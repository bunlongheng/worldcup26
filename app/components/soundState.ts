// Shared on/off flag for all app audio. The Sound toggle (ThemeSong) writes it;
// speak() reads it so muting the theme also silences country-name speech.
// Simple module-level state - one boolean, no store needed.
let soundOn = true;

export const isSoundOn = () => soundOn;
export const setSoundOn = (v: boolean) => {
  soundOn = v;
};
