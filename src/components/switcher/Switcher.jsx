import { useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext.jsx";
import glassDisplacementMap from "./glassDisplacementMap.js";
import "./switcher.css";

// Maps each theme to the pen's `c-option` index (drives the sliding glass thumb
// position + morph direction via the CSS `:has()` / [c-previous] selectors).
const C_OPTION = { light: "1", dark: "2", dim: "3" };

// Inline SVG icons, taken verbatim from the reference pen (sun / moon / dim-sun).
// All paths fill with var(--c), which the CSS drives per hover / checked state.
const ICONS = {
  light: (
    <>
      <path
        fill="var(--c)"
        fillRule="evenodd"
        d="M18 12a6 6 0 1 1 0 12 6 6 0 0 1 0-12Zm0 2a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
        clipRule="evenodd"
      />
      <path
        fill="var(--c)"
        d="M17 6.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 7.742a1 1 0 1 1 1.618 1.176L24.1 11.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 13.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM29.722 20.795a1 1 0 0 1-.619 1.902l-2.853-.927a1 1 0 1 1 .618-1.902l2.854.927ZM25.862 27.159a1 1 0 0 1-1.618 1.175l-1.763-2.427a1 1 0 1 1 1.618-1.175l1.763 2.427ZM19 30.038a1 1 0 0 1-2 0v-3a1 1 0 1 1 2 0v3ZM11.755 28.334a1 1 0 0 1-1.618-1.175l1.764-2.427a1 1 0 1 1 1.618 1.175l-1.764 2.427ZM6.896 22.697a1 1 0 1 1-.618-1.902l2.853-.927a1 1 0 1 1 .618 1.902l-2.853.927ZM6.278 15.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 8.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z"
      />
    </>
  ),
  dark: (
    <path
      fill="var(--c)"
      d="M12.5 8.473a10.968 10.968 0 0 1 8.785-.97 7.435 7.435 0 0 0-3.737 4.672l-.09.373A7.454 7.454 0 0 0 28.732 20.4a10.97 10.97 0 0 1-5.232 7.125l-.497.27c-5.014 2.566-11.175.916-14.234-3.813l-.295-.483C5.53 18.403 7.13 11.93 12.017 8.77l.483-.297Zm4.234.616a8.946 8.946 0 0 0-2.805.883l-.429.234A9 9 0 0 0 10.206 22.5l.241.395A9 9 0 0 0 22.5 25.794l.416-.255a8.94 8.94 0 0 0 2.167-1.99 9.433 9.433 0 0 1-2.782-.313c-5.043-1.352-8.036-6.535-6.686-11.578l.147-.491c.242-.745.573-1.44.972-2.078Z"
    />
  ),
  dim: (
    <path
      fill="var(--c)"
      d="M5 21a1 1 0 0 1 1-1h24a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1ZM12 25a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H13a1 1 0 0 1-1-1ZM15 29a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1ZM18 13a6 6 0 0 1 5.915 7h-2.041A4.005 4.005 0 0 0 18 15a4 4 0 0 0-3.874 5h-2.041A6 6 0 0 1 18 13ZM17 7.038a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0v-3ZM24.244 8.742a1 1 0 1 1 1.618 1.176L24.1 12.345a1 1 0 1 1-1.618-1.176l1.763-2.427ZM29.104 14.379a1 1 0 0 1 .618 1.902l-2.854.927a1 1 0 1 1-.618-1.902l2.854-.927ZM6.278 16.28a1 1 0 1 1 .618-1.901l2.853.927a1 1 0 1 1-.618 1.902l-2.853-.927ZM10.137 9.918a1 1 0 0 1 1.618-1.176l1.764 2.427a1 1 0 0 1-1.618 1.176l-1.764-2.427Z"
    />
  ),
};

const OPTIONS = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "dim", label: "Dim" },
];

export default function Switcher() {
  const { theme, setTheme } = useTheme();
  const fieldsetRef = useRef(null);
  // Tracks the previously-selected option so the thumb knows which edge to
  // squish from — this is the React port of the pen's `trackPrevious` script.
  const prevOptionRef = useRef(C_OPTION[theme]);

  // Seed `c-previous` once on mount (pen sets it to the initially-checked option).
  useEffect(() => {
    fieldsetRef.current?.setAttribute("c-previous", prevOptionRef.current);
  }, []);

  const handleChange = (value) => {
    // Write the option that was selected BEFORE this change, then advance —
    // exactly the ordering the pen's change handler uses.
    fieldsetRef.current?.setAttribute("c-previous", prevOptionRef.current);
    prevOptionRef.current = C_OPTION[value];
    setTheme(value);
  };

  return (
    <fieldset className="switcher liquid-glass" ref={fieldsetRef}>
      <legend className="switcher__legend">Choose theme</legend>

      {OPTIONS.map(({ value, label }) => (
        <label className="switcher__option" key={value}>
          <input
            className="switcher__input"
            type="radio"
            name="theme"
            value={value}
            c-option={C_OPTION[value]}
            checked={theme === value}
            onChange={() => handleChange(value)}
          />
          <span className="switcher__legend">{label}</span>
          <svg className="switcher__icon" fill="none" viewBox="0 0 36 36">
            {ICONS[value]}
          </svg>
        </label>
      ))}

      {/* SVG filters that power `backdrop-filter: url(#…)` — must exist in the DOM
          for the refraction to resolve. Chrome/Edge render the refraction; Safari
          ignores url() filters in backdrop-filter and falls back to blur.
          Both use primitiveUnits="objectBoundingBox", so displacement scales with
          element size — hence two filters (see .liquid-glass in switcher.css):
            #switcher   — strong, tuned for the small switcher pill.
            #glass-soft — gentle, for the larger badge & nav bar, where scale=0.5
                          would magnify the backdrop into a pixelated rainbow. */}
      <div className="switcher__filter">
        <svg>
          <filter id="switcher" primitiveUnits="objectBoundingBox">
            <feImage
              result="map"
              width="100%"
              height="100%"
              x="0"
              y="0"
              href={glassDisplacementMap}
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.04" result="blur" />
            <feDisplacementMap
              id="disp"
              in="blur"
              in2="map"
              scale="0.5"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
          {/* Same map, much smaller displacement scale so the backdrop isn't
              magnified into a smear on big elements. preserveAspectRatio="none"
              stretches the map to the full box (no truncation at the ends). */}
          <filter id="glass-soft" primitiveUnits="objectBoundingBox">
            <feImage
              result="map"
              width="100%"
              height="100%"
              x="0"
              y="0"
              preserveAspectRatio="none"
              href={glassDisplacementMap}
            />
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.04" result="blur" />
            <feDisplacementMap
              in="blur"
              in2="map"
              scale="0.1"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      </div>
    </fieldset>
  );
}
