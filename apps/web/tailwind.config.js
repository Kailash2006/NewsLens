/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0e14',
          900: '#11151f',
          800: '#1a1f2e',
          700: '#252c3f',
        },
        brand: {
          DEFAULT: '#6366f1',
          soft: '#818cf8',
        },
        // NOTE: bias lean colors are NOT defined here. They're applied as inline
        // styles from `biasColor()` in src/lib/bias.js, since the lean is a runtime
        // value and Tailwind can't generate classes for it. Edit them there.
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'ui-serif', 'serif'],
      },
    },
  },
  plugins: [],
};
