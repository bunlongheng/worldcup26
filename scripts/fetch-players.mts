// Generate app/data/players.ts - the OFFICIAL 2026 FIFA World Cup 26-man squads.
//
// Squad lists (shirt number, position, captain, club, caps, goals, age) come from
// the "2026 FIFA World Cup squads" Wikipedia page - identical to the tournament
// rosters. Each player's Panini-style cutout photo (transparent PNG, fallback
// headshot) comes from TheSportsDB's free per-player search and is downloaded
// into public/players/ so the app stays self-contained (strict CSP: img-src 'self').
//
// The free API key is rate-limited (~30 req/min), so player lookups are throttled
// and progress is cached to disk per nation - re-run any time to resume.
// Run: npm run data:players
import { writeFile, readFile, mkdir } from "node:fs/promises";
import { TEAMS } from "../app/data/teams.ts";

const KEY = "3"; // TheSportsDB public/free test key
const BASE = `https://www.thesportsdb.com/api/v1/json/${KEY}`;
const WIKI =
  "https://en.wikipedia.org/w/api.php?action=parse&page=2026_FIFA_World_Cup_squads&prop=wikitext&format=json&formatversion=2";
const CACHE = "scripts/.squads-cache.json";
const OUT = "app/data/players.ts";
const IMG_DIR = "public/players";
const CUP_DAY = Date.UTC(2026, 5, 11); // tournament opening day, for squad ages

// Wikipedia section title -> our team name where they differ.
const WIKI_TO_APP: Record<string, string> = {
  "Czech Republic": "Czechia",
  "Bosnia and Herzegovina": "Bosnia & Herzegovina",
  Turkey: "Türkiye",
  "Ivory Coast": "Côte d'Ivoire",
  "Cape Verde": "Cabo Verde",
};

// Accepted TheSportsDB strNationality values per team (guards against namesakes).
const NATIONALITY: Record<string, string[]> = {
  Czechia: ["Czech Republic", "Czechia"],
  "Bosnia & Herzegovina": ["Bosnia and Herzegovina", "Bosnia & Herzegovina", "Bosnia"],
  Türkiye: ["Turkey", "Türkiye"],
  "Côte d'Ivoire": ["Ivory Coast", "Côte d'Ivoire"],
  "Cabo Verde": ["Cape Verde", "Cabo Verde"],
  "United States": ["United States", "USA", "United States of America"],
  Curaçao: ["Curacao", "Curaçao", "Netherlands"],
  "DR Congo": ["DR Congo", "Congo DR", "Democratic Republic of the Congo", "Congo"],
  "South Korea": ["South Korea", "Korea Republic"],
};

type Player = {
  no: number;
  name: string;
  pos: string; // GK | DF | MF | FW
  img: string; // "" when no photo found
  captain?: boolean;
  club?: string;
  caps?: number;
  goals?: number;
  age?: number;
};
type Cache = Record<string, Player[]>;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "");
const slug = (s: string) => fold(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const unlink = (s: string) => s.replace(/\[\[(?:[^|\]]*\|)?([^\]]+)\]\]/g, "$1").trim();

// Fetch JSON, retrying while the response is empty (rate-limited) with growing waits.
async function getJson(url: string, tries = 6): Promise<any> {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { "user-agent": "worldcup26-app/1.0" } });
      const text = await res.text();
      if (text && text.trim() && text.trim() !== "null") return JSON.parse(text);
    } catch {
      /* network blip - fall through to backoff */
    }
    await sleep(2500 + i * 2000);
  }
  return null;
}

async function download(url: string, dest: string): Promise<boolean> {
  for (let i = 0; i < 3; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        await writeFile(dest, Buffer.from(await res.arrayBuffer()));
        return true;
      }
      if (res.status === 404) return false;
    } catch {
      /* retry */
    }
    await sleep(1500);
  }
  return false;
}

