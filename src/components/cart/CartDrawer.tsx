'use client'

import { useState } from 'react'
import { X, ShoppingBag } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function CartDrawer() {
  const router = useRouter()
  const {
    items, isOpen, closeCart, itemCount,
    subtotal, discountAmt, discountCode,
    total, applyDiscount,
  } = useCart()

  const [code, setCode] = useState('')
  const [codeLoading, setCodeLoading] = useState(false)
  const [codeMsg, setCodeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleApplyCode() {
    if (!code.trim()) return
    setCodeLoading(true)
    setCodeMsg(null)
    try {
      const res = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase(), subtotal }),
      })
      const data = await res.json()
      if (data.valid) {
        applyDiscount(code.trim().toUpperCase(), data.discountAmount)
        setCodeMsg({ type: 'success', text: `Code applied! You save ${data.message}` })
      } else {
        setCodeMsg({ type: 'error', text: data.message })
      }
    } catch {
      setCodeMsg({ type: 'error', text: 'Failed to validate code. Try again.' })
    } finally {
      setCodeLoading(false)
    }
  }

  function handleCheckout() {
    closeCart()
    router.push('/checkout')
  }

  return (
    <>
      {/* Backdrop — only closes on direct backdrop click */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300
          ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      />

      {/* Drawer — stopPropagation prevents backdrop from catching clicks inside */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-[#1A1A1A] z-50 flex flex-col
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-[#FF6B35]" />
            <span className="text-white font-semibold text-base">Your Cart</span>
            {itemCount > 0 && (
              <span className="bg-[#FF6B35] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="text-[#9CA3AF] hover:text-white transition-colors p-1"
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <ShoppingBag size={48} className="text-[#2A2A2A]" />
              <p className="text-white font-medium">Your cart is empty</p>
              <p className="text-[#9CA3AF] text-sm text-center">
                Discover trending products and add them to your cart
              </p>
              <button
                onClick={closeCart}
                className="border border-[#FF6B35] text-[#FF6B35] px-6 py-2.5 rounded-lg
                  text-sm font-medium hover:bg-[#FF6B35] hover:text-white transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div>
              {items.map(item => (
                <CartItem
                  key={`${item.productId}-${item.variantId}`}
                  item={item}
                />
              ))}

              {/* Discount code */}
              <div className="py-4 border-b border-[#2A2A2A]">
                <p className="text-[#9CA3AF] text-xs mb-2">Discount code</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 bg-[#2A2A2A] border border-[#2A2A2A] focus:border-[#FF6B35]
                      text-white placeholder-[#9CA3AF] rounded-lg px-3 py-2 text-sm outline-none transition-colors"
                  />
                  <button
                    onClick={handleApplyCode}
                    disabled={codeLoading || !code.trim()}
                    className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg text-sm font-medium
                      disabled:opacity-50 hover:bg-[#E55A24] transition-colors"
                  >
                    {codeLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {codeMsg && (
                  <p className={`text-xs mt-1.5 ${codeMsg.type === 'success' ? 'text-[#10B981]' : 'text-[#EF4444]'
                    }`}>
                    {codeMsg.text}
                  </p>
                )}
              </div>

              <CartSummary
                subtotal={subtotal}
                discountAmt={discountAmt}
                discountCode={discountCode}
                total={total}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-[#2A2A2A]">
            <button
              onClick={handleCheckout}
              className="w-full bg-[#FF6B35] text-white py-3.5 rounded-lg font-semibold
                text-sm hover:bg-[#E55A24] transition-colors"
            >
              Proceed to Checkout →
            </button>
            <p className="text-[#9CA3AF] text-xs text-center mt-2">
              Free delivery across India
            </p>
          </div>
        )}
      </div>
    </>
  )
}