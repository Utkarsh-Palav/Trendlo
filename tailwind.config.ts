import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#FF6B35",
          light: "#FF8C5A",
          dark: "#E55A24",
        },
        dark: {
          DEFAULT: "#0F0F0F",
          surface: "#1A1A1A",
          border: "#2A2A2A",
        },
        light: {
          DEFAULT: "#F8F7F4",
          surface: "#FFFFFF",
          border: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

export default config;

