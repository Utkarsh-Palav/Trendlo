'use client'

import { useState } from 'react'
import { Check, Shield, Truck, RotateCcw } from 'lucide-react'
import type { Product } from '@/types'
import { formatINR } from '@/utils/currency'
import { ReviewStars } from './ReviewStars'
import { VariantSelector } from './VariantSelector'
import { CountdownTimer } from '@/components/shared/CountdownTimer'
import { useCart } from '@/hooks/useCart'

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const variants = product.variants as Array<{
    id: string
    cj_variant_id: string
    name: string
    price: number
  }>

  const [selectedVariantId, setSelectedVariantId] = useState(
    variants[0]?.id ?? product.cj_variant_id
  )
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem, openCart } = useCart()

  const images = product.images as Array<{ url: string; alt?: string }>

  const salePrice = product.price
  const originalPrice = product.compare_price ?? 0
  const hasDiscount = originalPrice > salePrice && originalPrice > 0
  const savings = hasDiscount ? originalPrice - salePrice : 0
  const savingsPct = hasDiscount
    ? Math.round((savings / originalPrice) * 100)
    : 0

  function handleAddToCart() {
    const variant = variants.find(v => v.id === selectedVariantId) ?? variants[0]
    addItem({
      productId: product.id,
      variantId: variant?.cj_variant_id ?? product.cj_variant_id,
      name: product.name,
      image: images[0]?.url ?? '',
      price: salePrice,
      qty: quantity,
    })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    handleAddToCart()
  }

  return (
    <div className="space-y-5 rounded-2xl bg-white border border-[#E5E7EB] p-5 lg:sticky lg:top-24">

      {/* Name + stars */}
      <div className="space-y-1.5">
        <h1 className="text-xl font-semibold text-[#111827] leading-snug">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
          <ReviewStars rating={4.8} />
          <span>·</span>
          <span>127 reviews</span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#FF6B35]">
            {formatINR(salePrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-[#9CA3AF] line-through">
              {formatINR(originalPrice)}
            </span>
          )}
        </div>
        {hasDiscount && savings > 0 && (
          <span className="inline-flex items-center rounded-full
            bg-[#ECFDF5] px-2.5 py-0.5 text-xs font-semibold text-[#10B981]">
            Save {formatINR(savings)} ({savingsPct}% off)
          </span>
        )}
      </div>

      {/* Bullet points */}
      <ul className="space-y-1.5">
        {[
          'Best-selling pick this week',
          'Ready to ship from trusted supplier',
          'Perfect for gifting and daily use',
          'Free delivery on all prepaid orders',
        ].map(bullet => (
          <li key={bullet} className="flex items-start gap-2 text-xs text-[#374151]">
            <Check size={13} className="mt-0.5 flex-shrink-0 text-[#FF6B35]" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* Variant selector */}
      {variants.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-[#374151]">
              Select variant
            </p>
            <p className="text-xs text-[#9CA3AF]">
              {variants.length} options
            </p>
          </div>
          <VariantSelector
            variants={variants}
            selectedId={selectedVariantId}
            onChange={setSelectedVariantId}
          />
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-[#374151]">Quantity</p>
        <div className="inline-flex items-center border border-[#E5E7EB]
          rounded-lg overflow-hidden">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(q - 1, 1))}
            className="w-9 h-9 flex items-center justify-center
              text-[#374151] hover:bg-[#F8F7F4] transition-colors text-lg"
          >
            −
          </button>
          <span className="w-10 text-center text-sm font-medium text-[#111827]">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => Math.min(q + 1, 10))}
            className="w-9 h-9 flex items-center justify-center
              text-[#374151] hover:bg-[#F8F7F4] transition-colors text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Countdown timer */}
      <CountdownTimer />

      {/* CTA buttons */}
      <div className="space-y-2.5">
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full rounded-xl bg-[#FF6B35] px-4 py-3.5 text-sm
            font-semibold text-white transition-colors hover:bg-[#E55A24]
            active:scale-[0.98]"
        >
          Buy Now
        </button>
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full rounded-xl border border-[#FF6B35] bg-white
            px-4 py-3.5 text-sm font-semibold text-[#FF6B35] transition-colors
            hover:bg-[#FFF3EE] active:scale-[0.98]"
        >
          {added ? 'Added to Cart ✓' : 'Add to Cart'}
        </button>
      </div>

      {/* Trust row */}
      <div className="grid grid-cols-3 gap-2 border-t border-[#E5E7EB] pt-4">
        {[
          { icon: Shield, label: 'Secure Payment' },
          { icon: Truck, label: 'Free Delivery' },
          { icon: RotateCcw, label: '7-Day Returns' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <Icon size={16} className="text-[#9CA3AF]" />
            <span className="text-[10px] text-[#9CA3AF] leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ProductInfo