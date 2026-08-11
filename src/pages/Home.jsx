import Hero from "../components/Hero.jsx";
import FluidSwitcher from "../components/background/FluidSwitcher.jsx";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <FluidSwitcher />
    </main>
  );
}
