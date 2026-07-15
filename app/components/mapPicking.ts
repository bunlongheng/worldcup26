// Pure selection/highlight logic for the map + globe - no d3, no DOM - so the
// picking behavior (what glows when you tap a country or a group) is testable
// independently of the SVG rendering.

import type { Team } from "../data/teams";

const DEFAULT_GLOW = "#2fa84f";

/** iso3 -> teams (England & Scotland both share GBR). */
export function teamsByIso3(teams: Team[]): Record<string, Team[]> {
  return teams.reduce<Record<string, Team[]>>((acc, t) => {
    (acc[t.iso3] ||= []).push(t);
    return acc;
  }, {});
}

/** iso3 codes that should glow, given a selected country OR a selected group. */
export function activeIso3(
  selected: string | null,
  selectedGroup: string | null,
  qualifiedA3s: string[],
  byIso3: Record<string, Team[]>
): Set<string> {
  const set = new Set<string>();
  if (selectedGroup) {
    for (const a3 of qualifiedA3s) {
      if ((byIso3[a3] || []).some((t) => t.group === selectedGroup)) set.add(a3);
    }
  } else if (selected) {
    set.add(selected);
  }
  return set;
}

/** Group letters to light in the legend (a selected country lights its group). */
export function activeGroupLetters(
  selected: string | null,
  selectedGroup: string | null,
  byIso3: Record<string, Team[]>
): Set<string> {
  const set = new Set<string>();
  if (selectedGroup) set.add(selectedGroup);
  else if (selected) for (const t of byIso3[selected] || []) set.add(t.group);
  return set;
}

/** Glow color for a country: the selected group's accent, else its own group's. */
export function glowColorFor(
  a3: string,
  selectedGroup: string | null,
  byIso3: Record<string, Team[]>,
  accents: Record<string, string>
): string {
  if (selectedGroup) return accents[selectedGroup];
  return accents[byIso3[a3]?.[0]?.group] || DEFAULT_GLOW;
}
