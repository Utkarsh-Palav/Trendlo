export default function CheckoutLoading() {
    return (
        <div className="min-h-screen bg-[#F8F7F4]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="h-8 w-36 bg-[#E5E7EB] rounded animate-pulse mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3 space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl p-5">
                                <div className="h-5 w-32 bg-[#E5E7EB] rounded animate-pulse mb-4" />
                                <div className="space-y-3">
                                    <div className="h-11 bg-[#F3F4F6] rounded-lg animate-pulse" />
                                    <div className="h-11 bg-[#F3F4F6] rounded-lg animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 h-64 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    )
}