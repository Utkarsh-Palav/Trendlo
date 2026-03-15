import { getMetrics, getOrders } from '@/actions/admin.actions'
import MetricCard from '@/components/admin/MetricCard'
import OrdersTable from '@/components/admin/OrdersTable'
import DashboardCharts from '@/components/admin/DashboardCharts'

export const metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
    const [metrics, { orders }] = await Promise.all([
        getMetrics(),
        getOrders({ limit: 10 }),
    ])

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-[#111827] text-2xl font-semibold">Dashboard</h1>
                <p className="text-[#9CA3AF] text-sm mt-1">
                    Welcome back — here's what's happening with Trendlo
                </p>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    label="Today's Revenue"
                    value={metrics.todayRevenue}
                    isCurrency
                />
                <MetricCard
                    label="Today's Orders"
                    value={metrics.todayOrders}
                />
                <MetricCard
                    label="Total Revenue"
                    value={metrics.totalRevenue}
                    isCurrency
                />
                <MetricCard
                    label="Top Source This Week"
                    value={metrics.topSource}
                />
            </div>

            {/* Charts */}
            <DashboardCharts
                revenueData={metrics.revenueChart}
                utmData={metrics.utmChart}
            />

            {/* Recent orders */}
            <div>
                <h2 className="text-[#111827] font-semibold text-base mb-3">Recent orders</h2>
                <OrdersTable orders={orders} />
            </div>
        </div>
    )
}