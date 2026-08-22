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
  groupStandings,
  koResult,
  koWinner,
  matchOutcome,
  textOn,
  GROUP_ACCENTS,
  KNOCKOUT_TOPOLOGY,
  finalRanking,
} from "../app/data/teams.ts";

// WCAG contrast ratio between two sRGB hex colors (for asserting textOn picks well).
function contrast(hexA: string, hexB: string): number {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const c = (i: number) => {
      const s = parseInt(h.slice(i, i + 2), 16) / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * c(0) + 0.7152 * c(2) + 0.0722 * c(4);
  };
  const [hi, lo] = [lum(hexA), lum(hexB)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

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

test("group standings: 4 teams, each played 3, W+D+L and GD are consistent", () => {
  for (const g of GROUP_LETTERS) {
    const table = groupStandings(g);
    assert.equal(table.length, 4);
    for (const r of table) {
      assert.equal(r.p, 3, `${r.team.name} should have played 3`);
      assert.equal(r.w + r.d + r.l, r.p);
      assert.equal(r.pts, r.w * 3 + r.d);
      assert.equal(r.gd, r.gf - r.ga);
    }
    // sorted by the FULL comparator: points, then GD, then goals-for, then name
    for (let i = 1; i < table.length; i++) {
      const a = table[i - 1];
      const b = table[i];
      const ordered =
        a.pts !== b.pts
          ? a.pts > b.pts
          : a.gd !== b.gd
            ? a.gd > b.gd
            : a.gf !== b.gf
              ? a.gf > b.gf
              : a.team.name.localeCompare(b.team.name) <= 0;
      assert.ok(ordered, `${g} not sorted by pts/gd/gf/name at row ${i}`);
    }
  }
});

test("group standings: Group A tops with Mexico on 9", () => {
  const a = groupStandings("A");
  assert.equal(a[0].team.name, "Mexico");
  assert.equal(a[0].pts, 9);
  assert.equal(a[0].gd, 6);
});

test("koResult orients the score + winner and flags pens; group-only pairs are null", () => {
  assert.deepEqual(koResult("Spain", "Argentina"), { sa: 1, sb: 0, pens: undefined, win: "a" });
  assert.deepEqual(koResult("Argentina", "Spain"), { sa: 0, sb: 1, pens: undefined, win: "b" });
  const pens = koResult("Switzerland", "Colombia");
  assert.equal(pens?.sa, 0);
  assert.equal(pens?.sb, 0);
  assert.ok(pens?.pens, "penalty note preserved");
  assert.equal(pens?.win, "a", "shootout winner oriented to the a-side");
  // orientation flips the pens winner too
  assert.equal(koResult("Colombia", "Switzerland")?.win, "b");
  assert.equal(koResult("Mexico", "South Africa"), null); // met only in the group stage
});

test("bracket topology never drifts from MATCHES", () => {
  const names = new Set(TEAMS.map((t) => t.name));
  const key = (a: string, b: string) => [a, b].sort().join(" | ");

  // (a) every pairing is real teams and resolves to a played result with a winner
  for (const round of KNOCKOUT_TOPOLOGY) {
    for (const m of round.matches) {
      assert.ok(names.has(m.a) && names.has(m.b), `unknown team in ${m.a} v ${m.b}`);
      const r = koResult(m.a, m.b);
      assert.ok(r && r.win, `${m.a} v ${m.b} has no derivable knockout result`);
    }
  }

  // (b) each round's winners are exactly the next round's participants
  for (let i = 0; i < KNOCKOUT_TOPOLOGY.length - 1; i++) {
    const winners = new Set(KNOCKOUT_TOPOLOGY[i].matches.map((m) => koWinner(m.a, m.b)));
    const nextParticipants = KNOCKOUT_TOPOLOGY[i + 1].matches.flatMap((m) => [m.a, m.b]);
    for (const p of nextParticipants) {
      assert.ok(winners.has(p), `${p} plays in ${KNOCKOUT_TOPOLOGY[i + 1].name} but did not win ${KNOCKOUT_TOPOLOGY[i].name}`);
    }
  }

  // (c) every bracket knockout row (not group, not the medal matches) appears once in the topology
  const topo = new Set(KNOCKOUT_TOPOLOGY.flatMap((r) => r.matches.map((m) => key(m.a, m.b))));
  const knockoutRows = MATCHES.filter(
    (m) => !m.stage.startsWith("Group") && m.stage !== "Final" && m.stage !== "Third place"
  );
  assert.equal(topo.size, knockoutRows.length, "topology and MATCHES knockout counts differ");
  for (const m of knockoutRows) {
    assert.ok(topo.has(key(m.a, m.b)), `${m.stage} ${m.a} v ${m.b} is missing from the bracket topology`);
  }

  // (d) the Final row exists and its participants are exactly the two semi-final winners
  const sfWinners = new Set(KNOCKOUT_TOPOLOGY[KNOCKOUT_TOPOLOGY.length - 1].matches.map((m) => koWinner(m.a, m.b)));
  const final = MATCHES.find((m) => m.stage === "Final");
  assert.ok(final, "no Final row in MATCHES");
  assert.ok(sfWinners.has(final!.a) && sfWinners.has(final!.b), "Final participants are not the semi-final winners");
  assert.ok(koWinner(final!.a, final!.b), "Final has no derivable winner (champion would be TBD)");
});

test("matchOutcome resolves win/loss/draw/pens/upcoming from either side", () => {
  assert.equal(matchOutcome({ stage: "x", a: "A", b: "B", sa: 2, sb: 0 }, true), "won");
  assert.equal(matchOutcome({ stage: "x", a: "A", b: "B", sa: 2, sb: 0 }, false), "lost");
  assert.equal(matchOutcome({ stage: "x", a: "A", b: "B", sa: 1, sb: 1 }, true), "draw");
  assert.equal(matchOutcome({ stage: "x", a: "A", b: "B", sa: 0, sb: 0, pens: "4-3 pens" }, true), "won");
  assert.equal(matchOutcome({ stage: "x", a: "A", b: "B", sa: 0, sb: 0, pens: "4-3 pens" }, false), "lost");
  assert.equal(matchOutcome({ stage: "x", a: "A", b: "B", sa: null, sb: null }, true), "upcoming");
});

test("textOn picks the higher-contrast text and clears WCAG AA on every group accent", () => {
  assert.equal(textOn("#ffffff"), "#0b0b0b"); // black on white
  assert.equal(textOn("#000000"), "#ffffff"); // white on black
  for (const [letter, hex] of Object.entries(GROUP_ACCENTS)) {
    const chosen = textOn(hex);
    const other = chosen === "#ffffff" ? "#0b0b0b" : "#ffffff";
    assert.ok(
      contrast(hex, chosen) >= contrast(hex, other),
      `group ${letter}: textOn should pick the higher-contrast color`
    );
  }
});

test("koWinner returns the advancing team both ways round", () => {
  assert.equal(koWinner("Spain", "Argentina"), "Spain");
  assert.equal(koWinner("Argentina", "Spain"), "Spain");
  assert.equal(koWinner("Switzerland", "Colombia"), "Switzerland"); // won on pens
  assert.equal(koWinner("Mexico", "South Africa"), null);
});

test("finalRanking ranks all 48 uniquely, champion first, derived from the results", () => {
  const r = finalRanking();
  assert.equal(r.length, 48, "every nation is ranked");
  assert.deepEqual(
    r.map((x) => x.rank),
    Array.from({ length: 48 }, (_, i) => i + 1),
    "ranks are 1..48 in order with no gaps or ties"
  );
  assert.equal(r[0].team.name, "Spain", "champion is #1");
  assert.equal(r[0].roundOut, "Champion");
  assert.equal(r[1].team.name, "Argentina", "final's loser is #2");
  assert.equal(r[1].roundOut, "Runner-up");
  // the third-place playoff decides 3rd/4th: England beat France for the bronze
  assert.equal(r[2].team.name, "England", "third-place winner is #3");
  assert.equal(r[2].roundOut, "Third place");
  assert.equal(r[3].team.name, "France", "third-place loser is #4");
  assert.equal(r[3].roundOut, "Fourth place");
  // exactly 16 nations went out in the group stage (48 - 32 that advanced)
  assert.equal(r.filter((x) => x.roundOut === "Group stage").length, 16);
});

test("every knockout shootout is level in normal time and a-side wins the pens", () => {
  for (const m of MATCHES) {
    if (!m.pens) continue;
    assert.equal(m.sa, m.sb, `${m.a} v ${m.b}: pens implies a level score`);
    const parsed = m.pens.match(/^(\d+)-(\d+)/);
    assert.ok(parsed, `${m.pens} should start with a X-Y shootout score`);
    assert.ok(
      Number(parsed![1]) > Number(parsed![2]),
      `${m.a} v ${m.b}: a-side must win the shootout (${m.pens})`
    );
  }
});
