/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#090B10',
        surface: {
          DEFAULT: '#111520',
          elevated: '#171C2B',
          glass: 'rgba(18, 22, 36, 0.75)',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#7C3AED',
          light: '#A78BFA',
        },
        spotify: '#1DB954',
        youtube: '#FF0033',
        party: {
          pink: '#EC4899',
          purple: '#8B5CF6',
          cyan: '#06B6D4',
          yellow: '#F59E0B',
          glow: 'rgba(236, 72, 153, 0.35)',
        }
      },
      boxShadow: {
        'glow-primary': '0 0 25px rgba(139, 92, 246, 0.35)',
        'glow-party': '0 0 35px rgba(236, 72, 153, 0.45)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.35)',
        'glow-spotify': '0 0 25px rgba(29, 185, 84, 0.35)',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'pulse-glow': 'pulse-glow 2.5s ease-in-out infinite',
        'float-reaction': 'float-up 2s ease-out forwards',
        'equalizer': 'equalizer 1s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.04)' },
        },
        'float-up': {
          '0%': { transform: 'translateY(0) scale(0.8)', opacity: '1' },
          '100%': { transform: 'translateY(-120px) scale(1.4)', opacity: '0' },
        },
        'equalizer': {
          '0%': { height: '15%' },
          '100%': { height: '100%' },
        }
      }
    },
  },
  plugins: [],
}
