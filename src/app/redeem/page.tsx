'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useCartStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import { ShoppingCart, Plus, Check, Zap, Gift, Smartphone, Coffee, ShoppingBag, Plane } from 'lucide-react';
import type { Reward, RewardCategory } from '@/types';

type Category = 'All' | 'Vouchers' | 'Electronics' | 'Food' | 'Travel' | 'Lifestyle';

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
    All: <Gift size={16} />,
    Vouchers: <Zap size={16} />,
    Electronics: <Smartphone size={16} />,
    Food: <Coffee size={16} />,
    Travel: <Plane size={16} />,
    Lifestyle: <ShoppingBag size={16} />,
};

const CATEGORIES: Category[] = ['All', 'Vouchers', 'Electronics', 'Food', 'Travel', 'Lifestyle'];

// Extended reward with UI extras
interface RewardItem extends Reward {
    displayCategory: Category;
    popular: boolean;
    subtitle: string;
    imageEmoji: string;
}

const REWARDS: RewardItem[] = [
    { id: 'r1', title: 'Amazon Gift Card', subtitle: '₹500 voucher', description: 'Amazon gift voucher', image: '🛒', imageEmoji: '🛒', pointsRequired: 1000, value: 500, stock: 50, isAvailable: true, tenantId: 'tenant-001', category: 'gift-cards' as RewardCategory, displayCategory: 'Vouchers', popular: true },
    { id: 'r2', title: 'Flipkart Voucher', subtitle: '₹250 voucher', description: 'Flipkart shopping voucher', image: '🏪', imageEmoji: '🏪', pointsRequired: 500, value: 250, stock: 100, isAvailable: true, tenantId: 'tenant-001', category: 'gift-cards' as RewardCategory, displayCategory: 'Vouchers', popular: false },
    { id: 'r3', title: 'Wireless Earbuds', subtitle: 'Noise Cancellation', description: 'Premium wireless earbuds', image: '🎧', imageEmoji: '🎧', pointsRequired: 3500, value: 1800, stock: 10, isAvailable: true, tenantId: 'tenant-001', category: 'electronics' as RewardCategory, displayCategory: 'Electronics', popular: true },
    { id: 'r4', title: 'Smart Watch', subtitle: 'Fitness tracker', description: 'Advanced fitness smartwatch', image: '⌚', imageEmoji: '⌚', pointsRequired: 5000, value: 2500, stock: 0, isAvailable: false, tenantId: 'tenant-001', category: 'electronics' as RewardCategory, displayCategory: 'Electronics', popular: false },
    { id: 'r5', title: 'Zomato Credits', subtitle: '₹300 food credits', description: 'Zomato food ordering credits', image: '🍕', imageEmoji: '🍕', pointsRequired: 700, value: 300, stock: 200, isAvailable: true, tenantId: 'tenant-001', category: 'gift-cards' as RewardCategory, displayCategory: 'Food', popular: false },
    { id: 'r6', title: 'MakeMyTrip', subtitle: '₹1000 travel voucher', description: 'MakeMyTrip travel booking voucher', image: '✈️', imageEmoji: '✈️', pointsRequired: 2000, value: 1000, stock: 30, isAvailable: true, tenantId: 'tenant-001', category: 'holidays' as RewardCategory, displayCategory: 'Travel', popular: true },
    { id: 'r7', title: 'Myntra Voucher', subtitle: '₹750 fashion voucher', description: 'Myntra fashion shopping voucher', image: '👗', imageEmoji: '👗', pointsRequired: 1500, value: 750, stock: 40, isAvailable: true, tenantId: 'tenant-001', category: 'beauty' as RewardCategory, displayCategory: 'Lifestyle', popular: false },
    { id: 'r8', title: 'Netflix Subscription', subtitle: '1 Month Premium', description: 'Netflix 1 month premium', image: '🎬', imageEmoji: '🎬', pointsRequired: 2500, value: 649, stock: 999, isAvailable: true, tenantId: 'tenant-001', category: 'gift-cards' as RewardCategory, displayCategory: 'Lifestyle', popular: true },
];

