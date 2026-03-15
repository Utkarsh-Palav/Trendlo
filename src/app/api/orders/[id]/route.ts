/**
 * What it does: Fetches a single order by ID
 * What it expects: GET /api/orders/[id]
 * What it returns: { order } or { error }
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 })
        }

        return NextResponse.json({ order: data })
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}