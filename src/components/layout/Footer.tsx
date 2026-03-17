import Link from 'next/link'
import { Instagram, Facebook, Youtube, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#2A2A2A] bg-[#0F0F0F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-1 mb-3">
              <span className="text-xl font-semibold text-white">Trendlo</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
            </div>
            <p className="text-sm text-[#9CA3AF] leading-relaxed mb-5">
              Trending products, carefully curated and delivered fast across India.
              Quality you can trust, prices you'll love.
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]
                  flex items-center justify-center text-[#9CA3AF]
                  hover:text-[#FF6B35] hover:border-[#FF6B35] transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={14} color='violet' />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]
                  flex items-center justify-center text-[#9CA3AF]
                  hover:text-[#FF6B35] hover:border-[#FF6B35] transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={14} color='blue' />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A]
                  flex items-center justify-center text-[#9CA3AF]
                  hover:text-[#FF6B35] hover:border-[#FF6B35] transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={14} color='red' />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest
              text-[#9CA3AF] mb-4">
              Shop
            </h4>
            <div className="space-y-3 text-white">
              {[
                { href: '/products', label: 'All Products' },
                { href: '/#trending', label: 'Trending Now' },
                { href: '/track', label: 'Track Order' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-[#9CA3AF] hover:text-[#FF6B35]
                    transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest
              text-[#9CA3AF] mb-4">
              Legal
            </h4>
            <div className="space-y-3 text-white">
              {[
                { href: '/policies/privacy-policy', label: 'Privacy Policy' },
                { href: '/policies/shipping-policy', label: 'Shipping Policy' },
                { href: '/policies/return-policy', label: 'Return & Refund Policy' },
                { href: '/policies/terms', label: 'Terms of Service' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-[#9CA3AF] hover:text-[#FF6B35]
                    transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest
              text-[#9CA3AF] mb-4">
              Contact
            </h4>
            <div className="space-y-3 text-white">
              <a
                href="mailto:support@trendlo.utkarshdev.me"
                className="flex items-center gap-2 text-sm text-white
                  hover:text-orange-500 transition-colors"
              >
                <Mail size={13} color='orange' />
                support@trendlo.utkarshdev.me
              </a>
              <div className="flex items-start gap-2 text-sm text-white">
                <MapPin size={13} className="mt-0.5 flex-shrink-0" color='orange' />
                <span>India</span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Mon–Sat, 10am–6pm IST
              </p>
              <p className="text-xs text-[#6B7280]">
                Replies within 24 hours
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="mt-10 pt-8 border-t border-[#2A2A2A]">
          <div className="flex flex-wrap gap-6 items-center justify-between">
            <div className="flex flex-wrap gap-6">
              {[
                '🔒 Secure Payments',
                '🚚 Free Delivery',
                '↩ Easy Returns',
                '✓ Quality Checked',
              ].map(badge => (
                <span
                  key={badge}
                  className="text-xs text-[#6B7280]"
                >
                  {badge}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#4B5563]">
              © {new Date().getFullYear()} Trendlo. All rights reserved.
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer