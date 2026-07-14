import Logo from "./components/Logo";
import ThemeSong from "./components/ThemeSong";
import WorldCupViews from "./components/WorldCupViews";

export default function Home() {
  return (
    <main className="flex-1">
      <header className="mx-auto flex w-full max-w-6xl flex-col items-center px-5 pt-10 pb-8 text-center">
        <Logo className="h-[132px] w-auto" />
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-[var(--navy)] sm:text-5xl">
          World Cup 2026
        </h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.28em] text-[var(--muted)]">
          Canada · Mexico · USA <span className="mx-1 text-[var(--border)]">|</span> 48 Nations
        </p>
      </header>

      <WorldCupViews />

      <ThemeSong />
    </main>
  );
}
