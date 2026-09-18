/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        casino: {
          dark: '#050508',
          card: '#0c0d14',
          surface: '#121420',
          border: 'rgba(255, 255, 255, 0.08)',
          gold: '#ffd700',
          amber: '#f59e0b',
          crimson: '#ef4444',
          emerald: '#10b981',
          neonCyan: '#06b6d4',
          neonViolet: '#8b5cf6',
          neonPink: '#ec4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2.5s infinite linear',
      },
      keyframes: {
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(255, 215, 0, 0.2)' },
          '100%': { boxShadow: '0 0 35px rgba(255, 215, 0, 0.6)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        }
      },
      boxShadow: {
        'luxury': '0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 215, 0, 0.08)',
        'luxury-glow': '0 0 25px rgba(245, 158, 11, 0.35)',
        'danger-glow': '0 0 30px rgba(239, 68, 68, 0.4)',
        'card': '0 15px 35px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)',
      }
    },
  },
  plugins: [],
}
