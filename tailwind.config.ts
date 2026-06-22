import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#0a0a0f",
        surface: "#111117",
        "surface-2": "#18181f",
        "surface-3": "#1e1e27",
        "border-subtle": "#2a2a35",
        "text-primary": "#f0f0f5",
        "text-secondary": "#8888a0",
        "text-muted": "#555566",
        accent: {
          purple: "#7b5cf0",
          "purple-light": "#a78bfa",
          crimson: "#e31c25",
          "crimson-light": "#ff4757",
          gold: "#f59e0b",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "premium-purple": "linear-gradient(135deg, #7b5cf0 0%, #a855f7 50%, #ec4899 100%)",
        "premium-red": "linear-gradient(135deg, #e31c25 0%, #ff4757 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "ken-burns": "kenBurns 20s ease-in-out infinite alternate",
        shimmer: "shimmer 2s linear infinite",
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        grain: "grain 0.5s steps(1) infinite",
      },
      keyframes: {
        kenBurns: {
          "0%": { transform: "scale(1) translate(0%, 0%)" },
          "100%": { transform: "scale(1.12) translate(-2%, -1%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        grain: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-2%, -3%)" },
          "20%": { transform: "translate(3%, 2%)" },
          "30%": { transform: "translate(-1%, 4%)" },
          "40%": { transform: "translate(2%, -2%)" },
          "50%": { transform: "translate(-3%, 1%)" },
          "60%": { transform: "translate(1%, 3%)" },
          "70%": { transform: "translate(-2%, -1%)" },
          "80%": { transform: "translate(3%, -3%)" },
          "90%": { transform: "translate(-1%, 2%)" },
        },
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [],
};
export default config;
