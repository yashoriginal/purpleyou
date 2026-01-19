/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purpleLight: "#D3C9FF",
        purpleDeep: "#5540b7",
        luxuryBg: "#f8f5f2",
        champagneGold: "#E5D4B8",
        textPrimary: "#111111",
        textSub: "#6b6b6b",
        borderColor: "#e6e0da",
      },
    },
  },
  plugins: [],
};
