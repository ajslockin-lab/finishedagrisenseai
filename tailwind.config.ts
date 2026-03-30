import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Lush dark palette — deep forest meets warm earth
        background: '#0C0F0A',
        foreground: '#E8E6E1',
        card: {
          DEFAULT: '#141812',
          foreground: '#E8E6E1',
        },
        popover: {
          DEFAULT: '#141812',
          foreground: '#E8E6E1',
        },
        primary: {
          DEFAULT: '#6EE7A8',   // Warm mint
          foreground: '#0C0F0A',
        },
        secondary: {
          DEFAULT: '#1E241A',
          foreground: '#E8E6E1',
        },
        muted: {
          DEFAULT: '#1A1F16',
          foreground: '#7C8A72',
        },
        accent: {
          DEFAULT: '#D4A854',   // Warm gold/amber
          foreground: '#0C0F0A',
        },
        destructive: {
          DEFAULT: '#EF6461',
          foreground: '#0C0F0A',
        },
        sage: '#8BAA7A',
        amber: '#D4A854',
        border: '#232A1E',
        input: '#1A1F16',
        ring: '#6EE7A8',
        sidebar: {
          DEFAULT: '#0E120B',
          foreground: '#E8E6E1',
          border: '#1E241A',
        },
      },
      boxShadow: {
        'premium': '0 1px 2px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)',
        'glow': '0 0 20px rgba(110, 231, 168, 0.15)',
        'glow-amber': '0 0 20px rgba(212, 168, 84, 0.15)',
        'card-hover': '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(110,231,168,0.1)',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        'live-dot': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.4)', opacity: '0.7' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'live-dot': 'live-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
