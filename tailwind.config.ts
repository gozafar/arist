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
          50: "#f8f5f0",
          100: "#efe6da",
          200: "#ddd2c6",
          300: "#c8b8a8",
          400: "#b3967f",
          500: "rgb(100, 116, 139)",
          600: "rgb(100, 116, 139)",
          700: "#60321f",
          800: "#472517",
          900: "#2f1910"
        }
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 30px 90px -50px rgba(46,46,46,0.28)",
        card: "0 12px 38px -18px rgba(46,46,46,0.22)"
      }
    }
  },
  plugins: []
};

export default config;
