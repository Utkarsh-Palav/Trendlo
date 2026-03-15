/**
 * What it does: Returns all discount codes for admin dashboard
 * What it expects: GET (no params)
 * What it returns: { codes: DiscountCode[] }
 */

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data, error } = await supabase
            .from('discount_codes')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error

        return NextResponse.json({ codes: data ?? [] })
    } catch {
        return NextResponse.json({ codes: [] })
    }
}