"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Flag from "./Flag";
import { useDialog } from "./useDialog";
import { speak } from "./speak";
import { GROUP_ACCENTS } from "../data/teams";
import { POS_LABEL, type Player } from "../data/players";
import type { Team } from "../data/teams";

/* Full-screen trading-card view. The card spins in like a tossed Panini card,
   tilts toward the pointer with a holographic glare, and flips to a stats back
   on tap. Front: cutout photo, shirt number, name foil plate. Back: club, caps,
   goals, age. */
export default function PlayerCard({
  player,
  team,
  onClose,
}: {
  player: Player;
  team: Team;
  onClose: () => void;
}) {
  const dialogRef = useDialog<HTMLDivElement>(true, onClose);
  const cardRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 40, on: false });
  const accent = GROUP_ACCENTS[team.group] ?? "var(--gold)";

  useEffect(() => {
    speak(player.name);
  }, [player.name]);

  const onMove = (e: React.PointerEvent) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ rx: -(py - 0.5) * 14, ry: (px - 0.5) * 16, gx: px * 100, gy: py * 100, on: true });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, gx: 50, gy: 40, on: false });

  // Holo layers share the pointer position so the rainbow and glare move together.
  const holo = (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-color-dodge"
        style={{
          opacity: tilt.on ? 0.5 : 0.22,
          transition: "opacity 0.3s",
          background: `linear-gradient(${115 + tilt.ry * 3}deg,
            transparent 20%, rgba(0,231,255,0.45) ${30 + tilt.gx / 8}%,
            rgba(255,0,231,0.35) ${45 + tilt.gx / 8}%, rgba(255,214,0,0.4) ${60 + tilt.gx / 8}%,
            transparent 80%)`,
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: tilt.on ? 1 : 0,
          transition: "opacity 0.3s",
          background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(255,255,255,0.35) 0%, transparent 55%)`,
        }}
      />
    </>
  );

  const statRows: [string, string][] = [
    ["Position", POS_LABEL[player.pos] ?? player.pos],
    ...(player.club ? ([["Club", player.club]] as [string, string][]) : []),
    ...(player.caps != null ? ([["Caps", String(player.caps)]] as [string, string][]) : []),
    ...(player.goals != null ? ([["Goals", String(player.goals)]] as [string, string][]) : []),
    ...(player.age != null ? ([["Age", String(player.age)]] as [string, string][]) : []),
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4" onClick={onClose}>
      {/* Blurred flag backdrop - same language as the country modal */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 scale-125 bg-cover bg-center blur-2xl"
          style={{ backgroundImage: `url(https://flagcdn.com/w320/${team.flag}.png)` }}
        />
        <div className="absolute inset-0 bg-[rgba(8,12,22,0.72)] backdrop-blur-md" />
      </div>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${player.name}, ${team.name}, number ${player.no}. Tap the card to flip it.`}
        tabIndex={-1}
        className="relative z-10 outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-enter" style={{ perspective: "1200px" }}>
          <div
            ref={cardRef}
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            onClick={() => setFlipped((f) => !f)}
            role="button"
            aria-pressed={flipped}
            className="relative aspect-[5/7] w-[min(82vw,320px)] cursor-pointer select-none"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry + (flipped ? 180 : 0)}deg)`,
              transition: tilt.on ? "transform 0.08s linear" : "transform 0.65s cubic-bezier(0.3, 0.9, 0.35, 1)",
            }}
          >
            {/* FRONT */}
            <div
              className="foil-frame absolute inset-0 rounded-2xl p-[4px] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)]"
              style={{ backfaceVisibility: "hidden" }}
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-[var(--navy)]">
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(120% 90% at 50% 100%, ${accent}55 0%, transparent 60%)` }}
                />
                {/* Watermark number */}
                <span aria-hidden className="tnum absolute -right-2 top-2 text-[7rem] font-extrabold leading-none text-white/[0.07]">
                  {player.no}
                </span>

                <div className="relative flex items-center justify-between px-3.5 pt-3">
                  <Flag code={team.flag} name={team.name} className="h-6 w-9" />
                  <div className="flex items-center gap-1.5">
                    {player.captain && (
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--gold)] text-[11px] font-extrabold text-[var(--navy)]" title="Captain">
                        C
                      </span>
                    )}
                    <span className="rounded-md bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {player.pos}
                    </span>
                  </div>
                </div>

                {/* Cutout photo, anchored to the name plate */}
                <div className="relative min-h-0 flex-1">
                  {player.img ? (
                    <Image
                      src={player.img}
                      alt={player.name}
                      fill
                      sizes="320px"
                      className={player.img.endsWith(".png") ? "object-contain object-bottom drop-shadow-[0_10px_18px_rgba(0,0,0,0.5)]" : "object-cover object-top"}
                    />
                  ) : (
                    <PlayerSilhouette className="absolute bottom-0 left-1/2 h-[80%] w-auto -translate-x-1/2 text-white/15" />
                  )}
                </div>

                {/* Name foil plate */}
                <div className="foil-frame relative px-3 py-2.5 text-center">
                  <p className="truncate text-base font-extrabold uppercase tracking-wide text-[var(--navy)]">
                    <span className="tnum mr-1.5">{player.no}</span>
                    {player.name}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#5c4508]">
                    {team.name} · World Cup 26
                  </p>
                </div>
                {holo}
              </div>
            </div>

            {/* BACK */}
            <div
              className="foil-frame absolute inset-0 rounded-2xl p-[4px] shadow-[0_24px_60px_-16px_rgba(0,0,0,0.7)]"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-xl bg-[var(--navy)] px-5 py-5">
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(120% 90% at 50% 0%, ${accent}45 0%, transparent 60%)` }}
                />
                <div className="relative flex flex-col items-center">
                  <Flag code={team.flag} name={team.name} className="h-9 w-[54px]" />
                  <p className="mt-2 text-center text-lg font-extrabold uppercase leading-tight tracking-wide text-white">
                    {player.name}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
                    {team.name} · #{player.no}
                    {player.captain ? " · Captain" : ""}
                  </p>
                </div>
                <dl className="relative mt-5 flex-1 space-y-2.5">
                  {statRows.map(([k, v]) => (
                    <div key={k} className="flex items-baseline gap-2 border-b border-white/10 pb-2">
                      <dt className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">{k}</dt>
                      <dd className="tnum ml-auto truncate text-right text-sm font-bold text-white">{v}</dd>
                    </div>
                  ))}
                </dl>
                <p className="relative text-center text-[9px] font-bold uppercase tracking-[0.24em] text-[var(--gold)]">
                  FIFA World Cup 2026
                </p>
                {holo}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
          Tap card to flip
        </p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-12 right-0 grid h-9 w-9 place-items-center rounded-full border border-white/30 text-white/80 transition-colors hover:border-white hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Simple jersey-and-head silhouette for squad members with no photo yet.
export function PlayerSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" className={className} fill="currentColor" aria-hidden="true">
      <circle cx="50" cy="34" r="20" />
      <path d="M50 60c-16 0-29 10-33 25l-5 35h76l-5-35C79 70 66 60 50 60Z" />
    </svg>
  );
}
