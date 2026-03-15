'use server'

import { createClient } from '@supabase/supabase-js'
import type { AdminMetrics, Order } from '@/types'

function getServiceClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

export async function getMetrics(): Promise<AdminMetrics> {
    const supabase = getServiceClient()
    const today = new Date().toISOString().split('T')[0]

    const [todayRes, totalRes, utmRes, chartRes] = await Promise.all([
        supabase
            .from('orders')
            .select('total_paid')
            .eq('payment_status', 'paid')
            .gte('created_at', `${today}T00:00:00`),
        supabase
            .from('orders')
            .select('total_paid')
            .eq('payment_status', 'paid'),
        supabase
            .from('orders')
            .select('utm_source')
            .eq('payment_status', 'paid')
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
            .from('orders')
            .select('created_at, total_paid')
            .eq('payment_status', 'paid')
            .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: true }),
    ])

    const todayRevenue = (todayRes.data ?? []).reduce((s, o) => s + o.total_paid, 0)
    const todayOrders = (todayRes.data ?? []).length
    const totalRevenue = (totalRes.data ?? []).reduce((s, o) => s + o.total_paid, 0)

    // Top UTM source
    const utmCounts: Record<string, number> = {}
    for (const o of utmRes.data ?? []) {
        const src = o.utm_source ?? 'direct'
        utmCounts[src] = (utmCounts[src] ?? 0) + 1
    }
    const topSource = Object.entries(utmCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'direct'

    // Revenue chart — last 14 days
    const revenueByDay: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
        const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        revenueByDay[d.toISOString().split('T')[0]] = 0
    }
    for (const o of chartRes.data ?? []) {
        const day = o.created_at.split('T')[0]
        if (day in revenueByDay) revenueByDay[day] += o.total_paid
    }
    const revenueChart = Object.entries(revenueByDay).map(([date, revenue]) => ({
        date: new Date(date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        revenue: Math.round(revenue),
    }))

    // UTM chart — last 7 days
    const utmChart = Object.entries(utmCounts)
        .map(([source, orders]) => ({ source, orders }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 6)

    return {
        todayRevenue,
        todayOrders,
        totalRevenue,
        topSource,
        revenueChart,
        utmChart,
    }
}

export async function getOrders(filters: {
    status?: string
    search?: string
    page?: number
    limit?: number
}): Promise<{ orders: Order[]; total: number }> {
    const supabase = getServiceClient()
    const page = filters.page ?? 1
    const limit = filters.limit ?? 20
    const from = (page - 1) * limit
    const to = from + limit - 1

    let query = supabase
        .from('orders')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

    if (filters.status && filters.status !== 'all') {
        query = query.eq('payment_status', filters.status)
    }

    if (filters.search) {
        query = query.or(
            `order_number.ilike.%${filters.search}%,shipping_email.ilike.%${filters.search}%`
        )
    }

    const { data, count, error } = await query
    if (error) throw error

    return { orders: (data ?? []) as Order[], total: count ?? 0 }
}

export async function getOrderById(id: string): Promise<Order | null> {
    const supabase = getServiceClient()
    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
    if (error) return null
    return data as Order
}

export async function updateOrderStatus(
    id: string,
    fulfillmentStatus: string
): Promise<void> {
    const supabase = getServiceClient()
    await supabase
        .from('orders')
        .update({ fulfillment_status: fulfillmentStatus })
        .eq('id', id)
}

export async function toggleProductActive(
    id: string,
    active: boolean
): Promise<void> {
    const supabase = getServiceClient()
    await supabase.from('products').update({ active }).eq('id', id)
}

export async function updateProductPrice(
    id: string,
    price: number
): Promise<void> {
    const supabase = getServiceClient()
    await supabase.from('products').update({ price }).eq('id', id)
}

export async function createDiscountCode(data: {
    code: string
    type: 'percent' | 'flat'
    value: number
    min_order?: number
    max_uses?: number
    ref_name?: string
}): Promise<void> {
    const supabase = getServiceClient()
    await supabase.from('discount_codes').insert({
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        min_order: data.min_order ?? 0,
        max_uses: data.max_uses ?? null,
        ref_name: data.ref_name ?? null,
        active: true,
    })
}