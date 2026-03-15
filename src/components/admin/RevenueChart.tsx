'use client'

import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { formatINR } from '@/utils/currency'

interface RevenueDataPoint {
    date: string
    revenue: number
}

export default function RevenueChart({ data }: { data: RevenueDataPoint[] }) {
    return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-[#111827] font-semibold text-sm mb-4">Revenue — last 14 days</h3>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={v => `₹${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                        formatter={(value: any) => [formatINR(Number(value) || 0), 'Revenue']}
                        contentStyle={{
                            border: '1px solid #E5E7EB',
                            borderRadius: 8,
                            fontSize: 12,
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#FF6B35"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: '#FF6B35' }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}