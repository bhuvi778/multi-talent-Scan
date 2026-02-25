'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import {
    Menu, X, Bell, QrCode, Star, ChevronRight, ChevronLeft,
    User, History, ShoppingBag, Package, Shield, Phone,
    LogOut, Home, Gift, Zap, Search
} from 'lucide-react';

const NAVY = '#6366f1';
const NAVY2 = '#4f46e5';

const TIER_CLR: Record<string, string> = {
    Bronze: '#cd7f32', Silver: '#94a3b8', Gold: '#f59e0b', Diamond: '#6366f1', Platinum: '#7c3aed',
};

const SIDEBAR_LINKS = [
    { Icon: Home, label: 'Home', path: '/home' },
    { Icon: User, label: 'My Profile', path: '/profile' },
    { Icon: History, label: 'My Statement', path: '/history' },
    { Icon: Package, label: 'My Orders', path: '/orders' },
    { Icon: ShoppingBag, label: 'Product Catalogue', path: '/cart' },
    { Icon: Gift, label: 'Redeem Rewards', path: '/redeem' },
    { Icon: Shield, label: 'Asli vs Nakli', path: '/asli-vs-nakli' },
    { Icon: Phone, label: 'Contact Us', path: '/contact' },
];

const DEALS = [
    { emoji: '🎨', title: 'Asian Paints Essentials', sub: 'Up to 50% OFF', bg: 'linear-gradient(135deg,#6366f1,#2563eb)', badge: 'HOT' },
    { emoji: '🖌️', title: 'Berger Paints Sale', sub: 'Upto 30% OFF', bg: 'linear-gradient(135deg,#7c3aed,#a855f7)', badge: 'NEW' },
    { emoji: '🪣', title: 'Nerolac Offer', sub: 'Flat 20% OFF', bg: 'linear-gradient(135deg,#059669,#10b981)', badge: 'DEAL' },
];

const VOUCHERS = [
    { pts: '1,000', title: 'Shopping Voucher', sub: '1000 Points', emoji: '🎁', clr: '#6366f1', bg: '#eef2ff' },
    { pts: '5,000', title: 'Premium Voucher', sub: '5000 Points', emoji: '💎', clr: '#7c3aed', bg: '#f5f3ff' },
    { pts: '500', title: 'Cashback Voucher', sub: '500 Points', emoji: '💸', clr: '#059669', bg: '#ecfdf5' },
];

const TENANTS = [
    { logo: '⚡', name: 'AvoPay', color: '#6366f1', bg: '#eef2ff', logoUrl: 'https://ui-avatars.com/api/?name=AP&background=6366f1&color=fff&size=128&bold=true&font-size=0.45&rounded=true' },
    { logo: '🛍️', name: 'LoyalMart', color: '#f59e0b', bg: '#fffbeb', logoUrl: 'https://ui-avatars.com/api/?name=LM&background=f59e0b&color=fff&size=128&bold=true&font-size=0.45&rounded=true' },
    { logo: '🎨', name: 'AsiaPaint', color: '#dc2626', bg: '#fef2f2', logoUrl: 'https://ui-avatars.com/api/?name=AP&background=dc2626&color=fff&size=128&bold=true&font-size=0.45&rounded=true' },
    { logo: '🖌️', name: 'Berger', color: '#7c3aed', bg: '#f5f3ff', logoUrl: 'https://ui-avatars.com/api/?name=BG&background=7c3aed&color=fff&size=128&bold=true&font-size=0.45&rounded=true' },
    { logo: '🪣', name: 'Nerolac', color: '#059669', bg: '#ecfdf5', logoUrl: 'https://ui-avatars.com/api/?name=NL&background=059669&color=fff&size=128&bold=true&font-size=0.45&rounded=true' },
];

const EVENTS = [
    { emoji: '🛒', title: 'Big Shopping Event', date: '12 Feb 2026', bg: 'linear-gradient(135deg,#6366f1,#3b82f6)' },
    { emoji: '🎵', title: 'Live Concert Event', date: '29 Mar 2026', bg: 'linear-gradient(135deg,#7c3aed,#c026d3)' },
];

