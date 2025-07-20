import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ToastProvider } from '@/components/providers/ToastProvider';
import { Header } from '@/components/ui/Header';
import { BackgroundMusic } from '@/components/ui/BackgroundMusic';
import { RainbowStarBackground } from '@/components/ui/RainbowStarBackground';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'JokeAI Platform - AI-Powered Joke Generator',
  description: 'Generate hilarious jokes with AI. Choose from different categories and get personalized humor powered by advanced language models.',
  keywords: 'AI jokes, joke generator, humor, comedy, artificial intelligence',
  authors: [{ name: 'JokeAI Team' }],
  openGraph: {
    title: 'JokeAI Platform - AI-Powered Joke Generator',
    description: 'Generate hilarious jokes with AI. Choose from different categories and get personalized humor.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JokeAI Platform - AI-Powered Joke Generator',
    description: 'Generate hilarious jokes with AI. Choose from different categories and get personalized humor.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <RainbowStarBackground />
          <Header />
          <main>{children}</main>
          <BackgroundMusic />
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}