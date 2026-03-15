'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Download } from 'lucide-react'
import { getOrders } from '@/actions/admin.actions'
import OrdersTable from '@/components/admin/OrdersTable'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { Order } from '@/types'

const STATUSES = ['all', 'pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('all')
    const [page, setPage] = useState(1)

    const fetchOrders = useCallback(async () => {
        setLoading(true)
        try {
            const result = await getOrders({ search, status, page, limit: 20 })
            setOrders(result.orders)
            setTotal(result.total)
        } finally {
            setLoading(false)
        }
    }, [search, status, page])

    useEffect(() => { fetchOrders() }, [fetchOrders])

    function exportCSV() {
        const headers = ['Order #', 'Customer', 'Email', 'Phone', 'Total', 'Status', 'UTM Source', 'Date']
        const rows = orders.map(o => [
            o.order_number,
            o.shipping_name,
            o.shipping_email,
            o.shipping_phone,
            o.total_paid,
            o.payment_status,
            o.utm_source ?? 'direct',
            new Date(o.created_at).toLocaleDateString('en-IN'),
        ])
        const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
        const blob = new Blob([csv], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `trendlo-orders-${Date.now()}.csv`
        a.click()
    }

    const totalPages = Math.ceil(total / 20)

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-[#111827] text-2xl font-semibold">Orders</h1>
                    <p className="text-[#9CA3AF] text-sm">{total} total orders</p>
                </div>
                <button
                    onClick={exportCSV}
                    className="flex items-center gap-2 border border-[#FF6B35] text-[#FF6B35]
            px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#FF6B35] hover:text-white transition-colors"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 flex-wrap">
                <div className="relative flex-1 min-w-48">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1) }}
                        placeholder="Search order # or email..."
                        className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg
              pl-9 pr-4 py-2.5 text-sm text-[#111827] outline-none transition-colors"
                    />
                </div>
                <select
                    value={status}
                    onChange={e => { setStatus(e.target.value); setPage(1) }}
                    className="border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg
            px-4 py-2.5 text-sm text-[#111827] outline-none bg-white capitalize"
                >
                    {STATUSES.map(s => (
                        <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-12"><LoadingSpinner /></div>
            ) : (
                <OrdersTable orders={orders} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between text-sm">
                    <p className="text-[#9CA3AF]">
                        Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, total)} of {total}
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#374151]
                disabled:opacity-40 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-4 py-2 border border-[#E5E7EB] rounded-lg text-[#374151]
                disabled:opacity-40 hover:border-[#FF6B35] hover:text-[#FF6B35] transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}