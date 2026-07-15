import test from "node:test";
import assert from "node:assert/strict";
import { BALL, releaseVelocity, bounceAxis, shakeStep } from "../app/components/ballPhysics.ts";

test("releaseVelocity: velocity is displacement over time (px/s)", () => {
  // moved 100px in x and 50px in y over 100ms -> 1000 / 500 px/s
  const v = releaseVelocity([{ t: 0, x: 0, y: 0 }, { t: 100, x: 100, y: 50 }], false);
  assert.equal(Math.round(v.x), 1000);
  assert.equal(Math.round(v.y), 500);
});

test("releaseVelocity: needs 2+ samples and a positive time span", () => {
  assert.deepEqual(releaseVelocity([], false), { x: 0, y: 0 });
  assert.deepEqual(releaseVelocity([{ t: 5, x: 1, y: 1 }], false), { x: 0, y: 0 });
  assert.deepEqual(releaseVelocity([{ t: 5, x: 0, y: 0 }, { t: 5, x: 9, y: 9 }], false), { x: 0, y: 0 });
});

test("releaseVelocity: a normal flick is clamped to maxSpeed", () => {
  // 10000px in 100ms would be 100000 px/s -> clamped to maxSpeed
  const v = releaseVelocity([{ t: 0, x: 0, y: 0 }, { t: 100, x: 10000, y: 0 }], false);
  assert.equal(Math.round(Math.hypot(v.x, v.y)), BALL.maxSpeed);
});

test("releaseVelocity: fire multiplies speed and raises the cap", () => {
  const samples = [{ t: 0, x: 0, y: 0 }, { t: 100, x: 100, y: 0 }]; // 1000 px/s
  const normal = releaseVelocity(samples, false);
  const fire = releaseVelocity(samples, true);
  assert.equal(Math.round(fire.x / normal.x), BALL.fireMultiplier);
  // a hard fire flick is capped at maxSpeed * fireMultiplier, not maxSpeed
  const hard = releaseVelocity([{ t: 0, x: 0, y: 0 }, { t: 100, x: 100000, y: 0 }], true);
  assert.equal(Math.round(Math.hypot(hard.x, hard.y)), BALL.maxSpeed * BALL.fireMultiplier);
});

test("bounceAxis: reflects off both edges with energy loss, else unchanged", () => {
  const lo = bounceAxis(-10, -300, 500);
  assert.equal(lo.p, 0);
  assert.equal(lo.v, 300 * BALL.restitution); // direction flipped, energy lost
  const hi = bounceAxis(600, 300, 500);
  assert.equal(hi.p, 500);
  assert.equal(hi.v, -300 * BALL.restitution);
  assert.deepEqual(bounceAxis(250, 300, 500), { p: 250, v: 300 }); // in range: untouched
});

test("shakeStep: detects direction and only flags a real reversal", () => {
  assert.deepEqual(shakeStep(2, 0), { sign: 0, reversed: false }); // sub-threshold = no direction
  assert.deepEqual(shakeStep(20, 0), { sign: 1, reversed: false }); // first move, no prior sign
  assert.deepEqual(shakeStep(20, 1), { sign: 1, reversed: false }); // same direction
  assert.deepEqual(shakeStep(-20, 1), { sign: -1, reversed: true }); // flip = reversal
  assert.deepEqual(shakeStep(2, 1), { sign: 0, reversed: false }); // tiny move never reverses
});
