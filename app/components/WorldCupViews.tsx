"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Flag from "./Flag";
import Logo from "./Logo";
import {
  TEAMS,
  GROUP_LETTERS,
  GROUP_ACCENTS,
  CONFED_LABEL,
  teamsByGroup,
  type Confed,
} from "../data/teams";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center text-sm text-[var(--muted)]">
      Loading map…
    </div>
  ),
});

type View = "flags" | "groups" | "bracket" | "map" | "globe";

const TABS: { id: View; label: string }[] = [
  { id: "flags", label: "Flags" },
  { id: "groups", label: "Groups" },
  { id: "bracket", label: "Bracket" },
  { id: "map", label: "Map" },
  { id: "globe", label: "Globe" },
];

const CONF_ORDER: Confed[] = ["CONCACAF", "CONMEBOL", "UEFA", "CAF", "AFC", "OFC"];

/* ---------- Flags (default, fits without scrolling) ---------- */
function FlagsView() {
  const ordered = useMemo(
    () =>
      [...TEAMS].sort((a, b) => {
        if (!!b.host !== !!a.host) return a.host ? -1 : 1;
        const c = CONF_ORDER.indexOf(a.confed) - CONF_ORDER.indexOf(b.confed);
        return c !== 0 ? c : a.name.localeCompare(b.name);
      }),
    []
  );

  return (
    <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
      {ordered.map((t) => (
        <div
          key={t.name}
          className="flex flex-col items-center rounded-lg border border-[var(--border)] bg-white px-1.5 py-2 transition-shadow hover:shadow-[0_6px_16px_-8px_rgba(20,33,61,0.3)]"
        >
          <Flag code={t.flag} name={t.name} className="h-8 w-[52px]" />
          <span className="mt-1.5 text-center text-[11px] font-bold leading-tight text-[var(--navy)]">
            {t.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Groups ---------- */
function GroupsView() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GROUP_LETTERS.map((letter) => {
        const accent = GROUP_ACCENTS[letter];
        return (
          <div
            key={letter}
            className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm"
          >
            <div
              className="flex items-center justify-between px-4 py-2 text-white"
              style={{ background: accent }}
            >
              <span className="text-base font-extrabold tracking-wide">GROUP {letter}</span>
              <span className="text-base font-extrabold opacity-70">{letter}</span>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {teamsByGroup(letter).map((t) => (
                <li key={t.name} className="flex items-center gap-2.5 px-3 py-2">
                  <Flag code={t.flag} name={t.name} className="h-5 w-8 shrink-0" />
                  <span className="flex-1 text-sm font-medium text-[var(--navy)]">{t.name}</span>
                  {t.host && (
                    <span className="rounded-full bg-[var(--navy)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                      Host
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Bracket (projected R32 with real flags) ---------- */
// seed like "1A" (winner A), "2E" (runner-up E), "3C" (3rd of C) -> projected team
function seedTeam(seed: string) {
  const m = /^([123])([A-L])$/.exec(seed);
  if (!m) return null;
  return teamsByGroup(m[2])[Number(m[1]) - 1] ?? null;
}

// valid 32-team partition: 12 winners + 12 runners-up + 8 best thirds
const R32_PAIRS: [string, string][] = [
  ["1A", "2B"], ["1C", "2D"], ["1E", "2F"], ["1G", "2H"],
  ["1I", "2J"], ["1K", "2L"], ["1B", "2A"], ["1D", "2C"],
  ["1F", "2E"], ["1H", "2G"], ["1J", "2I"], ["1L", "2K"],
  ["3A", "3C"], ["3B", "3D"], ["3E", "3G"], ["3F", "3H"],
];

const ROUNDS = [
  { name: "Round of 32", count: 16, start: 1, prevStart: 0 },
  { name: "Round of 16", count: 8, start: 17, prevStart: 1 },
  { name: "Quarters", count: 4, start: 25, prevStart: 17 },
  { name: "Semis", count: 2, start: 29, prevStart: 25 },
  { name: "Final", count: 1, start: 31, prevStart: 29 },
];

function TeamRow({ seed, divider }: { seed: string; divider: boolean }) {
  const t = seedTeam(seed);
  const m = /^([123])([A-L])$/.exec(seed);
  const color = m ? GROUP_ACCENTS[m[2]] : "var(--border)";
  return (
    <div className={`flex items-center gap-1.5 py-1 ${divider ? "border-b border-[var(--border)]" : ""}`}>
      <span className="h-4 w-1 shrink-0 rounded" style={{ background: color }} />
      {t ? (
        <>
          <Flag code={t.flag} name={t.name} className="h-4 w-6 shrink-0" />
          <span className="truncate text-[11px] font-semibold text-[var(--navy)]">{t.name}</span>
        </>
      ) : (
        <span className="text-[11px] text-[var(--muted)]">{seed}</span>
      )}
    </div>
  );
}

function BracketView() {
  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-[var(--muted)]">
        Projected Round of 32 - each group&apos;s top two (plus the 8 best third-placed
        teams) by seeding, so you can see who could meet who. Real matchups confirm once
        the group games are played; later rounds fill in as teams win.
      </p>
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-[1120px] gap-3">
          {ROUNDS.map((round, ri) => (
            <div key={round.name} className={`flex flex-col ${ri === 0 ? "w-52 shrink-0" : "flex-1"}`}>
              <h4 className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--navy)]">
                {round.name}
              </h4>
              <div className="flex flex-1 flex-col justify-around gap-2">
                {Array.from({ length: round.count }).map((_, k) => (
                  <div
                    key={k}
                    className="rounded-lg border border-[var(--border)] bg-white px-2 py-1 shadow-sm"
                  >
                    {ri === 0 ? (
                      <>
                        <TeamRow seed={R32_PAIRS[k][0]} divider />
                        <TeamRow seed={R32_PAIRS[k][1]} divider={false} />
                      </>
                    ) : (
                      [0, 1].map((slot) => (
                        <div
                          key={slot}
                          className={`py-1 text-[11px] font-medium text-[var(--muted)] ${
                            slot === 0 ? "border-b border-[var(--border)]" : ""
                          }`}
                        >
                          Winner M{round.prevStart + 2 * k + slot}
                        </div>
                      ))
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col justify-center">
            <h4 className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--gold)]">
              Champion
            </h4>
            <div className="grid place-items-center rounded-xl border border-[var(--gold)] bg-[rgba(233,185,73,0.1)] px-5 py-6">
              <svg viewBox="0 0 120 200" className="h-12 w-auto" aria-hidden="true">
                <path fill="var(--gold)" d="M60 10c17 0 30 13 30 31 0 17-11 27-19 41-5 9-6 20-6 33h-10c0-13-1-24-6-33-8-14-19-24-19-41C30 23 43 10 60 10z" />
                <rect x="52" y="120" width="16" height="22" fill="var(--gold)" />
                <path fill="var(--gold)" d="M30 166h60l-6 16H36z" />
                <rect x="26" y="182" width="68" height="8" rx="3" fill="var(--gold)" />
              </svg>
              <span className="mt-2 text-center text-lg font-extrabold text-[var(--navy)]">Lifted July 19</span>
              <span className="text-[11px] text-[var(--muted)]">MetLife Stadium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- App shell (logo left, tabs right) ---------- */
export default function WorldCupViews() {
  const [view, setView] = useState<View>("flags");

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-[var(--border)] py-4">
        <div className="flex items-center gap-3">
          <Logo className="h-12 w-auto shrink-0 sm:h-14" />
          <div>
            <h1 className="text-xl font-extrabold leading-none tracking-tight text-[var(--navy)] sm:text-2xl">
              World Cup 2026
            </h1>
            <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">
              Canada · Mexico · USA <span className="mx-1 text-[var(--border)]">|</span> 48 Nations
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-1.5">
          {TABS.map((tab) => {
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
                  active
                    ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                    : "border-[var(--border)] bg-white text-[var(--navy)] hover:border-[var(--navy)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <section className="py-6">
        {view === "flags" && <FlagsView />}
        {view === "groups" && <GroupsView />}
        {view === "bracket" && <BracketView />}
        {view === "map" && <WorldMap mode="flat" />}
        {view === "globe" && <WorldMap mode="globe" />}
      </section>
    </div>
  );
}
