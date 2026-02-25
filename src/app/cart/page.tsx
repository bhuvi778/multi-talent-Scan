'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, ShoppingCart, SlidersHorizontal, Check } from 'lucide-react';

const NAVY = '#6366f1';

const PRODUCTS = [
    { id: 'p1', name: 'Hot Water Bottle', mrp: 450, pts: 1030, image: '🧴', category: 'Health' },
    { id: 'p2', name: 'Mechanical Weight\nMachine', mrp: 1395, pts: 2420, image: '⚖️', category: 'Health' },
    { id: 'p3', name: 'Glen Multi Mixer\nGrinder', mrp: 3195, pts: 3440, image: '🔄', category: 'Kitchen' },
    { id: 'p4', name: 'Maharaja Food\nProcessor', mrp: 7999, pts: 12970, image: '🥤', category: 'Kitchen' },
    { id: 'p5', name: 'BT Speakers', mrp: 1999, pts: 2800, image: '🔊', category: 'Electronics' },
    { id: 'p6', name: 'Skullcandy Mini\n& Dime', mrp: 2499, pts: 3600, image: '🎧', category: 'Electronics' },
    { id: 'p7', name: 'Air Purifier', mrp: 5999, pts: 8500, image: '💨', category: 'Home' },
    { id: 'p8', name: 'Electric Kettle', mrp: 1299, pts: 1900, image: '☕', category: 'Kitchen' },
];

export default function CartPage() {
    const router = useRouter();
    const { isLoggedIn, user } = useAuthStore();
    const { addItem, items } = useCartStore();
    const [added, setAdded] = useState<Record<string, boolean>>({});
    const [viewCart, setViewCart] = useState(false);

    if (!isLoggedIn) { router.replace('/login'); return null; }

    const cartCount = items.reduce((a, i) => a + i.quantity, 0);

    const handleAdd = (product: typeof PRODUCTS[0]) => {
        addItem({ id: product.id, title: product.name.replace('\n', ' '), description: product.category, pointsRequired: product.pts, value: product.mrp, image: product.image, stock: 99, isAvailable: true, tenantId: 'tenant-001', category: 'white-goods' as const });
        setAdded(a => ({ ...a, [product.id]: true }));
        setTimeout(() => setAdded(a => ({ ...a, [product.id]: false })), 1500);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ArrowLeft size={18} color={NAVY} />
                    </button>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1a2332' }}>Product Catalogue</span>
                </div>
                <button onClick={() => setViewCart(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative' }}>
                    <ShoppingCart size={22} color={NAVY} />
                    {cartCount > 0 && (
                        <span style={{ position: 'absolute', top: -6, right: -6, width: 17, height: 17, background: NAVY, borderRadius: '50%', fontSize: 10, fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff' }}>
                            {cartCount > 9 ? '9+' : cartCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Points info bar */}
            <div style={{ background: '#fff', padding: '8px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>Your available points</p>
                <p style={{ fontSize: 14, fontWeight: 800, color: NAVY, margin: 0 }}>{(user?.redeemablePoints ?? 0).toLocaleString('en-IN')} Pts</p>
            </div>

            {/* Filter bar */}
            <div style={{ background: '#fff', padding: '8px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                    <SlidersHorizontal size={16} color="#64748b" />
                    <span style={{ fontSize: 13, color: '#64748b' }}>Filter</span>
                </button>
            </div>

            {/* Product grid */}
            <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 480, margin: '0 auto' }}>
                {PRODUCTS.map(product => {
                    const isAdded = added[product.id];
                    const canAfford = (user?.redeemablePoints ?? 0) >= product.pts;
                    return (
                        <div key={product.id} style={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                            {/* Image area */}
                            <div style={{ height: 120, background: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ fontSize: 52 }}>{product.image}</span>
                            </div>
                            {/* Info */}
                            <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a2332', margin: 0, lineHeight: 1.3, whiteSpace: 'pre-line' }}>{product.name}</p>
                                <div style={{ marginTop: 4 }}>
                                    <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px' }}>MRP: <span style={{ textDecoration: 'line-through' }}>₹{product.mrp.toLocaleString()}</span></p>
                                    <p style={{ fontSize: 12, fontWeight: 700, color: NAVY, margin: 0 }}>
                                        Reward Price: <span style={{ color: '#6366f1' }}>Pt. {product.pts.toLocaleString()}</span>
                                    </p>
                                </div>
                                <button onClick={() => handleAdd(product)}
                                    disabled={!canAfford}
                                    style={{ width: '100%', marginTop: 8, padding: '9px', background: isAdded ? '#059669' : canAfford ? NAVY : '#e2e8f0', border: 'none', borderRadius: 8, color: isAdded ? '#fff' : canAfford ? '#fff' : '#94a3b8', fontSize: 12, fontWeight: 700, cursor: canAfford ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                                    {isAdded ? <><Check size={14} />Added!</> : 'Add to cart'}
                                </button>
                                {!canAfford && (
                                    <p style={{ fontSize: 10, color: '#94a3b8', textAlign: 'center', margin: '4px 0 0' }}>Need {(product.pts - (user?.redeemablePoints ?? 0)).toLocaleString()} more pts</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Cart modal */}
            {viewCart && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setViewCart(false)}>
                    <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '24px 20px', width: '100%', maxHeight: '70vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#1a2332', margin: 0 }}>My Cart ({cartCount})</h3>
                            <button onClick={() => setViewCart(false)} style={{ background: '#f4f6f9', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', fontSize: 16 }}>✕</button>
                        </div>
                        {items.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px 0' }}>Your cart is empty</p>
                        ) : (
                            <>
                                {items.map(({ reward, quantity }) => (
                                    <div key={reward.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f1f5f9' }}>
                                        <div>
                                            <p style={{ fontSize: 13, fontWeight: 700, color: '#1a2332', margin: '0 0 2px', whiteSpace: 'pre-line' }}>{reward.title}</p>
                                            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Qty: {quantity} × {reward.pointsRequired.toLocaleString()} pts</p>
                                        </div>
                                        <p style={{ fontSize: 14, fontWeight: 800, color: NAVY, margin: 0 }}>{(reward.pointsRequired * quantity).toLocaleString()} Pts</p>
                                    </div>
                                ))}
                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '2px solid #e8ecf0', marginTop: 8 }}>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#1a2332', margin: 0 }}>Total</p>
                                    <p style={{ fontSize: 16, fontWeight: 900, color: NAVY, margin: 0 }}>{items.reduce((a, i) => a + i.reward.pointsRequired * i.quantity, 0).toLocaleString()} Pts</p>
                                </div>
                                <button style={{ width: '100%', padding: '14px', background: NAVY, border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Redeem Now
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
