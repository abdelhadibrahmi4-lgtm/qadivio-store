import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#EAF2FF",
          100: "#D5E4FD",
          200: "#AFC9FA",
          300: "#7EA9F6",
          400: "#538BF3",
          500: "#3478F0", // Primary Royal Blue
          600: "#2565D8",
          700: "#1C4EB0",
          800: "#153C88",
          900: "#102A56", // Deep Navy
          950: "#0A1B38",
          royal: "#3478F0",
          navy: "#102A56",
          light: "#EAF2FF",
          subtle: "#F5F7FB",
          accent: "#38BDF8",
          gold: "#F59E0B",
          emerald: "#10B981",
        },
      },
      fontFamily: {
        arabic: ["Cairo", "Tajawal", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "pulse-subtle": "pulseSubtle 2s infinite ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(16px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
