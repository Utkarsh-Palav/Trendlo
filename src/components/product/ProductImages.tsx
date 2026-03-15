'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ProductImagesProps {
  images: Array<{ url: string; alt?: string }>
  productName: string
}

export function ProductImages({ images, productName }: ProductImagesProps) {
  const [index, setIndex] = useState(0)

  const displayImages = images.length
    ? images
    : [{ url: '/hero-product.png', alt: productName }]

  const current = displayImages[index] ?? displayImages[0]

  return (
    <div className="space-y-3 rounded-2xl bg-white p-4 border border-[#E5E7EB]">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#F3F4F6]">
        <Image
          key={current.url}
          src={current.url}
          alt={current.alt ?? productName}
          fill
          className="object-cover transition-transform duration-300 hover:scale-[1.02]"
          priority
        />
      </div>

      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {displayImages.map((img, i) => (
            <button
              key={img.url + i}
              type="button"
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors
                ${i === index
                  ? 'border-[#FF6B35]'
                  : 'border-[#E5E7EB] hover:border-[#FF6B35]/50'
                }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.url}
                alt={img.alt ?? productName}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductImages