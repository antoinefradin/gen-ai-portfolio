// Demo content for the blog template. Swap these out for real posts —
// the shape (`sections` of "p" | "h3") is all BlogPost.jsx needs.

export const posts = [
  {
    slug: "building-this-portfolio",
    title: "Building a Portfolio With a Live Fluid Background",
    date: "Aug 11, 2026",
    readTime: "4 min read",
    tags: ["Vite", "React", "WebGL"],
    excerpt:
      "Notes on wiring an interactive GPU fluid simulation into a React landing page without it fighting the rest of the UI for mouse events.",
    sections: [
      {
        type: "p",
        text: "A portfolio landing page is a small surface, but it's a good place to try an effect you'd never risk on a production app. This one leans on a full-viewport WebGL fluid simulation that trails the cursor in color, sitting behind a set of frosted-glass navigation buttons.",
      },
      {
        type: "p",
        text: "The interesting part wasn't the simulation itself — it's a well-documented technique — it was getting it to cooperate with everything drawn on top of it.",
      },
      {
        type: "h3",
        text: "The pointer-events problem",
      },
      {
        type: "p",
        text: "Most fluid-simulation libraries listen for mouse movement on their own canvas element. That's fine until you stack real UI on top of that canvas: buttons, headings, and images all intercept the pointer before it ever reaches the layer underneath, so the effect only reacts in the gaps between your content.",
      },
      {
        type: "p",
        text: "The fix is to flip the default: make the decorative wrapper pointer-events-none so events fall through to the canvas everywhere, then explicitly opt the real, clickable elements back in with pointer-events-auto. Everything you'd expect to click still works; everything else stops blocking the effect.",
      },
      {
        type: "h3",
        text: "Picking a library, twice",
      },
      {
        type: "p",
        text: "The first pass was a hand-rolled shader pipeline — ping-ponged framebuffers, a Jacobi pressure solve, the usual stable-fluids recipe. It worked in one browser and rendered nothing in another, because it assumed a half-float texture would always be renderable as a framebuffer attachment. Some GPUs disagree.",
      },
      {
        type: "p",
        text: "Swapping to a maintained library that already handles the WebGL2/WebGL1 fallback and texture-format detection fixed it in minutes. Worth remembering: a well-tested dependency beats re-solving a cross-browser compatibility problem from scratch.",
      },
      {
        type: "h3",
        text: "What's next",
      },
      {
        type: "p",
        text: "This post itself is a template — the design comes from a neobrutalist blog layout: heavy borders, flat offset shadows, no blur anywhere. The goal was to lift the visual language cleanly so future posts (real ones) drop into the same shape without extra design work.",
      },
    ],
  },
];

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}
