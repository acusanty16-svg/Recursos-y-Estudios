/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kids: ['"Fredoka"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Newsreader"', '"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        parchment: {
          50: '#FAF8F5',
          100: '#F3EFE6',
          200: '#E6DEC8',
        }
      },
      boxShadow: {
        'kids-card': '0 10px 25px -5px rgba(245, 158, 11, 0.15), 0 8px 10px -6px rgba(245, 158, 11, 0.1)',
        'general-card': '0 4px 20px -2px rgba(15, 23, 42, 0.06), 0 2px 6px -1px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
};
