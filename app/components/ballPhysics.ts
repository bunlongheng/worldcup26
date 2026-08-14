// Pure, testable physics for the floating ball - no DOM, no React, just math.
// The bug-prone bits (release velocity, wall bounce, shake detection) live here
// so they can be unit-tested independently of the animation loop.

export const BALL = {
  size: 58, // diameter, px
  restitution: 0.72, // energy kept per wall bounce
  drag: 0.6, // air damping, per second (exponential)
  maxSpeed: 4200, // px/s clamp on a normal flick
  restSpeed: 12, // below this the ball settles
  smokeSpeed: 850, // above this speed it smokes
  shakeMin: 6, // px of horizontal travel to count as a direction
  shakeWindow: 450, // ms allowed between shake reversals
  fireMs: 2200, // how long fire lasts after a full shake
  smokeShakes: 3, // reversals to start smoking
  fireShakes: 6, // reversals to catch fire
  fireMultiplier: 5, // fire launches at Nx speed
  goldenMultiplier: 3, // the golden final ball throws at Nx a normal ball
  maxParticles: 240, // hard cap on live particles
} as const;

export type Vec = { x: number; y: number };
export type Sample = { t: number; x: number; y: number };

/** Flick velocity (px/s) from recent pointer samples, with the fire boost, an
    optional extra multiplier (e.g. the golden ball's 3x), and the cap applied. */
export function releaseVelocity(samples: Sample[], fire: boolean, mult = 1): Vec {
  if (samples.length < 2) return { x: 0, y: 0 };
  const a = samples[0], b = samples[samples.length - 1];
  const span = (b.t - a.t) / 1000;
  if (span <= 0) return { x: 0, y: 0 };
  let vx = (b.x - a.x) / span;
  let vy = (b.y - a.y) / span;
  let cap = BALL.maxSpeed;
  if (fire) {
    vx *= BALL.fireMultiplier;
    vy *= BALL.fireMultiplier;
    cap = BALL.maxSpeed * BALL.fireMultiplier;
  }
  if (mult !== 1) {
    vx *= mult;
    vy *= mult;
    cap *= mult;
  }
  const sp = Math.hypot(vx, vy);
  if (sp > cap) { vx *= cap / sp; vy *= cap / sp; }
  return { x: vx, y: vy };
}

/** Reflect a position/velocity off the [0, max] edges on one axis. */
export function bounceAxis(p: number, v: number, max: number): { p: number; v: number } {
  if (p < 0) return { p: 0, v: -v * BALL.restitution };
  if (p > max) return { p: max, v: -v * BALL.restitution };
  return { p, v };
}

/** Direction of a horizontal move (+1/-1/0) and whether it reversed the last direction. */
export function shakeStep(dx: number, lastSign: number): { sign: number; reversed: boolean } {
  const sign = dx > BALL.shakeMin ? 1 : dx < -BALL.shakeMin ? -1 : 0;
  return { sign, reversed: sign !== 0 && lastSign !== 0 && sign !== lastSign };
}
