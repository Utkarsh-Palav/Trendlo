"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Product } from "@/types";
import { formatINR } from "@/utils/currency";
import { ReviewStars } from "./ReviewStars";
import { VariantSelector } from "./VariantSelector";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { useCart } from "@/hooks/useCart";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const salePrice = product.price;
  const originalPrice = product.compare_price ?? product.price * 1.3;
  const savings = Math.max(originalPrice - salePrice, 0);
  const savingsPct =
    originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

  const handleAddToCart = () => {
    const variant =
      product.variants.find((v) => v.id === selectedVariantId) ??
      product.variants[0];
    addItem({
      productId: product.id,
      variantId: variant?.id ?? product.cj_variant_id,
      name: product.name,
      image: product.images[0]?.url,
      price: salePrice,
      qty: quantity,
    });
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-24">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">
          {product.name}
        </h1>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ReviewStars rating={4.8} />
          <span>·</span>
          <span>127 reviews</span>
        </div>
      </div>

      <div className="space-y-1">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-brand">
            {formatINR(salePrice)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formatINR(originalPrice)}
          </span>
        </div>
        {savings > 0 && (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-500">
            Save {formatINR(savings)} ({savingsPct}% off)
          </span>
        )}
      </div>

      <ul className="space-y-1 text-xs text-gray-700">
        {[
          "Best‑selling pick for this week",
          "Ready‑to‑ship from trusted supplier",
          "Perfect for gifting and daily use",
          "COD available in most pincodes",
        ].map((bullet) => (
          <li key={bullet} className="flex items-start gap-2">
            <Check className="mt-0.5 h-3 w-3 text-brand" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-700">Variant</p>
        <VariantSelector
          variants={product.variants}
          selectedId={selectedVariantId}
          onChange={setSelectedVariantId}
        />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-700">Quantity</p>
        <div className="inline-flex items-center rounded-full border border-brand px-2 py-1 text-xs">
          <button
            type="button"
            className="h-7 w-7 rounded-full text-center text-base text-brand"
            onClick={() =>
              setQuantity((q) => (q > 1 ? q - 1 : 1))
            }
          >
            −
          </button>
          <span className="mx-2 w-6 text-center text-sm font-medium">
            {quantity}
          </span>
          <button
            type="button"
            className="h-7 w-7 rounded-full text-center text-base text-brand"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>
      </div>

      <CountdownTimer minutes={45} />

      <div className="space-y-2">
        <button
          type="button"
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          onClick={handleAddToCart}
        >
          Buy Now
        </button>
        <button
          type="button"
          className="w-full rounded-lg border border-brand bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-[#FFF3EE]"
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-light-border pt-3 text-[11px] text-gray-500">
        <span>Free delivery on all prepaid orders</span>
        <span>·</span>
        <span>7‑day easy returns</span>
      </div>
    </div>
  );
}

