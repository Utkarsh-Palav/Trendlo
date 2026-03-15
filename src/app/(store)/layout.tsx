import { CartProvider } from '@/hooks/useCart'
import CartDrawer from '@/components/cart/CartDrawer'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import UTMCapture from '@/components/shared/UTMCapture'

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <UTMCapture />
      <Header />
      <CartDrawer />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  )
}