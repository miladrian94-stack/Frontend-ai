import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - AI Music Generation Platform`,
    template: `%s | ${siteConfig.name}`,
  },
  description: 'Transform your words into professional songs with AI. Create studio-quality music from lyrics, voice, or audio files.',
  keywords: [
    'AI music generator',
    'text to song',
    'AI singer',
    'create music online',
    'AI music production',
    'song creator',
    'music AI tool',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - AI Music Generation Platform`,
    description: 'Transform your words into professional songs with AI.',
    images: [
      {
        url: '/og-home.jpg',
        width: 1200,
        height: 630,
        alt: 'Melody AI Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} - AI Music Generation`,
    description: 'Create professional songs with AI',
    images: ['/og-home.jpg'],
    creator: '@melodyai',
  },
};
