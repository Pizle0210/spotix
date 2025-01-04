import type { Config } from "tailwindcss";
import t_animate from "tailwindcss-animate";
import forms from "@tailwindcss/forms";
// import t_motion from "tailwindcss-motion";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "floating-cube1": "float1 10s ease-in-out infinite",
        "floating-cube2": "float2 8s linear infinite",
        "floating-cube3": "float3 10s ease-in-out infinite",
        "floating-cube4": "float4 15s ease-in-out infinite",
        "floating-cube5": "float5 11s ease-in infinite",
        "floating-cube6": "float6 9s ease-in infinite",
        "floating-cube7": "float7 12s ease-in infinite",
      },
      keyframes: {
        float1: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateX(-70px) rotate(45deg)" },
        },
        float2: {
          "0%, 100%": { transform: "translateX(0) rotate(0deg)" },
          "50%": { transform: "translateX(30px) rotate(90deg)" },
        },
        float3: {
          "0%, 100%": { transform: "scale(.7) rotate(0deg)" },
          "50%": { transform: "scale(1.2) rotate(180deg)" },
        },
        float4: {
          "0%, 100%": { transform: "translate(0px, 100px) rotate(0deg)" },
          "50%": { transform: "translateX(-1200px) rotate(290deg)" },
        },
        float6: {
          "0%, 100%": { transform: "translate(0, 0) scale(.2)" },
          "50%": { transform: "translate(-10px, 40px) scale(1.7)" },
        },
        float7: {
          "0%, 100%": { transform: "translate(0, 0) scale(0.5)" },
          "50%": { transform: "translate(-10px, 20px) scale(2.1)" },
        },
      },
    },
  },
  plugins: [t_animate, forms],
} satisfies Config;
