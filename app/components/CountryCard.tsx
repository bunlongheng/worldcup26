import type { ReactNode } from "react";
import Flag from "./Flag";
import {
  COUNTRY_INFO,
  GROUP_ACCENTS,
  CONFED_LABEL,
  textOn,
  type Team,
} from "../data/teams";

const I = "h-4 w-4";
const StarIcon = () => (
  <svg viewBox="0 0 24 24" className={I} fill="currentColor" aria-hidden="true">
    <path d="M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 17.3 5.8 20.9l1.6-6.8L2.2 8.9l6.9-.6z" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className={I} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.6 2.6 2.6 15.4 0 18M12 3c-2.6 2.6-2.6 15.4 0 18" />
  </svg>
);
const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" className={I} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
const AreaIcon = () => (
  <svg viewBox="0 0 24 24" className={I} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M16 21h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
  </svg>
);
const MoneyIcon = () => (
  <svg viewBox="0 0 24 24" className={I} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="2" x2="12" y2="22" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

function StatRow({ icon, label, value, color }: { icon: ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg" style={{ background: `${color}1f`, color }}>
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[9px] font-semibold uppercase tracking-wider text-[var(--muted)]">{label}</p>
        <p className="truncate text-sm font-bold text-[var(--navy)]">{value}</p>
      </div>
    </div>
  );
}

export default function CountryCard({ team, big = false }: { team: Team; big?: boolean }) {
  const info = COUNTRY_INFO[team.name];
  const accent = GROUP_ACCENTS[team.group];
  return (
    <div className="flex flex-col items-center text-center">
      <Flag code={team.flag} name={team.name} className={big ? "h-[120px] w-[180px]" : "h-[86px] w-[128px]"} />
      <span className={`mt-3 font-extrabold text-[var(--navy)] ${big ? "text-3xl" : "text-xl"}`}>{team.name}</span>
      <div className="mt-2 flex items-center gap-2">
        <span className="rounded-full px-3 py-1 text-xs font-bold" style={{ background: accent, color: textOn(accent) }}>
          Group {team.group}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
          {CONFED_LABEL[team.confed]}
        </span>
      </div>
      {team.host && (
        <span className="mt-2 rounded-full bg-[var(--navy)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          Host nation
        </span>
      )}
      {info && (
        <div className="mt-4 w-full space-y-2.5 border-t border-[var(--border)] pt-4 text-left">
          <StatRow icon={<StarIcon />} label="Capital" value={info.capital} color={accent} />
          <StatRow icon={<GlobeIcon />} label="Continent" value={info.continent} color={accent} />
          <StatRow icon={<PeopleIcon />} label="Population" value={info.population} color={accent} />
          <StatRow icon={<AreaIcon />} label="Area" value={info.area} color={accent} />
          <StatRow icon={<MoneyIcon />} label="Currency" value={info.currency} color={accent} />
        </div>
      )}
    </div>
  );
}
