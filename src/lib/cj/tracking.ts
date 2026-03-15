import { cj } from './client'
import { createClient } from '@supabase/supabase-js'
import { sendShippingNotification } from '@/lib/resend/client'
import type { Order } from '@/types'

interface CJTrackingRaw {
  orderStatus: string
  orderTrackList: Array<{
    trackNumber: string
    trackUrl?: string
  }>
}

export interface CJTrackingResponse {
  status: string
  trackingNumber: string | null
  trackingUrl: string | null
}

export async function getOrderTracking(
  cjOrderId: string
): Promise<CJTrackingResponse> {
  const data = await cj.request<CJTrackingRaw>(
    `/shopping/order/getOrderDetail?orderId=${cjOrderId}`
  )

  const track = data.orderTrackList?.[0]

  return {
    status: (data.orderStatus ?? 'processing').toLowerCase(),
    trackingNumber: track?.trackNumber ?? null,
    trackingUrl: track?.trackUrl ?? null,
  }
}

export async function syncAllPendingOrders(): Promise<number> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .not('fulfillment_status', 'in', '("delivered","cancelled")')
    .not('cj_order_id', 'is', null)

  if (error || !orders) return 0

  let synced = 0

  for (const order of orders) {
    try {
      const tracking = await getOrderTracking(order.cj_order_id as string)
      const prevStatus = order.fulfillment_status

      await supabase
        .from('orders')
        .update({
          fulfillment_status: tracking.status,
          tracking_number: tracking.trackingNumber,
          tracking_url: tracking.trackingUrl,
        })
        .eq('id', order.id)

      // Send shipping email when status first changes to shipped
      if (prevStatus !== 'shipped' && tracking.status === 'shipped') {
        await sendShippingNotification(order as Order)
      }

      synced++
    } catch (err) {
      console.error(`Failed to sync order ${order.order_number}:`, err)
    }
  }

  return synced
}