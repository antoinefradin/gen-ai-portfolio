import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { posts } from "../data/posts.js";

// Same design tokens as BlogPost.jsx — see docs/blog-post-design.md.
// CursorToggle intentionally lives on article pages only, not here.

export default function BlogIndex() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f0e8",
        color: "#1a1a1a",
        padding: "3rem 1.5rem 6rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <div style={backLinkStyle}>
              <ArrowLeft size={12} strokeWidth={2.5} />
              <span>Back home</span>
            </div>
          </Link>
        </div>

        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "2.4rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            margin: "0 0 2.5rem 0",
            color: "#1a1a1a",
          }}
        >
          Blog
        </h1>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          {posts.map((post) => (
            <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
              <article style={cardStyle}>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginBottom: "0.75rem", flexWrap: "wrap" }}>
                  <span style={metaStyle}>{post.date}</span>
                  <span style={{ color: "#aaa", fontSize: "0.7rem" }}>✦</span>
                  <span style={metaStyle}>{post.readTime}</span>
                </div>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "1.5rem",
                    fontWeight: 800,
                    margin: "0 0 0.6rem 0",
                    letterSpacing: "-0.01em",
                    color: "#1a1a1a",
                  }}
                >
                  {post.title}
                </h2>
                <p style={{ fontSize: "0.95rem", lineHeight: 1.6, color: "#333", margin: "0 0 1rem 0" }}>
                  {post.excerpt}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {post.tags.map((tag) => (
                      <span key={tag} style={tagStyle}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <ArrowRight size={16} strokeWidth={2.5} />
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

const backLinkStyle = {
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
};

const cardStyle = {
  border: "2.5px solid #1a1a1a",
  borderRadius: "3px",
  padding: "1.5rem",
  background: "#fff",
  boxShadow: "4px 4px 0 #1a1a1a",
  transition: "transform 0.15s ease, box-shadow 0.15s ease",
};

const metaStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.7rem",
  color: "#666",
  fontWeight: 700,
};

const tagStyle = {
  fontFamily: "'IBM Plex Mono', monospace",
  fontSize: "0.6rem",
  fontWeight: 700,
  border: "2px solid #1a1a1a",
  padding: "0.15rem 0.5rem",
  borderRadius: "3px",
  background: "#FF6B9D",
  boxShadow: "2px 2px 0 #1a1a1a",
};
