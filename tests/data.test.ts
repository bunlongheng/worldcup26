import test from "node:test";
import assert from "node:assert/strict";
import {
  TEAMS,
  GROUP_LETTERS,
  MATCHES,
  COUNTRY_INFO,
  HOST_STADIUMS,
  teamsByGroup,
  matchesFor,
} from "../app/data/teams.ts";

test("48 teams, all names unique", () => {
  assert.equal(TEAMS.length, 48);
  assert.equal(new Set(TEAMS.map((t) => t.name)).size, 48);
});

test("12 groups of exactly 4 teams", () => {
  assert.equal(GROUP_LETTERS.length, 12);
  for (const g of GROUP_LETTERS) assert.equal(teamsByGroup(g).length, 4);
});

test("exactly 3 host nations", () => {
  assert.equal(TEAMS.filter((t) => t.host).length, 3);
});

test("every match references two real teams", () => {
  const names = new Set(TEAMS.map((t) => t.name));
  for (const m of MATCHES) {
    assert.ok(names.has(m.a), `unknown team: ${m.a}`);
    assert.ok(names.has(m.b), `unknown team: ${m.b}`);
    assert.notEqual(m.a, m.b, "a team cannot play itself");
  }
});

test("every team has a quick-facts entry", () => {
  for (const t of TEAMS) assert.ok(COUNTRY_INFO[t.name], `no COUNTRY_INFO for ${t.name}`);
});

test("host stadiums add up to 16", () => {
  const total = Object.values(HOST_STADIUMS).reduce((n, s) => n + s.length, 0);
  assert.equal(total, 16);
});

test("matchesFor returns only matches involving the team", () => {
  const ms = matchesFor("Brazil");
  assert.ok(ms.length > 0);
  for (const m of ms) assert.ok(m.a === "Brazil" || m.b === "Brazil");
});
