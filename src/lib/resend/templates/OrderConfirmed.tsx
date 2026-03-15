import {
    Html, Head, Body, Container, Section,
    Text, Button, Hr, Row, Column, Img,
} from '@react-email/components'
import type { Order } from '@/types'

interface Props {
    order: Order
}

export function OrderConfirmedEmail({ order }: Props) {
    const items = order.items as Array<{
        name: string
        qty: number
        price: number
        variantName?: string
    }>

    return (
        <Html>
            <Head />
            <Body style={{ backgroundColor: '#F8F7F4', fontFamily: 'Inter, sans-serif' }}>
                <Container style={{ maxWidth: 560, margin: '0 auto', padding: '32px 16px' }}>

                    {/* Header */}
                    <Section style={{
                        backgroundColor: '#0F0F0F',
                        borderRadius: 12,
                        padding: '24px 32px',
                        marginBottom: 24,
                    }}>
                        <Text style={{
                            color: '#FFFFFF',
                            fontSize: 22,
                            fontWeight: 600,
                            margin: 0,
                        }}>
                            Trendlo
                            <span style={{ color: '#FF6B35' }}>.</span>
                        </Text>
                    </Section>

                    {/* Body */}
                    <Section style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: 12,
                        padding: '32px',
                        marginBottom: 16,
                        border: '1px solid #E5E7EB',
                    }}>
                        <Text style={{ fontSize: 22, fontWeight: 600, color: '#111827', marginTop: 0 }}>
                            Order Confirmed! 🎉
                        </Text>
                        <Text style={{ color: '#9CA3AF', fontSize: 14, marginTop: 4 }}>
                            Hi {order.shipping_name}, your order has been placed successfully.
                        </Text>

                        {/* Order number pill */}
                        <Section style={{
                            backgroundColor: '#FF6B35',
                            borderRadius: 8,
                            padding: '10px 20px',
                            display: 'inline-block',
                            marginBottom: 24,
                        }}>
                            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, margin: 0 }}>
                                {order.order_number}
                            </Text>
                        </Section>

                        <Hr style={{ borderColor: '#E5E7EB', margin: '16px 0' }} />

                        {/* Items */}
                        <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 8 }}>
                            Your items
                        </Text>
                        {items.map((item, i) => (
                            <Row key={i} style={{ marginBottom: 8 }}>
                                <Column>
                                    <Text style={{ fontSize: 13, color: '#374151', margin: 0 }}>
                                        {item.name}
                                        {item.variantName ? ` — ${item.variantName}` : ''} × {item.qty}
                                    </Text>
                                </Column>
                                <Column style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: 13, color: '#111827', fontWeight: 500, margin: 0 }}>
                                        ₹{Math.round(item.price * item.qty).toLocaleString('en-IN')}
                                    </Text>
                                </Column>
                            </Row>
                        ))}

                        <Hr style={{ borderColor: '#E5E7EB', margin: '16px 0' }} />

                        {/* Totals */}
                        <Row style={{ marginBottom: 4 }}>
                            <Column>
                                <Text style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Subtotal</Text>
                            </Column>
                            <Column style={{ textAlign: 'right' }}>
                                <Text style={{ fontSize: 13, color: '#111827', margin: 0 }}>
                                    ₹{Math.round(order.subtotal).toLocaleString('en-IN')}
                                </Text>
                            </Column>
                        </Row>

                        {order.discount_amt > 0 && (
                            <Row style={{ marginBottom: 4 }}>
                                <Column>
                                    <Text style={{ fontSize: 13, color: '#9CA3AF', margin: 0 }}>Discount</Text>
                                </Column>
                                <Column style={{ textAlign: 'right' }}>
                                    <Text style={{ fontSize: 13, color: '#10B981', margin: 0 }}>
                                        - ₹{Math.round(order.discount_amt).toLocaleString('en-IN')}
                                    </Text>
                                </Column>
                            </Row>
                        )}

                        <Row>
                            <Column>
                                <Text style={{ fontSize: 15, fontWeight: 600, color: '#111827', margin: 0 }}>
                                    Total paid
                                </Text>
                            </Column>
                            <Column style={{ textAlign: 'right' }}>
                                <Text style={{ fontSize: 15, fontWeight: 600, color: '#FF6B35', margin: 0 }}>
                                    ₹{Math.round(order.total_paid).toLocaleString('en-IN')}
                                </Text>
                            </Column>
                        </Row>

                        <Hr style={{ borderColor: '#E5E7EB', margin: '16px 0' }} />

                        {/* Shipping address */}
                        <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                            Delivery address
                        </Text>
                        <Text style={{ fontSize: 13, color: '#374151', lineHeight: 1.6, marginTop: 0 }}>
                            {order.shipping_name}<br />
                            {order.shipping_address}<br />
                            {order.shipping_city}, {order.shipping_state} — {order.shipping_pincode}
                        </Text>

                        <Text style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>
                            Estimated delivery: 7–14 business days
                        </Text>

                        {/* CTA */}
                        <Button
                            href={`${process.env.NEXT_PUBLIC_STORE_URL ?? 'https://trendlo.me'}/track?order=${order.order_number}`}
                            style={{
                                backgroundColor: '#FF6B35',
                                color: '#FFFFFF',
                                borderRadius: 8,
                                padding: '12px 28px',
                                fontSize: 14,
                                fontWeight: 600,
                                display: 'block',
                                textAlign: 'center',
                                marginTop: 24,
                                textDecoration: 'none',
                            }}
                        >
                            Track Your Order →
                        </Button>
                    </Section>

                    {/* Footer */}
                    <Section style={{ textAlign: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                            Trendlo · orders@trendlo.me
                        </Text>
                        <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>
                            You received this because you placed an order on trendlo.me
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    )
}