"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  geoOrthographic,
  geoEquirectangular,
  geoPath,
  geoGraticule10,
} from "d3-geo";
import Flag from "./Flag";
import {
  TEAMS,
  QUALIFIED_ISO3,
  CONFED_LABEL,
  GROUP_ACCENTS,
  GROUP_LETTERS,
  type Team,
} from "../data/teams";

type Feature = { properties: { a3: string }; geometry: unknown };
type Mode = "flat" | "globe";

const QUALIFIED = new Set(QUALIFIED_ISO3);
const GLOBE = 540;
const FLAT_W = 960;
const FLAT_H = 480; // 2:1 rectangle (equirectangular)

// iso3 -> teams (England & Scotland both share GBR)
const BY_ISO3 = TEAMS.reduce<Record<string, Team[]>>((acc, t) => {
  (acc[t.iso3] ||= []).push(t);
  return acc;
}, {});

export default function WorldMap({ mode }: { mode: Mode }) {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [rot, setRot] = useState<[number, number]>([-15, -18]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const dragging = useRef(false);
  const moved = useRef(false);
  const last = useRef<[number, number] | null>(null);
  const spin = useRef(true);

  useEffect(() => {
    fetch("/world.geojson")
      .then((r) => r.json())
      .then((g) => setFeatures(g.features))
      .catch(() => setFeatures([]));
  }, []);

  useEffect(() => {
    if (mode !== "globe") return;
    let raf = 0;
    let prev = performance.now();
    const tick = (t: number) => {
      const dt = t - prev;
      prev = t;
      if (spin.current && !dragging.current) setRot((r) => [r[0] + dt * 0.006, r[1]]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const projection = useMemo(() => {
    if (mode === "globe") {
      return geoOrthographic()
        .scale(GLOBE / 2 - 6)
        .translate([GLOBE / 2, GLOBE / 2])
        .rotate([rot[0], rot[1]]);
    }
    return geoEquirectangular().fitExtent(
      [
        [2, 2],
        [FLAT_W - 2, FLAT_H - 2],
      ],
      { type: "Sphere" } as never
    );
  }, [mode, rot]);

  const path = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => path(geoGraticule10()) ?? "", [path]);
  const sphere = useMemo(() => path({ type: "Sphere" } as never) ?? "", [path]);

  const onDown = (e: React.PointerEvent) => {
    moved.current = false;
    if (mode !== "globe") return;
    dragging.current = true;
    spin.current = false;
    last.current = [e.clientX, e.clientY];
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (mode !== "globe" || !dragging.current || !last.current) return;
    const dx = e.clientX - last.current[0];
    const dy = e.clientY - last.current[1];
    if (Math.abs(dx) + Math.abs(dy) > 3) moved.current = true;
    last.current = [e.clientX, e.clientY];
    setRot((r) => [r[0] + dx * 0.3, Math.max(-89, Math.min(89, r[1] - dy * 0.3))]);
  };
  const onUp = () => {
    dragging.current = false;
    last.current = null;
  };

  const pick = (a3: string) => {
    if (moved.current) return; // ignore drag-release on the globe
    setSelected(a3);
    spin.current = false;
  };

  const isGlobe = mode === "globe";
  const W = isGlobe ? GLOBE : FLAT_W;
  const H = isGlobe ? GLOBE : FLAT_H;
  const sea = isGlobe ? "url(#ocean)" : "#eaf1fb";
  const landOff = isGlobe ? "#2b2f38" : "#cdd6e2";

  const qualified = features.filter((f) => QUALIFIED.has(f.properties.a3));
  const others = features.filter((f) => !QUALIFIED.has(f.properties.a3));
  const selectedTeams = selected ? BY_ISO3[selected] ?? [] : [];

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      <div className="flex-1">
        <div className={`mx-auto w-full ${isGlobe ? "max-w-[540px]" : "max-w-[960px]"}`}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={`w-full touch-none select-none ${
              isGlobe
                ? "cursor-grab active:cursor-grabbing [filter:drop-shadow(0_24px_50px_rgba(20,33,61,0.28))]"
                : ""
            }`}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
          >
            <defs>
              <radialGradient id="ocean" cx="0.4" cy="0.35" r="0.85">
                <stop offset="0" stopColor="#20242c" />
                <stop offset="0.65" stopColor="#14161c" />
                <stop offset="1" stopColor="#0a0b0e" />
              </radialGradient>
              <filter id="pop" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="1" stdDeviation="1.4" floodColor="#14213d" floodOpacity="0.35" />
              </filter>
            </defs>

            {isGlobe ? (
              <circle cx={W / 2} cy={H / 2} r={GLOBE / 2 - 6} fill={sea} />
            ) : (
              <path d={sphere} fill={sea} stroke="#d5deea" strokeWidth={1} />
            )}
            <path d={graticule} fill="none" stroke={isGlobe ? "rgba(255,255,255,0.1)" : "#c6d3e6"} strokeWidth={0.5} />

            <g>
              {others.map((f, i) => {
                const d = path(f as never);
                return d ? <path key={i} d={d} fill={landOff} stroke={isGlobe ? "rgba(255,255,255,0.06)" : "#ffffff"} strokeWidth={0.4} /> : null;
              })}
            </g>

            <g filter="url(#pop)">
              {qualified.map((f, i) => {
                const d = path(f as never);
                if (!d) return null;
                const a3 = f.properties.a3;
                const isSel = selected === a3;
                const isHover = hovered === a3;
                const grp = BY_ISO3[a3]?.[0]?.group;
                const col = (grp && GROUP_ACCENTS[grp]) || "#2fa84f";
                return (
                  <path
                    key={i}
                    d={d}
                    fill={col}
                    fillOpacity={isSel ? 1 : isHover ? 0.85 : 1}
                    stroke={isSel || isHover ? "#14213d" : "#ffffff"}
                    strokeWidth={isSel ? 1.8 : isHover ? 1.2 : 0.8}
                    className="cursor-pointer"
                    onPointerEnter={() => setHovered(a3)}
                    onPointerLeave={() => setHovered(null)}
                    onClick={() => pick(a3)}
                    style={{ transition: "fill 0.15s" }}
                  />
                );
              })}
            </g>

            {isGlobe && (
              <circle cx={W / 2} cy={H / 2} r={GLOBE / 2 - 6} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} className="pointer-events-none" />
            )}
          </svg>
          <p className="mt-4 text-center text-sm text-[var(--muted)]">
            {isGlobe ? "Drag to spin. " : ""}Tap a country to see its flag - each color is a group.
          </p>
          {/* group color legend */}
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {GROUP_LETTERS.map((letter) => (
              <span
                key={letter}
                className="rounded-md px-2 py-0.5 text-[11px] font-bold text-white"
                style={{ background: GROUP_ACCENTS[letter] }}
              >
                {letter}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* click-to-reveal panel */}
      <aside className="w-full shrink-0 lg:w-72">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
          {selectedTeams.length > 0 ? (
            <div className="flex flex-col gap-4">
              {selectedTeams.map((t) => (
                <div key={t.name} className="flex flex-col items-center text-center">
                  <Flag code={t.flag} name={t.name} className="h-[86px] w-[128px]" />
                  <span className="mt-3 text-xl font-extrabold text-[var(--navy)]">{t.name}</span>
                  <div className="mt-2 flex items-center gap-2">
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold text-white"
                      style={{ background: GROUP_ACCENTS[t.group] }}
                    >
                      Group {t.group}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {CONFED_LABEL[t.confed]}
                    </span>
                  </div>
                  {t.host && (
                    <span className="mt-2 rounded-full bg-[var(--navy)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Host nation
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <svg viewBox="0 0 24 24" className="h-10 w-10 text-[var(--green)]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 11V6a2 2 0 0 1 4 0v5" />
                <path d="M13 8a2 2 0 0 1 4 0v6a5 5 0 0 1-5 5h-1.5a5 5 0 0 1-4.2-2.3l-1.6-2.5a1.6 1.6 0 0 1 2.5-2l1.3 1.3V8a2 2 0 0 1 4 0" />
              </svg>
              <p className="mt-3 text-sm font-semibold text-[var(--navy)]">Tap any country</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Its flag and group will show up right here.
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
