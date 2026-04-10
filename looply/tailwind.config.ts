import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#f4f6fb",
        mist: "#9ba4bb",
        surface: "#0c1020",
        "surface-soft": "#11162b",
        accent: "#62f2c8",
        coral: "#ff8577",
        gold: "#f7c66f"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      boxShadow: {
        glow: "0 30px 80px rgba(40, 54, 109, 0.35)",
        float: "0 18px 45px rgba(11, 16, 31, 0.45)"
      },
      backgroundImage: {
        "looply-grid":
          "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)"
      },
      animation: {
        float: "float 10s ease-in-out infinite",
        shimmer: "shimmer 2.8s ease-in-out infinite",
        fade: "fade 0.5s ease-out both",
        pulseSoft: "pulseSoft 2.4s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" }
        },
        shimmer: {
          "0%, 100%": { opacity: "0.65", transform: "scale(0.98)" },
          "50%": { opacity: "1", transform: "scale(1.02)" }
        },
        fade: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.85" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
