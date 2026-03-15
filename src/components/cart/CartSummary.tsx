import { formatINR } from '@/utils/currency'

interface CartSummaryProps {
  subtotal: number
  discountAmt: number
  discountCode: string | null
  total: number
}

export default function CartSummary({
  subtotal,
  discountAmt,
  discountCode,
  total,
}: CartSummaryProps) {
  return (
    <div className="space-y-2 py-3 border-t border-[#2A2A2A]">
      <div className="flex justify-between text-sm">
        <span className="text-[#9CA3AF]">Subtotal</span>
        <span className="text-white">{formatINR(subtotal)}</span>
      </div>

      {discountAmt > 0 && discountCode && (
        <div className="flex justify-between text-sm">
          <span className="text-[#9CA3AF]">
            Discount
            <span className="ml-1 text-[10px] bg-[#FF6B35]/20 text-[#FF6B35] px-1.5 py-0.5 rounded">
              {discountCode}
            </span>
          </span>
          <span className="text-[#10B981]">- {formatINR(discountAmt)}</span>
        </div>
      )}

      <div className="flex justify-between text-base font-semibold pt-2 border-t border-[#2A2A2A]">
        <span className="text-white">Total</span>
        <span className="text-[#FF6B35]">{formatINR(total)}</span>
      </div>
    </div>
  )
}