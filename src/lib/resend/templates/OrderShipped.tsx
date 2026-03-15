import {
    Html, Head, Body, Container, Section,
    Text, Button, Hr,
} from '@react-email/components'
import type { Order } from '@/types'

interface Props {
    order: Order
}

export function OrderShippedEmail({ order }: Props) {
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
                        <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: 600, margin: 0 }}>
                            Trendlo<span style={{ color: '#FF6B35' }}>.</span>
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
                            Your order is on its way! 🚚
                        </Text>
                        <Text style={{ color: '#9CA3AF', fontSize: 14 }}>
                            Hi {order.shipping_name}, your Trendlo order has been shipped.
                        </Text>

                        {/* Order number */}
                        <Section style={{
                            backgroundColor: '#FFF3EE',
                            borderRadius: 8,
                            padding: '12px 20px',
                            marginBottom: 24,
                        }}>
                            <Text style={{ color: '#FF6B35', fontSize: 14, fontWeight: 600, margin: 0 }}>
                                Order: {order.order_number}
                            </Text>
                        </Section>

                        {/* Tracking number */}
                        {order.tracking_number && (
                            <>
                                <Text style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                                    Tracking number
                                </Text>
                                <Section style={{
                                    backgroundColor: '#0F0F0F',
                                    borderRadius: 8,
                                    padding: '12px 20px',
                                    marginBottom: 16,
                                }}>
                                    <Text style={{ color: '#FF6B35', fontSize: 16, fontWeight: 600, margin: 0, letterSpacing: 1 }}>
                                        {order.tracking_number}
                                    </Text>
                                </Section>
                            </>
                        )}

                        <Text style={{ fontSize: 13, color: '#374151' }}>
                            Your order is on its way to {order.shipping_city}, {order.shipping_state}.
                            Expected delivery in 7–14 business days.
                        </Text>

                        <Hr style={{ borderColor: '#E5E7EB', margin: '20px 0' }} />

                        {/* CTA */}
                        {order.tracking_url ? (
                            <Button
                                href={order.tracking_url}
                                style={{
                                    backgroundColor: '#FF6B35',
                                    color: '#FFFFFF',
                                    borderRadius: 8,
                                    padding: '12px 28px',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    display: 'block',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                }}
                            >
                                Track Shipment →
                            </Button>
                        ) : (
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
                                    textDecoration: 'none',
                                }}
                            >
                                Track Your Order →
                            </Button>
                        )}
                    </Section>

                    {/* Footer */}
                    <Section style={{ textAlign: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
                            Trendlo · orders@trendlo.me
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    )
}