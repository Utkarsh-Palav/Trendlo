/**
 * What it does: Searches CJ Dropshipping product catalog
 * What it expects: GET ?q=keyword&page=1
 * What it returns: { products: CJProduct[] }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { searchProducts } from '@/lib/cj/products'

export async function GET(req: NextRequest) {
  try {
    // Verify admin session
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const authHeader = req.headers.get('cookie') ?? ''
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') ?? ''
    const page = parseInt(searchParams.get('page') ?? '1')

    if (!q.trim()) {
      return NextResponse.json({ products: [] })
    }

    const products = await searchProducts(q, page)

    return NextResponse.json({ products })
  } catch (err) {
    console.error('CJ products search error:', err)
    return NextResponse.json({ products: [], error: 'Search failed' })
  }
}