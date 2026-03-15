import type { ProductVariant } from "@/types";

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedId?: string;
  onChange?: (id: string) => void;
}

export function VariantSelector({
  variants,
  selectedId,
  onChange,
}: VariantSelectorProps) {
  if (!variants.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {variants.map((variant) => {
        const selected = variant.id === selectedId;
        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => onChange?.(variant.id)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              selected
                ? "border-brand bg-[#FFF3EE] text-brand"
                : "border-light-border bg-white text-gray-900 hover:border-brand"
            }`}
          >
            {variant.name ?? "Default"}
          </button>
        );
      })}
    </div>
  );
}

