'use client'

import type { ReactNode, FormEvent } from 'react'
import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { Order } from '@/types'

type Step = { label: string; key: string; icon: ReactNode }

const STEPS: Step[] = [
  { label: 'Order Placed', key: 'placed', icon: <Package size={18} /> },
  { label: 'Processing', key: 'processing', icon: <Clock size={18} /> },
  { label: 'Shipped', key: 'shipped', icon: <Truck size={18} /> },
  { label: 'Delivered', key: 'delivered', icon: <CheckCircle size={18} /> },
]

function getStepIndex(status: string): number {
  if (status === 'delivered') return 3
  if (status === 'shipped') return 2
  if (status === 'processing') return 1
  return 0
}

export default function TrackPage() {
  const [orderNumber, setOrderNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleTrack(e: FormEvent) {
    e.preventDefault()
    if (!orderNumber.trim() || !email.trim()) return
    setLoading(true)
    setError(null)
    setOrder(null)

    try {
      const res = await fetch(
        `/api/orders?orderNumber=${encodeURIComponent(orderNumber)}&email=${encodeURIComponent(email)}`
      )
      const data = await res.json()
      if (data.order) {
        setOrder(data.order)
      } else {
        setError('No order found with these details. Please check and try again.')
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const stepIndex = order ? getStepIndex(order.fulfillment_status) : -1

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Dark hero */}
      <div className="bg-[#0F0F0F] py-14 px-4 text-center">
        <h1 className="text-white text-3xl font-semibold mb-2">Track Your Order</h1>
        <div className="w-12 h-0.5 bg-[#FF6B35] mx-auto mt-3" />
      </div>

      <div className="max-w-lg mx-auto px-4 py-10">
        {/* Search form */}
        <form onSubmit={handleTrack}
          className="bg-white border border-[#E5E7EB] rounded-xl p-6 mb-6 space-y-4">
          <div>
            <label className="block text-[#374151] text-sm font-medium mb-1">Order number</label>
            <input
              value={orderNumber}
              onChange={e => setOrderNumber(e.target.value.toUpperCase())}
              placeholder="TRD-1234567890"
              className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[#374151] text-sm font-medium mb-1">Email address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !orderNumber.trim() || !email.trim()}
            className="w-full bg-[#FF6B35] text-white py-3.5 rounded-lg font-medium text-sm
              hover:bg-[#E55A24] disabled:opacity-50 transition-colors
              flex items-center justify-center gap-2"
          >
            {loading ? <LoadingSpinner size="sm" color="white" /> : <Search size={16} />}
            {loading ? 'Searching...' : 'Track Order'}
          </button>
        </form>

        {/* Error */}
        {error && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl px-4 py-3 mb-6">
            <p className="text-[#EF4444] text-sm">{error}</p>
          </div>
        )}

        {/* Order status */}
        {order && (
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 space-y-6">
            <div>
              <p className="text-[#9CA3AF] text-xs">Order number</p>
              <p className="text-[#111827] font-semibold">{order.order_number}</p>
            </div>

            {/* Stepper */}
            <div className="space-y-0">
              {STEPS.map((step, i) => {
                const done = i <= stepIndex
                const active = i === stepIndex
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                        ${done ? 'bg-[#FF6B35] text-white' : 'bg-[#F8F7F4] text-[#9CA3AF]'}
                        ${active ? 'ring-4 ring-[#FF6B35]/20' : ''}`}>
                        {step.icon}
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className={`w-0.5 h-8 ${done && i < stepIndex ? 'bg-[#FF6B35]' : 'bg-[#E5E7EB]'}`} />
                      )}
                    </div>
                    <div className="pb-6">
                      <p className={`text-sm font-medium ${done ? 'text-[#111827]' : 'text-[#9CA3AF]'}`}>
                        {step.label}
                      </p>
                      {active && order.tracking_number && step.key === 'shipped' && (
                        <div className="mt-1">
                          <p className="text-[#9CA3AF] text-xs">
                            Tracking: <span className="text-[#FF6B35] font-medium">{order.tracking_number}</span>
                          </p>
                          {order.tracking_url && (
                            <a
                              href={order.tracking_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FF6B35] text-xs underline mt-0.5 block"
                            >
                              Track shipment →
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}