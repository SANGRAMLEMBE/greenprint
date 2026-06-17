import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // AA-contrast-checked palette against white/near-white backgrounds.
        leaf: {
          DEFAULT: '#1b7a43',
          dark: '#10532d',
          light: '#2ecc71',
          50: '#edfaf1',
          100: '#d3f3dd',
          600: '#1b7a43',
          700: '#156336',
        },
        coal: { DEFAULT: '#1f2933', light: '#3e4c59' },
        ember: '#b23a2e',
        sand: '#faf9f6',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(16, 83, 45, 0.04), 0 8px 24px rgba(16, 83, 45, 0.06)',
        glow: '0 0 0 1px rgba(27, 122, 67, 0.1), 0 8px 30px rgba(27, 122, 67, 0.12)',
        card: '0 2px 8px rgba(31, 41, 51, 0.04), 0 12px 32px rgba(31, 41, 51, 0.05)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.95)', opacity: '0.5' },
          '70%': { transform: 'scale(1.1)', opacity: '0' },
          '100%': { transform: 'scale(1.1)', opacity: '0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out both',
        'slide-up': 'slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        float: 'float 4s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
export default config;
