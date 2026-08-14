import Flag from "../Flag";
import Logo from "../Logo";
import { TEAM_BY_NAME, koResult, koWinner, KNOCKOUT_TOPOLOGY } from "../../data/teams";

// Topology (who meets whom) lives in teams.ts beside MATCHES; every OUTCOME - scores,
// winners, the final, the champion - is derived here from MATCHES via koResult/koWinner,
// so a score edit can never disagree with what the bracket shows (guarded by a test).
const KO_ROUNDS = KNOCKOUT_TOPOLOGY;

const SEMIS = KO_ROUNDS[KO_ROUNDS.length - 1].matches;
const FINALISTS = SEMIS.map((m) => koWinner(m.a, m.b)); // derived, not hard-coded
const CHAMPION =
  FINALISTS[0] && FINALISTS[1] ? koWinner(FINALISTS[0], FINALISTS[1]) : null;

type CellState = "win" | "lose" | "tbd";
function stateFor(win: "a" | "b" | null | undefined, side: "a" | "b"): CellState {
  if (!win) return "tbd";
  return win === side ? "win" : "lose";
}

function TeamCell({
  name,
  state,
  score,
  pens,
  divider,
}: {
  name: string | null;
  state: CellState;
  score?: number | null;
  pens?: string;
  divider: boolean;
}) {
  const t = name ? TEAM_BY_NAME[name] : undefined;
  const tone =
    state === "win"
      ? "font-extrabold text-[var(--navy)]"
      : state === "lose"
        ? "font-medium text-[var(--muted)]"
        : "font-semibold text-[var(--navy)]";
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
      <span className={`hidden truncate sm:inline sm:text-sm ${state === "lose" ? `${tone} line-through` : tone}`}>
        {t ? t.name : name ?? "TBD"}
      </span>
      <span className="ml-auto flex items-center gap-0.5 sm:gap-1">
        {score != null && <span className={`tabular-nums text-[11px] sm:text-sm ${tone}`}>{score}</span>}
        {state === "win" && pens && (
          <span title={pens} className="rounded bg-[var(--gold)] px-0.5 text-[7px] font-bold uppercase leading-tight text-[var(--navy)] sm:text-[8px]">
            p
          </span>
        )}
        {state === "win" && <span className="text-xs font-bold text-[var(--green)] sm:text-sm">✓</span>}
      </span>
    </div>
  );
}

// One knockout card, fully derived from MATCHES.
function MatchCard({ a, b }: { a: string | null; b: string | null }) {
  const r = a && b ? koResult(a, b) : null;
  return (
    <div className="rounded-md border border-[var(--border)] bg-white px-0.5 py-0.5 shadow-sm sm:rounded-lg sm:px-1.5 sm:py-1">
      <TeamCell name={a} state={stateFor(r?.win, "a")} score={r?.sa ?? null} pens={r?.pens} divider />
      <TeamCell name={b} state={stateFor(r?.win, "b")} score={r?.sb ?? null} pens={r?.pens} divider={false} />
    </div>
  );
}

/* Knockout bracket - topology is fixed, every score/winner/champion is derived from MATCHES. */
export default function BracketView() {
  return (
    <div>
      <div
        className="overflow-x-auto pb-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--navy)]"
        tabIndex={0}
        role="region"
        aria-label="Knockout bracket, scroll horizontally"
      >
        <div className="flex min-w-[1180px] gap-2 sm:gap-3">
          {KO_ROUNDS.map((round) => (
            <div key={round.name} className="flex flex-1 flex-col">
              <h4 className="mb-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-[var(--navy)] sm:mb-3 sm:text-[11px] sm:tracking-[0.14em]">
                <span className="sm:hidden">{round.short}</span>
                <span className="hidden sm:inline">{round.name}</span>
              </h4>
              <div className="flex flex-1 flex-col justify-around gap-2">
                {round.matches.map((m, k) => (
                  <MatchCard key={k} a={m.a} b={m.b} />
                ))}
              </div>
            </div>
          ))}

          {/* Final - finalists + result derived from the semi-final winners */}
          <div className="flex flex-1 flex-col">
            <h4 className="mb-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-[var(--navy)] sm:mb-3 sm:text-[11px] sm:tracking-[0.14em]">
              <span className="sm:hidden">F</span>
              <span className="hidden sm:inline">Final</span>
            </h4>
            <div className="flex flex-1 flex-col justify-center">
              <MatchCard a={FINALISTS[0]} b={FINALISTS[1]} />
              <p className="mt-2 text-center text-[9px] text-[var(--muted)] sm:text-[10px]">July 19</p>
            </div>
          </div>

          {/* Champion - derived winner of the final */}
          <div className="flex flex-col justify-center">
            <h4 className="mb-2 text-center text-[9px] font-bold uppercase tracking-[0.06em] text-[var(--gold-ink)] sm:mb-3 sm:text-[11px] sm:tracking-[0.14em]">
              <span className="sm:hidden">CH</span>
              <span className="hidden sm:inline">Champion</span>
            </h4>
            <div className="grid place-items-center rounded-lg border border-[var(--gold)] bg-[rgba(233,185,73,0.1)] px-1.5 py-3 sm:rounded-xl sm:px-5 sm:py-6">
              <Logo className="h-10 w-auto sm:h-16" />
              <div className="mt-1 flex items-center justify-center gap-1.5 sm:mt-2">
                {CHAMPION && TEAM_BY_NAME[CHAMPION] && (
                  <Flag code={TEAM_BY_NAME[CHAMPION].flag} name={CHAMPION} className="h-4 w-6 shrink-0 sm:h-6 sm:w-9" />
                )}
                <span className="text-center text-sm font-extrabold text-[var(--navy)] sm:text-lg">{CHAMPION ?? "TBD"}</span>
              </div>
              <span className="mt-1 text-[10px] text-[var(--muted)] sm:text-[11px]">Crowned July 19</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
