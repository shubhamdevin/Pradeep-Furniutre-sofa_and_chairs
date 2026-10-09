/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FAF8F5',
          100: '#F7F4EF',
          200: '#EDE5D9',
          300: '#DFD4C2',
        },
        cream: '#EDE5D9',
        charcoal: {
          DEFAULT: '#242424',
          light: '#2E2E2E',
          dark: '#181818',
          deep: '#121212',
        },
        walnut: {
          DEFAULT: '#624737',
          light: '#7A5B47',
          dark: '#4A3427',
        },
        gold: {
          light: '#CEB282',
          DEFAULT: '#B99A68',
          dark: '#9E804F',
          amber: '#A68042',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Playfair Display', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(36, 36, 36, 0.08), 0 0 1px 1px rgba(36, 36, 36, 0.04)',
        'luxury-hover': '0 30px 60px -20px rgba(36, 36, 36, 0.16), 0 0 1px 1px rgba(185, 154, 104, 0.3)',
        'luxury-gold': '0 10px 30px -10px rgba(185, 154, 104, 0.3)',
      },
    },
  },
  plugins: [],
}
