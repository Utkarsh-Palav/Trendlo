import Link from "next/link";
import { X } from "lucide-react";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <div
      className={`fixed inset-0 z-50 transition ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`absolute inset-y-0 right-0 flex w-72 flex-col border-l border-dark-border bg-dark-surface px-5 py-4 text-sm text-white transition-transform ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <span className="text-base font-semibold">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-dark-border hover:border-brand hover:text-brand"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex flex-col gap-3">
          <Link
            href="/"
            className="transition-colors hover:text-brand"
            onClick={onClose}
          >
            Home
          </Link>
          <Link
            href="/products"
            className="transition-colors hover:text-brand"
            onClick={onClose}
          >
            Products
          </Link>
          <Link
            href="/track"
            className="transition-colors hover:text-brand"
            onClick={onClose}
          >
            Track Order
          </Link>
        </nav>
      </aside>
    </div>
  );
}

