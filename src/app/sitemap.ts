import { MetadataRoute } from 'next'
import { createClient } from '@supabase/supabase-js'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_STORE_URL ?? 'https://trendlo.me'

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/products`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
        { url: `${baseUrl}/track`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    ]

    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data: products } = await supabase
            .from('products')
            .select('slug, updated_at')
            .eq('active', true)

        const productPages: MetadataRoute.Sitemap = (products ?? []).map(p => ({
            url: `${baseUrl}/products/${p.slug}`,
            lastModified: new Date(p.updated_at),
            changeFrequency: 'weekly',
            priority: 0.8,
        }))

        return [...staticPages, ...productPages]
    } catch {
        return staticPages
    }
}
