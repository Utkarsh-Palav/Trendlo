import { ProductCard } from "@/components/product/ProductCard";
import { ProductSkeleton } from "@/components/product/ProductSkeleton";
import { getAllProducts } from "@/actions/product.actions";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="bg-light">
      <section className="bg-dark py-10">
        <div className="container">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            All Products
          </h1>
          <span className="mt-3 block h-0.5 w-16 rounded-full bg-brand" />
        </div>
      </section>
      <section className="container py-10">
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description="Once you import products from CJ, they will show up here."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.length === 0
              ? Array.from({ length: 8 }).map((_, idx) => (
                  <ProductSkeleton key={idx} />
                ))
              : products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>
        )}
      </section>
    </div>
  );
}


