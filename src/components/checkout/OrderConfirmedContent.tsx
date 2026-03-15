'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Package, MapPin, ArrowRight } from 'lucide-react'
import { formatINR } from '@/utils/currency'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { Order } from '@/types'

export default function OrderConfirmedContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderId = searchParams.get('id')

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!orderId) { router.replace('/'); return }
    fetch(`/api/orders/${orderId}`)
      .then(r => r.json())
      .then(data => { setOrder(data.order); setLoading(false) })
      .catch(() => { setLoading(false) })
  }, [orderId, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <LoadingSpinner />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F7F4]">
        <div className="text-center">
          <p className="text-[#111827] font-medium">Order not found</p>
          <Link href="/" className="text-[#FF6B35] text-sm mt-2 block">
            Return to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Dark hero */}
      <div className="bg-[#0F0F0F] py-16 px-4 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle size={64} className="text-[#FF6B35]" strokeWidth={1.5} />
        </div>
        <h1 className="text-white text-3xl font-semibold mb-2">Order Confirmed!</h1>
        <div className="inline-block bg-[#FF6B35] text-white px-4 py-1.5 rounded-full text-sm font-medium mb-3">
          {order.order_number}
        </div>
        <p className="text-[#9CA3AF] text-sm">
          A confirmation email has been sent to{' '}
          <span className="text-white">{order.shipping_email}</span>
        </p>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
        {/* Items */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Package size={18} className="text-[#FF6B35]" />
            <h2 className="text-[#111827] font-semibold">Your items</h2>
          </div>
          <div className="space-y-2">
            {(order.items as unknown as Array<{ name: string; qty: number; price: number }>).map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#374151]">{item.name} × {item.qty}</span>
                <span className="text-[#111827] font-medium">{formatINR(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E5E7EB] mt-3 pt-3 flex justify-between font-semibold">
            <span className="text-[#111827]">Total paid</span>
            <span className="text-[#FF6B35]">{formatINR(order.total_paid)}</span>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <MapPin size={18} className="text-[#FF6B35]" />
            <h2 className="text-[#111827] font-semibold">Delivery address</h2>
          </div>
          <p className="text-[#374151] text-sm leading-relaxed">
            {order.shipping_name}<br />
            {order.shipping_address}<br />
            {order.shipping_city}, {order.shipping_state} – {order.shipping_pincode}
          </p>
          <p className="text-[#9CA3AF] text-xs mt-3">
            Estimated delivery: 7–14 business days
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/track?order=${order.order_number}`}
            className="flex items-center justify-center gap-2 bg-[#FF6B35] text-white py-3.5 rounded-xl font-medium text-sm hover:bg-[#E55A24] transition-colors"
          >
            Track Order <ArrowRight size={14} />
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center border border-[#FF6B35] text-[#FF6B35] py-3.5 rounded-xl font-medium text-sm hover:bg-[#FF6B35] hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}