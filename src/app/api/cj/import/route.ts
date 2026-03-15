/**
 * What it does: Imports a product from CJ Dropshipping into the store database
 * What it expects: POST { cjProductId: string }
 * What it returns: { product: Product }
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { importProductToDB } from '@/lib/cj/products'

const schema = z.object({
  cjProductId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const product = await importProductToDB(parsed.data.cjProductId)

    return NextResponse.json({ product })
  } catch (err) {
    console.error('CJ import error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Import failed' },
      { status: 500 }
    )
  }
}