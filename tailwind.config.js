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
        // Official Architectural Graphite + Platinum Palette (Section 2)
        graphite: {
          DEFAULT: '#22272B', // Graphite Primary
          primary: '#22272B',
          deep: '#15191C',    // Deep Graphite
          elevated: '#2D353A',// Elevated dark surfaces
          hover: '#353D42',   // Button hover
          border: '#414A50',  // Dark Border
        },
        platinum: {
          DEFAULT: '#F3F4F2', // Platinum White
          white: '#FFFFFF',   // Pure White
          soft: '#E8EBE9',    // Soft Platinum
          hover: '#E2E6E3',   // Surface hover
          border: '#D7DCDA',  // Light Border
        },
        slate: {
          silver: '#8D979B',  // Silver Slate (decorative accent)
          dark: '#4D565B',    // Dark Grey (secondary light-theme text)
          muted: '#687276',   // Text Muted
        },
        olive: {
          muted: '#768177',   // Muted Olive (rare organic accent)
          decorative: '#9FAAA1',
        },
        status: {
          success: '#24684C',
          warning: '#8A5B1D',
          error: '#B42318',
          info: '#315B75',
        },

        // Legacy compatibility mappings remapped to Architectural Graphite + Platinum
        ivory: {
          50: '#F8F9F8',
          100: '#F3F4F2',
          200: '#E8EBE9',
          300: '#D7DCDA',
        },
        cream: '#E8EBE9',
        charcoal: {
          DEFAULT: '#22272B',
          light: '#353D42',
          dark: '#15191C',
          deep: '#15191C',
        },
        walnut: {
          DEFAULT: '#4D565B',
          light: '#687276',
          dark: '#22272B',
        },
        gold: {
          DEFAULT: '#768177', // Remapped to Muted Olive (strictly NO gold luxury styling)
          light: '#8D979B',   // Remapped to Silver Slate
          dark: '#4D565B',
          amber: '#768177',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-serif)', 'Instrument Serif', 'Cormorant Garamond', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(34, 39, 43, 0.05), 0 1px 2px rgba(34, 39, 43, 0.03)',
        'card': '0 4px 12px -2px rgba(34, 39, 43, 0.06), 0 2px 4px -1px rgba(34, 39, 43, 0.03)',
        'elevated': '0 12px 24px -4px rgba(34, 39, 43, 0.08), 0 4px 8px -2px rgba(34, 39, 43, 0.04)',
        'luxury': '0 10px 25px -5px rgba(21, 25, 28, 0.08), 0 8px 10px -6px rgba(21, 25, 28, 0.04)',
        'luxury-hover': '0 16px 32px -8px rgba(21, 25, 28, 0.12), 0 0 0 1px rgba(65, 74, 80, 0.15)',
      },
      borderRadius: {
        'sm': '6px',
        'md': '8px',
        'lg': '10px',
        'xl': '12px',
        '2xl': '16px',
      },
      maxWidth: {
        'site': '1440px',
        'reading': '760px',
      },
    },
  },
  plugins: [],
};
