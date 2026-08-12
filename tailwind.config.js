/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Atticor green kit. Keep these in sync with the C object in components/AtticorMerchHub.jsx.
        ink: "#081D01",      // Dark Green — text
        forest: "#013828",   // Mid Green — primary
        sage: "#D0D9BA",     // Light Green
        offwhite: "#F8FAF2",
        tint: "#E4EAD3",
        apricot: "#FFA967",  // gradient accent
        hairline: "#DDE3D0",
      },
      fontFamily: {
        display: ["STK Bureau Serif", "ui-serif", "Georgia", "serif"],
        body: ["STK Miso", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
