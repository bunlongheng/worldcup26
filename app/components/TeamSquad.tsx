"use client";

import Flag from "./Flag";
import PlayerPhoto from "./PlayerPhoto";
import { playersFor, POS_LABEL, type Player } from "../data/players";
import type { Team } from "../data/teams";

const POS_SECTIONS = ["GK", "DF", "MF", "FW"];

/* A nation's official 26-man squad in Panini album order (GK, DF, MF, FW by
   shirt number). Body content only - the caller wraps it in a modal and shows
   the trading card for the tapped player. */
export default function TeamSquad({ team, onSelect }: { team: Team; onSelect: (p: Player) => void }) {
  const roster = playersFor(team.name);

  return (
    <>
      <div className="flex flex-col items-center text-center">
        <Flag code={team.flag} name={team.name} className="h-[70px] w-[104px]" />
        <span className="mt-3 text-2xl font-extrabold text-[var(--navy)]">{team.name}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          Official squad · {roster.length} players
        </span>
      </div>

      {POS_SECTIONS.map((pos) => {
        const group = roster.filter((p) => p.pos === pos);
        if (!group.length) return null;
        return (
          <div key={pos} className="mt-5">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              {POS_LABEL[pos] ?? pos}s
            </p>
            <div className="grid grid-cols-3 gap-2.5">
              {group.map((p) => (
                <button
                  key={p.no + p.name}
                  type="button"
                  onClick={() => onSelect(p)}
                  aria-label={`${p.name}, number ${p.no}${p.captain ? ", captain" : ""}. View card.`}
                  className="group flex flex-col items-center text-center"
                >
                  <span className="relative w-full">
                    <PlayerPhoto
                      src={p.img}
                      name={p.name}
                      className="aspect-[3/4] w-full rounded-xl ring-1 ring-black/10 transition-transform group-hover:-translate-y-0.5"
                    />
                    <span className="tnum absolute left-1 top-1 grid h-5 min-w-5 place-items-center rounded-md bg-[var(--navy)]/85 px-1 text-[10px] font-extrabold text-white">
                      {p.no}
                    </span>
                    {p.captain && (
                      <span className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-[var(--gold)] text-[10px] font-extrabold text-[var(--navy)]" title="Captain">
                        C
                      </span>
                    )}
                  </span>
                  <span className="mt-1.5 w-full truncate text-[11px] font-bold text-[var(--navy)]">{p.name}</span>
                  {p.club && (
                    <span className="w-full truncate text-[9px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                      {p.club}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
