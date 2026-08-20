// Speak a country name aloud using the browser's built-in speech synthesis.
// No-op when unsupported; each call cancels the previous utterance so rapid
// taps do not queue up. Called from a user gesture (click), so no autoplay block.
import { isSoundOn } from "./soundState";

export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  if (!isSoundOn()) return; // respect the Sound toggle / mute
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    u.rate = 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    /* speech not available - silently ignore */
  }
}
