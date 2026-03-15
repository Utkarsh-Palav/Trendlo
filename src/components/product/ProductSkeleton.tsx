export function ProductSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-light-border bg-white">
      <div className="aspect-square bg-gray-200" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-1/3 rounded bg-gray-200" />
        <div className="h-8 w-full rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

