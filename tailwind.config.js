import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./App.tsx",
  ],
  theme: {
    extend: {
      spacing: {
        15: '3.75rem',
      },
      colors: {
        primary: '#F3E5AB',
        'primary-dark': '#D4C38E',
        'primary-text': '#5C4D1C',
        'background-light': '#FAF9F6',
        'background-dark': '#1C1C1E',
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [forms, containerQueries, animate],
};
