"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Flag from "./Flag";
import {
  TEAMS,
  GROUP_LETTERS,
  GROUP_ACCENTS,
  CONFED_LABEL,
  teamsByGroup,
  type Confed,
} from "../data/teams";

const Globe = dynamic(() => import("./Globe"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center text-sm text-[var(--muted)]">
      Loading globe…
    </div>
  ),
});

type View = "flags" | "groups" | "bracket" | "globe";

const TABS: { id: View; label: string }[] = [
  { id: "flags", label: "Flags" },
  { id: "groups", label: "Groups" },
  { id: "bracket", label: "Bracket" },
  { id: "globe", label: "Globe" },
];

const CONF_ORDER: Confed[] = ["CONCACAF", "CONMEBOL", "UEFA", "CAF", "AFC", "OFC"];

/* ---------- Flags (default) ---------- */
function FlagsView() {
  const ordered = useMemo(
    () =>
      [...TEAMS].sort((a, b) => {
        if (!!b.host !== !!a.host) return a.host ? -1 : 1;
        const c = CONF_ORDER.indexOf(a.confed) - CONF_ORDER.indexOf(b.confed);
        return c !== 0 ? c : a.name.localeCompare(b.name);
      }),
    []
  );

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {ordered.map((t, i) => (
        <div
          key={t.name}
          className="reveal flex flex-col items-center rounded-xl border border-[var(--border)] bg-white px-3 py-5 transition-shadow hover:shadow-[0_8px_24px_-10px_rgba(20,33,61,0.25)]"
          style={{ animationDelay: `${Math.min(i * 18, 500)}ms` }}
        >
          <Flag code={t.flag} name={t.name} className="h-[52px] w-[78px]" />
          <span className="mt-3 text-center text-sm font-bold text-[var(--navy)]">
            {t.name}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Groups ---------- */
function GroupsView() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {GROUP_LETTERS.map((letter, gi) => {
        const accent = GROUP_ACCENTS[letter];
        return (
          <div
            key={letter}
            className="reveal overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm"
            style={{ animationDelay: `${gi * 40}ms` }}
          >
            <div
              className="flex items-center justify-between px-4 py-2.5 text-white"
              style={{ background: accent }}
            >
              <span className="text-lg font-extrabold tracking-wide">GROUP {letter}</span>
              <span className="text-lg font-extrabold opacity-70">{letter}</span>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {teamsByGroup(letter).map((t) => (
                <li key={t.name} className="flex items-center gap-3 px-4 py-2.5">
                  <Flag code={t.flag} name={t.name} className="h-6 w-9 shrink-0" />
                  <span className="flex-1 text-[15px] font-medium text-[var(--navy)]">
                    {t.name}
                  </span>
                  {t.host && (
                    <span className="rounded-full bg-[var(--navy)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Host
                    </span>
                  )}
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--muted)]">
                    {CONFED_LABEL[t.confed]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- Bracket ---------- */
const ROUNDS = [
  { name: "Round of 32", n: 16 },
  { name: "Round of 16", n: 8 },
  { name: "Quarter-finals", n: 4 },
  { name: "Semi-finals", n: 2 },
  { name: "Final", n: 1 },
];

function BracketView() {
  return (
    <div>
      <p className="mb-5 max-w-2xl text-sm text-[var(--muted)]">
        The 12 group winners, 12 runners-up and 8 best third-placed teams reach the
        Round of 32. This is the tournament structure - exact matchups lock in once the
        group standings are final.
      </p>
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-[820px] gap-5">
          {ROUNDS.map((round, ri) => (
            <div key={round.name} className="flex flex-1 flex-col">
              <h4 className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--navy)]">
                {round.name}
              </h4>
              <div className="flex flex-1 flex-col justify-around gap-3">
                {Array.from({ length: round.n }).map((_, mi) => (
                  <div
                    key={mi}
                    className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 shadow-sm"
                  >
                    {[0, 1].map((slot) => (
                      <div
                        key={slot}
                        className={`flex items-center gap-2 py-1 text-xs text-[var(--muted)] ${
                          slot === 0 ? "border-b border-[var(--border)]" : ""
                        }`}
                      >
                        <span className="h-4 w-4 rounded-sm bg-[var(--bg-2)]" />
                        <span>
                          {ri === 0
                            ? slot === 0
                              ? "Group winner / R-up"
                              : "R-up / 3rd place"
                            : "Winner advances"}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="flex flex-col justify-center">
            <h4 className="mb-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
              Champion
            </h4>
            <div className="grid place-items-center rounded-xl border border-[var(--gold)] bg-[rgba(233,185,73,0.1)] px-5 py-6">
              <svg viewBox="0 0 120 200" className="h-12 w-auto" aria-hidden="true">
                <path
                  fill="var(--gold)"
                  d="M60 10c17 0 30 13 30 31 0 17-11 27-19 41-5 9-6 20-6 33h-10c0-13-1-24-6-33-8-14-19-24-19-41C30 23 43 10 60 10z"
                />
                <rect x="52" y="120" width="16" height="22" fill="var(--gold)" />
                <path fill="var(--gold)" d="M30 166h60l-6 16H36z" />
                <rect x="26" y="182" width="68" height="8" rx="3" fill="var(--gold)" />
              </svg>
              <span className="mt-2 text-center text-lg font-extrabold text-[var(--navy)]">
                Lifted July 19
              </span>
              <span className="text-[11px] text-[var(--muted)]">MetLife Stadium</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */
export default function WorldCupViews() {
  const [view, setView] = useState<View>("flags");

  return (
    <section className="mx-auto w-full max-w-6xl px-5 pb-16">
      <div className="mb-7 flex flex-wrap justify-center gap-2">
        {TABS.map((tab) => {
          const active = view === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setView(tab.id)}
              className={`rounded-full border px-5 py-2 text-sm font-bold uppercase tracking-[0.08em] transition-colors ${
                active
                  ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                  : "border-[var(--border)] bg-white text-[var(--navy)] hover:border-[var(--navy)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {view === "flags" && <FlagsView />}
      {view === "groups" && <GroupsView />}
      {view === "bracket" && <BracketView />}
      {view === "globe" && <Globe />}
    </section>
  );
}
