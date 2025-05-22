/** @type {import('tailwindcss').Config} */
import plugin from "tailwindcss/plugin";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        textColor: "var(--text-color)",
        btnBg: "#008FF610",
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        stroke: "#DBDEE1",
        stroke2: "#E8EAEC",
        contentBg: "#DBDEE1",
        error: "#FF0000",
        success: "#38B000",
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
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      backgroundImage: {
        gradientText:
          "linear-gradient(90deg, #008FF6 0%, #926DFB 53.5%, #E34ECB 81.5%, #F44F16 100%)",
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      fontFamily: {
        open: ['"Open Sans"', 'sans-serif'],
      },
      fontSize: {
        h1: [
          "32px",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        h2: [
          "24px",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        h3: [
          "20px",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        h4: [
          "20px",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        h5: [
          "16px",
          {
            lineHeight: "1.25",
            fontWeight: "700",
          },
        ],
        p: [
          "14px",
          {
            lineHeight: "1.5",
            fontWeight: "500",
          },
        ],
        "p-md": [
          "16px",
          {
            lineHeight: "1.5",
            fontWeight: "500",
          },
        ],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          /* Chrome, Safari и Opera */
          "-webkit-scrollbar": {
            display: "none",
          },
          /* Firefox */
          "scrollbar-width": "none",
          /* IE и Edge */
          "-ms-overflow-style": "none",
        },
      });
    }),
    plugin(function ({ addComponents }) {
      addComponents({
        ".select-no-arrow": {
          "-webkit-appearance": "none",
          "-moz-appearance": "none",
          appearance: "none",
          "background-repeat": "no-repeat",
          "background-position": "right 1rem center",
          "background-size": "1em",
          "padding-right": "2.5rem",
        },
      });
    }),
  ],
};
