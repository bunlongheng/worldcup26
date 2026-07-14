"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Logo from "./Logo";
import ThemeSong from "./ThemeSong";
import FlagsView from "./views/FlagsView";
import GroupsView from "./views/GroupsView";
import BracketView from "./views/BracketView";

const WorldMap = dynamic(() => import("./WorldMap"), {
  ssr: false,
  loading: () => (
    <div className="grid h-[420px] place-items-center text-sm text-[var(--muted)]">
      Loading map…
    </div>
  ),
});

type View = "flags" | "groups" | "bracket" | "map" | "globe";

const TABS: { id: View; label: string }[] = [
  { id: "flags", label: "Flags" },
  { id: "groups", label: "Groups" },
  { id: "bracket", label: "Bracket" },
  { id: "map", label: "Map" },
  { id: "globe", label: "Globe" },
];

/* App shell: logo + theme toggle on the left, view tabs on the right. */
export default function WorldCupViews() {
  const [view, setView] = useState<View>("flags");

  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 py-3">
        <div className="flex items-center gap-2.5">
          <Logo className="h-10 w-auto shrink-0 sm:h-14" />
          <div>
            <h1 className="text-lg font-extrabold leading-none tracking-tight text-[var(--navy)] sm:text-2xl">
              World Cup 2026
            </h1>
            <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-[var(--muted)] sm:text-[10px]">
              48 Nations
            </p>
          </div>
          <ThemeSong />
        </div>

        <nav className="flex flex-nowrap gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const active = view === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setView(tab.id)}
                className={`shrink-0 rounded-full border px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.04em] transition-colors sm:px-4 sm:py-2 sm:text-xs sm:tracking-[0.06em] ${
                  active
                    ? "border-[var(--navy)] bg-[var(--navy)] text-white"
                    : "border-[var(--border)] bg-white text-[var(--navy)] hover:border-[var(--navy)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </header>

      <section className="py-4">
        {view === "flags" && <FlagsView />}
        {view === "groups" && <GroupsView />}
        {view === "bracket" && <BracketView />}
        {view === "map" && <WorldMap mode="flat" />}
        {view === "globe" && <WorldMap mode="globe" />}
      </section>
    </div>
  );
}
