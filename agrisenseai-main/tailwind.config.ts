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
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        background: 'var(--bg)',
        foreground: 'var(--text-1)',
        surface: 'var(--surface)',
        border: 'var(--border)',
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--bg)',
        },
        blue: 'var(--blue)',
        gold: 'var(--gold)',
        danger: 'var(--danger)',
        text1: 'var(--text-1)',
        text2: 'var(--text-2)',
        
        // Shadcn fallbacks
        card: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--text-1)',
        },
        popover: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--text-1)',
        },
        primary: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--bg)',
        },
        secondary: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--text-1)',
        },
        muted: {
          DEFAULT: 'var(--surface)',
          foreground: 'var(--text-2)',
        },
        destructive: {
          DEFAULT: 'var(--danger)',
          foreground: 'var(--text-1)',
        },
        input: 'var(--border)',
        ring: 'var(--accent)',
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
