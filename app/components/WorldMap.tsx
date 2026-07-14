"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  geoOrthographic,
  geoEquirectangular,
  geoPath,
  geoGraticule10,
  type GeoSphere,
} from "d3-geo";
import Flag from "./Flag";
import CountryCard from "./CountryCard";
import {
  TEAMS,
  QUALIFIED_ISO3,
  GROUP_ACCENTS,
  GROUP_LETTERS,
  teamsByGroup,
  textOn,
  type Team,
} from "../data/teams";

type Feature = GeoJSON.Feature<GeoJSON.Geometry, { a3: string }>;
type Mode = "flat" | "globe";

const SPHERE: GeoSphere = { type: "Sphere" };
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
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
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
    let acc = 0; // cap state updates to ~25fps so we don't re-render 177 paths every frame
    const tick = (t: number) => {
      const dt = t - prev;
      prev = t;
      if (spin.current && !dragging.current && !document.hidden) {
        acc += dt;
        if (acc >= 40) {
          const step = acc;
          acc = 0;
          setRot((r) => [r[0] + step * 0.006, r[1]]);
        }
      }
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
      SPHERE
    );
  }, [mode, rot]);

  const path = useMemo(() => geoPath(projection), [projection]);
  const graticule = useMemo(() => path(geoGraticule10()) ?? "", [path]);
  const sphere = useMemo(() => path(SPHERE) ?? "", [path]);

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
    setSelectedGroup(null);
    spin.current = false;
  };
  const pickGroup = (letter: string) => {
    setSelectedGroup((g) => (g === letter ? null : letter));
    setSelected(null);
    spin.current = false;
  };

  const isGlobe = mode === "globe";
  const W = isGlobe ? GLOBE : FLAT_W;
  const H = isGlobe ? GLOBE : FLAT_H;
  const sea = isGlobe ? "url(#ocean)" : "#161821";
  const landOff = "#2b2f38";

  const qualified = features.filter((f) => QUALIFIED.has(f.properties.a3));
  const others = features.filter((f) => !QUALIFIED.has(f.properties.a3));
  const selectedTeams = selected ? BY_ISO3[selected] ?? [] : [];
  const inGroup = (a3: string, g: string) => (BY_ISO3[a3] || []).some((t) => t.group === g);
  const activeSet = new Set<string>();
  if (selectedGroup) {
    qualified.forEach((f) => {
      if (inGroup(f.properties.a3, selectedGroup)) activeSet.add(f.properties.a3);
    });
  } else if (selected) {
    activeSet.add(selected);
  }
  const anySel = !!(selected || selectedGroup);
  const glowColor = (a3: string) =>
    selectedGroup
      ? GROUP_ACCENTS[selectedGroup]
      : GROUP_ACCENTS[BY_ISO3[a3]?.[0]?.group] || "#2fa84f";
  // which group letters to highlight in the legend (a selected country lights its group)
  const activeGroups = new Set<string>();
  if (selectedGroup) activeGroups.add(selectedGroup);
  else if (selected) (BY_ISO3[selected] || []).forEach((t) => activeGroups.add(t.group));

  return (
    <div className="flex w-full min-w-0 flex-col overflow-x-hidden">
      <div className="flex w-full min-w-0 flex-col gap-6 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1 overflow-hidden">
        <div className={`mx-auto w-max ${isGlobe ? "" : "overflow-hidden rounded-2xl"}`}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className={`block max-w-full touch-none select-none ${
              isGlobe
                ? "h-[340px] w-auto cursor-grab active:cursor-grabbing sm:h-[calc(100vh_-_230px)] sm:max-h-[820px]"
                : "h-[190px] w-auto sm:h-[520px]"
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
              <filter id="sel-glow" x="-120%" y="-120%" width="340%" height="340%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ffffff" floodOpacity="1" />
              </filter>
            </defs>

            {isGlobe ? (
              <circle cx={W / 2} cy={H / 2} r={GLOBE / 2 - 6} fill={sea} />
            ) : (
              <path d={sphere} fill={sea} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
            )}
            <path d={graticule} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={0.5} />

            <g>
              {others.map((f, i) => {
                const d = path(f);
                return d ? <path key={i} d={d} fill={landOff} stroke="rgba(255,255,255,0.06)" strokeWidth={0.4} /> : null;
              })}
            </g>

            <g filter="url(#pop)">
              {qualified.map((f, i) => {
                const d = path(f);
                if (!d) return null;
                const a3 = f.properties.a3;
                const isHover = hovered === a3;
                const grp = BY_ISO3[a3]?.[0]?.group;
                const col = (grp && GROUP_ACCENTS[grp]) || "#2fa84f";
                return (
                  <path
                    key={i}
                    d={d}
                    fill={col}
                    fillOpacity={anySel && !activeSet.has(a3) ? 0.3 : isHover ? 0.85 : 1}
                    stroke={isHover ? "#14213d" : "#ffffff"}
                    strokeWidth={isHover ? 1.2 : 0.8}
                    className="cursor-pointer"
                    onPointerEnter={() => setHovered(a3)}
                    onPointerLeave={() => setHovered(null)}
                    onClick={() => pick(a3)}
                    style={{ transition: "fill-opacity 0.2s" }}
                  />
                );
              })}
            </g>

            {/* selected country/group pops: pulsing glow ring + bright fill on top */}
            {qualified
              .filter((f) => activeSet.has(f.properties.a3))
              .map((f, i) => {
                const d = path(f);
                if (!d) return null;
                const c = glowColor(f.properties.a3);
                return (
                  <g key={`sel-${i}`} className="pointer-events-none">
                    <path d={d} fill="none" stroke={c} strokeWidth={5} filter="url(#sel-glow)" className="sel-pulse" />
                    <path d={d} fill={c} stroke="#ffffff" strokeWidth={2.4} />
                  </g>
                );
              })}

            {isGlobe && (
              <circle cx={W / 2} cy={H / 2} r={GLOBE / 2 - 6} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth={1.5} className="pointer-events-none" />
            )}
          </svg>
        </div>
        </div>

      {/* click-to-reveal panel */}
      <aside className="w-full min-w-0 shrink-0 lg:w-72">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 shadow-sm">
          {selectedTeams.length > 0 ? (
            <div className="flex flex-col gap-4">
              {selectedTeams.map((t) => (
                <CountryCard key={t.name} team={t} />
              ))}
            </div>
          ) : selectedGroup ? (
            <div>
              <div
                className="mb-2 flex items-center justify-between rounded-lg px-3 py-2"
                style={{ background: GROUP_ACCENTS[selectedGroup], color: textOn(GROUP_ACCENTS[selectedGroup]) }}
              >
                <span className="text-base font-extrabold tracking-wide">GROUP {selectedGroup}</span>
                <span className="text-base font-extrabold opacity-70">{selectedGroup}</span>
              </div>
              <ul>
                {teamsByGroup(selectedGroup).map((t) => (
                  <li key={t.name}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(t.iso3);
                        setSelectedGroup(null);
                      }}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-[var(--bg-2)]"
                    >
                      <Flag code={t.flag} name={t.name} className="h-5 w-8 shrink-0" />
                      <span className="flex-1 text-sm font-semibold text-[var(--navy)]">{t.name}</span>
                      {t.host && (
                        <span className="rounded-full bg-[var(--navy)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                          Host
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 px-2 text-[11px] text-[var(--muted)]">Tap a team for its full stats.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-6 text-center">
              <svg viewBox="0 0 48 48" className="h-12 w-12 text-[var(--green)]" aria-hidden="true">
                <circle cx="24" cy="24" r="19" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                <circle cx="24" cy="24" r="12" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                <circle cx="24" cy="24" r="5.5" fill="currentColor" />
              </svg>
              <p className="mt-3 text-sm font-semibold text-[var(--navy)]">Tap any country or group</p>
              <p className="mt-1 text-xs text-[var(--muted)]">
                Flags, groups and stats show up right here.
              </p>
            </div>
          )}
        </div>
      </aside>
      </div>

      {/* caption + legend flow right after the map/panel (no forced height, no scroll) */}
      <div className="pt-6">
        <p className="text-center text-sm text-[var(--muted)]">
          {isGlobe ? "Drag to spin. " : ""}Tap a country or a group letter - each color is a group.
        </p>
        <div className="mx-auto mt-3 grid max-w-md grid-cols-6 gap-2 sm:max-w-2xl sm:grid-cols-12">
          {GROUP_LETTERS.map((letter) => (
            <button
              key={letter}
              type="button"
              onClick={() => pickGroup(letter)}
              className={`rounded-lg py-2.5 text-base font-extrabold transition-transform active:scale-95 sm:py-2 sm:text-lg ${
                activeGroups.has(letter) ? "ring-2 ring-[var(--navy)] ring-offset-2" : "hover:brightness-95"
              }`}
              style={{ background: GROUP_ACCENTS[letter], color: textOn(GROUP_ACCENTS[letter]) }}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
