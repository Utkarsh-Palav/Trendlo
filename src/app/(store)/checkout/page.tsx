import { Suspense } from 'react'
import CheckoutForm from '@/components/checkout/CheckoutForm'
import OrderSummaryWrapper from '@/components/checkout/OrderSummaryWrapper'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export const metadata = {
  title: 'Checkout',
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-[#111827] text-2xl font-semibold mb-8">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              <CheckoutForm />
            </Suspense>
          </div>
          <div className="lg:col-span-2">
            <Suspense fallback={<LoadingSpinner />}>
              <OrderSummaryWrapper />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}