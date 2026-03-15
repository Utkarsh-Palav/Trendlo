import type { Json, ProductRow, OrderRow } from "@/lib/supabase/types";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ProductImage {
  url: string;
  alt?: string;
  position?: number;
}

export interface ProductVariant {
  id: string;
  sku?: string;
  name?: string;
  price: number;
  compareAtPrice?: number | null;
  costPrice?: number | null;
  cjVariantId?: string;
  stock?: number | null;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compare_price?: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  short_desc?: string | null;
  description?: string | null;
  cj_variant_id: string;
  active: boolean;
  featured: boolean;
  sold_count: number;
  cost_price?: number | null;
  cj_product_id?: string | null;
  category?: string | null;
  tags?: string[] | null;
  weight_grams?: number | null;
  seo_title?: string | null;
  seo_description?: string | null;
  stock?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  productId: string;
  variantId: string;
  name: string;
  image?: string;
  price: number;
  qty: number;
  variantName?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

export interface OrderItem {
  productId: string;
  variantId: string;
  name: string;
  image?: string;
  price: number;
  qty: number;
  variantName?: string;
}

export interface Order {
  id: string
  order_number: string
  created_at: string
  customer_id: string | null
  razorpay_order_id: string | null
  razorpay_payment_id: string | null
  cj_order_id: string | null
  items: unknown
  subtotal: number
  discount_amt: number
  total_paid: number
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  ref_code: string | null
  discount_code: string | null
  payment_status: string
  fulfillment_status: string
  tracking_number: string | null
  tracking_url: string | null
  shipping_name: string
  shipping_phone: string
  shipping_email: string
  shipping_address: string
  shipping_city: string
  shipping_state: string
  shipping_pincode: string
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface DiscountCode {
  code: string;
  type: "percent" | "flat";
  value: number;
  min_order?: number;
  ref_name?: string | null;
  uses: number;
  max_uses?: number | null;
  active: boolean;
  expires_at?: string | null;
}

export interface DiscountValidation {
  valid: boolean;
  discountAmount: number;
  message?: string;
  discountCode?: DiscountCode;
}

export interface CJProductImage {
  bigImg: string;
  position?: number;
}

export interface CJVariant {
  vid: string;
  sku?: string;
  sellPrice: number;
  variantName?: string;
  weight?: number;
}

export interface CJProduct {
  pid: string;
  productNameEn: string;
  productImageSet: CJProductImage[];
  sellPrice: number;
  categoryNameEn?: string;
}

export interface CJOrderResponse {
  orderId: string;
  orderNum: string;
  status: string;
}

export interface CJTrackingResponse {
  status: string;
  trackingNumber?: string;
  trackingUrl?: string;
  estimatedDelivery?: string;
}

export interface UTMData {
  source?: string;
  medium?: string;
  campaign?: string;
  ref?: string;
}

export interface AdminMetrics {
  todayRevenue: number;
  todayOrders: number;
  totalRevenue: number;
  topSource: string;
  revenueChart: Array<{ date: string; revenue: number }>
  utmChart: Array<{ source: string; orders: number }>
}

