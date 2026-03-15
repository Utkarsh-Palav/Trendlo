/**
 * What it does: Validates a discount code against the database
 * What it expects: POST { code: string, subtotal: number }
 * What it returns: { valid: boolean, discountAmount?: number, message: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const schema = z.object({
  code: z.string().min(1),
  subtotal: z.number().positive(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ valid: false, message: 'Invalid request' }, { status: 200 })
    }

    const { code, subtotal } = parsed.data

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .ilike('code', code)
      .eq('active', true)
      .single()

    if (error || !data) {
      return NextResponse.json({ valid: false, message: 'Invalid or expired code' })
    }

    // Check max uses
    if (data.max_uses !== null && data.uses >= data.max_uses) {
      return NextResponse.json({ valid: false, message: 'This code has reached its usage limit' })
    }

    // Check expiry
    if (data.expires_at && new Date(data.expires_at) < new Date()) {
      return NextResponse.json({ valid: false, message: 'This code has expired' })
    }

    // Check min order
    if (subtotal < data.min_order) {
      return NextResponse.json({
        valid: false,
        message: `Minimum order of ₹${data.min_order} required for this code`,
      })
    }

    // Calculate discount
    let discountAmount = 0
    if (data.type === 'percent') {
      discountAmount = Math.round((subtotal * data.value) / 100)
    } else {
      discountAmount = Math.min(data.value, subtotal)
    }

    return NextResponse.json({
      valid: true,
      type: data.type,
      value: data.value,
      discountAmount,
      message: `₹${discountAmount} off`,
    })
  } catch {
    return NextResponse.json({ valid: false, message: 'Something went wrong' })
  }
}