import Image from 'next/image'
import { formatINR } from '@/utils/currency'
import type { CartItem } from '@/types'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  discountAmt: number
  discountCode: string | null
  total: number
}

export default function OrderSummary({
  items, subtotal, discountAmt, discountCode, total
}: OrderSummaryProps) {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 sticky top-24">
      <h2 className="text-[#111827] font-semibold text-base mb-4">Order Summary</h2>

      <div className="space-y-3 mb-4">
        {items.map(item => (
          <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-[#F8F7F4]">
              <Image
                src={item.image || '/placeholder.png'}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[#111827] text-sm font-medium truncate">{item.name}</p>
              {item.variantName && (
                <p className="text-[#9CA3AF] text-xs">{item.variantName}</p>
              )}
              <p className="text-[#9CA3AF] text-xs">Qty: {item.qty}</p>
            </div>
            <p className="text-[#111827] text-sm font-medium flex-shrink-0">
              {formatINR(item.price * item.qty)}
            </p>
          </div>
        ))}
      </div>

      <div className="border-t border-[#E5E7EB] pt-3 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-[#9CA3AF]">Subtotal</span>
          <span className="text-[#111827]">{formatINR(subtotal)}</span>
        </div>

        {discountAmt > 0 && discountCode && (
          <div className="flex justify-between text-sm">
            <span className="text-[#9CA3AF]">
              Discount
              <span className="ml-1 text-[10px] bg-[#FF6B35]/10 text-[#FF6B35] px-1.5 py-0.5 rounded">
                {discountCode}
              </span>
            </span>
            <span className="text-[#10B981]">- {formatINR(discountAmt)}</span>
          </div>
        )}

        <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#E5E7EB]">
          <span className="text-[#111827]">Total</span>
          <span className="text-[#FF6B35]">{formatINR(total)}</span>
        </div>

        <p className="text-[#9CA3AF] text-xs text-center pt-1">
          Estimated delivery: 7–14 business days
        </p>
      </div>
    </div>
  )
}