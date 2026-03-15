'use client'

import { useState, useEffect } from 'react'
import { Search, Plus } from 'lucide-react'
import { toggleProductActive, updateProductPrice, createDiscountCode } from '@/actions/admin.actions'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import type { Product } from '@/types'

interface CJSearchResult {
    pid: string
    productNameEn: string
    sellPrice: number
    productImageUrl: string
}

interface DiscountCode {
    id: string
    code: string
    type: string
    value: number
    uses: number
    max_uses: number | null
    ref_name: string | null
    active: boolean
}

export default function ProductsAdminPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([])
    const [cjSearch, setCjSearch] = useState('')
    const [cjResults, setCjResults] = useState<CJSearchResult[]>([])
    const [cjLoading, setCjLoading] = useState(false)
    const [importingId, setImportingId] = useState<string | null>(null)
    const [importedIds, setImportedIds] = useState<Set<string>>(new Set())
    const [editingPrice, setEditingPrice] = useState<string | null>(null)
    const [priceInput, setPriceInput] = useState('')

    // New discount code form
    const [newCode, setNewCode] = useState({
        code: '', type: 'percent' as 'percent' | 'flat',
        value: '', min_order: '', max_uses: '', ref_name: '',
    })
    const [codeLoading, setCodeLoading] = useState(false)

    useEffect(() => {
        fetch('/api/products')
            .then(r => r.json())
            .then(d => setProducts(d.products ?? []))

        fetch('/api/discount/list')
            .then(r => r.json())
            .then(d => setDiscountCodes(d.codes ?? []))
            .catch(() => { })
    }, [])

    async function searchCJ() {
        if (!cjSearch.trim()) return
        setCjLoading(true)
        try {
            const res = await fetch(`/api/cj/products?q=${encodeURIComponent(cjSearch)}`)
            const data = await res.json()
            setCjResults(data.products ?? [])
        } finally {
            setCjLoading(false)
        }
    }

    async function importProduct(pid: string) {
        setImportingId(pid)
        try {
            const res = await fetch('/api/cj/import', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cjProductId: pid }),
            })
            if (res.ok) {
                setImportedIds(prev => new Set([...prev, pid]))
                const data = await res.json()
                setProducts(prev => [data.product, ...prev])
            }
        } finally {
            setImportingId(null)
        }
    }

    async function handleToggleActive(id: string, active: boolean) {
        await toggleProductActive(id, !active)
        setProducts(prev => prev.map(p => p.id === id ? { ...p, active: !active } : p))
    }

    async function handlePriceSave(id: string) {
        const price = parseFloat(priceInput)
        if (isNaN(price) || price <= 0) return
        await updateProductPrice(id, price)
        setProducts(prev => prev.map(p => p.id === id ? { ...p, price } : p))
        setEditingPrice(null)
    }

    async function handleCreateCode() {
        if (!newCode.code || !newCode.value) return
        setCodeLoading(true)
        try {
            await createDiscountCode({
                code: newCode.code,
                type: newCode.type,
                value: parseFloat(newCode.value),
                min_order: newCode.min_order ? parseFloat(newCode.min_order) : undefined,
                max_uses: newCode.max_uses ? parseInt(newCode.max_uses) : undefined,
                ref_name: newCode.ref_name || undefined,
            })
            setNewCode({ code: '', type: 'percent', value: '', min_order: '', max_uses: '', ref_name: '' })
        } finally {
            setCodeLoading(false)
        }
    }

    function getMarginColor(margin: number) {
        if (margin < 30) return 'text-[#EF4444]'
        if (margin < 50) return 'text-[#F59E0B]'
        return 'text-[#10B981]'
    }

    return (
        <div className="space-y-8">
            <h1 className="text-[#111827] text-2xl font-semibold">Products</h1>

            {/* CJ Import */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h2 className="text-[#111827] font-semibold text-base mb-4">Import from CJ Dropshipping</h2>
                <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                        <input
                            value={cjSearch}
                            onChange={e => setCjSearch(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && searchCJ()}
                            placeholder="Search CJ catalog (e.g. gadget, wireless, home)"
                            className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg
                pl-9 pr-4 py-2.5 text-sm text-[#111827] outline-none transition-colors"
                        />
                    </div>
                    <button
                        onClick={searchCJ}
                        disabled={cjLoading}
                        className="bg-[#FF6B35] text-white px-5 py-2.5 rounded-lg text-sm font-medium
              hover:bg-[#E55A24] disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                        {cjLoading ? <LoadingSpinner size="sm" color="white" /> : <Search size={16} />}
                        Search CJ
                    </button>
                </div>

                {cjResults.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {cjResults.map(p => {
                            const imported = importedIds.has(p.pid)
                            const importing = importingId === p.pid
                            return (
                                <div key={p.pid} className="border border-[#E5E7EB] rounded-xl overflow-hidden">
                                    <div className="aspect-square bg-[#F8F7F4] relative">
                                        {p.productImageUrl && (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={p.productImageUrl}
                                                alt={p.productNameEn}
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                    <div className="p-3">
                                        <p className="text-[#111827] text-xs font-medium line-clamp-2 mb-1">
                                            {p.productNameEn}
                                        </p>
                                        <p className="text-[#9CA3AF] text-xs">Cost: ₹{Math.round(p.sellPrice)}</p>
                                        <p className="text-[#FF6B35] text-xs font-medium">
                                            Sell: ₹{Math.round(p.sellPrice * 3)}
                                        </p>
                                        <button
                                            onClick={() => importProduct(p.pid)}
                                            disabled={importing || imported}
                                            className={`w-full mt-2 py-1.5 rounded-lg text-xs font-medium transition-colors
                        ${imported
                                                    ? 'bg-[#ECFDF5] text-[#10B981]'
                                                    : 'bg-[#FF6B35] text-white hover:bg-[#E55A24] disabled:opacity-50'
                                                }`}
                                        >
                                            {importing ? '...' : imported ? 'Imported ✓' : 'Import'}
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Product catalog */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#E5E7EB]">
                    <h2 className="text-[#111827] font-semibold text-base">Your catalog ({products.length})</h2>
                </div>
                {products.length === 0 ? (
                    <div className="p-8 text-center text-[#9CA3AF] text-sm">
                        No products yet — import from CJ above
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-[#F8F7F4] border-b border-[#E5E7EB]">
                                    <th className="text-left px-4 py-3 text-[#9CA3AF] text-xs font-medium">Product</th>
                                    <th className="text-left px-4 py-3 text-[#9CA3AF] text-xs font-medium">Price</th>
                                    <th className="text-left px-4 py-3 text-[#9CA3AF] text-xs font-medium">Cost</th>
                                    <th className="text-left px-4 py-3 text-[#9CA3AF] text-xs font-medium">Margin</th>
                                    <th className="text-left px-4 py-3 text-[#9CA3AF] text-xs font-medium">Sold</th>
                                    <th className="text-left px-4 py-3 text-[#9CA3AF] text-xs font-medium">Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => {
                                    const margin = p.cost_price
                                        ? Math.round(((p.price - p.cost_price) / p.price) * 100)
                                        : 0
                                    return (
                                        <tr key={p.id} className="border-b border-[#F3F4F6]">
                                            <td className="px-4 py-3">
                                                <p className="text-[#111827] font-medium text-xs line-clamp-1">{p.name}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                {editingPrice === p.id ? (
                                                    <div className="flex gap-1">
                                                        <input
                                                            type="number"
                                                            value={priceInput}
                                                            onChange={e => setPriceInput(e.target.value)}
                                                            className="w-20 border border-[#FF6B35] rounded px-2 py-1 text-xs outline-none"
                                                            autoFocus
                                                        />
                                                        <button
                                                            onClick={() => handlePriceSave(p.id)}
                                                            className="text-[#10B981] text-xs px-2"
                                                        >
                                                            ✓
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => { setEditingPrice(p.id); setPriceInput(String(p.price)) }}
                                                        className="text-[#111827] text-xs hover:text-[#FF6B35] transition-colors"
                                                    >
                                                        ₹{p.price}
                                                    </button>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-[#9CA3AF] text-xs">
                                                {p.cost_price ? `₹${p.cost_price}` : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-medium ${getMarginColor(margin)}`}>
                                                    {margin}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-[#9CA3AF] text-xs">{p.sold_count}</td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={() => handleToggleActive(p.id, p.active)}
                                                    className={`w-10 h-5 rounded-full transition-colors relative
                            ${p.active ? 'bg-[#FF6B35]' : 'bg-[#E5E7EB]'}`}
                                                    aria-label="Toggle active"
                                                >
                                                    <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white
                            transition-transform ${p.active ? 'translate-x-5' : 'translate-x-0.5'}`}
                                                    />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Discount codes */}
            <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                <h2 className="text-[#111827] font-semibold text-base mb-4">Discount codes</h2>

                {/* Create form */}
                <div className="bg-[#F8F7F4] rounded-xl p-4 mb-4">
                    <p className="text-[#374151] text-sm font-medium mb-3 flex items-center gap-1">
                        <Plus size={14} className="text-[#FF6B35]" />
                        Create new code
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <input
                            value={newCode.code}
                            onChange={e => setNewCode(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                            placeholder="Code (e.g. FRIEND10)"
                            className="border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-sm outline-none"
                        />
                        <select
                            value={newCode.type}
                            onChange={e => setNewCode(p => ({ ...p, type: e.target.value as 'percent' | 'flat' }))}
                            className="border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-sm outline-none bg-white"
                        >
                            <option value="percent">Percent %</option>
                            <option value="flat">Flat ₹</option>
                        </select>
                        <input
                            value={newCode.value}
                            onChange={e => setNewCode(p => ({ ...p, value: e.target.value }))}
                            placeholder="Value (e.g. 10)"
                            type="number"
                            className="border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-sm outline-none"
                        />
                        <input
                            value={newCode.min_order}
                            onChange={e => setNewCode(p => ({ ...p, min_order: e.target.value }))}
                            placeholder="Min order ₹ (optional)"
                            type="number"
                            className="border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-sm outline-none"
                        />
                        <input
                            value={newCode.max_uses}
                            onChange={e => setNewCode(p => ({ ...p, max_uses: e.target.value }))}
                            placeholder="Max uses (optional)"
                            type="number"
                            className="border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-sm outline-none"
                        />
                        <input
                            value={newCode.ref_name}
                            onChange={e => setNewCode(p => ({ ...p, ref_name: e.target.value }))}
                            placeholder="Ref name (e.g. influencer_friend)"
                            className="border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg px-3 py-2 text-sm outline-none"
                        />
                    </div>
                    <button
                        onClick={handleCreateCode}
                        disabled={codeLoading || !newCode.code || !newCode.value}
                        className="mt-3 bg-[#FF6B35] text-white px-5 py-2 rounded-lg text-sm font-medium
              hover:bg-[#E55A24] disabled:opacity-50 transition-colors"
                    >
                        {codeLoading ? 'Creating...' : 'Create Code'}
                    </button>
                </div>

                {/* Codes table */}
                {discountCodes.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-[#E5E7EB]">
                                    <th className="text-left py-2 text-[#9CA3AF] text-xs font-medium">Code</th>
                                    <th className="text-left py-2 text-[#9CA3AF] text-xs font-medium">Type</th>
                                    <th className="text-left py-2 text-[#9CA3AF] text-xs font-medium">Value</th>
                                    <th className="text-left py-2 text-[#9CA3AF] text-xs font-medium">Uses</th>
                                    <th className="text-left py-2 text-[#9CA3AF] text-xs font-medium">Ref</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discountCodes.map(c => (
                                    <tr key={c.id} className="border-b border-[#F3F4F6]">
                                        <td className="py-2.5 text-[#FF6B35] font-medium">{c.code}</td>
                                        <td className="py-2.5 text-[#374151] capitalize">{c.type}</td>
                                        <td className="py-2.5 text-[#111827]">
                                            {c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}
                                        </td>
                                        <td className="py-2.5 text-[#9CA3AF]">
                                            {c.uses}{c.max_uses ? `/${c.max_uses}` : ''}
                                        </td>
                                        <td className="py-2.5 text-[#9CA3AF] text-xs">{c.ref_name ?? '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}