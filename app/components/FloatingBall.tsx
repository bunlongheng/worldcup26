"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/* A World Cup ball that floats above everything. Drag to grab, flick to throw -
   it ricochets off the window edges with real physics: the release velocity
   sets how hard and how many times it bounces.
   - Fast motion leaves a smoke trail.
   - Shake it left/right fast: 3+ reversals -> smoke, 6+ -> it catches FIRE and
     the next throw launches at 2x speed. */

const SIZE = 58; // ball diameter in px
const RESTITUTION = 0.72; // energy kept per wall bounce
const DRAG = 0.6; // air damping (per second, exponential)
const MAX_SPEED = 4200; // px/s clamp on a flick
const REST_SPEED = 12; // below this it settles and idles
const SMOKE_SPEED = 850; // above this speed the ball smokes
const SHAKE_MIN = 6; // px of horizontal travel to count as a direction
const SHAKE_WINDOW = 450; // ms allowed between shake reversals
const FIRE_MS = 2200; // how long fire lasts after a 6-shake

type Particle = { x: number; y: number; vx: number; vy: number; age: number; life: number; size: number; fire: boolean };

type St = {
  x: number; y: number; vx: number; vy: number; angle: number;
  dragging: boolean; grabX: number; grabY: number;
  samples: { t: number; x: number; y: number }[];
  running: boolean; last: number; topInset: number;
  pmx: number; pmy: number; pmt: number; // previous pointer-move sample
  shakeSign: number; reversals: number; lastRev: number; fireUntil: number; fireArmed: boolean; smoldering: boolean;
};

