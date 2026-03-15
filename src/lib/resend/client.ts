import { Resend } from 'resend'
import type { Order } from '@/types'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('Missing RESEND_API_KEY')
  return new Resend(key)
}

export async function sendOrderConfirmation(order: Order): Promise<void> {
  try {
    const resend = getResend()
    const { OrderConfirmedEmail } = await import('./templates/OrderConfirmed')
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'orders@trendlo.me',
      to: order.shipping_email,
      subject: `Order Confirmed — ${order.order_number}`,
      react: OrderConfirmedEmail({ order }),
    })
  } catch (err) {
    console.error('Failed to send order confirmation email:', err)
  }
}

export async function sendShippingNotification(order: Order): Promise<void> {
  try {
    const resend = getResend()
    const { OrderShippedEmail } = await import('./templates/OrderShipped')
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? 'orders@trendlo.me',
      to: order.shipping_email,
      subject: `Your order is on its way! — ${order.order_number}`,
      react: OrderShippedEmail({ order }),
    })
  } catch (err) {
    console.error('Failed to send shipping notification email:', err)
  }
}