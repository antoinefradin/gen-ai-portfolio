/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        background: "oklch(1 0 0)",
        foreground: "oklch(0.141 0.005 285.823)",
        "secondary-foreground": "oklch(0.21 0.006 285.885)",
        border: "oklch(0.92 0.004 286.32)",
      },
    },
  },
  plugins: [],
};
