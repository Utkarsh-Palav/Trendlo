import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-dark-border bg-dark">
      <div className="container py-10 text-sm text-white">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-white">Trendlo</h3>
            <p className="mt-3 text-xs text-gray-400">
              Trending products, carefully curated and delivered fast across
              India.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
              Shop
            </h4>
            <div className="mt-3 space-y-2 text-xs text-gray-400">
              <Link
                href="/products"
                className="block transition-colors hover:text-brand"
              >
                All Products
              </Link>
              <Link
                href="/#trending"
                className="block transition-colors hover:text-brand"
              >
                Trending Now
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
              Support
            </h4>
            <div className="mt-3 space-y-2 text-xs text-gray-400">
              <Link
                href="/track"
                className="block transition-colors hover:text-brand"
              >
                Track Order
              </Link>
              <Link
                href="/"
                className="block transition-colors hover:text-brand"
              >
                Returns &amp; Refunds
              </Link>
            </div>
          </div>
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-300">
              Connect
            </h4>
            <div className="mt-3 space-y-2 text-xs text-gray-400">
              <a
                href="mailto:orders@trendlo.me"
                className="block transition-colors hover:text-brand"
              >
                orders@trendlo.me
              </a>
              <p className="text-xs text-gray-500">
                Mon–Sat, 10am–6pm IST
              </p>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-dark-border pt-4 text-xs text-gray-500">
          <p>© 2025 Trendlo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

