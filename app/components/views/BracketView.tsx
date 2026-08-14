import Flag from "../Flag";
import Logo from "../Logo";
import { TEAM_BY_NAME } from "../../data/teams";

type Match = { a: string; b: string; win?: "a" | "b" };

// Actual knockout results (as of July 19, 2026). Argentina beat Spain 1-0 in the final to win the title.
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
      { a: "France", b: "Spain", win: "b" },
      { a: "England", b: "Argentina", win: "b" },
    ],
  },
];

function cellState(m: Match, side: "a" | "b"): "win" | "lose" | "tbd" {
  if (!m.win) return "tbd";
  return m.win === side ? "win" : "lose";
}

function TeamCell({
  name,
  state,
  divider,
}: {
  name: string;
  state: "win" | "lose" | "tbd";
  divider: boolean;
}) {
  const t = TEAM_BY_NAME[name];
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

/* Knockout bracket - real results through the semi-finals, final and champion TBD. */
export default function BracketView() {
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
                <div className="flex items-center justify-center gap-1.5">
                  {TEAM_BY_NAME["Spain"] && (
                    <Flag code={TEAM_BY_NAME["Spain"].flag} name="Spain" className="h-3.5 w-5 shrink-0 opacity-50 sm:h-5 sm:w-7" />
                  )}
                  <span className="text-[9px] font-semibold text-[var(--muted)] sm:text-[11px]">Spain</span>
                  <span className="text-[9px] font-semibold text-[var(--muted)] sm:text-[11px]">0</span>
                </div>
                <p className="my-1 text-[9px] text-[var(--muted)] sm:text-[10px]">vs</p>
                <div className="flex items-center justify-center gap-1.5">
                  {TEAM_BY_NAME["Argentina"] && (
                    <Flag code={TEAM_BY_NAME["Argentina"].flag} name="Argentina" className="h-3.5 w-5 shrink-0 sm:h-5 sm:w-7" />
                  )}
                  <span className="text-[9px] font-extrabold text-[var(--navy)] sm:text-[11px]">Argentina</span>
                  <span className="text-[9px] font-extrabold text-[var(--gold)] sm:text-[11px]">1</span>
                </div>
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
              <div className="mt-1 flex items-center justify-center gap-1.5 sm:mt-2">
                {TEAM_BY_NAME["Argentina"] && (
                  <Flag code={TEAM_BY_NAME["Argentina"].flag} name="Argentina" className="h-4 w-6 shrink-0 sm:h-6 sm:w-9" />
                )}
                <span className="text-center text-sm font-extrabold text-[var(--navy)] sm:text-lg">Argentina</span>
              </div>
              <span className="hidden text-[11px] text-[var(--muted)] sm:block">Crowned July 19</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
