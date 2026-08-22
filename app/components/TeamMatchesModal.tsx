"use client";

import Flag from "./Flag";
import CountryModal from "./CountryModal";
import {
  GROUP_ACCENTS,
  HOST_STADIUMS,
  TEAM_BY_NAME,
  matchesFor,
  matchOutcome,
  textOn,
  type Team,
} from "../data/teams";

const STAGE_SHORT: Record<string, string> = {
  "Round of 32": "R32",
  "Round of 16": "R16",
  "Quarter-final": "QF",
  "Semi-final": "SF",
  "Third place": "3RD",
  Final: "F",
};
const shortStage = (s: string) =>
  STAGE_SHORT[s] ?? (s.startsWith("Group") ? s.replace("Group ", "GRP ") : s);

/* The one country match-center modal, shared by Groups, Rank, and Bracket:
   flag hero, group chip, every match with its score and W/D/L badge, and host
   stadiums for the 3 host nations. */
export default function TeamMatchesModal({ team, onClose }: { team: Team; onClose: () => void }) {
  const results = matchesFor(team.name);
  const accent = GROUP_ACCENTS[team.group];

  return (
    <CountryModal team={team} onClose={onClose} label={`${team.name} matches`}>
      <div className="flex flex-col items-center text-center">
        <Flag code={team.flag} name={team.name} className="h-[86px] w-[128px]" />
        <span className="mt-3 text-2xl font-extrabold text-[var(--navy)]">{team.name}</span>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ background: accent, color: textOn(accent) }}
          >
            Group {team.group}
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
              const isA = m.a === team.name;
              const opp = isA ? m.b : m.a;
              const ts = isA ? m.sa : m.sb;
              const os = isA ? m.sb : m.sa;
              const oppTeam = TEAM_BY_NAME[opp];
              const result = matchOutcome(m, isA);
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
                  <Flag code={team.flag} name={team.name} className="h-4 w-6 shrink-0" />
                  <span className="shrink-0 tabular-nums text-sm font-extrabold text-[var(--navy)]">
                    {ts == null || os == null ? <span className="font-semibold text-[var(--muted)]">vs</span> : `${ts}-${os}`}
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

        {team.host && HOST_STADIUMS[team.name] && (
          <>
            <p className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Host stadiums ({HOST_STADIUMS[team.name].length})
            </p>
            <ul className="divide-y divide-[var(--border)]">
              {HOST_STADIUMS[team.name].map((s) => (
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
    </CountryModal>
  );
}
