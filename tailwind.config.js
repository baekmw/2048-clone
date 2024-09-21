/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideRight: {
          from: { left: '0px' },
          to: { left: '10px' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out forwards',
        fadeOut: 'fadeOut 0.5s ease-in-out forwards',
      },
    },
  },
  plugins: [],
};
