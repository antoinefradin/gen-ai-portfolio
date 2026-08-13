import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import TypewriterHeading from "./TypewriterHeading";
import {
  ChevronRight,
  Laugh,
  BriefcaseBusiness,
  Layers,
  PartyPopper,
  UserRoundSearch,
  Newspaper,
  Sparkles,
  User,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Me", icon: Laugh, color: "#329696" },
  { label: "Projects", icon: BriefcaseBusiness, color: "#3E9858" },
  { label: "Skills", icon: Layers, color: "#856ED9" },
  { label: "Blog", icon: Newspaper, color: "#FF6B9D", to: "/blog" },
  { label: "Fun", icon: PartyPopper, color: "#B95F9D" },
  { label: "Contact", icon: UserRoundSearch, color: "#C19433" },
];

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    // pointer-events-none here lets mousemove fall through to the fluid
    // canvas underneath (it only listens on the canvas element itself), so
    // the effect reacts everywhere — buttons opt back in with pointer-events-auto.
    <div className="pointer-events-none relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20">
      {/* faint huge background wordmark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden">
        <div
          className="hidden bg-gradient-to-b from-neutral-500/10 to-neutral-500/0 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: "-2.5rem" }}
        >
          Portfolio
        </div>
      </div>

      {/* top-left floating badge */}
      <button
        className={`pointer-events-auto fixed top-8 left-6 z-[51] group flex cursor-pointer items-center gap-2 rounded-full border bg-transparent px-4 py-2.5 backdrop-blur-2xl transition-all duration-300 hover:shadow-xl ${
          mounted ? "opacity-100 scale-100" : "opacity-0 scale-[0.8]"
        }`}
        style={{ transition: "opacity 0.6s ease, transform 0.6s ease" }}
      >
        <Sparkles className="h-5 w-5 text-[color:var(--muted)]" />
        <span className="hidden text-sm font-medium text-foreground sm:inline">
          Your Portfolio
        </span>
        <span className="text-sm font-medium text-foreground sm:hidden">Portfolio</span>
        <ChevronRight className="hidden h-4 w-4 transition-transform group-hover:translate-x-0.5 sm:block" />
      </button>

      {/* hero heading block */}
      <div
        className="z-10 mt-24 mb-8 flex flex-col items-center text-center md:mt-4 md:mb-12"
        style={{
          transition: "opacity 0.7s ease, transform 0.7s ease",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(-60px)",
        }}
      >
        <div className="z-[100]">
          <button
            aria-label="About me"
            className="pointer-events-auto h-auto w-auto cursor-pointer rounded-2xl bg-[color:var(--surface)] p-3 shadow-lg backdrop-blur-lg transition-colors hover:bg-[color:var(--surface-hover)]"
          >
            <User className="h-6 w-6 text-[color:var(--muted)] md:h-8 md:w-8" />
            <span className="sr-only">About me</span>
          </button>
        </div>
        <h2 className="mt-1 text-xl font-semibold text-secondary-foreground md:text-2xl">
          Hey, I'm Your Name 👋
        </h2>
        <div className="mt-4">
          <TypewriterHeading
            phrases={["ML Systems Builder", "Full-Stack Developer", "GenAI Tinkerer"]}
          />
        </div>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">Your Role</h1>
      </div>

      {/* hero avatar — memoji */}
      <img
        src="/hero-memoji.png"
        alt="Memoji of me"
        draggable={false}
        className="relative z-10 h-52 w-auto select-none drop-shadow-xl sm:h-[22rem]"
      />

      {/* nav grid (ask-me-anything bar intentionally removed) */}
      <div
        className="z-10 mt-4 flex w-full flex-col items-center justify-center md:px-0"
        style={{
          transition: "opacity 0.7s ease, transform 0.7s ease",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(80px)",
        }}
      >
        <div className="mt-4 grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {NAV_ITEMS.map(({ label, icon: Icon, color, to }) => {
            const className =
              "pointer-events-auto border-border aspect-square w-full cursor-pointer rounded-2xl border bg-[color:var(--surface)] py-8 shadow-none backdrop-blur-lg transition-colors hover:bg-border/30 active:scale-95 md:p-10";
            const content = (
              <div className="flex h-full flex-col items-center justify-center gap-1 text-[color:var(--muted)]">
                <Icon size={22} stroke={color} strokeWidth={2} />
                <span className="text-xs font-medium sm:text-sm">{label}</span>
              </div>
            );
            return to ? (
              <Link key={label} to={to} className={className}>
                {content}
              </Link>
            ) : (
              <button key={label} className={className}>
                {content}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