export default function RedeemPage() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuthStore();
    const { addItem, items } = useCartStore();
    const [activeCategory, setActiveCategory] = useState<Category>('All');
    const [added, setAdded] = useState<string[]>([]);
    const cartCount = items.reduce((a, i) => a + i.quantity, 0);

    if (!isLoggedIn) { router.replace('/login'); return null; }

    const filtered = activeCategory === 'All' ? REWARDS : REWARDS.filter(r => r.displayCategory === activeCategory);

    const handleAdd = (reward: RewardItem) => {
        if (!reward.isAvailable) return;
        addItem(reward);
        setAdded(a => [...a, reward.id]);
        setTimeout(() => setAdded(a => a.filter(id => id !== reward.id)), 2000);
    };

    const canAfford = (pts: number): boolean => (user?.redeemablePoints || 0) >= pts;

    return (
        <div className="page-with-bottom-nav" style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                <div>
                    <h1 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 1px', letterSpacing: '-0.3px' }}>Redeem Points</h1>
                    <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Balance: <strong style={{ color: '#6366f1' }}>{user?.redeemablePoints?.toLocaleString('en-IN')} pts</strong></p>
                </div>
                <button onClick={() => router.push('/cart')} style={{ position: 'relative', padding: '10px 14px', background: cartCount > 0 ? '#eef2ff' : '#f8fafc', border: `1.5px solid ${cartCount > 0 ? '#c7d2fe' : '#e2e8f0'}`, borderRadius: 13, display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer' }}>
                    <ShoppingCart size={17} color={cartCount > 0 ? '#6366f1' : '#64748b'} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: cartCount > 0 ? '#6366f1' : '#64748b' }}>{cartCount}</span>
                </button>
            </div>

            <div style={{ maxWidth: 480, margin: '0 auto' }}>

                {/* Category tabs */}
                <div style={{ display: 'flex', gap: 8, padding: '16px 16px 0', overflowX: 'auto' }}>
                    {CATEGORIES.map(cat => (
                        <button key={cat} onClick={() => setActiveCategory(cat)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: activeCategory === cat ? '#6366f1' : '#fff', border: `1.5px solid ${activeCategory === cat ? '#6366f1' : '#e2e8f0'}`, borderRadius: 999, fontSize: 13, fontWeight: activeCategory === cat ? 700 : 500, color: activeCategory === cat ? '#fff' : '#64748b', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.2s', boxShadow: activeCategory === cat ? '0 4px 12px rgba(99,102,241,0.25)' : 'none' }}>
                            <span style={{ opacity: activeCategory === cat ? 1 : 0.6 }}>{CATEGORY_ICONS[cat]}</span>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <div style={{ padding: '14px 16px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}><span style={{ fontWeight: 700, color: '#0f172a' }}>{filtered.length}</span> rewards available</p>
                    {filtered.some(r => r.popular) && <span style={{ fontSize: 11, color: '#d97706', fontWeight: 700, background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 999, padding: '2px 9px' }}>⭐ Popular picks</span>}
                </div>

                {/* Reward cards */}
                <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {filtered.map(reward => {
                        const affordable = canAfford(reward.pointsRequired);
                        const wasAdded = added.includes(reward.id);
                        const inCart = items.some(i => i.reward.id === reward.id);

                        return (
                            <div key={reward.id} style={{ background: '#fff', border: `1.5px solid ${!reward.isAvailable ? '#f1f5f9' : inCart ? '#c7d2fe' : '#e2e8f0'}`, borderRadius: 20, padding: '16px', display: 'flex', gap: 14, alignItems: 'center', opacity: !reward.isAvailable ? 0.55 : 1, transition: 'all 0.2s', boxShadow: inCart ? '0 4px 16px rgba(99,102,241,0.1)' : '0 1px 4px rgba(0,0,0,0.03)' }}
                                onMouseEnter={e => { if (reward.isAvailable) e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = inCart ? '0 4px 16px rgba(99,102,241,0.1)' : '0 1px 4px rgba(0,0,0,0.03)'; }}>
                                {/* Image */}
                                <div style={{ width: 62, height: 62, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0 }}>
                                    {reward.imageEmoji}
                                </div>

                                {/* Info */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                                        <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reward.title}</p>
                                        {reward.popular && <span style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', borderRadius: 999, fontSize: 9, fontWeight: 700, padding: '1px 6px', flexShrink: 0 }}>HOT</span>}
                                    </div>
                                    <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 8px' }}>{reward.subtitle}</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <span style={{ fontSize: 14, fontWeight: 800, color: affordable ? '#6366f1' : '#94a3b8' }}>{reward.pointsRequired.toLocaleString()} pts</span>
                                        <span style={{ fontSize: 11, color: '#94a3b8' }}>·</span>
                                        <span style={{ fontSize: 12, color: '#059669', fontWeight: 700 }}>₹{reward.value.toLocaleString()}</span>
                                        {!affordable && reward.isAvailable && (
                                            <span style={{ fontSize: 10, color: '#dc2626', background: '#fef2f2', padding: '1px 7px', borderRadius: 999, fontWeight: 600, border: '1px solid #fecaca' }}>
                                                Need {(reward.pointsRequired - (user?.redeemablePoints || 0)).toLocaleString()} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Add button */}
                                {!reward.isAvailable ? (
                                    <span style={{ fontSize: 11, color: '#94a3b8', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 10, padding: '6px 10px', fontWeight: 600, flexShrink: 0 }}>Out of Stock</span>
                                ) : (
                                    <button
                                        id={`add-${reward.id}`}
                                        onClick={() => handleAdd(reward)}
                                        disabled={!affordable || wasAdded}
                                        style={{ width: 40, height: 40, borderRadius: 13, border: 'none', background: wasAdded ? '#ecfdf5' : affordable ? '#6366f1' : '#f1f5f9', color: wasAdded ? '#059669' : affordable ? '#fff' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: affordable && !wasAdded ? 'pointer' : 'not-allowed', flexShrink: 0, boxShadow: affordable && !wasAdded ? '0 4px 12px rgba(99,102,241,0.25)' : 'none', transition: 'all 0.25s' }}>
                                        {wasAdded ? <Check size={18} /> : <Plus size={18} />}
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Cart CTA */}
                {cartCount > 0 && (
                    <div style={{ position: 'sticky', bottom: 84, left: 0, right: 0, padding: '12px 16px' }}>
                        <button onClick={() => router.push('/cart')} style={{ width: '100%', padding: '15px 20px', background: '#6366f1', border: 'none', borderRadius: 18, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(99,102,241,0.35)' }}>
                            <span style={{ background: 'rgba(255,255,255,0.2)', borderRadius: 999, width: 26, height: 26, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>{cartCount}</span>
                            <span>View Cart & Redeem</span>
                            <ShoppingCart size={18} />
                        </button>
                    </div>
                )}
            </div>

            <BottomNav />
        </div>
    );
}
