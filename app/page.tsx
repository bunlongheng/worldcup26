import ThemeSong from "./components/ThemeSong";
import WorldCupViews from "./components/WorldCupViews";

export default function Home() {
  return (
    <main className="flex-1">
      <WorldCupViews />
      <ThemeSong />
    </main>
  );
}
