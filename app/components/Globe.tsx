"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import { QUALIFIED_ISO3 } from "../data/teams";

type Feature = { properties: { a3: string }; geometry: unknown };

const SIZE = 540;
const QUALIFIED = new Set(QUALIFIED_ISO3);

export default function Globe() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [rot, setRot] = useState<[number, number]>([-15, -18]);
  const [hovered, setHovered] = useState<string | null>(null);
  const dragging = useRef(false);
  const last = useRef<[number, number] | null>(null);
  const spin = useRef(true);

  useEffect(() => {
    fetch("/world.geojson")
      .then((r) => r.json())
      .then((g) => setFeatures(g.features))
      .catch(() => setFeatures([]));
  }, []);

  // gentle auto-rotation until the user grabs it
  useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (t: number) => {
      const dt = t - prev;
      prev = t;
      if (spin.current && !dragging.current) {
        setRot((r) => [r[0] + dt * 0.006, r[1]]);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const projection = useMemo(
    () =>
      geoOrthographic()
        .scale(SIZE / 2 - 6)
        .translate([SIZE / 2, SIZE / 2])
        .rotate([rot[0], rot[1]]),
    [rot]
  );

  const path = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => path(geoGraticule10()) ?? "", [path]);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    spin.current = false;
    last.current = [e.clientX, e.clientY];
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current || !last.current) return;
    const dx = e.clientX - last.current[0];
    const dy = e.clientY - last.current[1];
    last.current = [e.clientX, e.clientY];
    setRot((r) => [r[0] + dx * 0.3, Math.max(-89, Math.min(89, r[1] - dy * 0.3))]);
  };
  const onUp = () => {
    dragging.current = false;
    last.current = null;
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-[540px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full cursor-grab touch-none select-none active:cursor-grabbing [filter:drop-shadow(0_30px_60px_rgba(0,0,0,0.55))]"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerLeave={onUp}
        >
          <defs>
            <radialGradient id="ocean" cx="0.4" cy="0.35" r="0.8">
              <stop offset="0" stopColor="#0e3b6b" />
              <stop offset="0.7" stopColor="#0a2b4f" />
              <stop offset="1" stopColor="#061a33" />
            </radialGradient>
            <radialGradient id="rim" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0.82" stopColor="transparent" />
              <stop offset="1" stopColor="rgba(200,230,60,0.25)" />
            </radialGradient>
          </defs>

          {/* ocean sphere */}
          <circle cx={SIZE / 2} cy={SIZE / 2} r={SIZE / 2 - 6} fill="url(#ocean)" />
          {/* graticule */}
          <path d={graticule} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.6} />

          {/* land */}
          {features.map((f, i) => {
            const d = path(f as never);
            if (!d) return null;
            const on = QUALIFIED.has(f.properties.a3);
            const isHover = hovered === f.properties.a3;
            return (
              <path
                key={i}
                d={d}
                fill={on ? (isHover ? "var(--lime)" : "var(--green)") : "#123a2b"}
                stroke={on ? "#eafff0" : "rgba(255,255,255,0.06)"}
                strokeWidth={on ? 0.5 : 0.3}
                onPointerEnter={() => on && setHovered(f.properties.a3)}
                onPointerLeave={() => setHovered(null)}
                style={{ transition: "fill 0.15s" }}
              />
            );
          })}

          {/* lime rim glow */}
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={SIZE / 2 - 6}
            fill="url(#rim)"
            className="pointer-events-none"
          />
        </svg>
      </div>

      <p className="mt-5 text-center text-sm text-[var(--muted)]">
        Drag to spin the globe.{" "}
        <span className="text-[var(--green)]">48 qualified nations</span> lit in green.
      </p>
    </div>
  );
}
