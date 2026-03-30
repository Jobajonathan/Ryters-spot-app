import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import WhatsAppWidget from '@/components/WhatsAppWidget'
import { createClient } from '@supabase/supabase-js'

async function getSEO() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data } = await supabase.from('site_content').select('key, value').in('section', ['seo'])
    const c: Record<string, string> = {}
    data?.forEach(r => { if (r.key) c[r.key] = r.value || '' })
    return c
  } catch { return {} }
}

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSEO()
  const title = seo.seo_title || 'Ryters Spot — Research, Writing & Digital Consultancy'
  const description = seo.seo_description || 'Ryters Spot delivers specialist writing, research, digital transformation and EdTech consultancy to organisations across Africa, the UK, Europe and North America.'
  const ogImage = seo.seo_og_image || ''
  const keywords = seo.seo_keywords || 'academic writing, dissertation help, digital transformation, edtech, Nigeria, UK, Africa'

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url: 'https://theryters.com',
      siteName: 'Ryters Spot',
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
      type: 'website',
      locale: 'en_GB',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    alternates: { canonical: 'https://theryters.com' },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/favicon.ico' },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const seo = await getSEO()
  const ga4Id = seo.ga4_measurement_id?.trim() || ''

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Ryters Spot',
    url: 'https://theryters.com',
    logo: 'https://theryters.com/images/logo.png',
    description: 'Specialist writing, research, digital transformation and EdTech consultancy services.',
    address: { '@type': 'PostalAddress', addressLocality: 'Abuja', addressCountry: 'NG' },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-706-205-7116',
      email: 'hello@theryters.com',
      contactType: 'customer service',
      areaServed: ['NG', 'GB', 'US', 'CA', 'DE', 'FR', 'NL', 'IE', 'GH', 'KE', 'ZA'],
      availableLanguage: 'English',
    },
    serviceArea: ['Nigeria', 'United Kingdom', 'United States', 'Canada', 'Europe', 'Africa'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Consultancy Services',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Academic Writing & Research' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Digital Transformation & AI Automation' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'EdTech Services' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Product Management' } },
      ],
    },
  }

  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
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
