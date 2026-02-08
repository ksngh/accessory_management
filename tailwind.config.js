/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#F3E5AB',
        'primary-dark': '#D4C38E',
        'primary-text': '#5C4D1C',
        'background-light': '#FAF9F6',
        'background-dark': '#1C1C1E',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
}
