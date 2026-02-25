'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, SlidersHorizontal, Package, Truck, RotateCcw, CheckCircle, Clock } from 'lucide-react';

const NAVY = '#6366f1';

type OrderStatus = 'Ready to ship' | 'Order delivered' | 'Processing' | 'Cancelled';

interface Order {
    id: string;
    orderNo: string;
    productName: string;
    productCode: string;
    total: number;
    status: OrderStatus;
    placedOn: string;
    returnBy?: string;
    shipTo: string;
    image: string;
}

const MOCK_ORDERS: Order[] = [
    { id: 'o1', orderNo: '652147', productName: 'CDC-3800 STD. Silver', productCode: 'CDC-3800', total: 5100, status: 'Ready to ship', placedOn: '4-Feb-2022', shipTo: 'Ankit Dasmana', image: '🔧' },
    { id: 'o2', orderNo: '459826', productName: 'CDC-4800 STD. Silver', productCode: 'CDC-4800', total: 7850, status: 'Order delivered', placedOn: '27-Jan-2022', returnBy: '10-Feb-2022', shipTo: 'Ankit Dasmana', image: '🔩' },
    { id: 'o3', orderNo: '324589', productName: 'NSK-680 STD. Silver', productCode: 'NSK-680', total: 2600, status: 'Order delivered', placedOn: '05-Jan-2022', shipTo: 'Ankit Dasmana', image: '⚙️' },
    { id: 'o4', orderNo: '218970', productName: 'NSK-780 STD. Silver', productCode: 'NSK-780', total: 6400, status: 'Processing', placedOn: '22-Feb-2022', shipTo: 'Ankit Dasmana', image: '🔨' },
];

const STATUS_CONFIG: Record<OrderStatus, { color: string; bg: string; Icon: React.ElementType }> = {
    'Ready to ship': { color: '#d97706', bg: '#fffbeb', Icon: Truck },
    'Order delivered': { color: '#059669', bg: '#ecfdf5', Icon: CheckCircle },
    'Processing': { color: '#6366f1', bg: '#eef2ff', Icon: Clock },
    'Cancelled': { color: '#dc2626', bg: '#fef2f2', Icon: RotateCcw },
};

export default function OrdersPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();
    const [tracked, setTracked] = useState<Record<string, boolean>>({});
    const [returning, setReturning] = useState<string | null>(null);

    if (!isLoggedIn) { router.replace('/login'); return null; }

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ArrowLeft size={18} color={NAVY} />
                    </button>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1a2332' }}>My Orders</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: '#f4f6f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <SlidersHorizontal size={15} color="#64748b" />
                    </button>
                </div>
            </div>

            {/* Filter bar */}
            <div style={{ background: '#f4f6f9', padding: '10px 16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', border: '1px solid #e8ecf0', borderRadius: 8, padding: '6px 12px', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <SlidersHorizontal size={14} color="#64748b" />
                    <span style={{ fontSize: 13, color: '#475569' }}>Filter</span>
                </button>
            </div>

            <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 12px 8px' }}>

                {MOCK_ORDERS.map(order => {
                    const cfg = STATUS_CONFIG[order.status];
                    const isDelivered = order.status === 'Order delivered';
                    const isShipping = order.status === 'Ready to ship';
                    const isTracked = tracked[order.id];

                    return (
                        <div key={order.id} style={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 16, marginBottom: 12, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                            <div style={{ padding: '14px 16px', display: 'flex', gap: 12 }}>
                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: '#059669', margin: '0 0 4px', letterSpacing: '0.02em' }}>Order#: {order.orderNo}</p>
                                    <p style={{ fontSize: 15, fontWeight: 800, color: '#1a2332', margin: '0 0 8px', letterSpacing: '-0.2px' }}>{order.productName}</p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                                        <Row label="Total" value={`₹${order.total.toLocaleString('en-IN')}`} />
                                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                            <span style={{ fontSize: 12, color: '#64748b' }}>Order Status:</span>
                                            <span style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{order.status}</span>
                                        </div>
                                        <Row label="Order Placed" value={order.placedOn} />
                                        {order.returnBy && <Row label="Return Order" value={order.returnBy} />}
                                        <Row label="Ship To" value={order.shipTo} />
                                    </div>
                                </div>

                                {/* Product image */}
                                <div style={{ width: 88, height: 88, background: '#f8f9fb', border: '1px solid #e8ecf0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 40 }}>
                                    {order.image}
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div style={{ padding: '0 16px 14px', display: 'flex', gap: 10 }}>
                                {isShipping && (
                                    <button
                                        onClick={() => setTracked(t => ({ ...t, [order.id]: true }))}
                                        style={{ padding: '8px 20px', background: isTracked ? '#ecfdf5' : '#fff', border: `1px solid ${isTracked ? '#a7f3d0' : '#059669'}`, borderRadius: 8, color: isTracked ? '#059669' : '#059669', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                                        {isTracked ? <><CheckCircle size={14} />Tracking…</> : <><Truck size={14} />Track Order</>}
                                    </button>
                                )}
                                {isDelivered && (
                                    <button
                                        onClick={() => setReturning(order.id)}
                                        style={{ padding: '8px 20px', background: returning === order.id ? '#fef2f2' : '#fff', border: `1px solid ${returning === order.id ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 8, color: returning === order.id ? '#dc2626' : '#475569', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                                        <RotateCcw size={14} />{returning === order.id ? 'Return Requested' : 'Return Order'}
                                    </button>
                                )}
                                {order.status === 'Processing' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: '#eef2ff', borderRadius: 8 }}>
                                        <Clock size={14} color="#6366f1" />
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>Processing…</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Empty state if needed */}
                {MOCK_ORDERS.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                        <Package size={52} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
                        <p style={{ fontSize: 16, fontWeight: 700, color: '#475569', margin: '0 0 4px' }}>No orders yet</p>
                        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>Your orders will appear here</p>
                    </div>
                )}
            </div>

            {/* Return modal */}
            {returning && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setReturning(null)}>
                    <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px', width: '100%' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#1a2332', margin: '0 0 8px' }}>Return Order</h3>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px', lineHeight: 1.6 }}>Please select the reason for return. Our team will pick up within 3-5 business days.</p>
                        {['Damaged product', 'Wrong item received', 'Changed my mind', 'Product not as described'].map(reason => (
                            <button key={reason} onClick={() => setReturning(null)}
                                style={{ width: '100%', padding: '12px 14px', background: '#f8f9fb', border: '1px solid #e8ecf0', borderRadius: 10, textAlign: 'left', fontSize: 14, color: '#374151', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8, fontWeight: 500 }}>
                                {reason}
                            </button>
                        ))}
                        <button onClick={() => setReturning(null)} style={{ width: '100%', padding: '13px', background: NAVY, border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
                            Submit Return Request
                        </button>
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}

function Row({ label, value }: { label: string; value: string }) {
    return (
        <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>
            {label}: <span style={{ color: '#374151', fontWeight: 500 }}>{value}</span>
        </p>
    );
}
