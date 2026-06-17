import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

// Self-hosted at build time, so no external request and CSP stays strict.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Greenprint — know your carbon footprint, then cut it',
  description:
    'Turn a few simple answers into an honest, science-backed footprint estimate and a ranked, personalised action plan. Local-first and private by design.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-sand text-coal antialiased font-sans">
        {/* Skip link: first focusable element, for keyboard & screen-reader users. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-leaf focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
