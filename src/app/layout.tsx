import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ryters Spot — Research, Digital Transformation, Ed-Tech and Product Management',
  description: 'Ryters Spot delivers specialist research, digital transformation, Ed-Tech and product management services to clients across the UK, Europe, North America and beyond.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
