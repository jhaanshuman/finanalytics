/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'fin-dark': '#0a0a0f',
        'fin-darker': '#050508',
        'fin-panel': '#111118',
        'fin-border': '#1a1a2e',
        'fin-accent': '#00d4ff',
        'fin-accent-glow': '#00d4ff33',
        'fin-purple': '#7c3aed',
        'fin-purple-glow': '#7c3aed33',
        'fin-emerald': '#10b981',
        'fin-rose': '#f43f5e',
        'fin-amber': '#f59e0b',
        'fin-glass': 'rgba(17, 17, 24, 0.85)',
        'fin-glass-light': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        'fin': ['Inter', 'SF Pro Display', 'system-ui', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 212, 255, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'fin-gradient': 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #f43f5e 100%)',
        'fin-dark-gradient': 'linear-gradient(180deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
