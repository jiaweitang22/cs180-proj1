import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Images of the Russian Empire · CS 180 Project 1',
  description: 'Colorizing the Prokudin-Gorskii photo collection with image alignment.',
  openGraph: {
    title: 'Images of the Russian Empire · CS 180 Project 1',
    description: 'Colorizing the Prokudin-Gorskii collection with exhaustive search and image pyramids.',
    images: ['/og.jpg'],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
