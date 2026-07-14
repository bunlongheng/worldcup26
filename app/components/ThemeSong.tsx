"use client";

import { useEffect, useState } from "react";

// Official WC26 theme song. Browsers block autoplay-with-sound until a user
// gesture, so we attempt on mount and also start on the first interaction.
const VIDEO_ID = "HmpzUm5j4OE";

export default function ThemeSong() {
  const [playing, setPlaying] = useState(false);
  const [armed, setArmed] = useState(false); // has ever started

  useEffect(() => {
    setPlaying(true); // attempt immediate autoplay
    const start = () => {
      setPlaying(true);
      setArmed(true);
    };
    const opts = { once: true } as AddEventListenerOptions;
    window.addEventListener("pointerdown", start, opts);
    window.addEventListener("keydown", start, opts);
    return () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
    };
  }, []);

  return (
    <>
      {playing && (
        <iframe
          title="World Cup 26 theme"
          className="pointer-events-none fixed h-0 w-0 opacity-0"
          src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&loop=1&playlist=${VIDEO_ID}&controls=0&modestbranding=1&rel=0`}
          allow="autoplay; encrypted-media"
        />
      )}

      <button
        type="button"
        onClick={() => {
          setPlaying((p) => !p);
          setArmed(true);
        }}
        aria-label={playing ? "Pause theme song" : "Play theme song"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--navy)] shadow-md transition-colors hover:border-[var(--navy)]"
      >
        <span className="relative flex h-3.5 w-3.5 items-center justify-end gap-[2px]">
          {playing ? (
            <>
              <i className="block h-3.5 w-[3px] animate-pulse rounded bg-[var(--green)]" />
              <i
                className="block h-2.5 w-[3px] animate-pulse rounded bg-[var(--green)]"
                style={{ animationDelay: "0.15s" }}
              />
              <i
                className="block h-3 w-[3px] animate-pulse rounded bg-[var(--green)]"
                style={{ animationDelay: "0.3s" }}
              />
            </>
          ) : (
            <span className="ml-[3px] block border-y-[6px] border-l-[9px] border-y-transparent border-l-[var(--green)]" />
          )}
        </span>
        {playing ? "Theme on" : armed ? "Theme off" : "Play theme"}
      </button>
    </>
  );
}
