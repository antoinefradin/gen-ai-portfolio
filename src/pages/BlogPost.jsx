import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug } from "../data/posts.js";
import CursorToggle from "../components/CursorToggle.jsx";

// Design lifted from the reference neobrutalist blog post layout — see
// docs/blog-post-design.md for the full spec (colors, fonts, spacing).

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f5f0e8",
          color: "#1a1a1a",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        <CursorToggle />
        <p>Post not found.</p>
        <BackLink />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f0e8",
        color: "#1a1a1a",
        padding: "3rem 1.5rem 6rem 1.5rem",
      }}
    >
      <CursorToggle />
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
          <BackLink />
        </div>

        <header style={{ marginBottom: "3rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap" }}>
            <span style={metaStyle}>{post.date}</span>
            <span style={{ color: "#aaa", fontSize: "0.75rem" }}>✦</span>
            <span style={metaStyle}>{post.readTime}</span>
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "2.8rem",
              fontWeight: 800,
              lineHeight: 1.15,
              margin: "0 0 1.5rem 0",
              letterSpacing: "-0.02em",
              color: "#1a1a1a",
            }}
          >
            {post.title}
          </h1>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {post.tags.map((tag) => (
              <span key={tag} style={tagStyle}>
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div style={{ borderBottom: "3px solid #1a1a1a", marginBottom: "3rem" }} />

        <article style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {post.sections.map((section, i) =>
            section.type === "h3" ? (
              <h3 key={i} style={h3Style}>
                {section.text}
              </h3>
            ) : (
              <p key={i} style={pStyle}>
                {section.text}
              </p>
            )
          )}
        </article>
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <Link to="/blog" style={{ textDecoration: "none" }}>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "0.9rem",
          border: "2.5px solid #1a1a1a",
          padding: "0.4rem 1.2rem",
          background: "transparent",
          color: "#1a1a1a",
          boxShadow: "3px 3px 0 #1a1a1a",
          borderRadius: "3px",
          display: "inline-flex",
          alignItems: "center",
          gap: "0.4rem",
          cursor: "pointer",
        }}
      >
        <ArrowLeft size={12} strokeWidth={2.5} />
        <span>Back to blogs</span>
      </div>
    </Link>
  );
}

const metaStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.75rem",
  color: "#666",
  fontWeight: 700,
};

const tagStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.65rem",
  fontWeight: 700,
  border: "2.5px solid #1a1a1a",
  padding: "0.2rem 0.6rem",
  borderRadius: "3px",
  background: "#FF6B9D",
  boxShadow: "2px 2px 0 #1a1a1a",
};

const pStyle = {
  fontSize: "1.02rem",
  lineHeight: 1.8,
  color: "#333",
  marginBottom: "1.25rem",
  textAlign: "justify",
};

const h3Style = {
  fontFamily: "'Space Grotesk', sans-serif",
  fontSize: "1.4rem",
  fontWeight: 800,
  marginTop: "2rem",
  marginBottom: "1rem",
  color: "#1a1a1a",
};
