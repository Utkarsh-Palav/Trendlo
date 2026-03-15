import { ShieldCheck, Truck, RotateCcw } from "lucide-react";

interface TrustBadgesProps {
  className?: string;
}

export function TrustBadges({ className }: TrustBadgesProps) {
  return (
    <div
      className={`flex flex-wrap items-center gap-4 text-xs text-gray-300 ${className ?? ""}`}
    >
      <div className="inline-flex items-center gap-1.5">
        <Truck className="h-3 w-3 text-white" />
        <span>Free Delivery</span>
      </div>
      <div className="inline-flex items-center gap-1.5">
        <RotateCcw className="h-3 w-3 text-white" />
        <span>Easy Returns</span>
      </div>
      <div className="inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3 w-3 text-white" />
        <span>Secure Payment</span>
      </div>
    </div>
  );
}

