import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import WagmiProvider from './WagmiProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shezmu App',
  description: 'The Altar of Shezmu Awaits',
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
      <WagmiProvider>
        <body className={inter.className}>{children}</body>
      </WagmiProvider>
    </html>
  )
}
