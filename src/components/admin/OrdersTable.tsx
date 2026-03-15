import Link from 'next/link'
import { formatINR } from '@/utils/currency'
import type { Order } from '@/types'

const STATUS_STYLES: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-blue-100 text-blue-700',
    processing: 'bg-orange-100 text-orange-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
}

export default function OrdersTable({ orders }: { orders: Order[] }) {
    if (orders.length === 0) {
        return (
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center">
                <p className="text-[#9CA3AF] text-sm">No orders yet</p>
            </div>
        )
    }

    return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-[#E5E7EB] bg-[#F8F7F4]">
                            <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium text-xs uppercase tracking-wide">Order</th>
                            <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium text-xs uppercase tracking-wide">Customer</th>
                            <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium text-xs uppercase tracking-wide">Total</th>
                            <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium text-xs uppercase tracking-wide">Payment</th>
                            <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium text-xs uppercase tracking-wide">Source</th>
                            <th className="text-left px-4 py-3 text-[#9CA3AF] font-medium text-xs uppercase tracking-wide">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, i) => (
                            <tr
                                key={order.id}
                                className={`border-b border-[#E5E7EB] hover:bg-[#F8F7F4] transition-colors
                  ${i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}
                            >
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/admin/orders/${order.id}`}
                                        className="text-[#FF6B35] font-medium hover:underline"
                                    >
                                        {order.order_number}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-[#374151]">{order.shipping_name}</td>
                                <td className="px-4 py-3 text-[#111827] font-medium">
                                    {formatINR(order.total_paid)}
                                </td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                    ${STATUS_STYLES[order.payment_status] ?? 'bg-gray-100 text-gray-700'}`}>
                                        {order.payment_status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    {order.utm_source ? (
                                        <span className="text-[#374151] text-xs capitalize">
                                            {order.utm_source}
                                        </span>
                                    ) : (
                                        <span className="text-[#9CA3AF] text-xs">direct</span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-[#9CA3AF] text-xs">
                                    {new Date(order.created_at).toLocaleDateString('en-IN', {
                                        day: 'numeric', month: 'short', year: 'numeric'
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}