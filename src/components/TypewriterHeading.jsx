import { useEffect, useState } from "react";

// Neobrutalist "terminal tag" heading with a looping typewriter effect.
// Reproduces the reference design (amanbuilds.me blogs section):
//   > typed text_
// IBM Plex Mono 600, hard black border, flat offset shadow, blinking caret.
// Design tokens match the blog's neobrutalist language (docs/blog-post-design.md).

export default function TypewriterHeading({
  phrases,
  typingSpeed = 90,
  deletingSpeed = 45,
  pauseEnd = 1600, // hold at the full phrase before deleting
  pauseStart = 400, // pause on empty before typing the next phrase
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

  // Reserve width for the longest phrase so the box doesn't re-center/jitter
  // as characters are typed (the hero is center-aligned). "> " + longest + caret.
  const longest = phrases.reduce((a, b) => (b.length > a.length ? b : a), "");
  const reservedCh = longest.length + 3; // "> " prefix + one caret slot

  return (
    <span style={tagStyle}>
      <span aria-hidden="true">&gt;&nbsp;</span>
      <span
        style={{
          display: "inline-block",
          minWidth: `${reservedCh}ch`,
          textAlign: "left",
          whiteSpace: "pre",
        }}
      >
        {text}
        <span style={caretStyle} aria-hidden="true">
          _
        </span>
      </span>
    </span>
  );
}

const tagStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "clamp(0.8rem, 3vw, 1.5rem)",
  fontWeight: 600,
  border: "3px solid #1a1a1a",
  padding: "0.4rem 1rem",
  background: "#fff",
  color: "#1a1a1a",
  boxShadow: "4px 4px 0 #1a1a1a",
  display: "inline-block",
  maxWidth: "100%",
  lineHeight: 1.2,
};

const caretStyle = {
  animation: "typewriterBlink 1s steps(1) infinite",
};
