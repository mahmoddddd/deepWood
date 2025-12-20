/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'deep-brown': '#3C2415',
        'beige': '#E8DCC4',
        'matte-black': '#1A1A1A',
        'gold': '#C9A962',
        'cream': '#F5F0E8',
        'warm-gray': '#8B8178',
      },
      fontFamily: {
        cairo: ['Cairo', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
