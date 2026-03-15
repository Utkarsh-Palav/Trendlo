'use client'

import { useCart } from '@/hooks/useCart'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function CartPage() {
  const { openCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    openCart()
    router.replace('/')
  }, [openCart, router])

  return null
}