export default function FloatingBall() {
  const ballRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const bobRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const raf = useRef(0);
  const parts = useRef<Particle[]>([]);
  const st = useRef<St>({
    x: 0, y: 0, vx: 0, vy: 0, angle: 0,
    dragging: false, grabX: 0, grabY: 0, samples: [], running: false, last: 0, topInset: 80,
    pmx: 0, pmy: 0, pmt: 0, shakeSign: 0, reversals: 0, lastRev: 0, fireUntil: 0, fireArmed: false, smoldering: false,
  });

  useEffect(() => {
    const s = st.current;
    const bounds = () => ({ W: window.innerWidth, H: window.innerHeight });
    // keep the ball out of the header strip so it never covers the logo/tabs
    s.topInset = (document.querySelector("header")?.offsetHeight ?? 76) + 8;

    const { W, H } = bounds();
    s.x = W - SIZE - 20;
    s.y = H - SIZE - 20;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    let dpr = 1;
    function sizeCanvas() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { W, H } = bounds();
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();
    render(); setIdle(true);

    function render() {
      if (ballRef.current) ballRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      if (spinRef.current) spinRef.current.style.transform = `rotate(${s.angle}deg)`;
    }
    function setIdle(on: boolean) { bobRef.current?.classList.toggle("ball-idle", on); }

    function start() {
      if (s.running) return;
      s.running = true; setIdle(false);
      s.last = performance.now();
      raf.current = requestAnimationFrame(step);
    }
    function stop() { s.running = false; cancelAnimationFrame(raf.current); setIdle(true); }

    function emit(count: number, fire: boolean) {
      const cx = s.x + SIZE / 2, cy = s.y + SIZE / 2;
      const trail = Math.atan2(s.vy, s.vx) + Math.PI; // trail behind travel
      for (let i = 0; i < count; i++) {
        // fire licks upward and fans out; smoke trails behind motion
        const a = fire ? -Math.PI / 2 + (Math.random() - 0.5) * 1.2 : trail + (Math.random() - 0.5) * 0.9;
        const spd = fire ? 45 + Math.random() * 75 : 34 * (0.4 + Math.random());
        parts.current.push({
          x: cx + (Math.random() - 0.5) * SIZE * (fire ? 0.55 : 0.4),
          y: cy + (Math.random() - 0.5) * SIZE * 0.4,
          vx: Math.cos(a) * spd + s.vx * 0.12,
          vy: Math.sin(a) * spd - (fire ? 30 : 22), // rise
          age: 0,
          life: fire ? 0.45 + Math.random() * 0.3 : 1.3 + Math.random() * 1.4, // smoke lingers longer
          size: fire ? 12 + Math.random() * 14 : 9 + Math.random() * 9,
          fire,
        });
      }
      if (parts.current.length > 400) parts.current.splice(0, parts.current.length - 400);
    }

    function drawParticles(dt: number, fireOn: boolean) {
      const { W, H } = bounds();
      ctx.clearRect(0, 0, W, H);
      // hot glow aura so the ball reads as "on fire"
      if (fireOn) {
        const cx = s.x + SIZE / 2, cy = s.y + SIZE / 2;
        const g = ctx.createRadialGradient(cx, cy, SIZE * 0.2, cx, cy, SIZE * 1.15);
        g.addColorStop(0, "rgba(255,180,50,0.55)");
        g.addColorStop(0.5, "rgba(255,95,20,0.3)");
        g.addColorStop(1, "rgba(255,60,0,0)");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, SIZE * 1.15, 0, 6.283); ctx.fill();
      }
      const arr = parts.current;
      for (let i = arr.length - 1; i >= 0; i--) {
        const p = arr[i];
        p.age += dt;
        if (p.age >= p.life) { arr.splice(i, 1); continue; }
        p.vx *= 0.96; p.vy = p.vy * 0.96 - 14 * dt; // drift + buoyancy
        p.x += p.vx * dt; p.y += p.vy * dt;
        const t = p.age / p.life;
        if (p.fire) {
          // vivid opaque flames (source-over) so they read on the white page
          ctx.globalCompositeOperation = "source-over";
          const a = (1 - t) * 0.95;
          const col = t < 0.25 ? `255,236,150` : t < 0.5 ? `255,158,36` : t < 0.75 ? `244,70,18` : `168,32,10`;
          ctx.fillStyle = `rgba(${col},${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 - 0.35 * t), 0, 6.283); ctx.fill();
        } else {
          // smoke: expands and eases to nothing (soft tail, no abrupt cut-off)
          ctx.globalCompositeOperation = "source-over";
          const a = 0.3 * Math.pow(1 - t, 1.6);
          ctx.fillStyle = `rgba(150,150,150,${a})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (0.7 + t * 2.4), 0, 6.283); ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }

    function step(now: number) {
      let dt = (now - s.last) / 1000;
      s.last = now;
      if (dt > 0.033) dt = 0.033;
      const { W, H } = bounds();
      const maxX = W - SIZE, maxY = H - SIZE, R = SIZE / 2;
      const speed = Math.hypot(s.vx, s.vy);
      const fireOn = now < s.fireUntil;

      // emission: fire wins, else smoke when shaking hard, moving fast, or
      // still smoldering after the fire went out (until the ball stops)
      if (fireOn) emit(3, true);
      else if (s.reversals >= 3 || speed > SMOKE_SPEED || (s.smoldering && speed > REST_SPEED)) emit(2, false);

      if (!s.dragging) {
        const d = Math.exp(-DRAG * dt);
        s.vx *= d; s.vy *= d;
        s.x += s.vx * dt; s.y += s.vy * dt;

        if (s.x < 0) { s.x = 0; s.vx = -s.vx * RESTITUTION; }
        else if (s.x > maxX) { s.x = maxX; s.vx = -s.vx * RESTITUTION; }
        if (s.y < s.topInset) { s.y = s.topInset; s.vy = -s.vy * RESTITUTION; }
        else if (s.y > maxY) { s.y = maxY; s.vy = -s.vy * RESTITUTION; }

        s.angle += ((s.vx * dt) / R) * (180 / Math.PI);
        render();
        if (speed < REST_SPEED) { s.vx = 0; s.vy = 0; s.smoldering = false; } // stopped: stop smoking
      }

      drawParticles(dt, fireOn);

      if (s.dragging || parts.current.length > 0 || Math.hypot(s.vx, s.vy) >= REST_SPEED || fireOn) {
        raf.current = requestAnimationFrame(step);
      } else { stop(); }
    }

    // ---- pointer (drag, shake, flick) ----
    const onDown = (e: PointerEvent) => {
      e.preventDefault(); // selection is disabled app-wide in CSS
      s.dragging = true;
      s.grabX = e.clientX - s.x; s.grabY = e.clientY - s.y;
      s.samples = [{ t: performance.now(), x: e.clientX, y: e.clientY }];
      s.pmx = e.clientX; s.pmy = e.clientY; s.pmt = performance.now();
      s.shakeSign = 0; s.reversals = 0; s.fireArmed = false;
      ballRef.current!.setPointerCapture(e.pointerId);
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const { W, H } = bounds();
      s.x = Math.max(0, Math.min(W - SIZE, e.clientX - s.grabX));
      s.y = Math.max(s.topInset, Math.min(H - SIZE, e.clientY - s.grabY));
      render();

      const now = performance.now();
      const mdt = (now - s.pmt) / 1000;
      const dx = e.clientX - s.pmx, dy = e.clientY - s.pmy;
      if (mdt > 0) { s.vx = dx / mdt; s.vy = dy / mdt; } // live velocity for the trail

      // shake detection: count fast left/right reversals
      const sign = dx > SHAKE_MIN ? 1 : dx < -SHAKE_MIN ? -1 : 0;
      if (sign !== 0) {
        if (s.shakeSign !== 0 && sign !== s.shakeSign) {
          s.reversals = now - s.lastRev < SHAKE_WINDOW ? s.reversals + 1 : 1;
          s.lastRev = now;
          if (s.reversals >= 6) { s.fireArmed = true; s.fireUntil = now + FIRE_MS; s.smoldering = true; }
        }
        s.shakeSign = sign;
      }
      if (now - s.lastRev > SHAKE_WINDOW) s.reversals = 0;
      s.pmx = e.clientX; s.pmy = e.clientY; s.pmt = now;

      s.samples.push({ t: now, x: e.clientX, y: e.clientY });
      while (s.samples.length > 2 && now - s.samples[0].t > 90) s.samples.shift();
    };
    const onUp = (e: PointerEvent) => {
      if (!s.dragging) return;
      s.dragging = false;
      try { ballRef.current?.releasePointerCapture(e.pointerId); } catch { /* already released */ }
      const a = s.samples[0], b = s.samples[s.samples.length - 1];
      const span = (b.t - a.t) / 1000;
      if (span > 0) {
        s.vx = (b.x - a.x) / span; s.vy = (b.y - a.y) / span;
        let cap = MAX_SPEED;
        if (s.fireArmed) { s.vx *= 5; s.vy *= 5; cap = MAX_SPEED * 5; s.fireUntil = performance.now() + FIRE_MS; s.smoldering = true; } // fire = 5x launch
        const sp = Math.hypot(s.vx, s.vy);
        if (sp > cap) { s.vx *= cap / sp; s.vy *= cap / sp; }
      } else { s.vx = 0; s.vy = 0; }
      s.samples = []; s.reversals = 0; s.shakeSign = 0;
      start();
    };
    const onResize = () => {
      sizeCanvas();
      const { W, H } = bounds();
      s.topInset = (document.querySelector("header")?.offsetHeight ?? 76) + 8;
      s.x = Math.max(0, Math.min(W - SIZE, s.x));
      s.y = Math.max(s.topInset, Math.min(H - SIZE, s.y));
      render();
    };

    const el = ballRef.current!;
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf.current);
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0"
        style={{ zIndex: 2147482999 }}
      />
      <div
        ref={ballRef}
        aria-hidden
        className="fixed left-0 top-0 cursor-grab touch-none select-none active:cursor-grabbing [-webkit-touch-callout:none]"
        style={{ width: SIZE, height: SIZE, zIndex: 2147483000, willChange: "transform", WebkitUserSelect: "none" }}
      >
        <div ref={spinRef} style={{ width: SIZE, height: SIZE, willChange: "transform" }}>
          <div ref={bobRef} className="drop-shadow-[0_5px_9px_rgba(0,0,0,0.16)]">
            <Image src="/ball.png" alt="" width={SIZE} height={SIZE} priority draggable={false} />
          </div>
        </div>
      </div>
    </>
  );
}
