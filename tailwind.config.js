/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Poppins", "Helvetica", "sans-serif"],
        sans: ["Heebo", "Helvetica", "sans-serif"]
      },

      colors: {
        nearblack: "#2b2b4f",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
