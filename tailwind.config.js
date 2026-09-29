/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FAF8F5',
          100: '#F4EFE6',
          200: '#E7DCB9',
          300: '#D9C694',
          400: '#C7AE67',
          500: '#B8973E', // subtle gold
          600: '#9E7E2C',
          700: '#7B6022',
          800: '#5A461A',
          900: '#3A2D11',
          gold: '#C5A059',
          'gold-light': '#E5D3B3',
          'gold-dark': '#9A7B38',
          noir: '#0F1115',
          'noir-light': '#1A1D24',
          sand: '#F7F5F0',
          stone: '#ECE8DF',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Playfair Display', 'Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 20px 40px -15px rgba(0, 0, 0, 0.08)',
        'gold-glow': '0 0 25px -5px rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
}
