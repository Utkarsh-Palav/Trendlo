"use client"

import Link from "next/link";
import { ShoppingBag, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";
import { MobileNav } from "./MobileNav";

export function Header() {
  const { itemCount, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 border-b border-dark-border bg-dark/95 backdrop-blur"
      data-scrolled={scrolled}
    >
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-1">
          <span className="text-xl font-bold text-white tracking-tight">
            Trendlo
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-brand" />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-300 md:flex">
          <Link
            href="/"
            className="transition-colors hover:text-brand"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="transition-colors hover:text-brand"
          >
            Products
          </Link>
          <Link
            href="/track"
            className="transition-colors hover:text-brand"
          >
            Track Order
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openCart()}
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-dark-border text-white transition-colors hover:border-brand hover:text-brand"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-dark-border text-white transition-colors hover:border-brand hover:text-brand md:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </div>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}

