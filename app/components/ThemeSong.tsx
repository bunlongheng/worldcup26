"use client";

import { useEffect, useRef, useState } from "react";

// Official WC26 theme song, served as a local audio file (reliable, unlike the
// YouTube embed). Browsers block sound-on-load until a gesture, so it also starts
// on the first tap. The pill toggles it.
const VOLUME = 0.22; // 0..1, low background level

export default function ThemeSong() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = VOLUME;

    const tryPlay = () => {
      a.volume = VOLUME;
      a.play().catch(() => {}); // ignore autoplay block; the button/gesture will start it
    };
    tryPlay();

    const kick = () => tryPlay();
    window.addEventListener("pointerdown", kick, { once: true });
    window.addEventListener("keydown", kick, { once: true });
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.volume = VOLUME;
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/theme.mp3"
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        title={playing ? "Sound on - tap to mute" : "Play the theme song"}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.06em] transition-colors ${
          playing
            ? "border-[var(--green)] bg-[var(--green)] text-white"
            : "border-[var(--border)] bg-white text-[var(--navy)] hover:border-[var(--navy)]"
        }`}
      >
        <span className="relative flex h-3.5 w-3.5 items-center justify-end gap-[2px]">
          {playing ? (
            <>
              <i className="block h-3.5 w-[3px] animate-pulse rounded bg-white" />
              <i className="block h-2.5 w-[3px] animate-pulse rounded bg-white" style={{ animationDelay: "0.15s" }} />
              <i className="block h-3 w-[3px] animate-pulse rounded bg-white" style={{ animationDelay: "0.3s" }} />
            </>
          ) : (
            <span className="ml-[3px] block border-y-[6px] border-l-[9px] border-y-transparent border-l-[var(--green)]" />
          )}
        </span>
        Sound
      </button>
    </>
  );
}
