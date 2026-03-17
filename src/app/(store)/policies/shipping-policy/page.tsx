import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Shipping Policy',
}

export default function ShippingPolicyPage() {
    return (
        <article className="prose prose-sm max-w-none text-[#374151]">
            <h1 className="text-2xl font-semibold text-[#111827] mb-2">
                Shipping Policy
            </h1>
            <p className="text-sm text-[#9CA3AF] mb-8">
                Last updated: March 2026
            </p>

            <p>
                We want your order to reach you as quickly as possible. Here is
                everything you need to know about our shipping process.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                1. Processing Time
            </h2>
            <p>
                All orders are processed within <strong>1–3 business days</strong>{' '}
                after payment confirmation. You will receive an email confirmation
                as soon as your order is placed, and another when it ships.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                2. Delivery Time
            </h2>
            <div className="bg-[#F8F7F4] rounded-xl p-5 mt-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="font-medium text-[#111827]">Standard Delivery</p>
                        <p className="text-[#9CA3AF] mt-1">7–14 business days</p>
                    </div>
                    <div>
                        <p className="font-medium text-[#111827]">Coverage</p>
                        <p className="text-[#9CA3AF] mt-1">All across India</p>
                    </div>
                    <div>
                        <p className="font-medium text-[#111827]">Shipping Cost</p>
                        <p className="text-[#9CA3AF] mt-1">Free on all orders</p>
                    </div>
                    <div>
                        <p className="font-medium text-[#111827]">Tracking</p>
                        <p className="text-[#9CA3AF] mt-1">Provided after dispatch</p>
                    </div>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                3. Order Tracking
            </h2>
            <p>
                Once your order is shipped, you will receive a tracking number via
                email. You can track your order anytime at{' '}
                <a href="/track" className="text-[#FF6B35] hover:underline">
                    trendlo.utkarshdev.me/track
                </a>
                {' '}using your order number and email address.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                4. Shipping Locations
            </h2>
            <p>
                We currently ship to all states and union territories across India.
                We do not ship internationally at this time.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                5. Delays
            </h2>
            <p>
                While we strive to meet our delivery estimates, delays may occasionally
                occur due to customs clearance, public holidays, natural disasters, or
                courier issues beyond our control. If your order is delayed beyond
                20 business days, please contact us and we will investigate immediately.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                6. Wrong Address
            </h2>
            <p>
                Please ensure your shipping address is correct at checkout. We are not
                responsible for orders delivered to an incorrect address provided by
                the customer. If you notice an error, contact us immediately at{' '}

                href="mailto:support@trendlo.utkarshdev.me"
                className="text-[#FF6B35] hover:underline"
                <a>
                    support@trendlo.utkarshdev.me
                </a>{' '}
                before the order is shipped.
            </p><h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                7. Contact
            </h2><p>
                For shipping queries, email{' '}
                <a
                    href="mailto:support@trendlo.utkarshdev.me"
                    className="text-[#FF6B35] hover:underline"
                >
                    support@trendlo.utkarshdev.me
                </a>{' '}
                or use the order tracking page.
            </p>
        </article>
    )
}