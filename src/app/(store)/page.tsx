import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { TrustBadges } from "@/components/shared/TrustBadges";
import { CountdownTimer } from "@/components/shared/CountdownTimer";
import { getFeaturedProducts } from "@/actions/product.actions";

export default async function HomePage() {
  const products = await getFeaturedProducts();

  return (
    <div className="bg-light">
      {/* Hero */}
      <section className="bg-dark">
        <div className="container grid gap-10 py-14 md:grid-cols-2 md:items-center">
          <div className="order-2 space-y-5 md:order-1">
            <span className="inline-flex items-center rounded-full bg-[#111827] px-3 py-1 text-xs font-medium text-white">
              New Arrivals ✦
            </span>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl lg:text-5xl">
              Trending products.{" "}
              <span className="text-brand">Delivered fast.</span>
            </h1>
            <p className="max-w-xl text-sm text-gray-300">
              Discover the coolest trending gadgets and lifestyle products,
              shipped straight to your door.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-brand-dark"
              >
                Shop Now →
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-lg border border-brand px-8 py-3 text-sm font-medium text-brand transition hover:bg-[#1F2937]"
              >
                View All Products
              </Link>
            </div>
            <TrustBadges className="pt-2" />
          </div>
          <div className="order-1 md:order-2">
            <div className="relative overflow-hidden rounded-2xl border border-dark-border bg-dark-surface p-4">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#111827]">
                <Image
                  src="/hero-product.png"
                  alt="Trending product mockup"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-300">
                <span>Same‑day dispatch on all orders</span>
                <CountdownTimer minutes={45} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section
        id="trending"
        className="border-t border-light-border bg-light py-12"
      >
        <div className="container">
          <div className="mb-6">
            <div className="inline-flex flex-col gap-1">
              <h2 className="text-xl font-semibold text-gray-900">
                What&apos;s Trending
              </h2>
              <span className="h-0.5 w-16 rounded-full bg-brand" />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Handpicked trending products updated weekly.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.length === 0
              ? Array.from({ length: 3 }).map((_, idx) => (
                <ProductSkeleton key={idx} />
              ))
              : products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
          </div>
        </div>
      </section>

      {/* Why Trendlo */}
      <section className="bg-dark py-12">
        <div className="container">
          <h2 className="text-xl font-semibold text-white">
            Why choose Trendlo?
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Weekly Drops",
                desc: "Fresh trending products added every single week.",
              },
              {
                title: "Fast Shipping",
                desc: "Optimised for quick dispatch from reliable suppliers.",
              },
              {
                title: "Quality Checked",
                desc: "Each product is vetted for quality and consistency.",
              },
              {
                title: "Easy Returns",
                desc: "Hassle‑free returns on all eligible orders.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-dark-border bg-dark-surface p-4"
              >
                <h3 className="text-sm font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-xs text-gray-400">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="bg-light py-12">
        <div className="container">
          <h2 className="text-xl font-semibold text-gray-900">
            Real customers. Real reviews.
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "Aman Gupta",
                text: "Wasn’t sure at first but the product quality and packaging were way better than other dropshipping stores I’ve tried.",
              },
              {
                name: "Priya Nair",
                text: "Order arrived in 3 days and the tracking was super clear. The product feels premium for the price.",
              },
              {
                name: "Rahul Verma",
                text: "Love the curation – feels like someone already filtered out all the random AliExpress junk for me.",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="flex flex-col gap-3 rounded-xl border border-light-border bg-white p-4"
              >
                <div className="flex gap-0.5 text-brand">
                  {"★★★★★"}
                </div>
                <p className="text-sm text-gray-700">{review.text}</p>
                <div className="mt-auto">
                  <p className="text-sm font-semibold text-gray-900">
                    {review.name}
                  </p>
                  <span className="mt-1 inline-flex items-center rounded-full bg-[#FFF3EE] px-2 py-0.5 text-[10px] font-medium text-brand">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-brand py-10 text-white">
        <div className="container flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold">
              Find your next favourite thing.
            </h2>
            <p className="mt-1 text-xs text-orange-50">
              New products drop every week. Don&apos;t miss out.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-full border border-white px-6 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-gray-900"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}


