import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carbon Companion — understand, track, reduce',
  description:
    'A personal carbon companion that turns a few simple inputs into an honest footprint estimate and a ranked, personalised action plan.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-coal antialiased">
        {/* Skip link: first focusable element, for keyboard & screen-reader users. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-leaf focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
