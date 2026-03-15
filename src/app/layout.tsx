import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Trendlo',
    default: 'Trendlo — Trending Products Delivered',
  },
  description:
    'Discover the best trending gadgets and lifestyle products. Fast delivery across India. Shop Trendlo today.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_STORE_URL ?? 'https://trendlo.me'
  ),
  openGraph: {
    type: 'website',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href={process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''}
        />
        <link rel="preconnect" href="https://img.cjdropshipping.com" />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen antialiased overflow-x-hidden`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}