// Split one {{nat fs g player|...}} line into top-level params (pipes inside
// [[...]] wikilinks and nested {{...}} templates don't count).
function templateParams(line: string): Record<string, string> {
  const inner = line.replace(/^\{\{/, "").replace(/\}\}\s*$/, "");
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  for (let i = 0; i < inner.length; i++) {
    const two = inner.slice(i, i + 2);
    if (two === "[[" || two === "{{") {
      depth++;
      cur += two;
      i++;
    } else if (two === "]]" || two === "}}") {
      depth--;
      cur += two;
      i++;
    } else if (inner[i] === "|" && depth === 0) {
      parts.push(cur);
      cur = "";
    } else {
      cur += inner[i];
    }
  }
  parts.push(cur);
  const params: Record<string, string> = {};
  for (const p of parts) {
    const eq = p.indexOf("=");
    if (eq > 0) params[p.slice(0, eq).trim()] = p.slice(eq + 1).trim();
  }
  return params;
}

// Age on the tournament's opening day, from the birth date inside the age template
// (its last 3 numeric args), e.g. {{birth date and age2|df=y|2026|6|11|2000|5|17}}.
function ageFrom(tpl: string | undefined): number | undefined {
  const nums = (tpl?.match(/\d+/g) ?? []).map(Number);
  if (nums.length < 3) return undefined;
  const [y, m, d] = nums.slice(-3);
  if (y < 1950 || y > 2015) return undefined;
  const ms = CUP_DAY - Date.UTC(y, m - 1, d);
  return Math.floor(ms / (365.25 * 24 * 3600 * 1000));
}

// Parse the whole squads page into { appTeamName: Player[] } (no photos yet).
async function fetchSquads(): Promise<Cache> {
  const data = await getJson(WIKI, 3);
  const text: string = data?.parse?.wikitext;
  if (!text) throw new Error("Could not fetch Wikipedia squads page");
  const squads: Cache = {};
  const sections = text.split(/^===\s*(.+?)\s*===$/m); // [pre, title, body, title, body, ...]
  for (let i = 1; i < sections.length; i += 2) {
    const nation = WIKI_TO_APP[sections[i]] ?? sections[i];
    if (!TEAMS.some((t) => t.name === nation)) continue;
    const players: Player[] = [];
    for (const line of sections[i + 1].split("\n")) {
      if (!line.startsWith("{{nat fs g player") && !line.startsWith("{{nat fs player")) continue;
      const p = templateParams(line);
      const name = unlink(p.name ?? "");
      const no = parseInt(p.no ?? "", 10);
      if (!name || !Number.isFinite(no)) continue;
      const player: Player = { no, name, pos: (p.pos ?? "").toUpperCase(), img: "" };
      if (/captain/i.test(p.other ?? "")) player.captain = true;
      if (p.club) player.club = unlink(p.club);
      const caps = parseInt(p.caps ?? "", 10);
      const goals = parseInt(p.goals ?? "", 10);
      if (Number.isFinite(caps)) player.caps = caps;
      if (Number.isFinite(goals)) player.goals = goals;
      const age = ageFrom(p.age);
      if (age) player.age = age;
      players.push(player);
    }
    if (players.length) squads[nation] = players;
  }
  return squads;
}

// Find the player's photo on TheSportsDB: Panini-style cutout PNG preferred,
// headshot thumb as fallback. Returns the local /players path or "".
async function fetchPhoto(team: string, player: Player): Promise<string> {
  const okNats = NATIONALITY[team] ?? [team];
  const queries = [player.name, fold(player.name)];
  const words = player.name.split(/\s+/);
  if (words.length > 2) queries.push(`${words[0]} ${words[words.length - 1]}`);
  let candidates: any[] = [];
  for (const q of [...new Set(queries)]) {
    const data = await getJson(`${BASE}/searchplayers.php?p=${encodeURIComponent(q)}`, 3);
    candidates = (data?.player ?? []).filter((c: any) => c.strSport === "Soccer");
    await sleep(2100); // free key: ~30 req/min
    if (candidates.length) break;
  }
  if (!candidates.length) return "";
  const match =
    candidates.find((c: any) => okNats.includes(c.strNationality)) ??
    (candidates.length === 1 ? candidates[0] : null);
  if (!match) return "";

  const src = match.strCutout || match.strThumb;
  if (!src) return "";
  const ext = match.strCutout ? "png" : "jpg";
  const file = `${slug(team)}-${slug(player.name)}.${ext}`;
  const ok =
    (await download(`${src}/small`, `${IMG_DIR}/${file}`)) ||
    (await download(src, `${IMG_DIR}/${file}`));
  return ok ? `/players/${file}` : "";
}

