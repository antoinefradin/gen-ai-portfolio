import { useEffect, useState } from "react";

// Looping typewriter for the hero's main title. Unlike TypewriterHeading, this
// renders bare (no box/border) so it inherits whatever font + size the parent
// <h1> uses. A hidden copy of the longest phrase reserves the width, so the
// centered title never jitters or re-centers as characters type in and out.

export default function AnimatedRole({
  phrases,
  typingSpeed = 150,
  deletingSpeed = 80,
  pauseEnd = 3200, // hold at the full phrase before deleting
  pauseStart = 1000, // pause on empty before typing the next phrase
}) {
  const [text, setText] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex % phrases.length];

    // Decide the next tick: finished typing -> hold, then delete;
    // finished deleting -> pause, then advance to the next phrase.
    let delay;
    if (!deleting && text === current) {
      delay = pauseEnd;
    } else if (deleting && text === "") {
      delay = pauseStart;
    } else {
      delay = deleting ? deletingSpeed : typingSpeed;
    }

    const id = setTimeout(() => {
      if (!deleting && text === current) {
        setDeleting(true);
      } else if (deleting && text === "") {
        setDeleting(false);
        setPhraseIndex((i) => (i + 1) % phrases.length);
      } else {
        const nextLen = deleting ? text.length - 1 : text.length + 1;
        setText(current.slice(0, nextLen));
      }
    }, delay);

    return () => clearTimeout(id);
  }, [text, deleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseEnd, pauseStart]);

  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");

  return (
    // inline-grid stacks the visible text and a hidden sizer in the same cell;
    // the sizer (longest phrase + caret) fixes the width so the title stays
    // centered and stable while typing.
    <span style={{ display: "inline-grid", placeItems: "center" }}>
      <span
        aria-hidden="true"
        style={{ gridArea: "1 / 1", visibility: "hidden", whiteSpace: "pre" }}
      >
        {longest}
        <span style={caretStyle}>_</span>
      </span>
      <span style={{ gridArea: "1 / 1", whiteSpace: "pre" }}>
        {text}
        <span style={caretStyle} aria-hidden="true">
          _
        </span>
      </span>
    </span>
  );
}

const caretStyle = {
  color: "currentColor",
  fontWeight: 400,
  animation: "typewriterBlink 1s steps(1) infinite",
};
