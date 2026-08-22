"use client";

import { useMemo, useState } from "react";
import Flag from "../Flag";
import PlayerPhoto from "../PlayerPhoto";
import CountryModal from "../CountryModal";
import PlayerCard from "../PlayerCard";
import PlayerQuiz from "./PlayerQuiz";
import { TEAM_BY_NAME, type Team } from "../../data/teams";
import { TEAMS_WITH_PLAYERS, playersFor, POS_LABEL, type Player } from "../../data/players";

type Mode = "browse" | "quiz";

const POS_SECTIONS = ["GK", "DF", "MF", "FW"];

/* Players tab: browse each nation's official 26-man World Cup squad in Panini
   album order (GK, DF, MF, FW by shirt number), or play the "guess the nation"
   quiz. Tapping a nation opens the shared country modal; tapping a player spins
   up their trading card. */
export default function PlayersView() {
  const [mode, setMode] = useState<Mode>("browse");
  const [open, setOpen] = useState<Team | null>(null);
  const [card, setCard] = useState<Player | null>(null);

  const nations = useMemo(
    () =>
      TEAMS_WITH_PLAYERS.map((n) => TEAM_BY_NAME[n])
        .filter(Boolean)
        .sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const roster = open ? playersFor(open.name) : [];

  return (
    <>
      <div className="mb-4 flex justify-center">
        <div className="inline-flex rounded-full border border-[var(--border)] bg-white p-1">
          {(["browse", "quiz"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              aria-pressed={mode === m}
              className={`rounded-full px-5 py-1.5 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
                mode === m ? "bg-[var(--navy)] text-white" : "text-[var(--navy)] hover:text-[var(--green)]"
              }`}
            >
              {m === "browse" ? "Squads" : "Player quiz"}
            </button>
          ))}
        </div>
      </div>

      {mode === "quiz" ? (
        <PlayerQuiz />
      ) : (
        <>
          <p className="mb-3 text-center text-xs text-[var(--muted)]">
            Official 26-man World Cup 2026 squads. Tap a nation, then tap a player for their card.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {nations.map((t) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setOpen(t)}
                className="flex items-center gap-2.5 rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-8px_rgba(20,33,61,0.3)]"
              >
                <Flag code={t.flag} name={t.name} className="h-6 w-9 shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold text-[var(--navy)]">{t.name}</span>
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                    {playersFor(t.name).length} players
                  </span>
                </span>
              </button>
            ))}
          </div>
        </>
      )}

      {open && (
        <CountryModal team={open} onClose={() => setOpen(null)} label={`${open.name} squad`} maxWidth="max-w-lg">
          <div className="flex flex-col items-center text-center">
            <Flag code={open.flag} name={open.name} className="h-[70px] w-[104px]" />
            <span className="mt-3 text-2xl font-extrabold text-[var(--navy)]">{open.name}</span>
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
                      onClick={() => setCard(p)}
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
        </CountryModal>
      )}

      {card && open && <PlayerCard player={card} team={open} onClose={() => setCard(null)} />}
    </>
  );
}
