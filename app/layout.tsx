import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Melody AI — منصة توليد الأغاني بالذكاء الاصطناعي',
  description: 'منصة SaaS عالمية لتوليد الأغاني والمحتوى الصوتي بالذكاء الاصطناعي',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
