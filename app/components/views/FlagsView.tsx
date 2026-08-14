"use client";

import { useMemo, useState } from "react";
import Flag from "../Flag";
import CountryCard from "../CountryCard";
import { useDialog } from "../useDialog";
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

  const dialogRef = useDialog<HTMLDivElement>(!!open, () => setOpen(null));

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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(10,15,25,0.55)] p-4 backdrop-blur-md"
          onClick={() => setOpen(null)}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${open.name} details`}
            tabIndex={-1}
            className="reveal relative max-h-[85vh] w-full max-w-sm overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(null)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <CountryCard team={open} big />
          </div>
        </div>
      )}
    </>
  );
}
