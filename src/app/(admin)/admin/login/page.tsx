'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { Lock } from 'lucide-react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSignIn(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        const { error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (signInError) {
            setError('Invalid credentials. Please try again.')
            setLoading(false)
            return
        }

        router.push('/admin')
        router.refresh()
    }

    return (
        <div className="min-h-screen bg-[#F8F7F4] flex items-center justify-center px-4">
            <div className="w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-1 mb-2">
                        <span className="text-2xl font-semibold text-[#111827]">Trendlo</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-0.5" />
                    </div>
                    <p className="text-[#9CA3AF] text-sm">Admin Dashboard</p>
                </div>

                {/* Card */}
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8">
                    <h1 className="text-[#111827] text-xl font-semibold mb-6">Sign in</h1>

                    <form onSubmit={handleSignIn} className="space-y-4">
                        <div>
                            <label className="block text-[#374151] text-sm font-medium mb-1">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="admin@trendlo.me"
                                required
                                className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg
                  px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-[#374151] text-sm font-medium mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full border border-[#E5E7EB] focus:border-[#FF6B35] rounded-lg
                  px-4 py-3 text-sm text-[#111827] outline-none transition-colors"
                            />
                        </div>

                        {error && (
                            <p className="text-[#EF4444] text-sm bg-[#EF4444]/10 px-3 py-2 rounded-lg">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !email || !password}
                            className="w-full bg-[#FF6B35] text-white py-3 rounded-lg font-medium
                hover:bg-[#E55A24] disabled:opacity-50 transition-colors
                flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <LoadingSpinner size="sm" color="white" />
                            ) : (
                                <Lock size={16} />
                            )}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}