export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      {/* Hero skeleton */}
      <div className="bg-[#0F0F0F] h-[500px] animate-pulse" />

      {/* Products skeleton */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="h-8 w-48 bg-[#E5E7EB] rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
              <div className="aspect-square bg-[#F3F4F6] animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-[#F3F4F6] rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-[#F3F4F6] rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}