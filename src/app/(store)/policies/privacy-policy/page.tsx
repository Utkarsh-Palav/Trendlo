import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Privacy Policy',
}

export default function PrivacyPolicyPage() {
    return (
        <article className="prose prose-sm max-w-none text-[#374151]">
            <h1 className="text-2xl font-semibold text-[#111827] mb-2">
                Privacy Policy
            </h1>
            <p className="text-sm text-[#9CA3AF] mb-8">
                Last updated: March 2026
            </p>

            <p>
                At Trendlo, we are committed to protecting your personal information.
                This Privacy Policy explains how we collect, use, and safeguard your
                data when you visit our store at trendlo.utkarshdev.me.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                1. Information We Collect
            </h2>
            <p>When you place an order or contact us, we collect:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Name, email address, and phone number</li>
                <li>Shipping address (street, city, state, pincode)</li>
                <li>Payment information (processed securely by Razorpay — we never store card details)</li>
                <li>Order history and preferences</li>
                <li>Device information and browsing data (via cookies)</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                2. How We Use Your Information
            </h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>To process and fulfil your orders</li>
                <li>To send order confirmations and shipping updates</li>
                <li>To respond to your support queries</li>
                <li>To improve our store and personalise your experience</li>
                <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                3. Sharing Your Information
            </h2>
            <p>
                We share your information only with trusted partners necessary to
                fulfil your order:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>
                    <strong>CJ Dropshipping</strong> — our supplier, receives your
                    shipping address to deliver your order
                </li>
                <li>
                    <strong>Razorpay</strong> — our payment processor, handles payment
                    securely
                </li>
                <li>
                    <strong>Supabase</strong> — our database provider, stores order data
                    securely
                </li>
            </ul>
            <p className="mt-3">
                We never sell your personal information to third parties for marketing
                purposes.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                4. Data Security
            </h2>
            <p>
                We use industry-standard encryption (SSL/TLS) to protect data
                transmitted to and from our store. Payments are processed by Razorpay
                which is PCI-DSS compliant. We do not store credit card or UPI details.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                5. Cookies
            </h2>
            <p>
                We use essential cookies to keep your cart and session active. We do
                not use third-party advertising cookies. You can disable cookies in
                your browser settings, though this may affect store functionality.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                6. Your Rights
            </h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Request a copy of your personal data</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing communications</li>
            </ul>
            <p className="mt-3">
                To exercise these rights, email us at{' '}

                href="mailto:support@trendlo.utkarshdev.me"
                className="text-[#FF6B35] hover:underline"
                <a>
                    support@trendlo.utkarshdev.me
                </a>
            </p><h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                7. Contact
            </h2><p>
                For any privacy-related questions, contact us at{' '}
                <a
                    href="mailto:support@trendlo.utkarshdev.me"
                    className="text-[#FF6B35] hover:underline"
                >
                    support@trendlo.utkarshdev.me
                </a>
            </p >
        </article >
    )
}