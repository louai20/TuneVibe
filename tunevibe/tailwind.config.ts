const { addDynamicIconSelectors } = require('@iconify/tailwind');

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-slide-in": {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
        "hover-scale-up": {
          "0%": {
            transform: "scale(1)",
          },
          "100%": {
            transform: "scale(1.05)",
          },
        },
        circularRight: {
          "0%": { transform: "translate(100px, 0)" },
          "25%": { transform: "translate(0, 100px)" },
          "50%": { transform: "translate(-100px, 0)" },
          "75%": { transform: "translate(0, -100px)" },
          "100%": { transform: "translate(100px, 0)" },
        },
        circularLeft: {
          "0%": { transform: "translate(100px, 0)" },
          "25%": { transform: "translate(0, -100px)" },
          "50%": { transform: "translate(-100px, 0)" },
          "75%": { transform: "translate(0, 100px)" },
          "100%": { transform: "translate(100px, 0)" },
        },
        // Add more keyframes for additional movement patterns if desired
      },
      animation: {
        "fade-slide-in": "fade-slide-in 0.5s ease-out",
        "fade-slide-in-delay": "fade-slide-in 0.5s ease-out 0.2s",
        "hover-scale-up": "hover-scale-up 0.3s ease-in-out",
        circularRight: "circularRight 10s linear infinite",
        circularLeft: "circularLeft 10s linear infinite",

        // Add more animations for additional circles
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addDynamicIconSelectors(),
  ],
};
