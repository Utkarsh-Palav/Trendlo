import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-[#F8F7F4]">
            <Sidebar />
            <div className="lg:ml-60">
                {/* pt-16 on mobile gives space below the hamburger button */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-8 lg:pt-8">
                    {children}
                </div>
            </div>
        </div>
    )
}