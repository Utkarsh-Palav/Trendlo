'use client'

import dynamic from 'next/dynamic'

const RevenueChart = dynamic(() => import('@/components/admin/RevenueChart'), { ssr: false })
const UTMChart = dynamic(() => import('@/components/admin/UTMChart'), { ssr: false })

interface DashboardChartsProps {
    revenueData: any[]
    utmData: any[]
}

export default function DashboardCharts({ revenueData, utmData }: DashboardChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RevenueChart data={revenueData} />
            <UTMChart data={utmData} />
        </div>
    )
}
