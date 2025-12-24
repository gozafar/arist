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
          100: "#f2ebdf",
          200: "#e6dcc5",
          300: "#d8c6a1",
          400: "#c7b07c",
          500: "#b89b5e",
          600: "#a0804b",
          700: "#7f6538",
          800: "#5d4b2a",
          900: "#3c311c"
        }
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"]
      },
      boxShadow: {
        soft: "0 30px 90px -50px rgba(28,28,28,0.32)",
        card: "0 12px 38px -18px rgba(28,28,28,0.25)"
      }
    }
  },
  plugins: []
};

export default config;
