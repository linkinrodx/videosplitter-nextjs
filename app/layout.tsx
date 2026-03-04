import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains-mono' })

export const metadata: Metadata = {
  title: 'Video Splitter',
  description: 'Split videos into segments right from your Android device',
  manifest: '/videosplitter-nextjs/manifest.json',
  icons: {
    icon: [
      {
        url: '/videosplitter-nextjs/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/videosplitter-nextjs/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/videosplitter-nextjs/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/videosplitter-nextjs/apple-icon.png',
  },
  other: {
    'google': 'notranslate',
  },
}

export const viewport: Viewport = {
  themeColor: '#1a1a2e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
