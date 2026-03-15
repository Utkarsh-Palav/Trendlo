'use client'

import Image from 'next/image'
import { Minus, Plus, X } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { formatINR } from '@/utils/currency'
import type { CartItem as CartItemType } from '@/types'

export default function CartItem({ item }: { item: CartItemType }) {
  const { updateQty, removeItem } = useCart()

  return (
    <div className="flex gap-3 py-4 border-b border-[#2A2A2A]">
      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#2A2A2A]">
        <Image
          src={item.image || '/placeholder.png'}
          alt={item.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{item.name}</p>
        {item.variantName && (
          <p className="text-[#9CA3AF] text-xs mt-0.5">{item.variantName}</p>
        )}
        <p className="text-[#FF6B35] text-sm font-semibold mt-1">
          {formatINR(item.price * item.qty)}
        </p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => removeItem(item.productId, item.variantId)}
          className="text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
          aria-label="Remove item"
        >
          <X size={14} />
        </button>

        <div className="flex items-center gap-2 border border-[#2A2A2A] rounded-lg px-2 py-1">
          <button
            onClick={() => updateQty(item.productId, item.variantId, item.qty - 1)}
            disabled={item.qty <= 1}
            className="text-[#9CA3AF] hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Decrease quantity"
          >
            <Minus size={12} />
          </button>
          <span className="text-white text-xs w-4 text-center">{item.qty}</span>
          <button
            onClick={() => updateQty(item.productId, item.variantId, item.qty + 1)}
            disabled={item.qty >= 10}
            className="text-[#9CA3AF] hover:text-white disabled:opacity-30 transition-colors"
            aria-label="Increase quantity"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}