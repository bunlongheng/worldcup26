"use client";

import { useCallback, useEffect, useState } from "react";
import Flag from "../Flag";
import PlayerPhoto from "../PlayerPhoto";
import { speak } from "../speak";
import { TEAM_BY_NAME } from "../../data/teams";
import { PLAYER_POOL, TEAMS_WITH_PLAYERS, type Player } from "../../data/players";

type Question = { player: Player; team: string; options: string[] };

// Fisher-Yates - a fresh shuffled copy, leaves the input alone.
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestion(): Question {
  const pick = PLAYER_POOL[Math.floor(Math.random() * PLAYER_POOL.length)];
  const distractors = shuffle(TEAMS_WITH_PLAYERS.filter((t) => t !== pick.team)).slice(0, 3);
  return { player: pick.player, team: pick.team, options: shuffle([pick.team, ...distractors]) };
}

/* "Which country does this player play for?" - a photo, 4 flags, pick one.
   The correct nation is spoken aloud on reveal, keeping the tap-to-hear theme. */
export default function PlayerQuiz() {
  // Built after mount so the random pick never differs between SSR and hydration.
  const [q, setQ] = useState<Question | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const next = useCallback(() => {
    setPicked(null);
    setQ(buildQuestion());
  }, []);

  useEffect(() => {
    next();
  }, [next]);

  const choose = (team: string) => {
    if (picked || !q) return;
    setPicked(team);
    setScore((s) => ({ correct: s.correct + (team === q.team ? 1 : 0), total: s.total + 1 }));
    speak(q.team); // hear the right answer
  };

  if (!q) return <div className="grid h-64 place-items-center text-sm text-[var(--muted)]">Shuffling players…</div>;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      <div className="mb-3 flex w-full items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">Guess the nation</span>
        <span className="rounded-full bg-[var(--bg-2)] px-3 py-1 text-xs font-bold tabular-nums text-[var(--navy)]">
          {score.correct} / {score.total}
        </span>
      </div>

      <PlayerPhoto src={q.player.img} name={q.player.name} className="h-56 w-44 rounded-2xl ring-1 ring-black/10" />
      <p className="mt-3 text-xl font-extrabold text-[var(--navy)]">{q.player.name}</p>
      {q.player.pos && (
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{q.player.pos}</p>
      )}

      <div className="mt-5 grid w-full grid-cols-2 gap-2.5">
        {q.options.map((team) => {
          const t = TEAM_BY_NAME[team];
          const isRight = team === q.team;
          const isPicked = picked === team;
          const tone = !picked
            ? "border-[var(--border)] bg-white hover:border-[var(--navy)]"
            : isRight
              ? "border-[var(--green)] bg-[rgba(42,157,63,0.12)]"
              : isPicked
                ? "border-[var(--maroon)] bg-[rgba(122,31,47,0.1)]"
                : "border-[var(--border)] bg-white opacity-60";
          return (
            <button
              key={team}
              type="button"
              onClick={() => choose(team)}
              disabled={!!picked}
              className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${tone}`}
            >
              {t && <Flag code={t.flag} name={team} className="h-6 w-9 shrink-0" />}
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-[var(--navy)]">{team}</span>
              {picked && isRight && <span className="text-sm font-bold text-[var(--green)]">✓</span>}
              {picked && isPicked && !isRight && <span className="text-sm font-bold text-[var(--maroon)]">✗</span>}
            </button>
          );
        })}
      </div>

      {picked && (
        <button
          type="button"
          onClick={next}
          className="mt-5 rounded-full bg-[var(--navy)] px-6 py-2.5 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
        >
          Next player →
        </button>
      )}
    </div>
  );
}
