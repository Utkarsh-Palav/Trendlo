/**
 * What it does: Syncs order tracking for all pending orders from CJ
 * What it expects: GET with Authorization: Bearer CRON_SECRET header
 * What it returns: { synced: number, timestamp: string }
 */

import { NextRequest, NextResponse } from 'next/server'
import { syncAllPendingOrders } from '@/lib/cj/tracking'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const expectedSecret = `Bearer ${process.env.CRON_SECRET}`

  if (authHeader !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const synced = await syncAllPendingOrders()
    return NextResponse.json({
      synced,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('Cron sync error:', err)
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 })
  }
}