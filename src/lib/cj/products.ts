import { cj } from './client'
import { createClient } from '@supabase/supabase-js'
import { generateSlug } from '@/utils/slug'
import type { Product } from '@/types'

interface CJProductRaw {
  pid: string
  productNameEn: string
  sellPrice: number
  productImageSet: Array<{ imageUrl: string }>
  productImage?: string
}

interface CJVariantRaw {
  vid: string
  variantNameEn: string
  variantSellPrice: number
}

export async function searchProducts(
  keyword: string,
  page = 1
): Promise<CJProductRaw[]> {
  const data = await cj.request<{ list: CJProductRaw[] }>(
    `/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=${page}&pageSize=20`
  )
  return data.list ?? []
}

export async function getProductById(pid: string): Promise<CJProductRaw> {
  return cj.request<CJProductRaw>(`/product/query?pid=${pid}`)
}

export async function getVariants(pid: string): Promise<CJVariantRaw[]> {
  const data = await cj.request<{ list: CJVariantRaw[] }>(
    `/product/variant?pid=${pid}`
  )
  return data.list ?? []
}

export async function importProductToDB(
  cjProductId: string
): Promise<Product> {
  const [product, variants] = await Promise.all([
    getProductById(cjProductId),
    getVariants(cjProductId),
  ])

  const slug = generateSlug(product.productNameEn)
  const costPrice = product.sellPrice
  const sellPrice = Math.round(costPrice * 3)

  const images = (product.productImageSet ?? []).map((img, i) => ({
    url: img.imageUrl,
    alt: product.productNameEn,
    position: i,
  }))

  if (images.length === 0 && product.productImage) {
    images.push({ url: product.productImage, alt: product.productNameEn, position: 0 })
  }

  const mappedVariants = variants.map(v => ({
    id: v.vid,
    cj_variant_id: v.vid,
    name: v.variantNameEn,
    price: Math.round(v.variantSellPrice * 3),
  }))

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data, error } = await supabase
    .from('products')
    .insert({
      name: product.productNameEn,
      slug,
      price: sellPrice,
      cost_price: costPrice,
      cj_product_id: product.pid,
      cj_variant_id: variants[0]?.vid ?? '',
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