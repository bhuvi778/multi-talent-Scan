'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Languages, Bell, QrCode } from 'lucide-react';

const NAVY = '#6366f1';

const TIERS = [
    { name: 'Silver', color: '#94a3b8', min: 0, borderColor: '#cbd5e1' },
    { name: 'Gold', color: '#f59e0b', min: 5000, borderColor: '#fcd34d' },
    { name: 'Platinum', color: '#7c3aed', min: 15000, borderColor: '#c4b5fd' },
];

const TIER_COLORS: Record<string, string> = {
    Bronze: '#cd7f32', Silver: '#94a3b8', Gold: '#f59e0b', Diamond: '#6366f1', Platinum: '#7c3aed',
};

export default function ProfilePage() {
    const router = useRouter();
    const { user, isLoggedIn, logout, tenant } = useAuthStore();
    const [activeTab, setActiveTab] = useState<'MEMBERSHIP' | 'MESSAGES' | 'POINTS' | 'REWARDS'>('MEMBERSHIP');

    if (!isLoggedIn || !user) { router.replace('/login'); return null; }

    const tierColor = TIER_COLORS[user.tier] || '#f59e0b';
    const currentTierIdx = TIERS.findIndex(t => t.name === user.tier);
    const currentTierInfo = TIERS[currentTierIdx] || TIERS[0];

    const TABS: typeof activeTab[] = ['MEMBERSHIP', 'MESSAGES', 'POINTS', 'REWARDS'];

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
                <button onClick={() => router.push('/home')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: NAVY, fontFamily: 'inherit' }}>
                    <ArrowLeft size={18} color={NAVY} />
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1a2332' }}>My Membership</span>
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                    <button style={{ background: '#f4f6f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Languages size={15} color="#64748b" /></button>
                    <button style={{ background: '#f4f6f9', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                        <Bell size={15} color="#64748b" />
                        <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, background: '#ef4444', borderRadius: '50%', border: '1px solid #fff' }} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div style={{ background: '#fff', borderBottom: '2px solid #e8ecf0', display: 'flex' }}>
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        style={{ flex: 1, padding: '11px 4px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: 11, fontWeight: 700, color: activeTab === tab ? NAVY : '#94a3b8', borderBottom: `2px solid ${activeTab === tab ? NAVY : 'transparent'}`, marginBottom: -2, fontFamily: 'inherit', letterSpacing: '0.04em' }}>
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>

                {/* ── Membership Card ── */}
                <div style={{ background: NAVY, borderRadius: 18, padding: '18px 20px', marginBottom: 20, position: 'relative', overflow: 'hidden', boxShadow: '0 6px 24px rgba(28,63,110,0.3)' }}>
                    {/* BG pattern */}
                    <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                    <div style={{ position: 'absolute', bottom: -30, left: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, position: 'relative' }}>
                        {/* QR */}
                        <div style={{ background: '#fff', borderRadius: 10, padding: 6, width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <QrCode size={44} color={NAVY} strokeWidth={1.5} />
                        </div>
                        {/* Tenant logo */}
                        <div style={{ background: '#fff', borderRadius: 12, padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {tenant.logoUrl ? (
                                <img
                                    src={tenant.logoUrl}
                                    alt={tenant.name}
                                    style={{ width: 36, height: 36, borderRadius: 10, objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: 36, height: 36, borderRadius: 10, background: tenant.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>
                                        {tenant.name.slice(0, 2).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div>
                                <p style={{ fontSize: 11, fontWeight: 900, color: tenant.primaryColor, margin: 0, letterSpacing: '-0.2px' }}>{tenant.name}</p>
                                <p style={{ fontSize: 8, color: '#64748b', margin: 0 }}>एक पहल, बेहतरी के साथ</p>
                            </div>
                        </div>
                    </div>

                    <div style={{ position: 'relative' }}>
                        <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.3px' }}>{user.name}</p>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', margin: '0 0 16px' }}>{user.tier} Star</p>
                        <div style={{ height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '0 0 2px' }}>Points:</p>
                                <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>{user.totalPoints.toLocaleString('en-IN')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Tier Progression ── */}
                <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ecf0', padding: '20px 16px', boxShadow: '0 1px 6px rgba(0,0,0,0.04)', marginBottom: 16 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 20px' }}>Tier Progression</p>

                    <div style={{ display: 'flex', gap: 0 }}>
                        {/* Left: "You Are Here" label + vertical line */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 16, paddingTop: 10 }}>
                            <div style={{ width: 2, flex: 1, background: '#e2e8f0', borderRadius: 1 }} />
                        </div>

                        {/* Right: tiers */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                <div style={{ background: '#e2e8f0', borderRadius: 6, padding: '4px 10px' }}>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#374141', margin: 0 }}>You Are Here</p>
                                </div>
                                <div style={{ height: 1, flex: 1, background: '#e2e8f0' }} />
                            </div>

                            {TIERS.map((tier, i) => {
                                const isCurrent = tier.name === user.tier;
                                const isPassed = i < currentTierIdx;
                                return (
                                    <div key={tier.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < TIERS.length - 1 ? 16 : 0 }}>
                                        {/* Circle */}
                                        <div style={{ width: 56, height: 56, borderRadius: '50%', border: `3px solid ${isCurrent ? tier.color : isPassed ? '#e2e8f0' : '#e2e8f0'}`, background: isCurrent ? '#fff' : '#f8f9fb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: isCurrent ? `0 0 0 6px ${tier.color}22` : 'none' }}>
                                            <p style={{ fontSize: 13, fontWeight: 900, color: isCurrent ? tier.color : '#94a3b8', margin: 0 }}>{tier.name}</p>
                                        </div>
                                        {/* Info */}
                                        <div style={{ flex: 1 }}>
                                            {isCurrent && <div style={{ background: NAVY, borderRadius: 4, padding: '2px 8px', display: 'inline-block', marginBottom: 4 }}><p style={{ fontSize: 9, fontWeight: 800, color: '#fff', margin: 0 }}>CURRENT</p></div>}
                                            <p style={{ fontSize: 12, fontWeight: 700, color: isCurrent ? '#1a2332' : '#94a3b8', margin: 0 }}>
                                                {isCurrent ? `${user.totalPoints.toLocaleString()} pts` : `From ${tier.min.toLocaleString()} pts`}
                                            </p>
                                        </div>
                                        {/* Help icon */}
                                        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#f4f6f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                                            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>?</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                        { label: 'Redeemable Points', value: user.redeemablePoints.toLocaleString(), color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
                        { label: 'Lifetime Points', value: user.lifetimePoints.toLocaleString(), color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
                    ].map(({ label, value, color, bg, border }) => (
                        <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '14px 16px' }}>
                            <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 4px', fontWeight: 600 }}>{label}</p>
                            <p style={{ fontSize: 22, fontWeight: 900, color, margin: 0, letterSpacing: '-0.5px' }}>{value}</p>
                            <p style={{ fontSize: 10, color: '#94a3b8', margin: '2px 0 0' }}>pts</p>
                        </div>
                    ))}
                </div>

                {/* Quick links */}
                {[
                    { icon: '📄', label: 'My Statement', sub: 'View transaction history', path: '/history' },
                    { icon: '🎁', label: 'Redeem Points', sub: 'Vouchers & rewards', path: '/redeem' },
                    { icon: '🛒', label: 'Product Catalogue', sub: 'Shop with points', path: '/cart' },
                    { icon: '📷', label: 'Scan QR Code', sub: 'Earn points by scanning', path: '/scan' },
                ].map(({ icon, label, sub, path }) => (
                    <button key={label} onClick={() => router.push(path)}
                        style={{ width: '100%', background: '#fff', border: '1px solid #e8ecf0', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', fontFamily: 'inherit', marginBottom: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', textAlign: 'left' }}>
                        <span style={{ fontSize: 22 }}>{icon}</span>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#1a2332', margin: '0 0 2px' }}>{label}</p>
                            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{sub}</p>
                        </div>
                        <span style={{ color: '#94a3b8', fontSize: 18 }}>›</span>
                    </button>
                ))}

                {/* Sign Out */}
                <button onClick={() => { logout(); router.replace('/login'); }}
                    style={{ width: '100%', padding: '13px', background: '#fff', border: '1.5px solid #fee2e2', borderRadius: 14, color: '#dc2626', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
                    Sign Out
                </button>
            </div>

            <BottomNav />
        </div>
    );
}
