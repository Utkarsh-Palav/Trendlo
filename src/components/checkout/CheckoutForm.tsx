'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { getUTM } from '@/utils/utm'
import AddressForm from './AddressForm'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  address: z.string().min(10, 'Enter your full address (min 10 characters)'),
  city: z.string().min(2, 'Enter your city'),
  state: z.string().min(1, 'Please select your state'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit pincode'),
  discountCode: z.string().optional(),
})

export type CheckoutFormData = z.infer<typeof schema>

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
    }
  }
}

export default function CheckoutForm() {
  const router = useRouter()
  const { items, subtotal, discountAmt, discountCode, total, clearCart, applyDiscount } = useCart()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [codeInput, setCodeInput] = useState('')
  const [codeLoading, setCodeLoading] = useState(false)
  const [codeMsg, setCodeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(schema),
  })

  async function handleApplyCode() {
    if (!codeInput.trim()) return
    setCodeLoading(true)
    setCodeMsg(null)
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: codeInput.trim().toUpperCase(),
          subtotal,
        }),
      })
      const data = await res.json()
      if (data.valid) {
        applyDiscount(codeInput.trim().toUpperCase(), data.discountAmount)
        setCodeMsg({ type: 'success', text: `Applied! You save ${data.message}` })
      } else {
        setCodeMsg({ type: 'error', text: data.message })
      }
    } catch {
      setCodeMsg({ type: 'error', text: 'Could not validate code. Try again.' })
    } finally {
      setCodeLoading(false)
    }
  }

  async function onSubmit(formData: CheckoutFormData) {
    if (items.length === 0) return
    setLoading(true)
    setError(null)

    try {
      const utm = getUTM()

      // Step 1: Create Razorpay order
      const orderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
          },
          discountCode: discountCode || undefined,
          utmSource: utm?.utm_source,
          utmMedium: utm?.utm_medium,
          utmCampaign: utm?.utm_campaign,
          refCode: utm?.ref_code,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order')

      // Step 2: Load Razorpay script
      await loadRazorpayScript()

      // Step 3: Open Razorpay modal
      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        order_id: orderData.razorpayOrderId,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Trendlo',
        description: 'Order Payment',
        image: '/logo.png',
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#FF6B35' },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderData.orderId,
              }),
            })
            const verifyData = await verifyRes.json()
            if (verifyData.success) {
              clearCart()
              router.push(`/order-confirmed?id=${orderData.orderId}`)
            } else {
              setError('Payment verification failed. Contact support.')
            }
          } catch {
            setError('Payment verification failed. Contact support.')
          } finally {
            setLoading(false)
          }
        },
        modal: {
          ondismiss: () => setLoading(false),
        },
      })

      rzp.open()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Contact */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h2 className="text-[#111827] font-semibold text-base mb-4">Contact details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[#374151] text-sm font-medium mb-1">Full name</label>
            <input
              {...register('name')}
              placeholder="Utkarsh Sharma"
              className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
            />
            {errors.name && (
              <p className="text-[#EF4444] text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[#374151] text-sm font-medium mb-1">Email address</label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
            />
            {errors.email && (
              <p className="text-[#EF4444] text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-[#374151] text-sm font-medium mb-1">Phone number</label>
            <input
              {...register('phone')}
              placeholder="9876543210"
              maxLength={10}
              className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
            />
            {errors.phone && (
              <p className="text-[#EF4444] text-xs mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h2 className="text-[#111827] font-semibold text-base mb-4">Shipping address</h2>
        <AddressForm register={register} errors={errors} />
      </div>

      {/* Discount code */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <h2 className="text-[#111827] font-semibold text-base mb-3">Discount code</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={codeInput}
            onChange={e => setCodeInput(e.target.value.toUpperCase())}
            placeholder="FRIEND10"
            className="flex-1 border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
          />
          <button
            type="button"
            onClick={handleApplyCode}
            disabled={codeLoading || !codeInput.trim()}
            className="bg-[#FF6B35] text-white px-5 py-3 rounded-lg text-sm font-medium disabled:opacity-50 hover:bg-[#E55A24] transition-colors"
          >
            {codeLoading ? '...' : 'Apply'}
          </button>
        </div>
        {codeMsg && (
          <p className={`text-xs mt-1.5 ${codeMsg.type === 'success' ? 'text-[#10B981]' : 'text-[#EF4444]'
            }`}>
            {codeMsg.text}
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-lg px-4 py-3">
          <p className="text-[#EF4444] text-sm">{error}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="w-full bg-[#FF6B35] text-white py-4 rounded-xl font-semibold text-base
          hover:bg-[#E55A24] disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <LoadingSpinner size="sm" color="white" />
            Processing...
          </>
        ) : (
          <>
            <Lock size={16} />
            Place Order · {items.reduce((s, i) => s + i.qty, 0)} items
          </>
        )}
      </button>

      <p className="text-[#9CA3AF] text-xs text-center flex items-center justify-center gap-1">
        <Lock size={10} />
        Secure payment powered by Razorpay. Your data is safe.
      </p>
    </form>
  )
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })
}