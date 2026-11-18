/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#060608',
          900: '#0A0A0D',
          850: '#0F0F13',
          800: '#14141A',
          700: '#1D1D26',
          600: '#282834',
        },
        lime: {
          DEFAULT: '#D4FF00',
          hover: '#C2EB00',
          muted: 'rgba(212, 255, 0, 0.12)',
        },
        spotify: '#1DB954',
        youtube: '#FF0033',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
        'elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
        'lime-glow': '0 0 20px rgba(212, 255, 0, 0.25)',
      }
    },
  },
  plugins: [],
}
