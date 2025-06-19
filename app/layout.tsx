import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Sports Celebrity History Reels - AI-Powered Sports Stories',
  description: 'Discover incredible journeys of sports legends through AI-generated video stories. Watch engaging reels about your favorite athletes.',
  keywords: 'sports, celebrity, history, AI, videos, reels, athletes, legends',
  authors: [{ name: 'Sports Reels Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {children}
        </div>
      </body>
    </html>
  );
}