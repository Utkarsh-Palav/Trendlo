'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import {
    LayoutDashboard, ShoppingCart, Package,
    LogOut, Menu, X,
} from 'lucide-react'

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/products', label: 'Products', icon: Package },
]

export default function Sidebar() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)
    const [signingOut, setSigningOut] = useState(false)

    async function handleSignOut() {
        setSigningOut(true)
        try {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
            await supabase.auth.signOut()
        } catch (err) {
            console.error('Sign out error:', err)
        } finally {
            // Hard redirect — clears all client state and forces middleware
            // to re-evaluate the session (which is now gone)
            window.location.href = '/admin/login'
        }
    }

    return (
        <>
            {/* Mobile hamburger */}
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 bg-white border border-[#E5E7EB]
          rounded-lg p-2.5 shadow-sm"
                aria-label="Open menu"
            >
                <Menu size={20} className="text-[#374151]" />
            </button>

            {/* Mobile backdrop */}
            {open && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/40 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-[#E5E7EB]
          flex flex-col z-50 transition-transform duration-300
          lg:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
            >
                {/* Logo */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-[#E5E7EB]">
                    <div className="flex items-center gap-1">
                        <span className="text-lg font-semibold text-[#111827]">Trendlo</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                    </div>
                    <button
                        onClick={() => setOpen(false)}
                        className="lg:hidden text-[#9CA3AF] hover:text-[#374151] p-1"
                        aria-label="Close menu"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV.map(({ href, label, icon: Icon }) => {
                        const active = pathname === href
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                  transition-colors font-medium
                  ${active
                                        ? 'bg-[#FFF3EE] text-[#FF6B35] border-l-[3px] border-[#FF6B35] pl-[9px]'
                                        : 'text-[#374151] hover:bg-[#F8F7F4] hover:text-[#FF6B35]'
                                    }`}
                            >
                                <Icon size={18} />
                                {label}
                            </Link>
                        )
                    })}
                </nav>

                {/* Sign out */}
                <div className="px-3 py-4 border-t border-[#E5E7EB]">
                    <button
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm
              text-[#374151] hover:bg-[#FFF3EE] hover:text-[#FF6B35]
              transition-colors font-medium disabled:opacity-50"
                    >
                        <LogOut size={18} />
                        {signingOut ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </aside>
        </>
    )
}
