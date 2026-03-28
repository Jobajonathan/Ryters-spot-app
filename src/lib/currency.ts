export type Currency = 'NGN' | 'GBP' | 'EUR' | 'USD'

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: '₦', GBP: '£', EUR: '€', USD: '$',
}

const EUR_COUNTRIES = new Set([
  'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Austria',
  'Portugal', 'Finland', 'Ireland', 'Luxembourg', 'Malta', 'Cyprus',
  'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Greece', 'Croatia',
  'Bulgaria', 'Romania', 'Hungary', 'Poland', 'Czech Republic', 'Denmark',
  'Sweden', 'Norway', 'Switzerland',
])

export function currencyFromCountry(country: string): Currency {
  if (country === 'Nigeria') return 'NGN'
  if (country === 'United Kingdom') return 'GBP'
  if (EUR_COUNTRIES.has(country)) return 'EUR'
  return 'USD'
}

export const BUDGET_RANGES: Record<Currency, string[]> = {
  GBP: ['Under £500', '£500 – £1,000', '£1,000 – £2,500', '£2,500 – £5,000', '£5,000 – £10,000', 'Over £10,000', 'To be discussed'],
  EUR: ['Under €500', '€500 – €1,000', '€1,000 – €2,500', '€2,500 – €5,000', '€5,000 – €10,000', 'Over €10,000', 'To be discussed'],
  USD: ['Under $500', '$500 – $1,000', '$1,000 – $2,500', '$2,500 – $5,000', '$5,000 – $10,000', 'Over $10,000', 'To be discussed'],
  NGN: ['Under ₦50,000', '₦50,000 – ₦200,000', '₦200,000 – ₦500,000', '₦500,000 – ₦1,000,000', '₦1,000,000 – ₦2,000,000', 'Over ₦2,000,000', 'To be discussed'],
}

export async function detectCurrency(): Promise<Currency> {
  try {
    const cached = localStorage.getItem('rs_currency')
    if (cached && ['NGN', 'GBP', 'EUR', 'USD'].includes(cached)) return cached as Currency
  } catch { /* localStorage unavailable */ }
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)
    const res = await fetch('https://ipapi.co/json/', { signal: controller.signal })
    clearTimeout(timeout)
    const data = await res.json()
    const currency = currencyFromCountry(data.country_name || '')
    try { localStorage.setItem('rs_currency', currency) } catch {}
    return currency
  } catch {
    return 'GBP'
  }
}
