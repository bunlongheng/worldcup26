import test from "node:test";
import assert from "node:assert/strict";
import { teamsByIso3, activeIso3, activeGroupLetters, glowColorFor } from "../app/components/mapPicking.ts";
import { TEAMS, GROUP_ACCENTS } from "../app/data/teams.ts";

const BY = teamsByIso3(TEAMS);
const t0 = TEAMS[0];
const allIso3 = TEAMS.map((t) => t.iso3);

test("teamsByIso3: England and Scotland share GBR", () => {
  const names = (BY["GBR"] || []).map((t) => t.name);
  assert.ok(names.includes("England"), "England under GBR");
  assert.ok(names.includes("Scotland"), "Scotland under GBR");
});

test("activeIso3: a selected country lights only itself", () => {
  assert.deepEqual([...activeIso3(t0.iso3, null, allIso3, BY)], [t0.iso3]);
});

test("activeIso3: a selected group lights every qualified member", () => {
  const letter = t0.group;
  const members = TEAMS.filter((t) => t.group === letter).map((t) => t.iso3);
  const set = activeIso3(null, letter, allIso3, BY);
  for (const iso of members) assert.ok(set.has(iso), `${iso} should glow for group ${letter}`);
});

test("activeIso3: nothing selected is empty", () => {
  assert.equal(activeIso3(null, null, allIso3, BY).size, 0);
});

test("activeGroupLetters: a country lights its own group", () => {
  assert.deepEqual([...activeGroupLetters(t0.iso3, null, BY)], [t0.group]);
});

test("glowColorFor: selected group wins, else own group, else default", () => {
  assert.equal(glowColorFor(t0.iso3, "D", BY, GROUP_ACCENTS), GROUP_ACCENTS["D"]);
  assert.equal(glowColorFor(t0.iso3, null, BY, GROUP_ACCENTS), GROUP_ACCENTS[t0.group]);
  assert.equal(glowColorFor("ZZZ", null, BY, GROUP_ACCENTS), "#2fa84f");
});
