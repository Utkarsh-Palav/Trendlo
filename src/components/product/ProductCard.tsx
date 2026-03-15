import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatINR } from "@/utils/currency";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0];

  const hasCompare =
    product.compare_price != null && product.compare_price > product.price;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-light-border bg-white transition hover:border-brand"
    >
      <div className="relative aspect-square overflow-hidden bg-light">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt ?? product.name}
            fill
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-medium text-gray-900">
          {product.name}
        </h3>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-base font-semibold text-brand">
            {formatINR(product.price)}
          </span>
          {hasCompare && (
            <span className="text-xs text-gray-400 line-through">
              {formatINR(product.compare_price ?? 0)}
            </span>
          )}
        </div>
        <button
          type="button"
          className="mt-auto inline-flex items-center justify-center rounded-full border border-brand px-3 py-1.5 text-xs font-medium text-brand transition-colors group-hover:bg-brand group-hover:text-white"
        >
          Add to cart
        </button>
      </div>
    </Link>
  );
}

