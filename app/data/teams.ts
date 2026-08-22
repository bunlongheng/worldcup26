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

// Pick the text color (black or white) with the HIGHER WCAG contrast ratio against
// a given brand color - so mid-tone accents get black text instead of low-contrast white.
export function textOn(hex: string): string {
  const h = hex.replace("#", "");
  const toLin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  const L =
    0.2126 * toLin(parseInt(h.slice(0, 2), 16)) +
    0.7152 * toLin(parseInt(h.slice(2, 4), 16)) +
    0.0722 * toLin(parseInt(h.slice(4, 6), 16));
  const onWhite = 1.05 / (L + 0.05); // contrast of white text
  const onBlack = (L + 0.05) / 0.05; // contrast of black text
  return onWhite >= onBlack ? "#ffffff" : "#0b0b0b";
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

// host cities and their World Cup 2026 stadiums (16 total)
export const HOST_STADIUMS: Record<string, { city: string; stadium: string }[]> = {
  Canada: [
    { city: "Toronto", stadium: "BMO Field" },
    { city: "Vancouver", stadium: "BC Place" },
  ],
  Mexico: [
    { city: "Mexico City", stadium: "Estadio Azteca" },
    { city: "Guadalajara", stadium: "Estadio Akron" },
    { city: "Monterrey", stadium: "Estadio BBVA" },
  ],
  "United States": [
    { city: "Atlanta", stadium: "Mercedes-Benz Stadium" },
    { city: "Boston", stadium: "Gillette Stadium" },
    { city: "Dallas", stadium: "AT&T Stadium" },
    { city: "Houston", stadium: "NRG Stadium" },
    { city: "Kansas City", stadium: "Arrowhead Stadium" },
    { city: "Los Angeles", stadium: "SoFi Stadium" },
    { city: "Miami", stadium: "Hard Rock Stadium" },
    { city: "New York / New Jersey", stadium: "MetLife Stadium" },
    { city: "Philadelphia", stadium: "Lincoln Financial Field" },
    { city: "San Francisco Bay Area", stadium: "Levi's Stadium" },
    { city: "Seattle", stadium: "Lumen Field" },
  ],
};

// Every match (group stage + knockouts) with real scores. Spain won the final 2-1.
export type MatchRow = { stage: string; a: string; b: string; sa: number | null; sb: number | null; pens?: string };
export const MATCHES: MatchRow[] = [
  // Group A
  { stage: "Group A", a: "Mexico", b: "South Africa", sa: 2, sb: 0 },
  { stage: "Group A", a: "South Korea", b: "Czechia", sa: 2, sb: 1 },
  { stage: "Group A", a: "Czechia", b: "South Africa", sa: 1, sb: 1 },
  { stage: "Group A", a: "Mexico", b: "South Korea", sa: 1, sb: 0 },
  { stage: "Group A", a: "Mexico", b: "Czechia", sa: 3, sb: 0 },
  { stage: "Group A", a: "South Africa", b: "South Korea", sa: 1, sb: 0 },
  // Group B
  { stage: "Group B", a: "Canada", b: "Bosnia & Herzegovina", sa: 1, sb: 1 },
  { stage: "Group B", a: "Switzerland", b: "Qatar", sa: 1, sb: 1 },
  { stage: "Group B", a: "Switzerland", b: "Bosnia & Herzegovina", sa: 4, sb: 1 },
  { stage: "Group B", a: "Canada", b: "Qatar", sa: 6, sb: 0 },
  { stage: "Group B", a: "Switzerland", b: "Canada", sa: 2, sb: 1 },
  { stage: "Group B", a: "Bosnia & Herzegovina", b: "Qatar", sa: 3, sb: 1 },
  // Group C
  { stage: "Group C", a: "Brazil", b: "Morocco", sa: 1, sb: 1 },
  { stage: "Group C", a: "Scotland", b: "Haiti", sa: 1, sb: 0 },
  { stage: "Group C", a: "Scotland", b: "Morocco", sa: 0, sb: 1 },
  { stage: "Group C", a: "Brazil", b: "Haiti", sa: 3, sb: 0 },
  { stage: "Group C", a: "Brazil", b: "Scotland", sa: 3, sb: 0 },
  { stage: "Group C", a: "Morocco", b: "Haiti", sa: 4, sb: 2 },
  // Group D
  { stage: "Group D", a: "United States", b: "Paraguay", sa: 4, sb: 1 },
  { stage: "Group D", a: "Australia", b: "Türkiye", sa: 2, sb: 0 },
  { stage: "Group D", a: "United States", b: "Australia", sa: 2, sb: 0 },
  { stage: "Group D", a: "Türkiye", b: "Paraguay", sa: 0, sb: 1 },
  { stage: "Group D", a: "Türkiye", b: "United States", sa: 3, sb: 2 },
  { stage: "Group D", a: "Paraguay", b: "Australia", sa: 0, sb: 0 },
  // Group E
  { stage: "Group E", a: "Germany", b: "Curaçao", sa: 7, sb: 1 },
  { stage: "Group E", a: "Côte d'Ivoire", b: "Ecuador", sa: 1, sb: 0 },
  { stage: "Group E", a: "Germany", b: "Côte d'Ivoire", sa: 2, sb: 1 },
  { stage: "Group E", a: "Ecuador", b: "Curaçao", sa: 0, sb: 0 },
  { stage: "Group E", a: "Côte d'Ivoire", b: "Curaçao", sa: 2, sb: 0 },
  { stage: "Group E", a: "Ecuador", b: "Germany", sa: 2, sb: 1 },
  // Group F
  { stage: "Group F", a: "Netherlands", b: "Japan", sa: 2, sb: 2 },
  { stage: "Group F", a: "Sweden", b: "Tunisia", sa: 5, sb: 1 },
  { stage: "Group F", a: "Netherlands", b: "Sweden", sa: 5, sb: 1 },
  { stage: "Group F", a: "Japan", b: "Tunisia", sa: 4, sb: 0 },
  { stage: "Group F", a: "Japan", b: "Sweden", sa: 1, sb: 1 },
  { stage: "Group F", a: "Netherlands", b: "Tunisia", sa: 3, sb: 1 },
  // Group G
  { stage: "Group G", a: "Belgium", b: "Egypt", sa: 1, sb: 1 },
  { stage: "Group G", a: "Iran", b: "New Zealand", sa: 2, sb: 2 },
  { stage: "Group G", a: "Belgium", b: "Iran", sa: 0, sb: 0 },
  { stage: "Group G", a: "New Zealand", b: "Egypt", sa: 1, sb: 3 },
  { stage: "Group G", a: "Egypt", b: "Iran", sa: 1, sb: 1 },
  { stage: "Group G", a: "New Zealand", b: "Belgium", sa: 1, sb: 5 },
  // Group H
  { stage: "Group H", a: "Spain", b: "Cabo Verde", sa: 0, sb: 0 },
  { stage: "Group H", a: "Saudi Arabia", b: "Uruguay", sa: 1, sb: 1 },
  { stage: "Group H", a: "Spain", b: "Saudi Arabia", sa: 4, sb: 0 },
  { stage: "Group H", a: "Uruguay", b: "Cabo Verde", sa: 2, sb: 2 },
  { stage: "Group H", a: "Cabo Verde", b: "Saudi Arabia", sa: 0, sb: 0 },
  { stage: "Group H", a: "Uruguay", b: "Spain", sa: 0, sb: 1 },
  // Group I
  { stage: "Group I", a: "France", b: "Senegal", sa: 3, sb: 1 },
  { stage: "Group I", a: "Iraq", b: "Norway", sa: 1, sb: 4 },
  { stage: "Group I", a: "France", b: "Iraq", sa: 3, sb: 0 },
  { stage: "Group I", a: "Norway", b: "Senegal", sa: 3, sb: 2 },
  { stage: "Group I", a: "Norway", b: "France", sa: 1, sb: 4 },
  { stage: "Group I", a: "Senegal", b: "Iraq", sa: 5, sb: 0 },
  // Group J
  { stage: "Group J", a: "Argentina", b: "Algeria", sa: 3, sb: 0 },
  { stage: "Group J", a: "Austria", b: "Jordan", sa: 3, sb: 1 },
  { stage: "Group J", a: "Argentina", b: "Austria", sa: 2, sb: 0 },
  { stage: "Group J", a: "Jordan", b: "Algeria", sa: 1, sb: 2 },
  { stage: "Group J", a: "Algeria", b: "Austria", sa: 3, sb: 3 },
  { stage: "Group J", a: "Jordan", b: "Argentina", sa: 1, sb: 3 },
  // Group K
  { stage: "Group K", a: "Portugal", b: "DR Congo", sa: 1, sb: 1 },
  { stage: "Group K", a: "Uzbekistan", b: "Colombia", sa: 1, sb: 3 },
  { stage: "Group K", a: "Portugal", b: "Uzbekistan", sa: 5, sb: 0 },
  { stage: "Group K", a: "Colombia", b: "DR Congo", sa: 1, sb: 0 },
  { stage: "Group K", a: "Colombia", b: "Portugal", sa: 0, sb: 0 },
  { stage: "Group K", a: "DR Congo", b: "Uzbekistan", sa: 3, sb: 1 },
  // Group L
  { stage: "Group L", a: "England", b: "Croatia", sa: 4, sb: 2 },
  { stage: "Group L", a: "Ghana", b: "Panama", sa: 1, sb: 0 },
  { stage: "Group L", a: "England", b: "Ghana", sa: 0, sb: 0 },
  { stage: "Group L", a: "Panama", b: "Croatia", sa: 0, sb: 1 },
  { stage: "Group L", a: "England", b: "Panama", sa: 2, sb: 0 },
  { stage: "Group L", a: "Croatia", b: "Ghana", sa: 2, sb: 1 },
  // Round of 32
  { stage: "Round of 32", a: "Canada", b: "South Africa", sa: 1, sb: 0 },
  { stage: "Round of 32", a: "Brazil", b: "Japan", sa: 2, sb: 1 },
  { stage: "Round of 32", a: "Paraguay", b: "Germany", sa: 1, sb: 1, pens: "4-3 pens" },
  { stage: "Round of 32", a: "Morocco", b: "Netherlands", sa: 1, sb: 1, pens: "3-2 pens" },
  { stage: "Round of 32", a: "Norway", b: "Côte d'Ivoire", sa: 2, sb: 1 },
  { stage: "Round of 32", a: "France", b: "Sweden", sa: 3, sb: 0 },
  { stage: "Round of 32", a: "Mexico", b: "Ecuador", sa: 2, sb: 0 },
  { stage: "Round of 32", a: "England", b: "DR Congo", sa: 2, sb: 1 },
  { stage: "Round of 32", a: "Belgium", b: "Senegal", sa: 3, sb: 2 },
  { stage: "Round of 32", a: "United States", b: "Bosnia & Herzegovina", sa: 2, sb: 0 },
  { stage: "Round of 32", a: "Spain", b: "Austria", sa: 3, sb: 0 },
  { stage: "Round of 32", a: "Portugal", b: "Croatia", sa: 2, sb: 1 },
  { stage: "Round of 32", a: "Switzerland", b: "Algeria", sa: 2, sb: 0 },
  { stage: "Round of 32", a: "Egypt", b: "Australia", sa: 1, sb: 1, pens: "4-2 pens" },
  { stage: "Round of 32", a: "Argentina", b: "Cabo Verde", sa: 3, sb: 2 },
  { stage: "Round of 32", a: "Colombia", b: "Ghana", sa: 1, sb: 0 },
  // Round of 16
  { stage: "Round of 16", a: "Morocco", b: "Canada", sa: 3, sb: 0 },
  { stage: "Round of 16", a: "France", b: "Paraguay", sa: 1, sb: 0 },
  { stage: "Round of 16", a: "Norway", b: "Brazil", sa: 2, sb: 1 },
  { stage: "Round of 16", a: "England", b: "Mexico", sa: 3, sb: 2 },
  { stage: "Round of 16", a: "Spain", b: "Portugal", sa: 1, sb: 0 },
  { stage: "Round of 16", a: "Belgium", b: "United States", sa: 4, sb: 1 },
  { stage: "Round of 16", a: "Switzerland", b: "Colombia", sa: 0, sb: 0, pens: "4-3 pens" },
  { stage: "Round of 16", a: "Argentina", b: "Egypt", sa: 3, sb: 2 },
  // Quarter-finals
  { stage: "Quarter-final", a: "France", b: "Morocco", sa: 2, sb: 0 },
  { stage: "Quarter-final", a: "Spain", b: "Belgium", sa: 2, sb: 1 },
  { stage: "Quarter-final", a: "England", b: "Norway", sa: 2, sb: 1 },
  { stage: "Quarter-final", a: "Argentina", b: "Switzerland", sa: 3, sb: 1 },
  // Semi-finals: France lost to Spain; Argentina beat England 2-1
  { stage: "Semi-final", a: "France", b: "Spain", sa: 0, sb: 2 },
  { stage: "Semi-final", a: "England", b: "Argentina", sa: 1, sb: 2 },
  // Third-place playoff: England beat France 6-4 for the bronze (Saka hat trick)
  { stage: "Third place", a: "England", b: "France", sa: 6, sb: 4 },
  // Final: Spain beat Argentina 1-0 after extra time (Ferran Torres 106')
  { stage: "Final", a: "Spain", b: "Argentina", sa: 1, sb: 0 },
];

export function matchesFor(name: string): MatchRow[] {
  return MATCHES.filter((m) => m.a === name || m.b === name);
}

// Result of a match from one team's perspective (works for group + knockout rows).
// The single home of the "shootout winner is the a-side" rule.
export function matchOutcome(m: MatchRow, teamIsA: boolean): "won" | "lost" | "draw" | "upcoming" {
  if (m.sa == null || m.sb == null) return "upcoming";
  const ts = teamIsA ? m.sa : m.sb;
  const os = teamIsA ? m.sb : m.sa;
  if (ts > os) return "won";
  if (ts < os) return "lost";
  if (m.pens) return teamIsA ? "won" : "lost";
  return "draw";
}

export const TEAM_BY_NAME: Record<string, Team> = TEAMS.reduce(
  (acc, t) => ((acc[t.name] = t), acc),
  {} as Record<string, Team>
);

export function teamsByGroup(letter: string): Team[] {
  return TEAMS.filter((t) => t.group === letter);
}

// Group standings computed from the group-stage results: P W D L GF GA GD Pts,
// sorted by points, then goal difference, then goals for, then name.
export type Standing = {
  team: Team;
  p: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
};

export function groupStandings(letter: string): Standing[] {
  const rows = new Map<string, Standing>(
    teamsByGroup(letter).map((team) => [
      team.name,
      { team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 },
    ])
  );
  for (const m of MATCHES) {
    if (m.stage !== `Group ${letter}` || m.sa == null || m.sb == null) continue;
    const ra = rows.get(m.a);
    const rb = rows.get(m.b);
    if (!ra || !rb) continue;
    ra.p++;
    rb.p++;
    ra.gf += m.sa;
    ra.ga += m.sb;
    rb.gf += m.sb;
    rb.ga += m.sa;
    if (m.sa > m.sb) {
      ra.w++;
      ra.pts += 3;
      rb.l++;
    } else if (m.sa < m.sb) {
      rb.w++;
      rb.pts += 3;
      ra.l++;
    } else {
      ra.d++;
      rb.d++;
      ra.pts++;
      rb.pts++;
    }
  }
  const table = [...rows.values()];
  for (const r of table) r.gd = r.gf - r.ga;
  return table.sort(
    (x, y) =>
      y.pts - x.pts || y.gd - x.gd || y.gf - x.gf || x.team.name.localeCompare(y.team.name)
  );
}

// Knockout score for an unordered pair, oriented to (a, b), plus the winner ("a" |
// "b") relative to that orientation. The pens winner is always the MATCHES `a` side,
// so `win` accounts for whether the pair was passed in swapped order.
export function koResult(
  a: string,
  b: string
): { sa: number | null; sb: number | null; pens?: string; win: "a" | "b" | null } | null {
  const m = MATCHES.find(
    (r) =>
      !r.stage.startsWith("Group") &&
      ((r.a === a && r.b === b) || (r.a === b && r.b === a))
  );
  if (!m) return null;
  const straight = m.a === a;
  const sa = straight ? m.sa : m.sb;
  const sb = straight ? m.sb : m.sa;
  // Reuse matchOutcome (the single home of the shootout rule) instead of re-deriving it.
  const outcome = matchOutcome(m, straight);
  const win = outcome === "won" ? "a" : outcome === "lost" ? "b" : null;
  return { sa, sb, pens: m.pens, win };
}

// Winner name of a knockout pairing, or null if the pair has not been played / found.
export function koWinner(a: string, b: string): string | null {
  const r = koResult(a, b);
  if (!r || !r.win) return null;
  return r.win === "a" ? a : b;
}

// Knockout bracket TOPOLOGY only (who meets whom, in tree order). No outcomes are stored
// here - every score/winner/final/champion is derived from MATCHES via koResult/koWinner.
// Kept beside MATCHES so a test can assert the two never drift (see tests/data.test.ts).
export type KnockoutRound = { name: string; short: string; matches: { a: string; b: string }[] };
export const KNOCKOUT_TOPOLOGY: KnockoutRound[] = [
  {
    name: "Round of 32",
    short: "R32",
    matches: [
      { a: "France", b: "Sweden" },
      { a: "Paraguay", b: "Germany" },
      { a: "Morocco", b: "Netherlands" },
      { a: "Canada", b: "South Africa" },
      { a: "Spain", b: "Austria" },
      { a: "Portugal", b: "Croatia" },
      { a: "Belgium", b: "Senegal" },
      { a: "United States", b: "Bosnia & Herzegovina" },
      { a: "England", b: "DR Congo" },
      { a: "Mexico", b: "Ecuador" },
      { a: "Norway", b: "Côte d'Ivoire" },
      { a: "Brazil", b: "Japan" },
      { a: "Argentina", b: "Cabo Verde" },
      { a: "Egypt", b: "Australia" },
      { a: "Switzerland", b: "Algeria" },
      { a: "Colombia", b: "Ghana" },
    ],
  },
  {
    name: "Round of 16",
    short: "R16",
    matches: [
      { a: "France", b: "Paraguay" },
      { a: "Morocco", b: "Canada" },
      { a: "Spain", b: "Portugal" },
      { a: "Belgium", b: "United States" },
      { a: "England", b: "Mexico" },
      { a: "Norway", b: "Brazil" },
      { a: "Argentina", b: "Egypt" },
      { a: "Switzerland", b: "Colombia" },
    ],
  },
  {
    name: "Quarter-finals",
    short: "QF",
    matches: [
      { a: "France", b: "Morocco" },
      { a: "Spain", b: "Belgium" },
      { a: "England", b: "Norway" },
      { a: "Argentina", b: "Switzerland" },
    ],
  },
  {
    name: "Semi-finals",
    short: "SF",
    matches: [
      { a: "France", b: "Spain" },
      { a: "England", b: "Argentina" },
    ],
  },
];

// Final tournament classification (1..48), derived entirely from MATCHES. The medal
// places (1-4) come straight from the Final and the third-place playoff; everyone
// else is bucketed by how far they went, then ranked within a bucket by their overall
// record (pts, GD, GF, name). Nothing is stored - flip a score and the table below
// re-sorts itself (guarded by a test).
export type Ranked = Standing & { rank: number; roundOut: string };

// Furthest stage a team can be ELIMINATED in, before the medal matches take over.
const ELIM_STAGES = ["Group", "Round of 32", "Round of 16", "Quarter-final"];
const ELIM_LABEL = ["Group stage", "Round of 32", "Round of 16", "Quarter-final"];
const elimRank = (stage: string) => (stage.startsWith("Group") ? 0 : ELIM_STAGES.indexOf(stage));
// Winner/loser of a two-team match row, by name.
const loserOf = (m: MatchRow | undefined) =>
  m ? (koWinner(m.a, m.b) === m.a ? m.b : m.a) : null;

export function finalRanking(): Ranked[] {
  const agg = new Map<string, Standing>(
    TEAMS.map((team) => [team.name, { team, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 }])
  );
  const furthest = new Map<string, number>(TEAMS.map((t) => [t.name, 0]));
  for (const m of MATCHES) {
    if (m.sa == null || m.sb == null) continue;
    const si = elimRank(m.stage); // medal-round stages map to -1 and never raise `furthest`
    for (const [name, isA] of [[m.a, true], [m.b, false]] as [string, boolean][]) {
      const r = agg.get(name);
      if (!r) continue;
      r.p++;
      r.gf += isA ? m.sa : m.sb;
      r.ga += isA ? m.sb : m.sa;
      const o = matchOutcome(m, isA);
      if (o === "won") {
        r.w++;
        r.pts += 3;
      } else if (o === "lost") {
        r.l++;
      } else {
        r.d++;
        r.pts += 1;
      }
      if (si > (furthest.get(name) ?? 0)) furthest.set(name, si);
    }
  }
  const finalRow = MATCHES.find((m) => m.stage === "Final");
  const thirdRow = MATCHES.find((m) => m.stage === "Third place");
  const medal: Record<string, { bucket: number; label: string }> = {};
  const seat = (name: string | null, bucket: number, label: string) => {
    if (name) medal[name] = { bucket, label };
  };
  seat(finalRow ? koWinner(finalRow.a, finalRow.b) : null, 0, "Champion");
  seat(loserOf(finalRow), 1, "Runner-up");
  seat(thirdRow ? koWinner(thirdRow.a, thirdRow.b) : null, 2, "Third place");
  seat(loserOf(thirdRow), 3, "Fourth place");

  const bucketOf = (name: string) => medal[name]?.bucket ?? 4 + (3 - (furthest.get(name) ?? 0));
  const rows = [...agg.values()];
  for (const r of rows) r.gd = r.gf - r.ga;
  rows.sort(
    (x, y) =>
      bucketOf(x.team.name) - bucketOf(y.team.name) ||
      y.pts - x.pts ||
      y.gd - x.gd ||
      y.gf - x.gf ||
      x.team.name.localeCompare(y.team.name)
  );
  return rows.map((r, i) => ({
    ...r,
    rank: i + 1,
    roundOut: medal[r.team.name]?.label ?? ELIM_LABEL[furthest.get(r.team.name) ?? 0],
  }));
}

export const QUALIFIED_ISO3 = Array.from(new Set(TEAMS.map((t) => t.iso3)));
