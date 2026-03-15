'use server'

import { cache } from 'react'
import { createClient } from '@supabase/supabase-js'
import type { Product } from '@/types'

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export const getFeaturedProducts = cache(async (): Promise<Product[]> => {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .eq('featured', true)
    .order('sold_count', { ascending: false })
    .limit(8)

  if (error) {
    console.error('getFeaturedProducts error:', error)
    return []
  }
  return (data ?? []) as Product[]
})

export const getAllProducts = cache(async (): Promise<Product[]> => {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getAllProducts error:', error)
    return []
  }
  return (data ?? []) as Product[]
})

export const getProductBySlug = cache(async (slug: string): Promise<Product | null> => {
  const supabase = getClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error) return null
  return data as Product
})