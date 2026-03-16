import Link from 'next/link'
import Image from 'next/image'
import { formatINR } from '@/utils/currency'
import type { Product } from '@/types'
import AddToCartButton from './AddToCartButton'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const images = product.images as Array<{ url: string; alt?: string }>
  const primaryImage = images?.[0]

  const hasDiscount =
    product.compare_price != null &&
    product.compare_price > product.price &&
    product.compare_price > 0

  const discountPercent = hasDiscount
    ? Math.round(
      ((product.compare_price! - product.price) / product.compare_price!) * 100
    )
    : 0

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border
        border-[#E5E7EB] bg-white transition-all duration-200
        hover:border-[#FF6B35]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#F8F7F4]">
        {primaryImage?.url ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="object-cover transition-transform duration-300
              group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs text-[#9CA3AF]">No image</span>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-[#EF4444] text-white
            text-xs font-medium px-2 py-0.5 rounded-full">
            -{discountPercent}%
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-[#111827] leading-snug">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-base font-semibold text-[#FF6B35]">
            {formatINR(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-[#9CA3AF] line-through">
              {formatINR(product.compare_price ?? 0)}
            </span>
          )}
        </div>

        {hasDiscount && (
          <p className="text-xs text-[#10B981] font-medium">
            Save {formatINR((product.compare_price ?? 0) - product.price)}
          </p>
        )}

        {/* Separate client component handles cart logic */}
        <AddToCartButton product={product} />
      </div>
    </Link>
  )
}

export default ProductCard