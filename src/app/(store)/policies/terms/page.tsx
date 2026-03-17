import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Terms of Service',
}

export default function TermsPage() {
    return (
        <article className="prose prose-sm max-w-none text-[#374151]">
            <h1 className="text-2xl font-semibold text-[#111827] mb-2">
                Terms of Service
            </h1>
            <p className="text-sm text-[#9CA3AF] mb-8">
                Last updated: March 2026
            </p>

            <p>
                By accessing or using Trendlo at trendlo.utkarshdev.me, you agree to
                be bound by these Terms of Service. Please read them carefully.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                1. General
            </h2>
            <p>
                Trendlo is an online retail store operated in India. We reserve the
                right to modify these terms at any time. Continued use of the site
                after changes constitutes acceptance of the updated terms.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                2. Products
            </h2>
            <p>
                We reserve the right to discontinue any product at any time. Product
                images are for illustration purposes and may vary slightly from the
                actual item. We strive to display accurate colours and descriptions
                but cannot guarantee your device displays them exactly.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                3. Pricing
            </h2>
            <p>
                All prices are in Indian Rupees (INR) and inclusive of applicable
                taxes. We reserve the right to change prices without prior notice.
                The price at the time of your order confirmation is the final price.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                4. Orders &amp; Payments
            </h2>
            <p>
                By placing an order you confirm that all provided information is
                accurate. We reserve the right to cancel orders that appear fraudulent
                or where payment cannot be verified. Payments are processed securely
                by Razorpay.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                5. Shipping &amp; Delivery
            </h2>
            <p>
                Delivery timelines are estimates and not guarantees. Trendlo is not
                liable for delays caused by courier services, customs, or events
                outside our control. Please refer to our{' '}
                <a
                    href="/policies/shipping-policy"
                    className="text-[#FF6B35] hover:underline"
                >
                    Shipping Policy
                </a>{' '}
                for full details.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                6. Returns &amp; Refunds
            </h2>
            <p>
                Returns and refunds are governed by our{' '}
                <a
                    href="/policies/return-policy"
                    className="text-[#FF6B35] hover:underline"
                >
                    Return &amp; Refund Policy
                </a>
                . By purchasing from us you agree to those terms.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                7. Intellectual Property
            </h2>
            <p>
                All content on this site including logos, text, images, and design is
                the property of Trendlo or its content suppliers and is protected by
                applicable intellectual property laws. You may not reproduce or
                distribute any content without our written permission.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                8. Limitation of Liability
            </h2>
            <p>
                Trendlo shall not be liable for any indirect, incidental, or
                consequential damages arising from the use of our site or products.
                Our total liability shall not exceed the amount paid for the specific
                order in question.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                9. Governing Law
            </h2>
            <p>
                These terms are governed by the laws of India. Any disputes shall be
                subject to the exclusive jurisdiction of courts in India.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                10. Contact
            </h2>
            <p>
                For any questions regarding these terms, email{' '}
                <a
                    href="mailto:support@trendlo.utkarshdev.me"
                    className="text-[#FF6B35] hover:underline"
                >
                    support@trendlo.utkarshdev.me
                </a>
            </p>
        </article>
    )
}