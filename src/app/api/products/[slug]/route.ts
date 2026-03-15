/**
 * What it does: Returns a single product by slug
 * What it expects: GET /api/products/[slug]
 * What it returns: { product: Product } or { error }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('slug', slug)
            .eq('active', true)
            .single()

        if (error || !data) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        return NextResponse.json({ product: data })
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}