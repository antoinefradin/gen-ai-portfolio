import glassDisplacementMap from "./glassDisplacementMap.js";
import "./button.css";

// A plain liquid-glass "background" element — the same tinted-glass material as
// the theme switcher (../switcher), with none of its multi-option machinery
// (no radio inputs, no sliding thumb, no icons/morph animations). Drop any
// content inside; it renders on top of the glass. Recolors across
// light/dark/dim automatically via the theme vars.
export default function Button({ children = "Liquid Glass", className = "" }) {
  return (
    <div className={`button ${className}`.trim()}>
      <span className="button__label">{children}</span>

      {/* SVG filters that power `backdrop-filter: url(#…)` — must exist in the
          DOM for the refraction to resolve. Chrome/Edge render the refraction;
          Safari ignores url() filters in backdrop-filter and falls back to blur.
          Both use primitiveUnits="objectBoundingBox", so displacement scales
          with element size — hence two filters. IDs are button-scoped so they
          never clash with the switcher's own #switcher / #glass-soft filters:
            #glass-btn      — strong, tuned for small pills (what .button uses).
            #glass-btn-soft — gentle, for larger surfaces where the strong filter
                              would magnify the backdrop into a smear. */}
      <div className="button__filter">
        <svg>
          <filter id="glass-btn" primitiveUnits="objectBoundingBox">
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
          <filter id="glass-btn-soft" primitiveUnits="objectBoundingBox">
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
    </div>
  );
}
