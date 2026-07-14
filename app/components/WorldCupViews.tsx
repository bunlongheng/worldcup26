"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Flag from "./Flag";
import Logo from "./Logo";
import ThemeSong from "./ThemeSong";
import CountryCard from "./CountryCard";
import type { Team } from "../data/teams";
import {
  TEAMS,
  GROUP_LETTERS,
  GROUP_ACCENTS,
  CONFED_LABEL,
  HOST_STADIUMS,
  matchesFor,
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

/* ---------- Flags (default) - tap a flag for the full modal ---------- */
function FlagsView() {
  const [open, setOpen] = useState<Team | null>(null);

  const ordered = useMemo(
    () =>
      [...TEAMS].sort((a, b) => {
        if (!!b.host !== !!a.host) return a.host ? -1 : 1;
        const c = CONF_ORDER.indexOf(a.confed) - CONF_ORDER.indexOf(b.confed);
        return c !== 0 ? c : a.name.localeCompare(b.name);
      }),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {ordered.map((t) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setOpen(t)}
            className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-white px-2 py-1.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-8px_rgba(20,33,61,0.3)]"
          >
            <Flag code={t.flag} name={t.name} className="h-[40px] w-[60px]" />
            <span className="mt-1 text-center text-[13px] font-bold leading-tight text-[var(--navy)]">
              {t.name}
            </span>
          </button>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,15,25,0.55)] p-4 backdrop-blur-md"
          onClick={() => setOpen(null)}
        >
          <div
            className="reveal relative w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <CountryCard team={open} big />
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- Groups ---------- */
const STAGE_SHORT: Record<string, string> = {
  "Round of 32": "R32",
  "Round of 16": "R16",
  "Quarter-final": "QF",
  "Semi-final": "SF",
  Final: "F",
};
const shortStage = (s: string) => STAGE_SHORT[s] ?? (s.startsWith("Group") ? s.replace("Group ", "GRP ") : s);

function GroupsView() {
  const [detail, setDetail] = useState<Team | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setDetail(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = detail ? matchesFor(detail.name) : [];

  return (
    <>
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
                  <li key={t.name}>
                    <button
                      type="button"
                      onClick={() => setDetail(t)}
                      className="group flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-[var(--bg-2)]"
                    >
                      <Flag code={t.flag} name={t.name} className="h-5 w-8 shrink-0" />
                      <span className="flex-1 text-sm font-medium text-[var(--navy)]">{t.name}</span>
                      {t.host && (
                        <span className="rounded-full bg-[var(--navy)] px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                          Host
                        </span>
                      )}
                      <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-[var(--border)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--navy)]" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {detail && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,15,25,0.55)] p-4 backdrop-blur-md"
          onClick={() => setDetail(null)}
        >
          <div
            className="reveal relative flex max-h-[85vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setDetail(null)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <div className="flex flex-col items-center text-center">
              <Flag code={detail.flag} name={detail.name} className="h-[86px] w-[128px]" />
              <span className="mt-3 text-2xl font-extrabold text-[var(--navy)]">{detail.name}</span>
              <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                <span
                  className="rounded-full px-3 py-1 text-xs font-bold"
                  style={{ background: GROUP_ACCENTS[detail.group], color: textOn(GROUP_ACCENTS[detail.group]) }}
                >
                  Group {detail.group}
                </span>
              </div>
            </div>

            <div className="mt-5 overflow-y-auto">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                World Cup 2026 - all matches
              </p>
              {results.length ? (
                <ul className="divide-y divide-[var(--border)]">
                  {results.map((m, i) => {
                    const isA = m.a === detail.name;
                    const opp = isA ? m.b : m.a;
                    const ts = isA ? m.sa : m.sb;
                    const os = isA ? m.sb : m.sa;
                    const oppTeam = BY_NAME[opp];
                    const result =
                      ts == null || os == null
                        ? "upcoming"
                        : ts > os
                          ? "won"
                          : ts < os
                            ? "lost"
                            : m.pens
                              ? isA
                                ? "won"
                                : "lost"
                              : "draw";
                    const rc =
                      result === "won"
                        ? "bg-[var(--green)]"
                        : result === "lost"
                          ? "bg-[var(--maroon)]"
                          : result === "draw"
                            ? "bg-[var(--muted)]"
                            : "bg-[var(--gold)]";
                    const rl = result === "won" ? "W" : result === "lost" ? "L" : result === "draw" ? "D" : "•";
                    return (
                      <li key={i} className="flex items-center gap-2.5 py-2">
                        <span className="w-9 shrink-0 text-[9px] font-bold uppercase tracking-wide text-[var(--muted)]">
                          {shortStage(m.stage)}
                        </span>
                        {oppTeam && <Flag code={oppTeam.flag} name={opp} className="h-4 w-6 shrink-0" />}
                        <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-[var(--navy)]">
                          {opp}
                          {m.pens ? <span className="text-[10px] font-normal text-[var(--muted)]"> ({m.pens})</span> : null}
                        </span>
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${rc}`}>
                          {rl}
                        </span>
                        <span className="w-10 shrink-0 text-right tabular-nums text-sm font-extrabold text-[var(--navy)]">
                          {ts == null || os == null ? "vs" : `${ts}–${os}`}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-sm text-[var(--muted)]">No matches found.</p>
              )}

              {detail.host && HOST_STADIUMS[detail.name] && (
                <>
                  <p className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                    Host stadiums ({HOST_STADIUMS[detail.name].length})
                  </p>
                  <ul className="divide-y divide-[var(--border)]">
                    {HOST_STADIUMS[detail.name].map((s) => (
                      <li key={s.stadium} className="flex items-center gap-3 py-2.5">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--bg-2)] text-[var(--green)]">
                          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </span>
                        <div className="min-w-0 flex-1 text-left">
                          <p className="text-sm font-bold text-[var(--navy)]">{s.city}</p>
                          <p className="truncate text-xs text-[var(--muted)]">{s.stadium}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
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
      className={`flex items-center gap-1 rounded-md px-1 py-1.5 sm:gap-2.5 sm:px-2 sm:py-2 ${
        divider ? "border-b border-[var(--border)]" : ""
      } ${state === "win" ? "bg-[rgba(42,157,63,0.12)]" : ""}`}
    >
      {t && (
        <Flag
          code={t.flag}
          name={t.name}
          className={`h-4 w-6 shrink-0 sm:h-7 sm:w-10 ${state === "lose" ? "opacity-45" : ""}`}
        />
      )}
      <span
        className={`hidden truncate sm:inline sm:text-sm ${
          state === "win"
            ? "font-extrabold text-[var(--navy)]"
            : state === "lose"
              ? "font-medium text-[var(--muted)] line-through"
              : "font-semibold text-[var(--navy)]"
        }`}
      >
        {t ? t.name : name}
      </span>
      {state === "win" && <span className="ml-auto text-xs font-bold text-[var(--green)] sm:text-sm">✓</span>}
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
      <div className="overflow-hidden pb-2 sm:overflow-x-auto">
        <div className="flex min-w-0 gap-0.5 sm:min-w-[1050px] sm:gap-3">
          {KO_ROUNDS.map((round) => (
            <div key={round.name} className="flex flex-1 flex-col">
              <h4 className="mb-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-[var(--navy)] sm:mb-3 sm:text-[11px] sm:tracking-[0.14em]">
                <span className="sm:hidden">
                  {round.name === "Round of 16" ? "R16" : round.name === "Quarter-finals" ? "QF" : round.name === "Semi-finals" ? "SF" : round.name}
                </span>
                <span className="hidden sm:inline">{round.name}</span>
              </h4>
              <div className="flex flex-1 flex-col justify-around gap-2">
                {round.matches.map((m, k) => (
                  <div
                    key={k}
                    className="rounded-md border border-[var(--border)] bg-white px-0.5 py-0.5 shadow-sm sm:rounded-lg sm:px-1.5 sm:py-1"
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
            <h4 className="mb-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-[var(--navy)] sm:mb-3 sm:text-[11px] sm:tracking-[0.14em]">
              <span className="sm:hidden">F</span>
              <span className="hidden sm:inline">Final</span>
            </h4>
            <div className="flex flex-1 flex-col justify-center">
              <div className="rounded-md border border-[var(--border)] bg-white px-1 py-2 text-center shadow-sm sm:rounded-lg sm:px-2">
                <p className="text-[9px] font-semibold text-[var(--navy)] sm:text-[11px]">
                  <span className="sm:hidden">SF1</span>
                  <span className="hidden sm:inline">Winner SF1</span>
                </p>
                <p className="my-1 text-[9px] text-[var(--muted)] sm:text-[10px]">vs</p>
                <p className="text-[9px] font-semibold text-[var(--navy)] sm:text-[11px]">
                  <span className="sm:hidden">SF2</span>
                  <span className="hidden sm:inline">Winner SF2</span>
                </p>
                <p className="mt-2 text-[9px] text-[var(--muted)] sm:text-[10px]">July 19</p>
              </div>
            </div>
          </div>

          {/* Champion */}
          <div className="hidden flex-col justify-center sm:flex">
            <h4 className="mb-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-[var(--gold)] sm:mb-3 sm:text-[11px] sm:tracking-[0.14em]">
              <span className="sm:hidden">CH</span>
              <span className="hidden sm:inline">Champion</span>
            </h4>
            <div className="grid place-items-center rounded-lg border border-[var(--gold)] bg-[rgba(233,185,73,0.1)] px-1.5 py-3 sm:rounded-xl sm:px-5 sm:py-6">
              <Logo className="h-10 w-auto sm:h-16" />
              <span className="mt-1 text-center text-sm font-extrabold text-[var(--navy)] sm:mt-2 sm:text-lg">TBD</span>
              <span className="hidden text-[11px] text-[var(--muted)] sm:block">Crowned July 19</span>
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
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <div className="flex items-center gap-2.5">
          <Logo className="h-10 w-auto shrink-0 sm:h-14" />
          <div>
            <h1 className="text-lg font-extrabold leading-none tracking-tight text-[var(--navy)] sm:text-2xl">
              World Cup 2026
            </h1>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] sm:text-[10px]">
              48 Nations
            </p>
          </div>
          <ThemeSong />
        </div>

        <nav className="flex flex-nowrap gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.04em] transition-colors sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.06em] ${
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

      <section className="py-4">
        {view === "flags" && <FlagsView />}
        {view === "groups" && <GroupsView />}
        {view === "bracket" && <BracketView />}
        {view === "map" && <WorldMap mode="flat" />}
        {view === "globe" && <WorldMap mode="globe" />}
      </section>
    </div>
  );
}
