"use client";

import { useMemo, useState } from "react";
import Flag from "../Flag";
import CountryCard from "../CountryCard";
import CountryModal from "../CountryModal";
import { finalRanking, type Team } from "../../data/teams";

// Podium accents for the top 3; every other rank is the plain muted chip.
const MEDAL: Record<number, string> = {
  1: "var(--gold)",
  2: "#c8ccd4",
  3: "#cd7f47",
};

/* Final tournament ranking 1-48, derived from the match results. Tap any nation
   for its country modal (name spoken, flag blurred behind), like everywhere else. */
export default function RankView() {
  const rows = useMemo(() => finalRanking(), []);
  const [open, setOpen] = useState<Team | null>(null);

  return (
    <>
      <p className="mb-3 text-center text-xs text-[var(--muted)]">
        Final standings - all 48 nations ranked by how far they went, then by overall record. Computed live from every match.
      </p>
      <ol className="mx-auto max-w-2xl divide-y divide-[var(--border)] overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm">
        {rows.map((r) => {
          const medal = MEDAL[r.rank];
          return (
            <li key={r.team.name}>
              <button
                type="button"
                onClick={() => setOpen(r.team)}
                aria-label={`Rank ${r.rank}, ${r.team.name}, ${r.roundOut}. Played ${r.p}, won ${r.w}, drawn ${r.d}, lost ${r.l}, ${r.pts} points`}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-[var(--bg-2)]"
                style={r.rank <= 3 ? { boxShadow: `inset 3px 0 0 ${medal}` } : undefined}
              >
                <span
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-extrabold tabular-nums"
                  style={
                    medal
                      ? { background: medal, color: r.rank === 2 ? "var(--navy)" : "#fff" }
                      : { background: "var(--bg-2)", color: "var(--muted)" }
                  }
                >
                  {r.rank}
                </span>
                <Flag code={r.team.flag} name={r.team.name} className="h-6 w-9 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[var(--navy)]">{r.team.name}</span>
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {r.roundOut}
                  </span>
                </span>
                <span className="hidden shrink-0 text-right text-[11px] tabular-nums text-[var(--muted)] sm:block">
                  {r.w}W {r.d}D {r.l}L
                </span>
                <span className="grid h-8 w-9 shrink-0 place-items-center rounded-lg bg-[var(--bg-2)] text-sm font-extrabold tabular-nums text-[var(--navy)]">
                  {r.pts}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {open && (
        <CountryModal team={open} onClose={() => setOpen(null)} maxWidth="max-w-sm">
          <CountryCard team={open} big />
        </CountryModal>
      )}
    </>
  );
}
