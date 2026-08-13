/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Backed by CSS custom properties (defined in src/index.css) so these
        // utilities follow the active theme. Values on :root equal the previous
        // literals, so untouched pages render identically.
        background: "var(--background)",
        foreground: "var(--foreground)",
        "secondary-foreground": "var(--secondary-foreground)",
        border: "var(--border)",
      },
    },
  },
  plugins: [],
};
