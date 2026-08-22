// Speak a country or player name aloud using the browser's built-in speech
// synthesis. Always on - it's the app's learning feature, independent of the
// Theme button (which only controls the music). No-op when unsupported; each
// call cancels the previous utterance so rapid taps do not queue up.
export function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
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
