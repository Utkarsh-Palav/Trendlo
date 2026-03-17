import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function PoliciesLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#F8F7F4]">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-[#9CA3AF]
            hover:text-[#FF6B35] transition-colors mb-8"
                >
                    <ArrowLeft size={14} />
                    Back to store
                </Link>
                <div className="bg-white border border-[#E5E7EB] rounded-2xl p-8 md:p-12">
                    {children}
                </div>
            </div>
        </div>
    )
}