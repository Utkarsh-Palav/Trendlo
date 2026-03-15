'use client'

import type { ReactNode } from 'react'
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import type { CartItem, Cart } from '@/types'

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string; variantId: string } }
  | { type: 'UPDATE_QTY'; payload: { productId: string; variantId: string; qty: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'APPLY_DISCOUNT'; payload: { discountCode: string; discountAmt: number } }
  | { type: 'HYDRATE'; payload: CartItem[] }

interface CartState {
  items: CartItem[]
  discountCode: string | null
  discountAmt: number
  isOpen: boolean
}

const initialState: CartState = {
  items: [],
  discountCode: null,
  discountAmt: 0,
  isOpen: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return { ...state, items: action.payload }

    case 'ADD_ITEM': {
      const existing = state.items.find(
        i => i.productId === action.payload.productId &&
             i.variantId === action.payload.variantId
      )
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.productId === action.payload.productId &&
            i.variantId === action.payload.variantId
              ? { ...i, qty: Math.min(i.qty + action.payload.qty, 10) }
              : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(
          i => !(i.productId === action.payload.productId &&
                 i.variantId === action.payload.variantId)
        ),
      }

    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i =>
          i.productId === action.payload.productId &&
          i.variantId === action.payload.variantId
            ? { ...i, qty: Math.min(Math.max(action.payload.qty, 1), 10) }
            : i
        ),
      }

    case 'CLEAR_CART':
      return { ...state, items: [], discountCode: null, discountAmt: 0 }

    case 'OPEN_CART':
      return { ...state, isOpen: true }

    case 'CLOSE_CART':
      return { ...state, isOpen: false }

    case 'APPLY_DISCOUNT':
      return {
        ...state,
        discountCode: action.payload.discountCode,
        discountAmt: action.payload.discountAmt,
      }

    default:
      return state
  }
}

interface CartContextValue extends CartState {
  itemCount: number
  subtotal: number
  total: number
  addItem: (item: CartItem) => void
  removeItem: (productId: string, variantId: string) => void
  updateQty: (productId: string, variantId: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  applyDiscount: (discountCode: string, discountAmt: number) => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('trendlo_cart')
      if (stored) {
        const parsed = JSON.parse(stored) as CartItem[]
        dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {
      // ignore corrupt storage
    }
  }, [])

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('trendlo_cart', JSON.stringify(state.items))
    } catch {
      // ignore storage errors
    }
  }, [state.items])

  const itemCount = state.items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const total = subtotal - state.discountAmt

  const addItem = useCallback((item: CartItem) =>
    dispatch({ type: 'ADD_ITEM', payload: item }), [])
  const removeItem = useCallback((productId: string, variantId: string) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { productId, variantId } }), [])
  const updateQty = useCallback((productId: string, variantId: string, qty: number) =>
    dispatch({ type: 'UPDATE_QTY', payload: { productId, variantId, qty } }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])
  const applyDiscount = useCallback((discountCode: string, discountAmt: number) =>
    dispatch({ type: 'APPLY_DISCOUNT', payload: { discountCode, discountAmt } }), [])

  return (
    <CartContext.Provider value={{
      ...state,
      itemCount,
      subtotal,
      total,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      openCart,
      closeCart,
      applyDiscount,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside CartProvider')
  return ctx
}