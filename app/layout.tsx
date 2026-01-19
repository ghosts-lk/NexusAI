import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '@/components/ui/toaster'
import { CookieConsent } from '@/components/cookie-consent'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: 'NexusAI - AI-Powered Productivity Workspace',
    template: '%s | NexusAI'
  },
  description: 'The intelligent workspace that helps teams work smarter. AI-powered documents, tasks, and collaboration tools that boost productivity 10x.',
  keywords: ['productivity', 'ai', 'workspace', 'collaboration', 'saas', 'project management', 'documents', 'tasks', 'team'],
  authors: [{ name: 'NexusAI' }],
  creator: 'NexusAI',
  publisher: 'NexusAI',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://nexusai.app'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NexusAI',
    title: 'NexusAI - AI-Powered Productivity Workspace',
    description: 'The intelligent workspace that helps teams work smarter. AI-powered documents, tasks, and collaboration tools.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'NexusAI - AI-Powered Productivity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NexusAI - AI-Powered Productivity Workspace',
    description: 'The intelligent workspace that helps teams work smarter.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {children}
        <Toaster />
        <CookieConsent />
        {/* Free Vercel analytics - no cost */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
