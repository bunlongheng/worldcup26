"use client";

import { useEffect, useRef, useState } from "react";

// Official WC26 theme song. Tries to autoplay quietly (volume 4) on load via the
// YouTube IFrame API; if the browser blocks sound-on-load, it starts on the first
// interaction. The floating button toggles it.
const VIDEO_ID = "HmpzUm5j4OE";
const VOLUME = 4;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export default function ThemeSong() {
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const createPlayer = () => {
      playerRef.current = new window.YT.Player("wc26-theme-frame", {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          controls: 0,
          loop: 1,
          playlist: VIDEO_ID,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
        events: {
          onReady: (e: any) => {
            e.target.setVolume(VOLUME);
            e.target.playVideo();
            setReady(true);
          },
          onStateChange: (e: any) => {
            // 1 = playing, 2 = paused, 0 = ended
            if (e.data === 1) setPlaying(true);
            else if (e.data === 2 || e.data === 0) setPlaying(false);
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.body.appendChild(tag);
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    // If autoplay-with-sound is blocked, start on the first user gesture.
    const kick = () => {
      const p = playerRef.current;
      if (p && p.playVideo) {
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
    if (!p) return;
    if (playing) {
      p.pauseVideo();
    } else {
      p.setVolume(VOLUME);
      p.playVideo();
    }
  };

  return (
    <>
      {/* hidden player - kept in the DOM (offscreen, not display:none) so audio runs */}
      <div className="pointer-events-none fixed -left-[9999px] top-0 h-2 w-2 overflow-hidden">
        <div id="wc26-theme-frame" />
      </div>

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause theme song" : "Play theme song"}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full border border-[var(--border)] bg-white px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--navy)] shadow-md transition-colors hover:border-[var(--navy)]"
      >
        <span className="relative flex h-3.5 w-3.5 items-center justify-end gap-[2px]">
          {playing ? (
            <>
              <i className="block h-3.5 w-[3px] animate-pulse rounded bg-[var(--green)]" />
              <i className="block h-2.5 w-[3px] animate-pulse rounded bg-[var(--green)]" style={{ animationDelay: "0.15s" }} />
              <i className="block h-3 w-[3px] animate-pulse rounded bg-[var(--green)]" style={{ animationDelay: "0.3s" }} />
            </>
          ) : (
            <span className="ml-[3px] block border-y-[6px] border-l-[9px] border-y-transparent border-l-[var(--green)]" />
          )}
        </span>
        {playing ? "Theme on" : ready ? "Theme off" : "Play theme"}
      </button>
    </>
  );
}