async function loadCache(): Promise<Cache> {
  try {
    return JSON.parse(await readFile(CACHE, "utf8"));
  } catch {
    return {};
  }
}

// Panini album order: GK, DF, MF, FW - by shirt number within each group.
const POS_ORDER: Record<string, number> = { GK: 0, DF: 1, MF: 2, FW: 3 };
const paniniSort = (ps: Player[]) =>
  [...ps].sort((a, b) => (POS_ORDER[a.pos] ?? 9) - (POS_ORDER[b.pos] ?? 9) || a.no - b.no);

async function emit(cache: Cache) {
  const entries = TEAMS.map((t) => t.name).filter((n) => cache[n]?.length).sort();
  const body = entries
    .map(
      (n) =>
        `  ${JSON.stringify(n)}: [\n` +
        paniniSort(cache[n]).map((p) => `    ${JSON.stringify(p)},`).join("\n") +
        `\n  ],`
    )
    .join("\n");
  const file = `// GENERATED by scripts/fetch-players.mts (npm run data:players) - do not hand-edit.
// Official 2026 FIFA World Cup 26-man squads (Wikipedia) in Panini album order
// (GK, DF, MF, FW by shirt number). Photos are TheSportsDB cutouts/headshots
// downloaded into public/players/ so the app stays self-contained under a
// strict CSP (img-src 'self'). img is "" when no photo was found.
export type Player = {
  no: number;
  name: string;
  pos: string;
  img: string;
  captain?: boolean;
  club?: string;
  caps?: number;
  goals?: number;
  age?: number;
};

export const POS_LABEL: Record<string, string> = {
  GK: "Goalkeeper",
  DF: "Defender",
  MF: "Midfielder",
  FW: "Forward",
};

export const PLAYERS: Record<string, Player[]> = {
${body}
};

export function playersFor(team: string): Player[] {
  return PLAYERS[team] ?? [];
}

// Nations we have a squad for (used to gate the Players tab + quiz).
export const TEAMS_WITH_PLAYERS: string[] = Object.keys(PLAYERS);

// Flat pool of every player WITH a photo, tagged with its nation - the quiz needs faces.
export const PLAYER_POOL: { player: Player; team: string }[] = Object.entries(PLAYERS).flatMap(
  ([team, ps]) => ps.filter((p) => p.img).map((player) => ({ player, team }))
);
`;
  await writeFile(OUT, file);
}

async function main() {
  await mkdir(IMG_DIR, { recursive: true });
  const cache = await loadCache();
  console.log("Fetching official squads from Wikipedia...");
  const squads = await fetchSquads();
  const nations = Object.keys(squads);
  console.log(`Squads parsed: ${nations.length} nations, ${nations.reduce((s, n) => s + squads[n].length, 0)} players.`);

  // ONLY=France npm run data:players -> fetch just that nation (queue-jump), resumable.
  const only = process.env.ONLY;
  for (const team of TEAMS) {
    if (only && team.name !== only) continue;
    const squad = squads[team.name];
    if (!squad) {
      console.log(`- ${team.name}: no squad on Wikipedia page`);
      continue;
    }
    // A nation is done once cached with the full squad size (photo misses included).
    if (cache[team.name]?.length === squad.length) {
      console.log(`✓ ${team.name} (cached, ${squad.length})`);
      continue;
    }
    const players: Player[] = [];
    for (const p of squad) {
      const img = await fetchPhoto(team.name, p);
      players.push({ ...p, img });
    }
    cache[team.name] = players;
    await writeFile(CACHE, JSON.stringify(cache, null, 2));
    await emit(cache); // regenerate after every nation so the app fills in live
    const withImg = players.filter((p) => p.img).length;
    console.log(`✓ ${team.name}: ${players.length} players, ${withImg} photos`);
  }

  const total = Object.values(cache).reduce((s, ps) => s + ps.length, 0);
  const photos = Object.values(cache).reduce((s, ps) => s + ps.filter((p) => p.img).length, 0);
  console.log(`\nWrote ${OUT}: ${Object.keys(cache).length} nations, ${total} players, ${photos} photos.`);
}

main();
