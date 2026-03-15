import crypto from 'crypto'

interface VerifyParams {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export function verifyPaymentSignature(params: VerifyParams): boolean {
  const body = `${params.razorpay_order_id}|${params.razorpay_payment_id}`

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest('hex')

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(params.razorpay_signature, 'hex')
    )
  } catch {
    return false
  }
}