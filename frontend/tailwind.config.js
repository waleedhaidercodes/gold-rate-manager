/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          400: '#E6C25B',
          500: '#D4AF37', // Classic Gold
          600: '#C5A028',
          700: '#B48E23',
        },
        dark: {
          900: '#0F172A', // Rich Dark Slate
          800: '#1E293B', // Surface
          700: '#334155', // Lighter Surface
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
