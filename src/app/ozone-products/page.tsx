'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, ChevronRight, Play, ShoppingCart } from 'lucide-react';

const NAVY = '#1c3f6e';

const CATEGORIES = ['All', 'Door Closers', 'Floor Springs', 'Hinges', 'Locks', 'Handles'];
const SBUS = ['All SBUs', 'Architectural Hardware', 'Glass Fittings', 'Ozone Smart'];

const PRODUCTS = [
    { id: 'op1', code: 'CDC-3800', name: 'CDC-3800 STD. Silver', price: 5100.00, image: '🔧', category: 'Door Closers' },
    { id: 'op2', code: 'CDC-4800', name: 'CDC-4800 STD. Silver', price: 7850.00, image: '🔩', category: 'Door Closers' },
    { id: 'op3', code: 'NSK-680', name: 'NSK-680 STD. Silver', price: 2600.00, image: '⚙️', category: 'Floor Springs' },
    { id: 'op4', code: 'NSK-780', name: 'NSK-780 STD. Silver', price: 6400.00, image: '🔨', category: 'Floor Springs' },
    { id: 'op5', code: 'NSK-680B', name: 'NSK-680 STD. Silver', price: 2600.00, image: '⚙️', category: 'Hinges' },
    { id: 'op6', code: 'NSK-780B', name: 'NSK-780 STD. Silver', price: 6400.00, image: '🔨', category: 'Hinges' },
];

export default function OzoneProductsPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSbu, setSelectedSbu] = useState('All SBUs');
    const [showCatPicker, setShowCatPicker] = useState(false);
    const [showSbuPicker, setShowSbuPicker] = useState(false);
    const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

    if (!isLoggedIn) { router.replace('/login'); return null; }

    const filtered = PRODUCTS.filter(p =>
        (selectedCategory === 'All' || p.category === selectedCategory)
    );

    const handleAdd = (id: string) => {
        setAddedItems(a => ({ ...a, [id]: true }));
        setTimeout(() => setAddedItems(a => ({ ...a, [id]: false })), 1500);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, position: 'sticky', top: 0, zIndex: 50 }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={18} color={NAVY} />
                </button>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#1a2332' }}>Ozone Products</span>
            </div>

            {/* Filter chips */}
            <div style={{ background: '#fff', padding: '12px 16px', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: 10 }}>
                {/* Category selector */}
                <button onClick={() => { setShowCatPicker(true); setShowSbuPicker(false); }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#fff', border: `1.5px solid ${showCatPicker ? NAVY : '#cbd5e1'}`, borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: 13, color: selectedCategory === 'All' ? '#64748b' : NAVY, fontWeight: selectedCategory === 'All' ? 400 : 700 }}>
                        {selectedCategory === 'All' ? 'Select product category' : selectedCategory}
                    </span>
                    <ChevronRight size={14} color="#94a3b8" />
                </button>

                {/* SBU selector */}
                <button onClick={() => { setShowSbuPicker(true); setShowCatPicker(false); }}
                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 12px', background: '#fff', border: `1.5px solid ${showSbuPicker ? NAVY : '#cbd5e1'}`, borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <span style={{ fontSize: 13, color: selectedSbu === 'All SBUs' ? '#64748b' : NAVY, fontWeight: selectedSbu === 'All SBUs' ? 400 : 700 }}>
                        {selectedSbu === 'All SBUs' ? 'Select product SBUs' : selectedSbu}
                    </span>
                    <ChevronRight size={14} color="#94a3b8" />
                </button>
            </div>

            {/* Product grid */}
            <div style={{ padding: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 480, margin: '0 auto' }}>
                {filtered.map(product => (
                    <div key={product.id} style={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}>
                        {/* Image */}
                        <div style={{ height: 120, background: '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid #f1f5f9', position: 'relative' }}>
                            <span style={{ fontSize: 52 }}>{product.image}</span>
                        </div>
                        {/* Info */}
                        <div style={{ padding: '10px 12px 12px' }}>
                            <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', margin: '0 0 8px', lineHeight: 1.3 }}>{product.name}</p>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <p style={{ fontSize: 15, fontWeight: 800, color: NAVY, margin: 0 }}>
                                    ₹ {product.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </p>
                                <button onClick={() => handleAdd(product.id)}
                                    style={{ width: 30, height: 30, borderRadius: '50%', background: addedItems[product.id] ? '#059669' : '#e53e3e', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
                                    {addedItems[product.id]
                                        ? <span style={{ color: '#fff', fontSize: 14 }}>✓</span>
                                        : <Play size={12} color="#fff" fill="#fff" />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Category Picker Modal */}
            {showCatPicker && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowCatPicker(false)}>
                    <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '20px', width: '100%' }} onClick={e => e.stopPropagation()}>
                        <p style={{ fontSize: 16, fontWeight: 800, color: '#1a2332', margin: '0 0 16px' }}>Select Category</p>
                        {CATEGORIES.map(cat => (
                            <button key={cat} onClick={() => { setSelectedCategory(cat); setShowCatPicker(false); }}
                                style={{ width: '100%', padding: '12px 14px', background: selectedCategory === cat ? '#eef2ff' : '#f8f9fb', border: `1px solid ${selectedCategory === cat ? '#c7d2fe' : '#e8ecf0'}`, borderRadius: 10, textAlign: 'left', fontSize: 14, color: selectedCategory === cat ? NAVY : '#374151', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8, fontWeight: selectedCategory === cat ? 700 : 400 }}>
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* SBU Picker Modal */}
            {showSbuPicker && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }} onClick={() => setShowSbuPicker(false)}>
                    <div style={{ background: '#fff', borderRadius: '24px 24px 0 0', padding: '20px', width: '100%' }} onClick={e => e.stopPropagation()}>
                        <p style={{ fontSize: 16, fontWeight: 800, color: '#1a2332', margin: '0 0 16px' }}>Select SBU</p>
                        {SBUS.map(sbu => (
                            <button key={sbu} onClick={() => { setSelectedSbu(sbu); setShowSbuPicker(false); }}
                                style={{ width: '100%', padding: '12px 14px', background: selectedSbu === sbu ? '#eef2ff' : '#f8f9fb', border: `1px solid ${selectedSbu === sbu ? '#c7d2fe' : '#e8ecf0'}`, borderRadius: 10, textAlign: 'left', fontSize: 14, color: selectedSbu === sbu ? NAVY : '#374151', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8, fontWeight: selectedSbu === sbu ? 700 : 400 }}>
                                {sbu}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <BottomNav />
        </div>
    );
}
