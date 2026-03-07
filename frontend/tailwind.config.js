/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50:  "#fdf8f0",
          100: "#faefd8",
          200: "#f5deb3",
          300: "#e8c88a",
          400: "#d4a96a",
          500: "#c8874a",
          600: "#a0522d",
          700: "#7b3f1e",
          800: "#5c2e12",
          900: "#3d1f0a",
        },
        cream: {
          50:  "#fffef7",
          100: "#fefce8",
          200: "#fef9c3",
          300: "#fef08a",
          400: "#fde047",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "serif"],
        body:    ["Lato", "sans-serif"],
      },
    },
  },
  plugins: [],
}