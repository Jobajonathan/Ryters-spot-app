import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { createClient } from '@supabase/supabase-js'

async function getAnalyticsId() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase
      .from('site_content')
      .select('value')
      .eq('key', 'ga4_measurement_id')
      .maybeSingle()
    return data?.value?.trim() || ''
  } catch {
    return ''
  }
}

export const metadata: Metadata = {
  title: 'Ryters Spot - Research and Product Development Company',
  description: 'Ryters Spot is an R&PD company helping organisations turn research into products, systems and serious deliverables.',
  keywords: ['research and product development', 'R&PD', 'product development', 'research intelligence', 'knowledge systems', 'Nigeria', 'Africa'],
  openGraph: {
    title: 'Ryters Spot - Research and Product Development Company',
    description: 'Research intelligence, product development and knowledge systems for serious teams.',
    url: 'https://theryters.com',
    siteName: 'Ryters Spot',
    type: 'website',
    locale: 'en_GB',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ryters Spot - Research and Product Development Company',
    description: 'Research intelligence, product development and knowledge systems for serious teams.',
  },
  alternates: { canonical: 'https://theryters.com' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/favicon.ico' },
  verification: { other: { 'msvalidate.01': '8D04BA47665965B6CF63E776C0AD32E6' } },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const ga4Id = await getAnalyticsId()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ryters Spot',
    url: 'https://theryters.com',
    logo: 'https://theryters.com/images/logo.png',
    description: 'Research and Product Development company helping organisations turn research into products, systems and serious deliverables.',
    address: { '@type': 'PostalAddress', addressLocality: 'Abuja', addressCountry: 'NG' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-706-205-7116',
      email: 'hello@theryters.com',
      contactType: 'customer support',
      areaServed: ['NG', 'GB', 'US', 'CA', 'DE', 'FR', 'NL', 'IE', 'GH', 'KE', 'ZA'],
      availableLanguage: 'English',
    },
    knowsAbout: ['Research Intelligence', 'Product Development', 'Knowledge Systems', 'Learning Product Development', 'Research Automation'],
  }

  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Lato:ital,wght@0,300;0,400;0,700;0,900;1,400&display=swap" rel="stylesheet" />
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('ryters-theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body>
        {children}
        <WhatsAppWidget />
        {ga4Id && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive" dangerouslySetInnerHTML={{ __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga4Id}');` }} />
          </>
        )}
      </body>
    </html>
  )
}
