/** @type {import('tailwindcss').Config} */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#FF6D2C",
        secondary: "#FDF3EA",
        darkProgram: "#93370D",

        black: "#1E1E1E",
        white: "#FFFFFF",

        graySoft: "#B0B0B0",
        grayMedium: "#6B6B6B",
        grayLight: "#F5F5F5",

        success: "#3CB371",
        warning: "#FFB547",
        error: "#FF5A5A",
      },

      fontFamily: {
        primary: ["Inter", "sans-serif"],
        handwriting: ["'Covered By Your Grace'", "cursive"],
        logo: ["Faster One", "cursive"],
      },

      boxShadow: {
        soft: "0px 4px 16px rgba(0,0,0,0.08)",
        medium: "0px 6px 24px rgba(0,0,0,0.12)",
        strong: "0px 10px 32px rgba(0,0,0,0.18)",
        glow: "0px 0px 24px rgba(255,109,44,0.35)",
        search: "0 4px 4px rgba(0,0,0,0.25)",
      },

      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },

      backgroundImage: {
        heroGradient:
          "linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.6) 100%)",

        cardGradient:
          "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(0,0,0,0.55) 100%)",
      },

      transitionTimingFunction: {
        smooth: "cubic-bezier(0.25, 0.1, 0.25, 1)",
      },

      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },

          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        pulseSoft: {
          "0%, 100%": {
            opacity: "1",
          },

          "50%": {
            opacity: ".6",
          },
        },

        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.95)",
          },

          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },

        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },

          "50%": {
            transform: "translateY(-6px)",
          },
        },
      },

      animation: {
        fadeIn: "fadeIn .4s ease forwards",
        pulseSoft: "pulseSoft 2s infinite",
        scaleIn: "scaleIn .3s ease forwards",
        float: "float 3s ease-in-out infinite",
      },

      screens: {
        xs: "480px",
      },
    },
  },

  plugins: [],
};