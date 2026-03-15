import { notFound } from 'next/navigation'
import { getOrderById } from '@/actions/admin.actions'
import { formatINR } from '@/utils/currency'
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater'

export default async function OrderDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const order = await getOrderById(id)
    if (!order) notFound()

    const items = order.items as Array<{ name: string; qty: number; price: number; variantName?: string }>

    return (
        <div className="space-y-5 max-w-3xl">
            <div>
                <h1 className="text-[#111827] text-2xl font-semibold">{order.order_number}</h1>
                <p className="text-[#9CA3AF] text-sm mt-1">
                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'long', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                    })}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Customer */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h2 className="text-[#111827] font-semibold text-sm mb-3">Customer</h2>
                    <p className="text-[#374151] text-sm">{order.shipping_name}</p>
                    <p className="text-[#9CA3AF] text-sm">{order.shipping_email}</p>
                    <p className="text-[#9CA3AF] text-sm">{order.shipping_phone}</p>
                </div>

                {/* Shipping */}
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h2 className="text-[#111827] font-semibold text-sm mb-3">Shipping address</h2>
                    <p className="text-[#374151] text-sm leading-relaxed">
                        {order.shipping_address}<br />
                        {order.shipping_city}, {order.shipping_state}<br />
                        {order.shipping_pincode}
                    </p>
                </div>
            </div>

            {/* Items */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h2 className="text-[#111827] font-semibold text-sm mb-4">Items</h2>
                <div className="space-y-2">
                    {items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm py-2 border-b border-[#F3F4F6] last:border-0">
                            <div>
                                <p className="text-[#374151]">{item.name}</p>
                                {item.variantName && <p className="text-[#9CA3AF] text-xs">{item.variantName}</p>}
                                <p className="text-[#9CA3AF] text-xs">Qty: {item.qty}</p>
                            </div>
                            <p className="text-[#111827] font-medium">{formatINR(item.price * item.qty)}</p>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between font-semibold pt-3 text-sm">
                    <span className="text-[#111827]">Total paid</span>
                    <span className="text-[#FF6B35]">{formatINR(order.total_paid)}</span>
                </div>
            </div>

            {/* Payment + Fulfillment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h2 className="text-[#111827] font-semibold text-sm mb-3">Payment</h2>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Status</span>
                            <span className="text-[#111827] capitalize">{order.payment_status}</span>
                        </div>
                        {order.razorpay_payment_id && (
                            <div className="flex justify-between">
                                <span className="text-[#9CA3AF]">Razorpay ID</span>
                                <span className="text-[#374151] text-xs font-mono">{order.razorpay_payment_id}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span className="text-[#9CA3AF]">Subtotal</span>
                            <span className="text-[#111827]">{formatINR(order.subtotal)}</span>
                        </div>
                        {order.discount_amt > 0 && (
                            <div className="flex justify-between">
                                <span className="text-[#9CA3AF]">Discount</span>
                                <span className="text-[#10B981]">- {formatINR(order.discount_amt)}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h2 className="text-[#111827] font-semibold text-sm mb-3">Fulfillment</h2>
                    <div className="space-y-1.5 text-sm mb-4">
                        {order.cj_order_id && (
                            <div className="flex justify-between">
                                <span className="text-[#9CA3AF]">CJ Order ID</span>
                                <span className="text-[#374151] text-xs font-mono">{order.cj_order_id}</span>
                            </div>
                        )}
                        {order.tracking_number && (
                            <div className="flex justify-between">
                                <span className="text-[#9CA3AF]">Tracking</span>
                                <span className="text-[#FF6B35] font-medium">{order.tracking_number}</span>
                            </div>
                        )}
                    </div>
                    <OrderStatusUpdater orderId={order.id} currentStatus={order.fulfillment_status} />
                </div>
            </div>

            {/* UTM */}
            {(order.utm_source || order.ref_code) && (
                <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                    <h2 className="text-[#111827] font-semibold text-sm mb-3">Attribution</h2>
                    <div className="flex flex-wrap gap-2">
                        {order.utm_source && (
                            <span className="bg-[#FFF3EE] text-[#FF6B35] text-xs px-3 py-1 rounded-full font-medium">
                                {order.utm_source}
                            </span>
                        )}
                        {order.utm_campaign && (
                            <span className="bg-[#F3F4F6] text-[#374151] text-xs px-3 py-1 rounded-full">
                                {order.utm_campaign}
                            </span>
                        )}
                        {order.ref_code && (
                            <span className="bg-[#ECFDF5] text-[#10B981] text-xs px-3 py-1 rounded-full font-medium">
                                ref: {order.ref_code}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}