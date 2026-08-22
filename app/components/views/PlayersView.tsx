"use client";

import { useMemo, useState } from "react";
import Flag from "../Flag";
import CountryModal from "../CountryModal";
import TeamSquad from "../TeamSquad";
import PlayerCard from "../PlayerCard";
import PlayerQuiz from "./PlayerQuiz";
import { TEAM_BY_NAME, type Team } from "../../data/teams";
import { TEAMS_WITH_PLAYERS, playersFor, type Player } from "../../data/players";

type Mode = "browse" | "quiz";

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
          <TeamSquad team={open} onSelect={setCard} />
        </CountryModal>
      )}

      {card && open && <PlayerCard player={card} team={open} onClose={() => setCard(null)} />}
    </>
  );
}
