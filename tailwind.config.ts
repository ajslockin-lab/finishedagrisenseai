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
        // The aggressive, ultra-extended grotesque display
        display: ['"Syncopate"', '"Arial Black"', 'Impact', 'sans-serif'],
        // The dense, mechanical data font
        mono: ['"Space Mono"', 'Consolas', 'monospace'],
        // The organic, biological serif
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        // Standard body parsing
        body: ['"Syncopate"', 'sans-serif'], 
      },
      colors: {
        // Cyber-Botany Palette
        abyss: '#030D06',       // Deepest background
        mycelium: '#0A170C',    // Elevated card backgrounds
        bio: {
          DEFAULT: '#39FF14',   // Shock neon green (Status OK/Accent)
          dim: '#165709',       // Deep glow
        },
        solar: {
          DEFAULT: '#FF3300',   // Visceral Warning Red
          dim: '#661400',
        },
        bone: '#F6F4EB',        // Main textual output
        
        // Root overrides so UI components don't break
        background: '#030D06',
        foreground: '#F6F4EB',
        card: {
          DEFAULT: '#0A170C',
          foreground: '#F6F4EB',
        },
        popover: {
          DEFAULT: '#0A170C',
          foreground: '#F6F4EB',
        },
        primary: {
          DEFAULT: '#39FF14',
          foreground: '#030D06',
        },
        secondary: {
          DEFAULT: '#0A170C',
          foreground: '#39FF14',
        },
        muted: {
          DEFAULT: '#165709',
          foreground: '#A3BFA0',
        },
        accent: {
          DEFAULT: '#39FF14',
          foreground: '#030D06',
        },
        destructive: {
          DEFAULT: '#FF3300',
          foreground: '#030D06',
        },
        border: '#165709',     // Thin bio-green borders everywhere
        input: '#0A170C',
        ring: '#39FF14',
      },
      boxShadow: {
        'neon': '10px 10px 0px 0px rgba(57, 255, 20, 0.1)',
        'neon-hover': '20px 20px 0px 0px rgba(57, 255, 20, 0.2)',
        'flare': '10px 10px 0px 0px rgba(255, 51, 0, 0.1)',
      },
      backgroundImage: {
         'mesh-glow': 'radial-gradient(circle at 50% 50%, rgba(57, 255, 20, 0.1), transparent 60%)',
      },
      borderRadius: {
        lg: '0px', // Complete sharp corners
        md: '0px',
        sm: '0px',
      },
      borderWidth: {
         '0.5': '0.5px', // Hairline precise UI
      },
      keyframes: {
        'mesh-drift': {
          '0%': { transform: 'translate(0%, 0%) scale(1)' },
          '33%': { transform: 'translate(5%, -5%) scale(1.1)' },
          '66%': { transform: 'translate(-5%, 2%) scale(0.95)' },
          '100%': { transform: 'translate(0%, 0%) scale(1)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        'glitch': {
          '0%, 100%': { opacity: '1', transform: 'translate(0)' },
          '10%': { opacity: '0.8', transform: 'translate(-2px, 1px)' },
          '20%': { opacity: '1', transform: 'translate(2px, -1px)' },
          '30%': { opacity: '0', transform: 'translate(0)' },
          '40%': { opacity: '1', transform: 'translate(-1px, 2px)' },
        }
      },
      animation: {
        'mesh-drift': 'mesh-drift 20s ease-in-out infinite alternate',
        'scanline': 'scanline 4s linear infinite',
        'glitch': 'glitch 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
