import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import TypewriterHeading from "./TypewriterHeading";
import AnimatedRole from "./AnimatedRole";
import ScrollIndicator from "./ScrollIndicator";
import "./liquid-bar.css";
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
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Mail,
  FileText,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Me", icon: Laugh, color: "#329696" },
  { label: "Projects", icon: BriefcaseBusiness, color: "#3E9858" },
  { label: "Skills", icon: Layers, color: "#856ED9" },
  { label: "Blog", icon: Newspaper, color: "#FF6B9D", to: "/blog" },
  { label: "Fun", icon: PartyPopper, color: "#B95F9D" },
  { label: "Contact", icon: UserRoundSearch, color: "#C19433" },
];

// Second bar: social / contact links (hrefs are placeholders — fill in yours).
const SOCIAL_ITEMS = [
  { label: "GitHub", icon: Github, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "X", icon: Twitter, href: "#" },
  { label: "Instagram", icon: Instagram, href: "#" },
  { label: "Email", icon: Mail, href: "mailto:you@example.com" },
  { label: "Resume", icon: FileText, href: "#" },
];

// wordmark travels at ~55% of page scroll speed — it lags behind the menu
// grids for a background-depth cue. Bump toward 0.65 for a stronger drift,
// 0.25 for subtler.
const PARALLAX_FACTOR = 0.45;

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const wordmarkRef = useRef(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Scroll parallax for the background wordmark: push it down by a fraction of
  // scrollY so its net upward travel is slower than the page. Imperative ref
  // write (no per-frame re-render), rAF-throttled — matches CustomCursor.jsx.
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    const apply = () => {
      el.style.transform = `translate3d(0, ${window.scrollY * PARALLAX_FACTOR}px, 0)`;
      rafId = 0;
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(apply);
    };
    apply(); // initial position (page may load already scrolled)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    // pointer-events-none here lets mousemove fall through to the fluid
    // canvas underneath (it only listens on the canvas element itself), so
    // the effect reacts everywhere — buttons opt back in with pointer-events-auto.
    <div className="pointer-events-none relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 pb-10 md:pb-20">
      {/* faint huge background wordmark — parallaxes slower than the page */}
      <div
        ref={wordmarkRef}
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
        style={{ willChange: "transform" }}
      >
        <div
          className="hidden bg-gradient-to-b from-neutral-500/10 to-neutral-500/0 bg-clip-text text-[10rem] leading-none font-black text-transparent select-none sm:block lg:text-[16rem]"
          style={{ marginBottom: "-2.5rem" }}
        >
          Portfolio
        </div>
      </div>

      {/* top-left floating badge */}
      <button
        className={`liquid-glass pointer-events-auto fixed top-8 left-6 z-[51] group flex cursor-pointer items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-300 ${
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

      {/* static comparison twin of the switcher — same glass bar + strong
          refraction, labeled, pinned below the badge to compare the two glass
          treatments (non-interactive; no theme switching) */}
      <div className="glass-compare liquid-glass">Your Portfolio</div>

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
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">
          <AnimatedRole
            phrases={["GEN AI ENGINEER", "AI ENGINEER", "SENIOR ML ENGINEER"]}
          />
        </h1>
      </div>

      {/* hero avatar — memoji */}
      <img
        src="/hero-memoji.png"
        alt="Memoji of me"
        draggable={false}
        className="relative z-10 h-52 w-auto select-none drop-shadow-xl sm:h-[22rem]"
      />

      {/* nav bar — one liquid-glass panel holding all destinations, matching the
          switcher/badge material (ask-me-anything bar intentionally removed) */}
      <div
        className="z-10 mt-4 flex w-full flex-col items-center justify-center md:px-0"
        style={{
          transition: "opacity 0.7s ease, transform 0.7s ease",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(80px)",
        }}
      >
        <div className="liquid-glass pointer-events-auto mt-4 grid w-full max-w-3xl grid-cols-3 gap-2 rounded-[6rem] px-4 py-4 sm:gap-4 sm:px-6 md:grid-cols-6">
          {NAV_ITEMS.map(({ label, icon: Icon, color, to }) => {
            const className =
              "group flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl py-3 transition-transform active:scale-95";
            const content = (
              <>
                <Icon
                  size={24}
                  stroke={color}
                  strokeWidth={2}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-xs font-medium text-[color:var(--muted)] sm:text-sm">
                  {label}
                </span>
              </>
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

        {/* second menu bar — CodePen (samarkandiy/yyNvNGQ) liquid-glass bar
            format: four stacked layers (filter/overlay/specular) behind a grid
            of social links. Faithful look = white text + bright specular. */}
        <div className="lg-bar pointer-events-auto mt-4 w-full max-w-3xl">
          <div className="lg-bar__filter" />
          <div className="lg-bar__overlay" />
          <div className="lg-bar__specular" />
          <div className="lg-bar__content grid grid-cols-3 gap-2 px-4 py-4 sm:gap-4 sm:px-6 md:grid-cols-6">
            {SOCIAL_ITEMS.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl py-3 text-white transition-transform active:scale-95"
                style={{ textShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
              >
                <Icon
                  size={24}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                <span className="text-xs font-medium sm:text-sm">{label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* bottom-center scroll hint — smooth-scrolls one viewport down */}
      <ScrollIndicator />

      {/* SVG displacement filter powering .lg-bar__filter — the pen's #lg-dist:
          fractal-noise turbulence displaces the backdrop for the liquid wobble.
          Chromium renders it; Safari falls back to plain blur. Hidden from AT. */}
      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="lg-dist" x="0%" y="0%" width="100%" height="100%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.008 0.008"
            numOctaves="2"
            seed="92"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="2" result="blurred" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="blurred"
            scale="70"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
}
