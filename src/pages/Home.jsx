import { useEffect } from "react";
import Hero from "../components/Hero.jsx";
import FluidSwitcher from "../components/background/FluidSwitcher.jsx";
import Switcher from "../components/switcher/Switcher.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Home() {
  const { theme } = useTheme();

  // Theme is scoped to the home page: set data-theme on <html> while Home is
  // mounted and remove it on unmount, so blog routes are never themed.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);

  return (
    <main className="flex min-h-screen flex-col">
      <Hero />

      {/* Scroll destination for the hero's ScrollIndicator (targetId="explore").
          relative z-10 keeps it above the fixed fluid canvas (z-0); colors use
          the home theme tokens so it recolors with light/dark/dim. */}
      <section
        id="explore"
        className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center"
      >
        <h2 className="text-3xl font-bold sm:text-4xl">Explore</h2>
        <p className="mt-4 max-w-md text-[color:var(--muted)]">More coming soon.</p>
      </section>

      <Switcher />
      <FluidSwitcher />
    </main>
  );
}
