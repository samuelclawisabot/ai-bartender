/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        noir: {
          900: '#0a0a0f',
          800: '#121218',
          700: '#1a1a25',
          600: '#232330',
        },
        neon: {
          cyan: '#00f5ff',
          magenta: '#ff00ff',
          purple: '#bf00ff',
          lime: '#ccff00',
        }
      },
    },
  },
  plugins: [],
}
