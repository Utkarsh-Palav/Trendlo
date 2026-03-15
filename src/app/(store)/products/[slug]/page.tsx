import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProductBySlug, getAllProducts } from '@/actions/product.actions'
import { ProductImages } from '@/components/product/ProductImages'
import { ProductInfo } from '@/components/product/ProductInfo'



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product not found' }

  const images = product.images as Array<{ url: string }>

  return {
    title: product.seo_title ?? product.name,
    description: product.seo_description ?? product.short_desc ?? product.name,
    openGraph: {
      images: images?.[0]?.url ? [{ url: images[0].url }] : [],
    },
  }
}

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map(p => ({ slug: p.slug }))
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug)
  if (!product) notFound()

  const images = product.images as Array<{ url: string; alt?: string }>

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: images.map(i => i.url),
    description: product.description ?? product.short_desc,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#F8F7F4]">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ProductImages images={images} productName={product.name} />
            <div className="lg:sticky lg:top-24 lg:self-start">
              <ProductInfo product={product} />
            </div>
          </div>

          {/* You may also like */}
          <div className="mt-16 bg-[#0F0F0F] rounded-2xl p-8">
            <h2 className="text-white text-xl font-semibold mb-2">You may also like</h2>
            <p className="text-[#9CA3AF] text-sm">More trending products</p>
          </div>
        </div>
      </div>
    </>
  )
}