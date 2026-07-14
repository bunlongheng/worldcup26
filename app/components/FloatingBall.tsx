"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/* A World Cup ball that floats above everything. Drag to grab, flick to throw -
   it ricochets off the window edges with real physics: the release velocity
   (how fast you flick) sets how hard and how many times it bounces. */

const SIZE = 58; // ball diameter in px
const RESTITUTION = 0.72; // energy kept per wall bounce
const DRAG = 0.6; // air damping (per second, exponential)
const MAX_SPEED = 4200; // px/s clamp on a flick
const REST_SPEED = 12; // below this it settles and idles

type St = {
  x: number; y: number; vx: number; vy: number; angle: number;
  dragging: boolean; grabX: number; grabY: number;
  samples: { t: number; x: number; y: number }[];
  running: boolean; last: number;
};

export default function FloatingBall() {
  const ballRef = useRef<HTMLDivElement>(null); // position (translate)
  const spinRef = useRef<HTMLDivElement>(null); // rotation
  const bobRef = useRef<HTMLDivElement>(null); // idle float (CSS)
  const raf = useRef(0);
  const st = useRef<St>({
    x: 0, y: 0, vx: 0, vy: 0, angle: 0,
    dragging: false, grabX: 0, grabY: 0, samples: [], running: false, last: 0,
  });

  useEffect(() => {
    const s = st.current;
    const bounds = () => ({ W: window.innerWidth, H: window.innerHeight });

    // start resting in the bottom-right corner
    const { W, H } = bounds();
    s.x = W - SIZE - 20;
    s.y = H - SIZE - 20;
    render();
    setIdle(true);

    function render() {
      if (ballRef.current) ballRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      if (spinRef.current) spinRef.current.style.transform = `rotate(${s.angle}deg)`;
    }
    function setIdle(on: boolean) {
      bobRef.current?.classList.toggle("ball-idle", on);
    }

    function start() {
      if (s.running) return;
      s.running = true;
      setIdle(false);
      s.last = performance.now();
      raf.current = requestAnimationFrame(step);
    }
    function stop() {
      s.running = false;
      cancelAnimationFrame(raf.current);
      setIdle(true);
    }

    function step(now: number) {
      let dt = (now - s.last) / 1000;
      s.last = now;
      if (dt > 0.033) dt = 0.033; // avoid tunneling on a slow frame
      const { W, H } = bounds();
      const maxX = W - SIZE, maxY = H - SIZE;
      const R = SIZE / 2;

      if (!s.dragging) {
        // air damping (frame-rate independent)
        const d = Math.exp(-DRAG * dt);
        s.vx *= d; s.vy *= d;

        s.x += s.vx * dt;
        s.y += s.vy * dt;

        // wall bounces with energy loss
        if (s.x < 0) { s.x = 0; s.vx = -s.vx * RESTITUTION; }
        else if (s.x > maxX) { s.x = maxX; s.vx = -s.vx * RESTITUTION; }
        if (s.y < 0) { s.y = 0; s.vy = -s.vy * RESTITUTION; }
        else if (s.y > maxY) { s.y = maxY; s.vy = -s.vy * RESTITUTION; }

        // rolling spin from horizontal motion (flips on bounce, like a real ball)
        s.angle += ((s.vx * dt) / R) * (180 / Math.PI);

        render();

        if (Math.hypot(s.vx, s.vy) < REST_SPEED) { s.vx = 0; s.vy = 0; stop(); return; }
      }
      raf.current = requestAnimationFrame(step);
    }

    // ---- pointer (drag + flick) ----
    const setSelect = (on: boolean) => {
      const v = on ? "" : "none";
      document.body.style.userSelect = v;
      document.body.style.webkitUserSelect = v;
    };

    const onDown = (e: PointerEvent) => {
      e.preventDefault();
      setSelect(false); // stop the drag from highlighting page text
      const el = ballRef.current!;
      s.dragging = true;
      s.grabX = e.clientX - s.x;
      s.grabY = e.clientY - s.y;
      s.samples = [{ t: performance.now(), x: e.clientX, y: e.clientY }];
      el.setPointerCapture(e.pointerId);
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!s.dragging) return;
      const { W, H } = bounds();
      s.x = Math.max(0, Math.min(W - SIZE, e.clientX - s.grabX));
      s.y = Math.max(0, Math.min(H - SIZE, e.clientY - s.grabY));
      render();
      const now = performance.now();
      s.samples.push({ t: now, x: e.clientX, y: e.clientY });
      // keep only the last ~90ms of motion for the release velocity
      while (s.samples.length > 2 && now - s.samples[0].t > 90) s.samples.shift();
    };
    const onUp = (e: PointerEvent) => {
      setSelect(true); // restore normal text selection
      if (!s.dragging) return;
      s.dragging = false;
      try { ballRef.current?.releasePointerCapture(e.pointerId); } catch { /* already released */ }
      // flick velocity = displacement over the recent sample window
      const a = s.samples[0];
      const b = s.samples[s.samples.length - 1];
      const span = (b.t - a.t) / 1000;
      if (span > 0) {
        s.vx = (b.x - a.x) / span;
        s.vy = (b.y - a.y) / span;
        const sp = Math.hypot(s.vx, s.vy);
        if (sp > MAX_SPEED) { s.vx *= MAX_SPEED / sp; s.vy *= MAX_SPEED / sp; }
      } else { s.vx = 0; s.vy = 0; }
      s.samples = [];
      start();
    };

    const onResize = () => {
      const { W, H } = bounds();
      s.x = Math.max(0, Math.min(W - SIZE, s.x));
      s.y = Math.max(0, Math.min(H - SIZE, s.y));
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
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
      style={{ zIndex: 2147483000 }}
    >
      <div
        ref={ballRef}
        className="pointer-events-auto absolute left-0 top-0 cursor-grab touch-none select-none active:cursor-grabbing [-webkit-touch-callout:none]"
        style={{ width: SIZE, height: SIZE, willChange: "transform", WebkitUserSelect: "none" }}
      >
        <div ref={spinRef} style={{ width: SIZE, height: SIZE, willChange: "transform" }}>
          <div ref={bobRef} className="drop-shadow-[0_5px_9px_rgba(0,0,0,0.16)]">
            <Image src="/ball.png" alt="" width={SIZE} height={SIZE} priority draggable={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
