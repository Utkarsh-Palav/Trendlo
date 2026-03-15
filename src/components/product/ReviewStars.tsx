interface ReviewStarsProps {
  rating?: number;
}

export function ReviewStars({ rating = 5 }: ReviewStarsProps) {
  const fullStars = Math.round(rating);
  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-brand">
        {"★★★★★".slice(0, fullStars)}
      </span>
      <span className="text-gray-400">
        ({rating.toFixed(1)} rating)
      </span>
    </div>
  );
}

