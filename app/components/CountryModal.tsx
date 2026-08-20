"use client";

import { useEffect, type ReactNode } from "react";
import { useDialog } from "./useDialog";
import { speak } from "./speak";
import type { Team } from "../data/teams";

/* Shared country modal shell: the team's flag sits blurred behind the card, the
   name is spoken aloud on open (like the Countries app), focus is trapped, and
   Escape or a backdrop click closes. Each view passes its own body. */
export default function CountryModal({
  team,
  onClose,
  label,
  maxWidth = "max-w-md",
  children,
}: {
  team: Team;
  onClose: () => void;
  label?: string;
  maxWidth?: string;
  children: ReactNode;
}) {
  const dialogRef = useDialog<HTMLDivElement>(true, onClose);

  // Speak the country name once when the modal opens (fired from a click gesture,
  // so it is not blocked by autoplay policy).
  useEffect(() => {
    speak(team.name);
  }, [team.name]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 scale-125 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(https://flagcdn.com/w320/${team.flag}.png)` }}
        />
        <div className="absolute inset-0 bg-[rgba(10,15,25,0.55)] backdrop-blur-md" />
      </div>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={label ?? `${team.name} details`}
        tabIndex={-1}
        className={`reveal relative z-10 max-h-[85vh] w-full ${maxWidth} overflow-y-auto rounded-3xl bg-white p-7 shadow-2xl outline-none`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-[var(--border)] text-[var(--muted)] transition-colors hover:border-[var(--navy)] hover:text-[var(--navy)]"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
