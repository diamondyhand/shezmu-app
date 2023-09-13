import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import WagmiProvider from './WagmiProvider'
import Head from 'next/head'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shezmu App',
  description: 'The Altar or Shezmu Awaits',
  icons: {
    icon: { url: '/image/logo_without_text.png' }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <title>Shezmu App</title>
        <meta name='Shezmu App' content='The Altar or Shezmu Awaits' />
      </Head>

      <WagmiProvider>
        <body className={inter.className}>{children}</body>
      </WagmiProvider>
    </html>
  )
}
