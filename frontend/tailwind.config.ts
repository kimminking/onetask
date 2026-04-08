import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: {
          50:  "#2a2320",
          100: "#221e1c",
          200: "#1c1917",
          300: "#181412",
          400: "#141110",
          500: "#100d0c",
        },
        jeok: {
          50:  "#fdf2f0",
          100: "#fbe0da",
          200: "#f5b8ad",
          300: "#ed8a7a",
          400: "#e05a46",
          500: "#c13b1b",
          600: "#a32f13",
          700: "#82240e",
          800: "#601a0a",
          900: "#3d1006",
          950: "#200803",
        },
      },
    },
  },
  plugins: [],
};
export default config;
