import './globals.css';
import { Inter } from 'next/font/google';
import { Analytics } from "@vercel/analytics/react";
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Metadata } from 'next';
import { ReactElement } from 'react';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Discord Clips',
    template: '%s | Discord Clips'
  },
  description: 'Share your gaming moments with your Discord community. Easy sharing, instant playback.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://discord-clips.vercel.app'),
  keywords: ['discord', 'clips', 'gaming', 'video sharing', 'gaming moments'],
  authors: [{ name: 'Discord Clips' }],
  creator: 'Discord Clips',
  openGraph: {
    title: 'Discord Clips',
    description: 'Share your gaming moments with your Discord community. Easy sharing, instant playback.',
    url: '/',
    siteName: 'Discord Clips',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Discord Clips',
    description: 'Share your gaming moments with your Discord community. Easy sharing, instant playback.',
  },
  icons: {
    icon: '/favicon.ico'
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): ReactElement {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen flex flex-col bg-[#FFFFFF] dark:bg-[#0F0F0F] text-[#0F0F0F] dark:text-[#FFFFFF]">
        <Header />
        <div className="flex-grow">
          <div className="max-w-[1280px] mx-auto px-4 py-8">
            <main>
              {children}
            </main>
          </div>
        </div>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
