import { cj } from './client'

interface CreateCJOrderParams {
  orderNumber: string
  shippingName: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingState: string
  shippingZip: string
  shippingCountryCode: string
  products: Array<{ vid: string; quantity: number }>
}

export interface CJOrderResponse {
  orderId: string
  orderNum: string
  status: string
}

export async function createCJOrder(
  params: CreateCJOrderParams
): Promise<CJOrderResponse> {
  const result = await cj.request<CJOrderResponse>(
    '/shopping/order/createOrderV2',
    'POST',
    {
      orderNumber: params.orderNumber,
      shippingZip: params.shippingZip,
      shippingCountryCode: params.shippingCountryCode,
      shippingCountry: 'India',
      shippingProvince: params.shippingState,
      shippingCity: params.shippingCity,
      shippingAddress: params.shippingAddress,
      shippingAddress2: '',
      shippingCustomerName: params.shippingName,
      shippingPhone: params.shippingPhone,
      products: params.products,
    }
  )

  return result
}