export default {
  darkMode: "class", // ✅ Important
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6C63FF",
          foreground: "#ffffff",
        },
      },
    },
  },
  plugins: [],
};
