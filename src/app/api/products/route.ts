/**
 * What it does: Returns all active products
 * What it expects: GET (no params required)
 * What it returns: { products: Product[] }
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('active', true)
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ products: data ?? [] })
    } catch {
        return NextResponse.json({ products: [] })
    }
}