export default function ProductLoading() {
    return (
        <div className="min-h-screen bg-[#F8F7F4]">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Images skeleton */}
                    <div className="space-y-3">
                        <div className="aspect-square bg-white border border-[#E5E7EB] rounded-xl animate-pulse" />
                        <div className="flex gap-2">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="w-16 h-16 bg-[#E5E7EB] rounded-lg animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Info skeleton */}
                    <div className="space-y-4">
                        <div className="h-8 bg-[#E5E7EB] rounded animate-pulse w-3/4" />
                        <div className="h-5 bg-[#E5E7EB] rounded animate-pulse w-1/3" />
                        <div className="h-10 bg-[#E5E7EB] rounded animate-pulse w-1/2" />
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-4 bg-[#E5E7EB] rounded animate-pulse" />
                            ))}
                        </div>
                        <div className="h-12 bg-[#FF6B35]/20 rounded-xl animate-pulse" />
                        <div className="h-12 bg-[#E5E7EB] rounded-xl animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    )
}