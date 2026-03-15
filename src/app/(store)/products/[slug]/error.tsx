'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ProductError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Product page error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-4">⚠️</div>
                <h1 className="text-[#111827] text-2xl font-semibold mb-2">
                    Something went wrong
                </h1>
                <p className="text-[#9CA3AF] text-sm mb-6">
                    We could not load this product. Please try again.
                </p>
                <div className="flex gap-3 justify-center">
                    <button
                        onClick={reset}
                        className="bg-[#FF6B35] text-white px-6 py-3 rounded-xl font-medium
              hover:bg-[#E55A24] transition-colors text-sm"
                    >
                        Try Again
                    </button>
                    <Link
                        href="/products"
                        className="border border-[#FF6B35] text-[#FF6B35] px-6 py-3 rounded-xl
              font-medium hover:bg-[#FF6B35] hover:text-white transition-colors text-sm"
                    >
                        All Products
                    </Link>
                </div>
            </div>
        </div>
    )
}