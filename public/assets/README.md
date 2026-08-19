# Static image assets

Files here are served from the site root under `/assets/…` (Vite copies
everything in `public/` verbatim — no import, no hashing). Reference them with
an absolute path, e.g. `url("/assets/sunset-mountains.webp")` in CSS or
`src="/assets/foo.png"` in JSX.

Keep only build-shipped, web-optimized files in here — full-res sources live
in `/design-src` (repo root) so they never bloat the `dist/` bundle.

## Files

| File                     | Role                                                                 |
| ------------------------ | -------------------------------------------------------------------- |
| `sunset-mountains.webp`  | **Shipped** Dim ("sunset") theme backdrop — `src/index.css` (`html[data-theme="dim"] body`). 2560×1707, ~247 KB. |

## Re-encoding the backdrop

Source lives at `../../design-src/sunset-mountains.jpg`. To regenerate the WebP
the app loads (run from this folder):

```sh
cwebp -q 82 -resize 2560 0 ../../design-src/sunset-mountains.jpg -o sunset-mountains.webp
```

> The backdrop only shows on the **Dim / sunset** theme (via the Switcher);
> Light and Dark use a flat color by design.
