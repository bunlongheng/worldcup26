"use client";

import { useEffect, useState } from "react";
import Flag from "../Flag";
import {
  GROUP_LETTERS,
  GROUP_ACCENTS,
  HOST_STADIUMS,
  TEAM_BY_NAME,
  matchesFor,
  teamsByGroup,
  textOn,
  type Team,
} from "../../data/teams";

const STAGE_SHORT: Record<string, string> = {
  "Round of 32": "R32",
  "Round of 16": "R16",
  "Quarter-final": "QF",
  "Semi-final": "SF",
  Final: "F",
};
const shortStage = (s: string) =>
  STAGE_SHORT[s] ?? (s.startsWith("Group") ? s.replace("Group ", "GRP ") : s);

/* Groups grid - tap a team for its full match center, hosts also list stadiums. */
export default function GroupsView() {
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
                    const oppTeam = TEAM_BY_NAME[opp];
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
                      <li key={i} className="flex items-center gap-2 py-2">
                        <span className="w-8 shrink-0 text-[9px] font-bold uppercase tracking-wide text-[var(--muted)]">
                          {shortStage(m.stage)}
                        </span>
                        <Flag code={detail.flag} name={detail.name} className="h-4 w-6 shrink-0" />
                        <span className="shrink-0 tabular-nums text-sm font-extrabold text-[var(--navy)]">
                          {ts == null || os == null ? <span className="font-semibold text-[var(--muted)]">vs</span> : `${ts}–${os}`}
                        </span>
                        {oppTeam && <Flag code={oppTeam.flag} name={opp} className="h-4 w-6 shrink-0" />}
                        <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold text-[var(--navy)]">
                          {opp}
                          {m.pens ? <span className="text-[10px] font-normal text-[var(--muted)]"> ({m.pens})</span> : null}
                        </span>
                        <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white ${rc}`}>
                          {rl}
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