/* ── Reusable carousel section ────────────────────────────── */
function Section({
    title, onViewAll, cardWidth, gap = 12, children,
}: {
    title: string;
    onViewAll?: () => void;
    cardWidth: number;
    gap?: number;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const scroll = (dir: 'left' | 'right') => {
        if (!ref.current) return;
        ref.current.scrollBy({ left: dir === 'right' ? cardWidth + gap : -(cardWidth + gap), behavior: 'smooth' });
    };

    return (
        <div style={{ marginTop: 18 }}>
            {/* Title row */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12, gap: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 800, color: '#1a2332', margin: 0, flex: 1 }}>{title}</p>
                {onViewAll && (
                    <span onClick={onViewAll} style={{ fontSize: 12, color: NAVY, fontWeight: 700, cursor: 'pointer', marginRight: 4 }}>
                        View all
                    </span>
                )}
                {/* Prev / Next arrow buttons */}
                <button onClick={() => scroll('left')} style={{ width: 28, height: 28, borderRadius: 8, background: '#eef2ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ChevronLeft size={14} color={NAVY} strokeWidth={2.5} />
                </button>
                <button onClick={() => scroll('right')} style={{ width: 28, height: 28, borderRadius: 8, background: '#eef2ff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ChevronRight size={14} color={NAVY} strokeWidth={2.5} />
                </button>
            </div>

            {/* Scrollable track — no scrollbar */}
            <div
                ref={ref}
                style={{
                    display: 'flex', gap, overflowX: 'auto', paddingBottom: 2,
                    scrollbarWidth: 'none',          /* Firefox */
                    msOverflowStyle: 'none',         /* IE/Edge */
                } as React.CSSProperties}
            >
                {children}
            </div>

            {/* Hide webkit scrollbar via inline <style> */}
            <style>{`div::-webkit-scrollbar{display:none}`}</style>
        </div>
    );
}

/* ── Main page ────────────────────────────────────────────── */
export default function HomePage() {
    const router = useRouter();
    const { user, isLoggedIn, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => { if (!isLoggedIn) router.replace('/login'); }, [isLoggedIn, router]);
    if (!user) return null;

    const tierColor = TIER_CLR[user.tier] ?? '#f59e0b';
    const nav = (path: string) => { setSidebarOpen(false); router.push(path); };
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return (
        <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>

            {/* ── Sidebar overlay ── */}
            {sidebarOpen && (
                <div onClick={() => setSidebarOpen(false)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(3px)' }} />
            )}

            {/* ── Sidebar drawer ── */}
            <aside style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: 275, zIndex: 201,
                background: '#fff', display: 'flex', flexDirection: 'column',
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: sidebarOpen ? '6px 0 40px rgba(0,0,0,0.18)' : 'none',
            }}>
                <div style={{ background: `linear-gradient(160deg,${NAVY},${NAVY2})`, padding: '44px 20px 22px', position: 'relative' }}>
                    <button onClick={() => setSidebarOpen(false)}
                        style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 9, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={16} color="#fff" />
                    </button>
                    <div style={{ width: 54, height: 54, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
                        <Zap size={26} color={NAVY} fill={NAVY} />
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{user.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', margin: '0 0 12px' }}>+91 {user.phone}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ background: tierColor, borderRadius: 6, padding: '3px 10px', fontSize: 11, fontWeight: 700, color: '#fff' }}>{user.tier}</span>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user.totalPoints.toLocaleString('en-IN')} pts</span>
                    </div>
                </div>
                <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                    {SIDEBAR_LINKS.map(({ Icon, label, path }) => (
                        <button key={path} onClick={() => nav(path)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={17} color={NAVY} />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2332', flex: 1 }}>{label}</span>
                            <ChevronRight size={14} color="#cbd5e1" />
                        </button>
                    ))}
                </nav>
                <div style={{ padding: '12px 16px 28px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={() => { setSidebarOpen(false); logout(); router.replace('/login'); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <LogOut size={17} color="#dc2626" />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ── Top header ── */}
            <div style={{ background: `linear-gradient(160deg,${NAVY} 0%,${NAVY2} 100%)`, padding: '0 16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, marginBottom: 14 }}>
                    <button id="home-hamburger" onClick={() => setSidebarOpen(true)}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 9, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Menu size={20} color="#fff" />
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <Zap size={18} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: 17, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px' }}>AvoPay</span>
                    </div>
                    <button id="home-bell" onClick={() => router.push('/profile')}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 9, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                        <Bell size={18} color="#fff" />
                        <span style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, background: '#ef4444', borderRadius: '50%', border: '1.5px solid ' + NAVY }} />
                    </button>
                </div>

                <p style={{ fontSize: 18, fontWeight: 800, color: '#fff', margin: '0 0 14px', letterSpacing: '-0.3px' }}>
                    {greeting}, {user.name.split(' ')[0]}! 👋
                </p>

                <div style={{ background: '#fff', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', marginBottom: 16 }}>
                    <Search size={16} color="#94a3b8" />
                    <span style={{ fontSize: 13, color: '#94a3b8', flex: 1 }}>Search Reward</span>
                    <QrCode size={16} color={NAVY} />
                </div>

                <div style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: 18, padding: '16px', backdropFilter: 'blur(8px)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                        <div>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your Points</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>
                                    {user.totalPoints.toLocaleString('en-IN')}
                                </span>
                                <span style={{ fontSize: 20 }}>⭐</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', margin: '0 0 4px', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Your Level</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 28, height: 28, borderRadius: 8, background: tierColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 14 }}>🏅</span>
                                </div>
                                <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{user.tier}</span>
                            </div>
                        </div>
                    </div>
                    <div onClick={() => router.push('/profile')}
                        style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                        <QrCode size={16} color="#fff" />
                        <span style={{ fontSize: 12, color: '#fff', fontWeight: 600 }}>QR Code Card Member</span>
                        <ChevronRight size={14} color="rgba(255,255,255,0.6)" style={{ marginLeft: 'auto' }} />
                    </div>
                </div>
            </div>

            {/* ── Collect Stamps banner ── */}
            <div onClick={() => router.push('/redeem')}
                style={{ margin: '14px 14px 0', background: 'linear-gradient(135deg,#f59e0b,#d97706)', borderRadius: 14, padding: '13px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}>
                <span style={{ fontSize: 22 }}>🎯</span>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '0 0 1px' }}>Collect Stamps, Unlock Rewards!</p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Scan more products to level up</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ChevronRight size={16} color="#fff" />
                </div>
            </div>

            {/* ── Scrollable sections ── */}
            <div style={{ padding: '0 14px' }}>

                {/* Deals */}
                <Section title="Top Deals For You" onViewAll={() => router.push('/ozone-products')} cardWidth={190}>
                    {DEALS.map((d, i) => (
                        <div key={i} onClick={() => router.push('/cashback')}
                            style={{ minWidth: 190, borderRadius: 16, background: d.bg, padding: '18px 14px', cursor: 'pointer', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
                            <span style={{ position: 'absolute', top: 10, right: 10, background: '#f59e0b', color: '#fff', fontSize: 9, fontWeight: 900, borderRadius: 6, padding: '2px 7px' }}>{d.badge}</span>
                            <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>{d.emoji}</span>
                            <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '0 0 3px', lineHeight: 1.3 }}>{d.title}</p>
                            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{d.sub}</p>
                        </div>
                    ))}
                </Section>

                {/* Spin the Wheel */}
                <div onClick={() => router.push('/redeem')}
                    style={{ marginTop: 14, background: 'linear-gradient(135deg,#fff7ed,#fef3c7)', border: '1.5px solid #fde68a', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', boxShadow: '0 2px 12px rgba(245,158,11,0.15)' }}>
                    <span style={{ fontSize: 40 }}>🎡</span>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#92400e', margin: '0 0 2px' }}>Spin the Wheel</p>
                        <p style={{ fontSize: 11, color: '#b45309', margin: '0 0 8px' }}>1 chance available</p>
                        <div style={{ background: '#f59e0b', borderRadius: 8, padding: '7px 16px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>Spin Now</span>
                            <ChevronRight size={13} color="#fff" />
                        </div>
                    </div>
                </div>

                {/* Redeem Vouchers */}
                <Section title="Redeem Your Points" onViewAll={() => router.push('/redeem')} cardWidth={150}>
                    {VOUCHERS.map((v, i) => (
                        <div key={i} onClick={() => router.push('/redeem')}
                            style={{ minWidth: 150, background: v.bg, border: `1.5px solid ${v.clr}22`, borderRadius: 16, padding: '16px 14px', cursor: 'pointer', flexShrink: 0 }}>
                            <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>{v.emoji}</span>
                            <p style={{ fontSize: 20, fontWeight: 900, color: v.clr, margin: '0 0 2px' }}>₹{v.pts}</p>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#1a2332', margin: '0 0 2px' }}>{v.title}</p>
                            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{v.sub}</p>
                        </div>
                    ))}
                </Section>

                {/* Mall Tenants */}
                <Section title="Mall Tenants" cardWidth={72} gap={16}>
                    {TENANTS.map((t, i) => (
                        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', flexShrink: 0 }}>
                            <div style={{ width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${t.color}33`, boxShadow: `0 4px 12px ${t.color}22`, flexShrink: 0 }}>
                                <img
                                    src={t.logoUrl}
                                    alt={t.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = ''; (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                                />
                            </div>
                            <p style={{ fontSize: 10, fontWeight: 700, color: '#374151', margin: 0, textAlign: 'center' }}>{t.name}</p>
                        </div>
                    ))}
                </Section>

                {/* Events */}
                <Section title="Events & Experiences" onViewAll={() => router.push('/contact')} cardWidth={165} >
                    {EVENTS.map((e, i) => (
                        <div key={i}
                            style={{ minWidth: 165, borderRadius: 16, background: e.bg, padding: '20px 14px', cursor: 'pointer', flexShrink: 0 }}>
                            <span style={{ fontSize: 36, display: 'block', marginBottom: 8 }}>{e.emoji}</span>
                            <p style={{ fontSize: 13, fontWeight: 800, color: '#fff', margin: '0 0 4px', lineHeight: 1.3 }}>{e.title}</p>
                            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', margin: 0 }}>📅 {e.date}</p>
                        </div>
                    ))}
                </Section>

            </div>

            <BottomNav />
        </div>
    );
}
