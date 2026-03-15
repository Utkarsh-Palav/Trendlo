/**
 * What it does: Creates a Razorpay order and saves a pending order to Supabase
 * What it expects: POST { items, customer, shippingAddress, discountCode?,
 *                         utmSource?, utmMedium?, utmCampaign?, refCode? }
 * What it returns: { razorpayOrderId, amount, orderId }
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import Razorpay from 'razorpay'

const schema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string(),
    name: z.string(),
    price: z.number().positive(),
    qty: z.number().int().min(1).max(10),
    image: z.string().optional(),
    variantName: z.string().optional(),
  })).min(1),
  customer: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().regex(/^[6-9]\d{9}$/),
  }),
  shippingAddress: z.object({
    address: z.string().min(10),
    city: z.string().min(2),
    state: z.string().min(1),
    pincode: z.string().regex(/^\d{6}$/),
  }),
  discountCode: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  refCode: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const {
      items, customer, shippingAddress,
      discountCode, utmSource, utmMedium, utmCampaign, refCode,
    } = parsed.data

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Calculate subtotal
    const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0)
    let discountAmt = 0

    // Validate discount code
    if (discountCode) {
      const { data: code } = await supabase
        .from('discount_codes')
        .select('*')
        .ilike('code', discountCode)
        .eq('active', true)
        .single()

      if (code) {
        const notExpired = !code.expires_at || new Date(code.expires_at) > new Date()
        const underLimit = code.max_uses === null || code.uses < code.max_uses
        const meetsMin = subtotal >= code.min_order

        if (notExpired && underLimit && meetsMin) {
          discountAmt = code.type === 'percent'
            ? Math.round((subtotal * code.value) / 100)
            : Math.min(code.value, subtotal)
        }
      }
    }

    const total = Math.max(subtotal - discountAmt, 0)

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    const receipt = `TRD-${Date.now()}`
    const rzpOrder = await razorpay.orders.create({
      amount: Math.round(total * 100),
      currency: 'INR',
      receipt,
    })

    // Save pending order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        order_number: receipt,
        razorpay_order_id: rzpOrder.id,
        items,
        subtotal,
        discount_amt: discountAmt,
        total_paid: total,
        discount_code: discountCode ?? null,
        utm_source: utmSource ?? null,
        utm_medium: utmMedium ?? null,
        utm_campaign: utmCampaign ?? null,
        ref_code: refCode ?? null,
        payment_status: 'pending',
        fulfillment_status: 'unfulfilled',
        shipping_name: customer.name,
        shipping_email: customer.email,
        shipping_phone: customer.phone,
        shipping_address: shippingAddress.address,
        shipping_city: shippingAddress.city,
        shipping_state: shippingAddress.state,
        shipping_pincode: shippingAddress.pincode,
      })
      .select('id')
      .single()

    if (error) throw error

    return NextResponse.json({
      razorpayOrderId: rzpOrder.id,
      amount: rzpOrder.amount,
      orderId: order.id,
    })
  } catch (err) {
    console.error('POST /api/orders error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderNumber = searchParams.get('orderNumber')
    const email = searchParams.get('email')

    if (!orderNumber || !email) {
      return NextResponse.json({ order: null })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .eq('shipping_email', email)
      .single()

    return NextResponse.json({ order: data ?? null })
  } catch {
    return NextResponse.json({ order: null })
  }
}