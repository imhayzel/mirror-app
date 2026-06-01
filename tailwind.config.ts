import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0A0A0A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A0A0A",
        },
        accent: {
          DEFAULT: "#C8F000",
          foreground: "#0A0A0A",
        },
        surface: {
          DEFAULT: "#F5F5F0",
          dim: "#E8E8E3",
          container: "#FFFFFF",
          "container-high": "#F0F0EB",
        },
        "on-surface": "#0A0A0A",
        "on-surface-variant": "#5C5C5C",
        outline: {
          DEFAULT: "#0A0A0A",
          variant: "#D4D4CF",
        },
        error: {
          DEFAULT: "#D4000F",
          foreground: "#FFFFFF",
        },
        background: "#F5F5F0",
        foreground: "#0A0A0A",
        border: "#0A0A0A",
        input: "#0A0A0A",
        ring: "#0A0A0A",
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A0A0A",
        },
        muted: {
          DEFAULT: "#E8E8E3",
          foreground: "#5C5C5C",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#0A0A0A",
        },
        destructive: {
          DEFAULT: "#D4000F",
          foreground: "#FFFFFF",
        },
      },
      fontFamily: {
        display: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Helvetica Neue", "Arial", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["80px", { lineHeight: "84px", letterSpacing: "-0.03em" }],
        "display-md": ["56px", { lineHeight: "60px", letterSpacing: "-0.02em" }],
        "headline-lg": ["36px", { lineHeight: "42px", letterSpacing: "-0.01em" }],
        "headline-md": ["24px", { lineHeight: "30px", letterSpacing: "0" }],
        "body-lg": ["16px", { lineHeight: "26px" }],
        "body-md": ["14px", { lineHeight: "22px" }],
        "label-lg": ["13px", { lineHeight: "16px", letterSpacing: "0.08em" }],
        "label-sm": ["11px", { lineHeight: "14px", letterSpacing: "0.1em" }],
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
        "2xl": "0px",
        full: "9999px",
      },
      spacing: {
        xs: "8px",
        sm: "16px",
        md: "24px",
        lg: "40px",
        xl: "64px",
      },
      height: {
        "btn": "52px",
        "input": "52px",
      },
      gap: {
        "card": "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
