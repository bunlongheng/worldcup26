"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Flag from "./Flag";
import Logo from "./Logo";
import ThemeSong from "./ThemeSong";
import {
  TEAMS,
  GROUP_LETTERS,
  GROUP_ACCENTS,
  CONFED_LABEL,
  teamsByGroup,
  textOn,
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
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {ordered.map((t) => (
        <div
          key={t.name}
          className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-white px-2 py-3.5 transition-shadow hover:shadow-[0_6px_16px_-8px_rgba(20,33,61,0.3)]"
        >
          <Flag code={t.flag} name={t.name} className="h-[48px] w-[72px]" />
          <span className="mt-2 text-center text-sm font-bold leading-tight text-[var(--navy)]">
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
              className="flex items-center justify-between px-4 py-2"
              style={{ background: accent, color: textOn(accent) }}
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

/* ---------- Bracket (real results through the semi-finals) ---------- */
const BY_NAME: Record<string, (typeof TEAMS)[number]> = TEAMS.reduce(
  (a, t) => ((a[t.name] = t), a),
  {} as Record<string, (typeof TEAMS)[number]>
);

type Match = { a: string; b: string; win?: "a" | "b" };

// Actual knockout results (as of July 14, 2026). Semis are set; final is July 19.
const KO_ROUNDS: { name: string; matches: Match[] }[] = [
  {
    name: "Round of 16",
    matches: [
      { a: "France", b: "Paraguay", win: "a" },
      { a: "Morocco", b: "Canada", win: "a" },
      { a: "Spain", b: "Austria", win: "a" },
      { a: "Belgium", b: "United States", win: "a" },
      { a: "England", b: "Mexico", win: "a" },
      { a: "Norway", b: "Brazil", win: "a" },
      { a: "Argentina", b: "Egypt", win: "a" },
      { a: "Switzerland", b: "Algeria", win: "a" },
    ],
  },
  {
    name: "Quarter-finals",
    matches: [
      { a: "France", b: "Morocco", win: "a" },
      { a: "Spain", b: "Belgium", win: "a" },
      { a: "England", b: "Norway", win: "a" },
      { a: "Argentina", b: "Switzerland", win: "a" },
    ],
  },
  {
    name: "Semi-finals",
    matches: [
      { a: "France", b: "Spain" },
      { a: "England", b: "Argentina" },
    ],
  },
];

function TeamCell({
  name,
  state,
  divider,
}: {
  name: string;
  state: "win" | "lose" | "tbd";
  divider: boolean;
}) {
  const t = BY_NAME[name];
  return (
    <div
      className={`flex items-center gap-2.5 rounded-md px-2 py-2 ${
        divider ? "border-b border-[var(--border)]" : ""
      } ${state === "win" ? "bg-[rgba(42,157,63,0.12)]" : ""}`}
    >
      {t && (
        <Flag
          code={t.flag}
          name={t.name}
          className={`h-7 w-10 shrink-0 ${state === "lose" ? "opacity-45" : ""}`}
        />
      )}
      <span
        className={`truncate text-sm ${
          state === "win"
            ? "font-extrabold text-[var(--navy)]"
            : state === "lose"
              ? "font-medium text-[var(--muted)] line-through"
              : "font-semibold text-[var(--navy)]"
        }`}
      >
        {t ? t.name : name}
      </span>
      {state === "win" && <span className="ml-auto text-sm font-bold text-[var(--green)]">✓</span>}
    </div>
  );
}

function cellState(m: Match, side: "a" | "b"): "win" | "lose" | "tbd" {
  if (!m.win) return "tbd";
  return m.win === side ? "win" : "lose";
}

function BracketView() {
  return (
    <div>
      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-[1050px] gap-3">
          {KO_ROUNDS.map((round) => (
            <div key={round.name} className="flex flex-1 flex-col">
              <h4 className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--navy)]">
                {round.name}
              </h4>
              <div className="flex flex-1 flex-col justify-around gap-2">
                {round.matches.map((m, k) => (
                  <div
                    key={k}
                    className="rounded-lg border border-[var(--border)] bg-white px-1.5 py-1 shadow-sm"
                  >
                    <TeamCell name={m.a} state={cellState(m, "a")} divider />
                    <TeamCell name={m.b} state={cellState(m, "b")} divider={false} />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Final */}
          <div className="flex flex-1 flex-col">
            <h4 className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--navy)]">
              Final
            </h4>
            <div className="flex flex-1 flex-col justify-center">
              <div className="rounded-lg border border-[var(--border)] bg-white px-2 py-2 text-center shadow-sm">
                <p className="text-[11px] font-semibold text-[var(--navy)]">Winner SF1</p>
                <p className="my-1 text-[10px] text-[var(--muted)]">vs</p>
                <p className="text-[11px] font-semibold text-[var(--navy)]">Winner SF2</p>
                <p className="mt-2 text-[10px] text-[var(--muted)]">July 19</p>
              </div>
            </div>
          </div>

          {/* Champion */}
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
              <span className="mt-2 text-center text-lg font-extrabold text-[var(--navy)]">TBD</span>
              <span className="text-[11px] text-[var(--muted)]">Crowned July 19</span>
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
              48 Nations
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
          <ThemeSong />
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
