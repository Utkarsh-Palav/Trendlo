'use client'

import { formatINR } from '@/utils/currency'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, Cell,
} from 'recharts'

interface UTMDataPoint {
    source: string
    orders: number
}

const COLORS: Record<string, string> = {
    instagram: '#E1306C',
    facebook: '#1877F2',
    youtube: '#FF0000',
    direct: '#FF6B35',
    referral: '#10B981',
    tiktok: '#010101',
}

export default function UTMChart({ data }: { data: UTMDataPoint[] }) {
    return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <h3 className="text-[#111827] font-semibold text-sm mb-1">Orders by platform — last 7 days</h3>
            <p className="text-[#9CA3AF] text-xs mb-4">Shows which platform is driving the most sales</p>
            <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
                    <XAxis
                        dataKey="source"
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 11, fill: '#9CA3AF' }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <Tooltip
                        formatter={(value: any) => [formatINR(Number(value) || 0), 'Orders']}
                        contentStyle={{
                            border: '1px solid #E5E7EB',
                            borderRadius: 8,
                            fontSize: 12,
                        }}
                    />
                    {data.map((entry) => (
                        <Cell
                            key={entry.source}
                            fill={COLORS[entry.source.toLowerCase()] ?? '#FF6B35'}
                        />
                    ))}
                    <Bar dataKey="orders" radius={[4, 4, 0, 0]}>
                        {data.map((entry) => (
                            <Cell
                                key={entry.source}
                                fill={COLORS[entry.source.toLowerCase()] ?? '#FF6B35'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}