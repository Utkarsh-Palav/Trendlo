/**
 * What it does: Verifies Razorpay payment signature, marks order paid,
 *               places CJ order, sends confirmation email
 * What it expects: POST { razorpay_order_id, razorpay_payment_id,
 *                         razorpay_signature, orderId }
 * What it returns: { success: true, orderNumber } or { error }
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { verifyPaymentSignature } from '@/lib/razorpay/verify'
import { createCJOrder } from '@/lib/cj/orders'
import { sendOrderConfirmation } from '@/lib/resend/client'
import type { Order } from '@/types'

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  orderId: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = parsed.data

    // Step 1 — Verify signature FIRST
    const valid = verifyPaymentSignature({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    })

    if (!valid) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Step 2 — Fetch order
    const { data: orderData, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (fetchError || !orderData) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    const order = orderData as Order

    // Step 3 — Mark as paid
    await supabase
      .from('orders')
      .update({
        payment_status: 'paid',
        razorpay_payment_id,
      })
      .eq('id', orderId)

    // Step 4 — Upsert customer
    const { data: customer } = await supabase
      .from('customers')
      .upsert({
        name: order.shipping_name,
        email: order.shipping_email,
        phone: order.shipping_phone,
      }, { onConflict: 'email' })
      .select('id')
      .single()

    if (customer) {
      await supabase
        .from('orders')
        .update({ customer_id: customer.id })
        .eq('id', orderId)
    }

    // Step 5 — Place CJ order (non-blocking failure)
    try {
      const items = order.items as Array<{ variantId: string; qty: number }>
      const cjResult = await createCJOrder({
        orderNumber: order.order_number,
        shippingName: order.shipping_name,
        shippingPhone: order.shipping_phone,
        shippingAddress: order.shipping_address,
        shippingCity: order.shipping_city,
        shippingState: order.shipping_state,
        shippingZip: order.shipping_pincode,
        shippingCountryCode: 'IN',
        products: items.map(i => ({ vid: i.variantId, quantity: i.qty })),
      })

      await supabase
        .from('orders')
        .update({
          cj_order_id: cjResult.orderId,
          fulfillment_status: 'processing',
        })
        .eq('id', orderId)
    } catch (cjErr) {
      console.error('CJ order placement failed (order still paid):', cjErr)
    }

    // Step 6 — Increment discount code uses
    if (order.discount_code) {
      await supabase.rpc('increment_discount_uses', { code_text: order.discount_code })
    }

    // Step 7 — Increment sold_count on products
    try {
      const items = order.items as Array<{ productId: string; qty: number }>
      for (const item of items) {
        await supabase.rpc('increment_sold_count', {
          product_id: item.productId,
          qty: item.qty,
        })
      }
    } catch {
      // non-critical
    }

    // Step 8 — Send confirmation email
    const updatedOrder = { ...order, razorpay_payment_id, payment_status: 'paid' }
    await sendOrderConfirmation(updatedOrder as Order)

    return NextResponse.json({ success: true, orderNumber: order.order_number })
  } catch (err) {
    console.error('POST /api/payments/verify error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}