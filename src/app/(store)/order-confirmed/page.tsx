import { Suspense } from 'react'
import OrderConfirmedContent from '@/components/checkout/OrderConfirmedContent'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export const metadata = { title: 'Order Confirmed' }

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>}>
      <OrderConfirmedContent />
    </Suspense>
  )
}