"use client";

import { useMemo, useState } from "react";
import Flag from "../Flag";
import CountryCard from "../CountryCard";
import CountryModal from "../CountryModal";
import { TEAMS, type Team, type Confed } from "../../data/teams";

const CONF_ORDER: Confed[] = ["CONCACAF", "CONMEBOL", "UEFA", "CAF", "AFC", "OFC"];

/* Flags grid - tap a flag for the full country modal. */
export default function FlagsView() {
  const [open, setOpen] = useState<Team | null>(null);

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
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
        {ordered.map((t) => (
          <button
            key={t.name}
            type="button"
            onClick={() => setOpen(t)}
            className="flex flex-col items-center rounded-xl border border-[var(--border)] bg-white px-2 py-1.5 transition-all hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-8px_rgba(20,33,61,0.3)]"
          >
            <Flag code={t.flag} name={t.name} className="h-[40px] w-[60px]" />
            <span className="mt-1 text-center text-[13px] font-bold leading-tight text-[var(--navy)]">
              {t.name}
            </span>
          </button>
        ))}
      </div>

      {open && (
        <CountryModal team={open} onClose={() => setOpen(null)} maxWidth="max-w-sm">
          <CountryCard team={open} big />
        </CountryModal>
      )}
    </>
  );
}
