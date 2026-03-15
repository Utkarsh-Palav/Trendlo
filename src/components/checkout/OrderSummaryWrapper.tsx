'use client'

import { useCart } from '@/hooks/useCart'
import OrderSummary from './OrderSummary'

export default function OrderSummaryWrapper() {
  const { items, subtotal, discountAmt, discountCode, total } = useCart()

  return (
    <OrderSummary
      items={items}
      subtotal={subtotal}
      discountAmt={discountAmt}
      discountCode={discountCode}
      total={total}
    />
  )
}