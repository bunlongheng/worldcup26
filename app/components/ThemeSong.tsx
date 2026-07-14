"use client";

import { useEffect, useRef, useState } from "react";

// Official WC26 theme song via the YouTube IFrame API. Autoplay-with-sound is
// blocked by browsers until a gesture, so it also starts on the first tap.
const VIDEO_ID = "HmpzUm5j4OE";
const VOLUME = 15; // low background level (4/100 was nearly silent)

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function ThemeSong() {
  const playerRef = useRef<any>(null);
  const wantRef = useRef(true);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const create = () => {
      if (playerRef.current) return;
      playerRef.current = new window.YT.Player("wc26-theme-frame", {
        height: "180",
        width: "320",
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: VIDEO_ID,
          playsinline: 1,
          disablekb: 1,
        },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(VOLUME);
            if (wantRef.current) e.target.playVideo();
          },
          onStateChange: (e: any) => {
            if (e.data === 1) setPlaying(true);
            else if (e.data === 2 || e.data === 0) setPlaying(false);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      create();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        prev?.();
        create();
      };
      if (!document.getElementById("yt-iframe-api")) {
        const s = document.createElement("script");
        s.id = "yt-iframe-api";
        s.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(s);
      }
    }

    const kick = () => {
      wantRef.current = true;
      const p = playerRef.current;
      if (p?.playVideo) {
        p.setVolume(VOLUME);
        p.playVideo();
      }
    };
    window.addEventListener("pointerdown", kick, { once: true });
    window.addEventListener("keydown", kick, { once: true });
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
  }, []);

  const toggle = () => {
    const p = playerRef.current;
    if (playing) {
      wantRef.current = false;
      setPlaying(false);
      p?.pauseVideo?.();
    } else {
      wantRef.current = true;
      setPlaying(true); // optimistic - instant indication
      if (p?.playVideo) {
        p.setVolume(VOLUME);
        p.playVideo();
      }
    }
  };

  return (
    <>
      {/* real-sized player parked off-screen (NOT hidden/0-size, or YouTube blocks audio) */}
      <div aria-hidden className="pointer-events-none fixed -left-[9999px] top-0 -z-10">
        <div id="wc26-theme-frame" />
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        title={playing ? "Theme on - tap to mute" : "Play theme song"}
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
        {playing ? "Theme On" : "Theme"}
      </button>
    </>
  );
}
