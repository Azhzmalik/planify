/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2559",
          light: "#242E6B",
          dark: "#141A42",
        },
        brand: {
          blue: "#3B82F6",
          bluedark: "#2563EB",
        },
        pastel: {
          mint: "#CFF7EA",
          mintdark: "#3FB98A",
          pink: "#FCE0EC",
          pinkdark: "#EC6BA0",
          yellow: "#FFF3C4",
          yellowdark: "#E8B227",
          purple: "#E7E1FB",
          purpledark: "#8B6FE8",
        },
        surface: {
          DEFAULT: "#F5F6FA",
          card: "#FFFFFF",
        },
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      boxShadow: {
        soft: "0 8px 24px rgba(27, 37, 89, 0.08)",
        card: "0 4px 16px rgba(27, 37, 89, 0.06)",
      },
    },
  },
  plugins: [],
};
