import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Return & Refund Policy',
}

export default function ReturnPolicyPage() {
    return (
        <article className="prose prose-sm max-w-none text-[#374151]">
            <h1 className="text-2xl font-semibold text-[#111827] mb-2">
                Return &amp; Refund Policy
            </h1>
            <p className="text-sm text-[#9CA3AF] mb-8">
                Last updated: March 2026
            </p>

            <p>
                We want you to be completely happy with your Trendlo purchase. If
                something is not right, we are here to help.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                1. Return Window
            </h2>
            <p>
                You may request a return within <strong>7 days</strong> of receiving
                your order. After 7 days, we are unable to accept return requests.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                2. Eligible Reasons for Return
            </h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Item received is damaged or defective</li>
                <li>Wrong item delivered</li>
                <li>Item significantly different from the product description</li>
                <li>Item missing from the order</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                3. Non-Returnable Items
            </h2>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Items showing signs of use or damage caused by the customer</li>
                <li>Items without original packaging</li>
                <li>Perishable or hygiene products (e.g. earphones once used)</li>
                <li>Items purchased during clearance sales</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                4. How to Request a Return
            </h2>
            <div className="bg-[#F8F7F4] rounded-xl p-5 mt-3 space-y-3 text-sm">
                <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs
            flex items-center justify-center font-medium flex-shrink-0">
                        1
                    </span>
                    <p>
                        Email us at{' '}
                        <a
                            href="mailto:support@trendlo.utkarshdev.me"
                            className="text-[#FF6B35]"
                        >
                            support@trendlo.utkarshdev.me
                        </a>{' '}
                        with your order number and reason for return
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs
            flex items-center justify-center font-medium flex-shrink-0">
                        2
                    </span>
                    <p>
                        Attach clear photos of the item showing the issue
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs
            flex items-center justify-center font-medium flex-shrink-0">
                        3
                    </span>
                    <p>
                        Our team will review your request within 2 business days and
                        provide return instructions
                    </p>
                </div>
                <div className="flex gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#FF6B35] text-white text-xs
            flex items-center justify-center font-medium flex-shrink-0">
                        4
                    </span>
                    <p>
                        Once return is approved and item received, refund is processed
                        within 5–7 business days
                    </p>
                </div>
            </div>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                5. Refund Method
            </h2>
            <p>
                Refunds are issued to the original payment method (UPI, card, wallet,
                netbanking). Processing time after approval:
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>UPI / Wallet: 1–3 business days</li>
                <li>Debit / Credit card: 5–7 business days</li>
                <li>Netbanking: 3–5 business days</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                6. Exchanges
            </h2>
            <p>
                We currently do not offer direct exchanges. If you need a different
                item, please return the original and place a new order.
            </p>

            <h2 className="text-lg font-semibold text-[#111827] mt-8 mb-3">
                7. Contact
            </h2>
            <p>
                Questions about returns? Email{' '}
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