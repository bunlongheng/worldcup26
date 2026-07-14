// 2026 FIFA World Cup - final draw (Dec 5, 2025). 48 teams, 12 groups.
// `flag` = flagcdn code (a2, or gb-eng/gb-sct). `iso3` = alpha-3 for the globe map.

export type Confed = "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC";

export type Team = {
  name: string;
  flag: string;
  iso3: string;
  group: string;
  confed: Confed;
  host?: boolean;
};

export const GROUP_LETTERS = [
  "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
] as const;

export const TEAMS: Team[] = [
  // Group A
  { name: "Mexico", flag: "mx", iso3: "MEX", group: "A", confed: "CONCACAF", host: true },
  { name: "South Africa", flag: "za", iso3: "ZAF", group: "A", confed: "CAF" },
  { name: "South Korea", flag: "kr", iso3: "KOR", group: "A", confed: "AFC" },
  { name: "Czechia", flag: "cz", iso3: "CZE", group: "A", confed: "UEFA" },
  // Group B
  { name: "Canada", flag: "ca", iso3: "CAN", group: "B", confed: "CONCACAF", host: true },
  { name: "Bosnia & Herzegovina", flag: "ba", iso3: "BIH", group: "B", confed: "UEFA" },
  { name: "Qatar", flag: "qa", iso3: "QAT", group: "B", confed: "AFC" },
  { name: "Switzerland", flag: "ch", iso3: "CHE", group: "B", confed: "UEFA" },
  // Group C
  { name: "Brazil", flag: "br", iso3: "BRA", group: "C", confed: "CONMEBOL" },
  { name: "Morocco", flag: "ma", iso3: "MAR", group: "C", confed: "CAF" },
  { name: "Haiti", flag: "ht", iso3: "HTI", group: "C", confed: "CONCACAF" },
  { name: "Scotland", flag: "gb-sct", iso3: "GBR", group: "C", confed: "UEFA" },
  // Group D
  { name: "United States", flag: "us", iso3: "USA", group: "D", confed: "CONCACAF", host: true },
  { name: "Paraguay", flag: "py", iso3: "PRY", group: "D", confed: "CONMEBOL" },
  { name: "Australia", flag: "au", iso3: "AUS", group: "D", confed: "AFC" },
  { name: "Türkiye", flag: "tr", iso3: "TUR", group: "D", confed: "UEFA" },
  // Group E
  { name: "Germany", flag: "de", iso3: "DEU", group: "E", confed: "UEFA" },
  { name: "Curaçao", flag: "cw", iso3: "CUW", group: "E", confed: "CONCACAF" },
  { name: "Côte d'Ivoire", flag: "ci", iso3: "CIV", group: "E", confed: "CAF" },
  { name: "Ecuador", flag: "ec", iso3: "ECU", group: "E", confed: "CONMEBOL" },
  // Group F
  { name: "Netherlands", flag: "nl", iso3: "NLD", group: "F", confed: "UEFA" },
  { name: "Japan", flag: "jp", iso3: "JPN", group: "F", confed: "AFC" },
  { name: "Sweden", flag: "se", iso3: "SWE", group: "F", confed: "UEFA" },
  { name: "Tunisia", flag: "tn", iso3: "TUN", group: "F", confed: "CAF" },
  // Group G
  { name: "Belgium", flag: "be", iso3: "BEL", group: "G", confed: "UEFA" },
  { name: "Egypt", flag: "eg", iso3: "EGY", group: "G", confed: "CAF" },
  { name: "Iran", flag: "ir", iso3: "IRN", group: "G", confed: "AFC" },
  { name: "New Zealand", flag: "nz", iso3: "NZL", group: "G", confed: "OFC" },
  // Group H
  { name: "Spain", flag: "es", iso3: "ESP", group: "H", confed: "UEFA" },
  { name: "Cabo Verde", flag: "cv", iso3: "CPV", group: "H", confed: "CAF" },
  { name: "Saudi Arabia", flag: "sa", iso3: "SAU", group: "H", confed: "AFC" },
  { name: "Uruguay", flag: "uy", iso3: "URY", group: "H", confed: "CONMEBOL" },
  // Group I
  { name: "France", flag: "fr", iso3: "FRA", group: "I", confed: "UEFA" },
  { name: "Senegal", flag: "sn", iso3: "SEN", group: "I", confed: "CAF" },
  { name: "Iraq", flag: "iq", iso3: "IRQ", group: "I", confed: "AFC" },
  { name: "Norway", flag: "no", iso3: "NOR", group: "I", confed: "UEFA" },
  // Group J
  { name: "Argentina", flag: "ar", iso3: "ARG", group: "J", confed: "CONMEBOL" },
  { name: "Algeria", flag: "dz", iso3: "DZA", group: "J", confed: "CAF" },
  { name: "Austria", flag: "at", iso3: "AUT", group: "J", confed: "UEFA" },
  { name: "Jordan", flag: "jo", iso3: "JOR", group: "J", confed: "AFC" },
  // Group K
  { name: "Portugal", flag: "pt", iso3: "PRT", group: "K", confed: "UEFA" },
  { name: "DR Congo", flag: "cd", iso3: "COD", group: "K", confed: "CAF" },
  { name: "Uzbekistan", flag: "uz", iso3: "UZB", group: "K", confed: "AFC" },
  { name: "Colombia", flag: "co", iso3: "COL", group: "K", confed: "CONMEBOL" },
  // Group L
  { name: "England", flag: "gb-eng", iso3: "GBR", group: "L", confed: "UEFA" },
  { name: "Croatia", flag: "hr", iso3: "HRV", group: "L", confed: "UEFA" },
  { name: "Ghana", flag: "gh", iso3: "GHA", group: "L", confed: "CAF" },
  { name: "Panama", flag: "pa", iso3: "PAN", group: "L", confed: "CONCACAF" },
];

export const CONFED_LABEL: Record<Confed, string> = {
  UEFA: "Europe",
  CONMEBOL: "South America",
  CONCACAF: "N. & C. America",
  CAF: "Africa",
  AFC: "Asia",
  OFC: "Oceania",
};

// 12 group colors drawn from the official FIFA World Cup 26 brand palette
// (oranges, greens, blues, lime, reds). Same color always means the same group.
export const GROUP_ACCENTS: Record<string, string> = {
  A: "#e8481c", B: "#3aaa4e", C: "#2749d6", D: "#8f2417",
  E: "#0e5c3d", F: "#7ba7f0", G: "#c1de39", H: "#e67817",
  I: "#158f7e", J: "#5a78e6", K: "#86b93a", L: "#c62e2e",
};

// pick readable text (dark or white) for a given brand color
export function textOn(hex: string): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 150 ? "#0b0b0b" : "#ffffff";
}

export function teamsByGroup(letter: string): Team[] {
  return TEAMS.filter((t) => t.group === letter);
}

export const QUALIFIED_ISO3 = Array.from(new Set(TEAMS.map((t) => t.iso3)));
