module.exports = {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{ts,tsx,js,jsx}",
    "./src/**/*.{ts,tsx,js,jsx}",
    "./**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
    },
  },
  plugins: [],
};
