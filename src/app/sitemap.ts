import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = 'https://theryters.com'
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/services/ai-automation`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services/writing`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services/edtech`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/services/product-management`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/get-started`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data: posts } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    const blogRoutes: MetadataRoute.Sitemap = (posts || []).map(post => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.updated_at || post.published_at || now),
      changeFrequency: 'monthly',
      priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes]
  } catch {
    return staticRoutes
  }
}
