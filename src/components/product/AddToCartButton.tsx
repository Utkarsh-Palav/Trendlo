'use client'

import { useCart } from '@/hooks/useCart'
import type { Product } from '@/types'

interface Props {
    product: Product
}

export default function AddToCartButton({ product }: Props) {
    const { addItem, openCart } = useCart()

    const images = product.images as Array<{ url: string; alt?: string }>

    function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        addItem({
            productId: product.id,
            variantId: product.cj_variant_id,
            name: product.name,
            image: images?.[0]?.url ?? '',
            price: product.price,
            qty: 1,
        })
        openCart()
    }

    return (
        <button
            type="button"
            onClick={handleAddToCart}
            className="mt-auto inline-flex items-center justify-center rounded-lg
        border border-[#FF6B35] px-3 py-2 text-xs font-medium
        text-[#FF6B35] transition-colors
        hover:bg-[#FF6B35] hover:text-white"
        >
            Add to Cart
        </button>
    )
}