interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-light-border bg-white px-6 py-10 text-center">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      {description && (
        <p className="mt-2 max-w-sm text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

