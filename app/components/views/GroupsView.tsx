"use client";

import { useState } from "react";
import Flag from "../Flag";
import TeamMatchesModal from "../TeamMatchesModal";
import {
  GROUP_LETTERS,
  GROUP_ACCENTS,
  groupStandings,
  textOn,
  type Team,
} from "../../data/teams";

// Shared grid so the header labels line up with each team row.
const STANDINGS_GRID =
  "grid grid-cols-[1.1rem_auto_minmax(0,1fr)_1.1rem_1.1rem_1.1rem_1.1rem_1.6rem_1.7rem] items-center gap-x-1";

/* Groups grid - tap a team for its full match center, hosts also list stadiums. */
export default function GroupsView() {
  const [detail, setDetail] = useState<Team | null>(null);

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
              <div className="px-2 py-1.5">
                <div className={`${STANDINGS_GRID} px-1 pb-1 text-[9px] font-bold uppercase tracking-wide text-[var(--muted)]`}>
                  <span />
                  <span />
                  <span />
                  <span className="text-center">P</span>
                  <span className="text-center">W</span>
                  <span className="text-center">D</span>
                  <span className="text-center">L</span>
                  <span className="text-center">GD</span>
                  <span className="text-center">Pts</span>
                </div>
                <ul className="divide-y divide-[var(--border)]">
                  {groupStandings(letter).map((s, i) => (
                    <li key={s.team.name}>
                      <button
                        type="button"
                        onClick={() => setDetail(s.team)}
                        style={i < 2 ? { boxShadow: `inset 3px 0 0 ${accent}` } : undefined}
                        aria-label={`${i + 1}. ${s.team.name}${s.team.host ? " (host nation)" : ""}: played ${s.p}, won ${s.w}, drawn ${s.d}, lost ${s.l}, goal difference ${s.gd}, ${s.pts} points`}
                        className={`${STANDINGS_GRID} w-full rounded-sm px-1 py-1.5 text-left transition-colors hover:bg-[var(--bg-2)]`}
                      >
                        <span aria-hidden className="text-center text-[10px] font-bold tabular-nums text-[var(--muted)]">{i + 1}</span>
                        <Flag code={s.team.flag} name={s.team.name} className="h-4 w-6 shrink-0" />
                        <span aria-hidden className="flex min-w-0 items-center gap-1">
                          <span className="truncate text-[13px] font-medium text-[var(--navy)]">{s.team.name}</span>
                          {s.team.host && (
                            <span title="Host nation" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]" />
                          )}
                        </span>
                        <span aria-hidden className="text-center text-[11px] tabular-nums text-[var(--muted)]">{s.p}</span>
                        <span aria-hidden className="text-center text-[11px] tabular-nums text-[var(--muted)]">{s.w}</span>
                        <span aria-hidden className="text-center text-[11px] tabular-nums text-[var(--muted)]">{s.d}</span>
                        <span aria-hidden className="text-center text-[11px] tabular-nums text-[var(--muted)]">{s.l}</span>
                        <span aria-hidden className="text-center text-[11px] font-medium tabular-nums text-[var(--navy)]">
                          {s.gd > 0 ? `+${s.gd}` : s.gd}
                        </span>
                        <span aria-hidden className="text-center text-[12px] font-extrabold tabular-nums text-[var(--navy)]">{s.pts}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-[var(--muted)]">
        The accent bar marks each group&apos;s top 2. They advance to the Round of 32 along with the 8 best third-placed teams.
      </p>

      {detail && <TeamMatchesModal team={detail} onClose={() => setDetail(null)} />}
    </>
  );
}
