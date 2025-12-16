import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: {
          50: "#f7f2ec",
          100: "#efe6d9",
          200: "#dfd0b3",
          300: "#cbb190",
          400: "#b5916e",
          500: "#9d7554",
          600: "#7f5b43",
          700: "#634535",
          800: "#453026",
          900: "#2b1d19"
        }
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-sora)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 25px 80px -35px rgba(0,0,0,0.35)",
        card: "0 10px 30px -15px rgba(0,0,0,0.25)"
      }
    }
  },
  plugins: []
};

export default config;
