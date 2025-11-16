
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Profilco Uw Calculator',
  description: 'Window thermal transmittance calculator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  )
}