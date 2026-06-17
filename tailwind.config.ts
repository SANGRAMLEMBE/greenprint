import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // AA-contrast-checked palette against white/near-white backgrounds.
        leaf: { DEFAULT: '#1b7a43', dark: '#10532d' },
        coal: '#1f2933',
        ember: '#b23a2e',
      },
    },
  },
  plugins: [],
};
export default config;
