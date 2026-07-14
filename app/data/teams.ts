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

export type Info = {
  capital: string;
  continent: string;
  population: string;
  area: string;
  currency: string;
};

// quick facts per nation (capital, continent, population, area, currency)
export const COUNTRY_INFO: Record<string, Info> = {
  Mexico: { capital: "Mexico City", continent: "North America", population: "129M", area: "1.96M km²", currency: "Peso (MXN)" },
  "South Africa": { capital: "Pretoria", continent: "Africa", population: "60M", area: "1.22M km²", currency: "Rand (ZAR)" },
  "South Korea": { capital: "Seoul", continent: "Asia", population: "52M", area: "100K km²", currency: "Won (KRW)" },
  Czechia: { capital: "Prague", continent: "Europe", population: "10.7M", area: "78.9K km²", currency: "Koruna (CZK)" },
  Canada: { capital: "Ottawa", continent: "North America", population: "39M", area: "9.98M km²", currency: "Dollar (CAD)" },
  "Bosnia & Herzegovina": { capital: "Sarajevo", continent: "Europe", population: "3.2M", area: "51.2K km²", currency: "Mark (BAM)" },
  Qatar: { capital: "Doha", continent: "Asia", population: "2.9M", area: "11.6K km²", currency: "Riyal (QAR)" },
  Switzerland: { capital: "Bern", continent: "Europe", population: "8.8M", area: "41.3K km²", currency: "Franc (CHF)" },
  Brazil: { capital: "Brasília", continent: "South America", population: "216M", area: "8.52M km²", currency: "Real (BRL)" },
  Morocco: { capital: "Rabat", continent: "Africa", population: "37M", area: "447K km²", currency: "Dirham (MAD)" },
  Haiti: { capital: "Port-au-Prince", continent: "North America", population: "11.7M", area: "27.8K km²", currency: "Gourde (HTG)" },
  Scotland: { capital: "Edinburgh", continent: "Europe", population: "5.5M", area: "77.9K km²", currency: "Pound (GBP)" },
  "United States": { capital: "Washington, D.C.", continent: "North America", population: "335M", area: "9.83M km²", currency: "Dollar (USD)" },
  Paraguay: { capital: "Asunción", continent: "South America", population: "6.8M", area: "407K km²", currency: "Guaraní (PYG)" },
  Australia: { capital: "Canberra", continent: "Oceania", population: "26M", area: "7.69M km²", currency: "Dollar (AUD)" },
  Türkiye: { capital: "Ankara", continent: "Europe / Asia", population: "85M", area: "784K km²", currency: "Lira (TRY)" },
  Germany: { capital: "Berlin", continent: "Europe", population: "84M", area: "357K km²", currency: "Euro (EUR)" },
  Curaçao: { capital: "Willemstad", continent: "North America", population: "152K", area: "444 km²", currency: "Guilder (ANG)" },
  "Côte d'Ivoire": { capital: "Yamoussoukro", continent: "Africa", population: "28M", area: "322K km²", currency: "CFA franc (XOF)" },
  Ecuador: { capital: "Quito", continent: "South America", population: "18M", area: "284K km²", currency: "Dollar (USD)" },
  Netherlands: { capital: "Amsterdam", continent: "Europe", population: "17.8M", area: "41.9K km²", currency: "Euro (EUR)" },
  Japan: { capital: "Tokyo", continent: "Asia", population: "124M", area: "378K km²", currency: "Yen (JPY)" },
  Sweden: { capital: "Stockholm", continent: "Europe", population: "10.5M", area: "450K km²", currency: "Krona (SEK)" },
  Tunisia: { capital: "Tunis", continent: "Africa", population: "12M", area: "164K km²", currency: "Dinar (TND)" },
  Belgium: { capital: "Brussels", continent: "Europe", population: "11.7M", area: "30.5K km²", currency: "Euro (EUR)" },
  Egypt: { capital: "Cairo", continent: "Africa", population: "111M", area: "1.01M km²", currency: "Pound (EGP)" },
  Iran: { capital: "Tehran", continent: "Asia", population: "89M", area: "1.65M km²", currency: "Rial (IRR)" },
  "New Zealand": { capital: "Wellington", continent: "Oceania", population: "5.2M", area: "268K km²", currency: "Dollar (NZD)" },
  Spain: { capital: "Madrid", continent: "Europe", population: "48M", area: "506K km²", currency: "Euro (EUR)" },
  "Cabo Verde": { capital: "Praia", continent: "Africa", population: "600K", area: "4,033 km²", currency: "Escudo (CVE)" },
  "Saudi Arabia": { capital: "Riyadh", continent: "Asia", population: "36M", area: "2.15M km²", currency: "Riyal (SAR)" },
  Uruguay: { capital: "Montevideo", continent: "South America", population: "3.4M", area: "176K km²", currency: "Peso (UYU)" },
  France: { capital: "Paris", continent: "Europe", population: "68M", area: "552K km²", currency: "Euro (EUR)" },
  Senegal: { capital: "Dakar", continent: "Africa", population: "18M", area: "197K km²", currency: "CFA franc (XOF)" },
  Iraq: { capital: "Baghdad", continent: "Asia", population: "44M", area: "438K km²", currency: "Dinar (IQD)" },
  Norway: { capital: "Oslo", continent: "Europe", population: "5.5M", area: "385K km²", currency: "Krone (NOK)" },
  Argentina: { capital: "Buenos Aires", continent: "South America", population: "46M", area: "2.78M km²", currency: "Peso (ARS)" },
  Algeria: { capital: "Algiers", continent: "Africa", population: "45M", area: "2.38M km²", currency: "Dinar (DZD)" },
  Austria: { capital: "Vienna", continent: "Europe", population: "9M", area: "83.9K km²", currency: "Euro (EUR)" },
  Jordan: { capital: "Amman", continent: "Asia", population: "11.3M", area: "89.3K km²", currency: "Dinar (JOD)" },
  Portugal: { capital: "Lisbon", continent: "Europe", population: "10.3M", area: "92.2K km²", currency: "Euro (EUR)" },
  "DR Congo": { capital: "Kinshasa", continent: "Africa", population: "102M", area: "2.34M km²", currency: "Franc (CDF)" },
  Uzbekistan: { capital: "Tashkent", continent: "Asia", population: "35M", area: "447K km²", currency: "Soʻm (UZS)" },
  Colombia: { capital: "Bogotá", continent: "South America", population: "52M", area: "1.14M km²", currency: "Peso (COP)" },
  England: { capital: "London", continent: "Europe", population: "56M", area: "130K km²", currency: "Pound (GBP)" },
  Croatia: { capital: "Zagreb", continent: "Europe", population: "3.9M", area: "56.6K km²", currency: "Euro (EUR)" },
  Ghana: { capital: "Accra", continent: "Africa", population: "34M", area: "239K km²", currency: "Cedi (GHS)" },
  Panama: { capital: "Panama City", continent: "North America", population: "4.4M", area: "75.4K km²", currency: "Balboa (PAB)" },
};

export function teamsByGroup(letter: string): Team[] {
  return TEAMS.filter((t) => t.group === letter);
}

export const QUALIFIED_ISO3 = Array.from(new Set(TEAMS.map((t) => t.iso3)));
