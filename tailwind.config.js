/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#a90707",
          dark: "#8a0606",
          light: "#c91010",
        },
        secondary: {
          DEFAULT: "#32373c",
          dark: "#1a1d20",
          light: "#4a5158",
        },
        background: {
          DEFAULT: "#ffffff",
          alt: "#f9fafb",
        },
        foreground: {
          DEFAULT: "#171717",
          muted: "#6b7280",
        },
        "off-white": "#efefef",
        "gray-dark": "#444444",
        "gray-medium": "#6b7280",
        "gray-light": "#9ca3af",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};
