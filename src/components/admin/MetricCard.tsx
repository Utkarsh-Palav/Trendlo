import { formatINR } from '@/utils/currency'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface MetricCardProps {
    label: string
    value: number | string
    isCurrency?: boolean
    trend?: number
    suffix?: string
}

export default function MetricCard({
    label,
    value,
    isCurrency = false,
    trend,
    suffix,
}: MetricCardProps) {
    const displayValue = isCurrency && typeof value === 'number'
        ? formatINR(value)
        : `${value}${suffix ?? ''}`

    return (
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
            <p className="text-[#9CA3AF] text-xs font-medium uppercase tracking-wide mb-2">
                {label}
            </p>
            <p className="text-[#111827] text-2xl font-semibold">{displayValue}</p>
            {trend !== undefined && (
                <div className={`flex items-center gap-1 mt-2 text-xs font-medium
          ${trend >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {trend >= 0
                        ? <TrendingUp size={12} />
                        : <TrendingDown size={12} />}
                    {Math.abs(trend)}% vs yesterday
                </div>
            )}
        </div>
    )
}