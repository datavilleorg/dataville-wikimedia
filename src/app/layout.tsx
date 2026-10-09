import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dataville — Wikipedia Knowledge Base Tracker',
  description: 'Build with Wikimedia data through Dataville: a company knowledge-base tracker using live, source-linked Wikipedia data from the Dataville API.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
