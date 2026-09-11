/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fdfcf9',
          100: '#faf9f5',
          200: '#f5f3ec',
          300: '#ebe7dc',
          400: '#ded8c8',
          500: '#c5bda9',
        },
        charcoal: {
          900: '#141413',
          800: '#1c1b18',
          700: '#2c2b28',
          600: '#42413d',
        },
        bureaucrat: {
          red: '#991b1b',
          amber: '#b45309',
          green: '#15803d',
          orange: '#c2410c',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'spin-fast': 'spin 0.25s linear infinite',
        'spin-slow': 'spin 2s linear infinite',
        'wiggle': 'wiggle 0.5s ease-in-out infinite',
        'glitch': 'glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        }
      }
    },
  },
  plugins: [],
}
