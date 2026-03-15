'use client'

import { useState } from 'react'
import { updateOrderStatus } from '@/actions/admin.actions'

const STATUSES = ['unfulfilled', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrderStatusUpdater({
    orderId,
    currentStatus,
}: {
    orderId: string
    currentStatus: string
}) {
    const [status, setStatus] = useState(currentStatus)
    const [saving, setSaving] = useState(false)
    const [saved, setSaved] = useState(false)

    async function handleSave() {
        setSaving(true)
        await updateOrderStatus(orderId, status)
        setSaving(false)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-2">
            <p className="text-[#9CA3AF] text-xs">Manual status override</p>
            <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg
          px-3 py-2 text-sm text-[#111827] outline-none capitalize bg-white"
            >
                {STATUSES.map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                ))}
            </select>
            <button
                onClick={handleSave}
                disabled={saving || status === currentStatus}
                className="w-full bg-[#FF6B35] text-white py-2 rounded-lg text-sm font-medium
          disabled:opacity-50 hover:bg-[#E55A24] transition-colors"
            >
                {saving ? 'Saving...' : saved ? 'Saved ✓' : 'Update Status'}
            </button>
        </div>
    )
}