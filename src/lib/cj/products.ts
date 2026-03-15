import { createClient } from '@supabase/supabase-js'
import { generateSlug } from '@/utils/slug'
import { getTokenForProducts } from './client'
import type { Product } from '@/types'

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0/v1'

interface CJProductRaw {
  id: string
  nameEn: string
  sellPrice: string
  bigImage: string
  sku: string
}

interface CJVariantFromDetail {
  vid: string
  variantNameEn: string
  variantSellPrice: number | string
  variantImage?: string
  variantKey?: string
  variantKeyEn?: string
}

interface CJProductDetail {
  pid: string
  productNameEn: string
  sellPrice: number | string
  // productImage is a JSON STRING containing an array of URLs
  productImage: string
  // productImageSet is a single string URL (the main/cover image)
  productImageSet: string
  // bigImage is another single URL fallback
  bigImage?: string
  description?: string
  productWeight?: number
  // variants come directly in the detail response
  variants?: CJVariantFromDetail[]
}

export interface CJSearchProduct {
  pid: string
  productNameEn: string
  sellPrice: number
  productImage: string
}

function parseCJPrice(price: number | string): number {
  if (typeof price === 'number') return price
  if (typeof price === 'string') {
    // Handle range like "8.79-9.50" — take the first value
    const first = price.split('-')[0]
    const parsed = parseFloat(first)
    return isNaN(parsed) ? 0 : parsed
  }
  return 0
}

export async function searchProducts(
  keyword: string,
  page = 1
): Promise<CJSearchProduct[]> {
  try {
    const token = await getTokenForProducts()

    const res = await fetch(
      `${CJ_BASE}/product/listV2?keyWord=${encodeURIComponent(keyword)}&page=${page}&size=20`,
      {
        method: 'GET',
        headers: {
          'CJ-Access-Token': token,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    const raw = await res.json()

    if (!raw.result) {
      console.error('CJ listV2 error:', raw.code, raw.message)
      return []
    }

    const data = raw.data
    const contentArray = data?.content ?? []

    const allProducts: CJProductRaw[] = []
    for (const contentItem of contentArray) {
      const productList = contentItem?.productList ?? []
      allProducts.push(...productList)
    }

    console.log(`CJ search "${keyword}" returned ${allProducts.length} products`)

    return allProducts.map(p => ({
      pid: p.id,
      productNameEn: p.nameEn,
      sellPrice: parseFloat(p.sellPrice) || 0,
      productImage: p.bigImage,
    }))
  } catch (err) {
    console.error('searchProducts error:', err)
    return []
  }
}

export async function getProductById(pid: string): Promise<CJProductDetail> {
  const token = await getTokenForProducts()
  const res = await fetch(`${CJ_BASE}/product/query?pid=${pid}`, {
    headers: {
      'CJ-Access-Token': token,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
  const raw = await res.json()
  if (!raw.result) throw new Error(`CJ product query failed: ${raw.message}`)
  return raw.data as CJProductDetail
}

export async function getVariants(pid: string): Promise<CJVariantFromDetail[]> {
  try {
    const token = await getTokenForProducts()
    const res = await fetch(`${CJ_BASE}/product/variant?pid=${pid}`, {
      headers: {
        'CJ-Access-Token': token,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    const raw = await res.json()
    if (!raw.result) return []
    const d = raw.data
    if (Array.isArray(d)) return d
    return d?.list ?? []
  } catch {
    return []
  }
}

function parseImageUrls(
  productImage: string,
  productImageSet: string,
  bigImage?: string
): string[] {
  const urls: string[] = []

  // productImage is a JSON string array — parse it
  if (productImage) {
    try {
      const parsed = JSON.parse(productImage)
      if (Array.isArray(parsed)) {
        for (const url of parsed) {
          if (typeof url === 'string' && url.startsWith('http')) {
            urls.push(url)
          }
        }
      }
    } catch {
      // Not JSON — might be a plain URL string
      if (productImage.startsWith('http')) {
        urls.push(productImage)
      }
    }
  }

  // productImageSet is a single string URL — add if not duplicate
  if (productImageSet && typeof productImageSet === 'string' && productImageSet.startsWith('http')) {
    if (!urls.includes(productImageSet)) {
      urls.push(productImageSet)
    }
  }

  // bigImage fallback
  if (bigImage && typeof bigImage === 'string' && bigImage.startsWith('http')) {
    if (!urls.includes(bigImage)) {
      urls.push(bigImage)
    }
  }

  return urls
}

export async function importProductToDB(
  cjProductId: string
): Promise<Product> {
  // Get product detail — variants are already inside it
  const product = await getProductById(cjProductId)

  const slug = generateSlug(product.productNameEn)
  const costPrice = parseCJPrice(product.sellPrice)
  const sellPrice = Math.round(costPrice * 3)

  // Parse all image URLs correctly
  const imageUrls = parseImageUrls(
    product.productImage,
    product.productImageSet,
    product.bigImage
  )

  const images = imageUrls.map((url, i) => ({
    url,
    alt: product.productNameEn,
    position: i,
  }))

  console.log(`Importing "${product.productNameEn}" with ${images.length} images`)
  if (images.length > 0) {
    console.log('First image URL:', images[0].url)
  }

  // Use variants from product detail directly
  // They are already embedded in the product/query response
  const detailVariants = product.variants ?? []

  // If no variants in detail, try separate variant endpoint
  let variants = detailVariants
  if (variants.length === 0) {
    variants = await getVariants(cjProductId)
  }

  const mappedVariants = variants.map(v => ({
    id: v.vid,
    cj_variant_id: v.vid,
    name: v.variantNameEn,
    price: Math.round(parseCJPrice(v.variantSellPrice) * 3),
  }))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check if product with this slug already exists — generate unique slug if so
  const { data: existing } = await supabase
    .from('products')
    .select('id')
    .eq('slug', slug)
    .single()

  const finalSlug = existing
    ? `${slug}-${Date.now()}`
    : slug

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.productNameEn,
      slug: finalSlug,
      description: product.description ?? null,
      price: sellPrice,
      cost_price: costPrice,
      cj_product_id: product.pid,
      cj_variant_id: variants[0]?.vid ?? 'default',
      images,
      variants: mappedVariants,
      active: false,
      featured: false,
      stock: 9999,
      sold_count: 0,
    })
    .select('*')
    .single()

  if (error) throw new Error(`Failed to import product: ${error.message}`)
  return data as Product
}