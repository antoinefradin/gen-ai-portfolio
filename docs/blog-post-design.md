# Blog post design template

Design reference reproduced from `amanbuilds.me/blogs/...` (a neobrutalist
article layout — cream background, hard black borders, flat drop shadows,
no blur/gradients). Use this doc as the spec whenever a new post page or
blog-related component is added, so everything stays visually consistent.

## Page

- Background: `#f5f0e8` (warm cream), text: `#1a1a1a` (near-black).
- Content column: `max-width: 720px`, centered, `padding: 3rem 1.5rem 6rem`.
- No blur, no soft shadows, no border-radius beyond `3px` — every shadow is a
  flat, hard-edged offset (`Npx Npx 0 #1a1a1a`, zero blur radius). That flat
  offset shadow + thick border is the signature of this style; don't soften it.

## Fonts

- **Space Grotesk** (headings, body, buttons) — geometric sans, bold weights
  (700/800) for anything that reads as a heading or label.
- **IBM Plex Mono** (metadata: date, read time, tags) — always small
  (`0.65–0.75rem`), always `font-weight: 700`, always uppercase-feeling even
  when the text itself isn't uppercase.

Both are open-source Google Fonts (OFL), loaded via `@fontsource`.

## Components

### Back link
Pill-ish button, not a plain link:
```
font: Space Grotesk 700 0.9rem
border: 2.5px solid #1a1a1a
padding: 0.4rem 1.2rem
background: transparent
box-shadow: 3px 3px 0 #1a1a1a
border-radius: 3px
display: inline-flex, gap: 0.4rem, align-items: center
```
Chevron-left icon + "Back to blogs". Links to the blog index.

### Post header
- Meta row (`flex, gap: 0.75rem, align-items: center, margin-bottom: 1rem`):
  `date` (mono, 0.75rem, `#666`, 700) — `✦` separator (`#aaa`, 0.75rem) —
  `read time` (same mono style as date).
- Title (`h1`): Space Grotesk 800, `2.8rem`, `line-height: 1.15`,
  `letter-spacing: -0.02em`, `margin: 0 0 1.5rem 0`.
- Tags row (`flex, gap: 0.5rem, wrap`): each tag is mono 0.65rem/700,
  `border: 2.5px solid #1a1a1a`, `padding: 0.2rem 0.6rem`, `border-radius: 3px`,
  `background: #FF6B9D` (hot-pink accent — the one splash of color on an
  otherwise black/cream/gray page), `box-shadow: 2px 2px 0 #1a1a1a`.
- Divider: `border-bottom: 3px solid #1a1a1a`, `margin-bottom: 3rem` — a
  single heavy rule, no gradient/fade.

### Prose (article body)
- Paragraphs: Space Grotesk, `1.02rem`, `line-height: 1.8`, `color: #333`,
  `margin-bottom: 1.25rem`, `text-align: justify`.
- Subheadings (`h3`): Space Grotesk 800, `1.4rem`, `margin-top: 2rem`,
  `margin-bottom: 1rem`, `color: #1a1a1a`.
- No blockquote/code-block styles were present on the reference post; if a
  post needs one, keep the same hard-border/flat-shadow language rather than
  introducing soft shadows or rounded pills.

## Content model

Each post is plain data (see `src/data/posts.js`) — `slug`, `title`, `date`,
`readTime`, `tags[]`, and `sections[]` where a section is `{ type: "p" | "h3", text }`.
`BlogPost.jsx` renders `sections` in order; `BlogIndex.jsx` renders a card per
post using the same tokens (border, flat shadow, mono meta) at a smaller scale.

## Site-wide selection, cursor scoped to articles

Applied in `src/index.css` / `CustomCursor.jsx` — the selection color is
global, but the blue-dot cursor only ever appears on article pages:

- Text selection (everywhere): `background: #FFE135` (the same yellow accent
  as tags), `color: #1a1a1a`.
- Pointer: the native cursor is untouched on the home page and the `/blog`
  index — only `/blog/:slug` article pages can activate the dot, and only if
  the toggle is on. `CustomCursor.jsx` combines the toggle's `enabled` state
  with `useLocation().pathname` matching `/^\/blog\/[^/]+/`; either condition
  being false means native cursor. Route changes are in the effect's
  dependency array, so navigating away from an article restores the native
  pointer immediately (same atomic swap as the toggle itself), not on the
  next mousemove.
- Touch devices are opted out entirely: `CustomCursor.jsx` returns early when
  `matchMedia("(pointer: coarse)")` matches, so the `custom-cursor` class is
  never applied and the native pointer/touch behavior is left alone.
- Persistence: the toggle state lives in `CursorContext.jsx`, backed by
  `localStorage` (key `customCursorEnabled`), and **defaults to on** when
  nothing is stored — so the preference survives reloads and navigation.
- When active: a 20px circle, `background: #3b82f6`, `border: 3px solid
  #1a1a1a`, following the mouse via a single `fixed`, `pointer-events-none`
  div mounted once in `App.jsx` (so its "have we seen a mousemove yet" state
  survives navigation) rather than per-page. Its `z-index` (100000) sits
  above everything, including `CursorToggle`'s button (10000), so the dot
  stays visible over UI — `pointer-events-none` still lets clicks fall
  through to whatever's underneath it.
- `CursorToggle.jsx` (top-right, article pages only — not the `/blog` index): a small fixed-width button
  (so "On" ↔ "Off" doesn't reflow it) showing just the state word plus a mini
  replica of the dot; clicking it flashes the button's own background blue
  (`cursorToggleFlash` keyframe in `index.css`) as press feedback.

## Where posts live

- `/blog` — index/listing (`BlogIndex.jsx`).
- `/blog/:slug` — a single post (`BlogPost.jsx`), "Back to blogs" → `/blog`.
- The homepage's nav grid has a **Blog** entry that links to `/blog`.
