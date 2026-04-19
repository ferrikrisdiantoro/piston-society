import type { Metadata } from 'next'
import { Outfit, Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { createClient } from '@/lib/supabase/server'

const outfit = Outfit({
  variable: '--font-outfit',
  subsets: ['latin'],
  display: 'swap',
})

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const baseMetadata = {
  title: {
    default: 'Piston Society | Car Subscription & Long-Term Rental Australia',
    template: '%s | Piston Society',
  },
  description:
    'Flexible car subscriptions in Australia. All-inclusive — insurance, registration, servicing & roadside assist included. No lock-in contracts.',
  keywords: [
    'car subscription Australia',
    'long-term car rental',
    'car rental Sydney',
    'car rental Melbourne',
    'all inclusive car subscription',
    'no lock in car rental',
    'Piston Society',
  ],
  authors: [{ name: 'Piston Society' }],
  creator: 'Piston Society',
  publisher: 'Piston Society',
  metadataBase: new URL('https://www.pistonsociety.com.au'),
  openGraph: {
    type: 'website' as const,
    locale: 'en_AU',
    url: 'https://www.pistonsociety.com.au',
    siteName: 'Piston Society',
    title: 'Piston Society | Car Subscription & Long-Term Rental Australia',
    description:
      'Flexible car subscriptions in Australia. All-inclusive — insurance, registration, servicing & roadside assist included.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Piston Society - Car Subscription Australia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image' as const,
    title: 'Piston Society | Car Subscription Australia',
    description: 'Flexible car subscriptions in Australia. All-inclusive.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1 as const,
      'max-image-preview': 'large' as const,
      'max-snippet': -1 as const,
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  try {
    const supabase = await createClient()
    const { data } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'logo_url')
      .single()
    const logoUrl = data?.value
    if (logoUrl) {
      return { ...baseMetadata, icons: { icon: logoUrl, apple: logoUrl } }
    }
  } catch {
    // fall through to default
  }
  return baseMetadata
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en-AU"
      className={`${outfit.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-[#1E293B]">
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  )
}
