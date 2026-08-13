import { useEffect } from "react";
import Hero from "../components/Hero.jsx";
import FluidSwitcher from "../components/background/FluidSwitcher.jsx";
import ThemeToggle from "../components/theme/ThemeToggle.jsx";
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
      <ThemeToggle />
      <FluidSwitcher />
    </main>
  );
}
