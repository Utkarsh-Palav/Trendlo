/**
 * What it does: Searches CJ Dropshipping product catalog
 * What it expects: GET ?q=keyword&page=1
 * What it returns: { products: CJProduct[] }
 */

import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/cj/products'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') ?? ''
    const page = parseInt(searchParams.get('page') ?? '1')

    if (!q.trim()) {
      return NextResponse.json({ products: [] })
    }

    const products = await searchProducts(q, page)
    console.log(products)
    return NextResponse.json({ products })
  } catch (err) {
    console.error('CJ products search error:', err)
    return NextResponse.json(
      { products: [], error: err instanceof Error ? err.message : 'Search failed' },
      { status: 500 }
    )
  }
}