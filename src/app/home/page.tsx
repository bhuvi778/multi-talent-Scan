'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import {
    Menu, X, Bell, QrCode, Star, ChevronRight,
    User, History, ShoppingBag, Package, Shield, Phone,
    LogOut, Home, Gift
} from 'lucide-react';

const NAVY = '#1c3f6e';
const NAVY2 = '#16325a';

/* ── Tier colours ── */
const TIER_CLR: Record<string, string> = {
    Bronze: '#cd7f32', Silver: '#94a3b8', Gold: '#f59e0b', Diamond: '#6366f1', Platinum: '#7c3aed',
};

/* ── Home grid sections ── */
const SCHEMES: GridCell[] = [
    { icon: '🏆', label: 'Loyalty\nSchemes', path: '/profile' },
    { icon: '📷', label: 'Scan & Win', path: '/scan' },
    { icon: '📣', label: 'Current\nCampaign', path: '/redeem' },
    { icon: '👥', label: 'Refer\n& Earn', path: '/redeem' },
];
const REWARDS: GridCell[] = [
    { icon: '🎁', label: 'Brand\nVoucher', path: '/redeem' },
    { icon: '🖥️', label: 'Product\nCatalogue', path: '/cart' },
    { icon: '🧪', label: 'Ozone\nProducts', path: '/ozone-products' },
];
const ANNOUNCE: GridCell[] = [
    { icon: '📢', label: "What's New", path: '/contact' },
    { icon: '📅', label: 'Events', path: '/contact' },
    { icon: '📱', label: 'Social', path: '/contact' },
    { icon: '🎓', label: 'Training\n& Meets', path: '/contact' },
];
const HELP: GridCell[] = [
    { icon: '☎️', label: 'Contact Us', path: '/contact' },
    { icon: '❓', label: 'FAQs', path: '/contact' },
    { icon: '▶️', label: 'App\nTutorial', path: '/contact' },
    { icon: '🤖', label: 'Chat Bot', path: '/contact' },
];

interface GridCell { icon: string; label: string; path: string; }

/* ── Sidebar nav items ── */
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

export default function HomePage() {
    const router = useRouter();
    const { user, isLoggedIn, logout } = useAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => { if (!isLoggedIn) router.replace('/login'); }, [isLoggedIn, router]);
    if (!user) return null;

    const tierColor = TIER_CLR[user.tier] ?? '#f59e0b';

    const nav = (path: string) => { setSidebarOpen(false); router.push(path); };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80, position: 'relative' }}>

            {/* ══════════════════════════════
                SIDEBAR OVERLAY
            ══════════════════════════════ */}
            {sidebarOpen && (
                <div
                    id="sidebar-overlay"
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 200, backdropFilter: 'blur(2px)' }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ══════════════════════════════
                SIDEBAR DRAWER
            ══════════════════════════════ */}
            <aside id="sidebar-drawer" style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: 270,
                background: '#fff', zIndex: 201,
                transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
                display: 'flex', flexDirection: 'column',
                boxShadow: sidebarOpen ? '4px 0 40px rgba(0,0,0,0.18)' : 'none',
            }}>
                {/* Sidebar header */}
                <div style={{ background: NAVY, padding: '40px 20px 20px', position: 'relative' }}>
                    <button id="sidebar-close" onClick={() => setSidebarOpen(false)}
                        style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <X size={16} color="#fff" />
                    </button>
                    <div style={{ width: 52, height: 52, borderRadius: 16, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.2)' }}>
                        <Star size={24} color={NAVY} fill={NAVY} />
                    </div>
                    <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{user.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 10px' }}>+91 {user.phone}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ background: tierColor, borderRadius: 6, padding: '3px 10px' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#fff', margin: 0 }}>{user.tier} Star</p>
                        </div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: 0 }}>
                            {user.totalPoints.toLocaleString('en-IN')} pts
                        </p>
                    </div>
                </div>

                {/* Sidebar links */}
                <nav style={{ flex: 1, overflowY: 'auto', padding: '10px 0' }}>
                    {SIDEBAR_LINKS.map(({ Icon, label, path }) => (
                        <button key={path} onClick={() => nav(path)}
                            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '13px 20px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#f4f6f9'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}>
                            <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <Icon size={17} color={NAVY} />
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2332' }}>{label}</span>
                            <ChevronRight size={14} color="#cbd5e1" style={{ marginLeft: 'auto' }} />
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div style={{ padding: '12px 16px 24px', borderTop: '1px solid #f1f5f9' }}>
                    <button onClick={() => { setSidebarOpen(false); logout(); router.replace('/login'); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <LogOut size={17} color="#dc2626" />
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#dc2626' }}>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* ══════════════════════════════
                TOP HEADER
            ══════════════════════════════ */}
            <div style={{ background: NAVY, padding: '0 16px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, marginBottom: 14 }}>
                    {/* Hamburger menu */}
                    <button id="home-hamburger" onClick={() => setSidebarOpen(true)}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 9, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Menu size={20} color="#fff" />
                    </button>

                    {/* Brand */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star size={17} color={NAVY} fill={NAVY} />
                        </div>
                        <div>
                            <p style={{ fontSize: 15, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.4px' }}>OzoSTARS</p>
                            <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', margin: 0 }}>एक पहल, बेहतरी के साथ</p>
                        </div>
                    </div>

                    {/* Bell */}
                    <button id="home-bell" onClick={() => router.push('/profile')}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: 9, width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                        <Bell size={18} color="#fff" />
                        <span style={{ position: 'absolute', top: 7, right: 7, width: 7, height: 7, background: '#ef4444', borderRadius: '50%', border: '1.5px solid ' + NAVY }} />
                    </button>
                </div>

                {/* Points / tier bar */}
                <button id="home-points-bar" onClick={() => router.push('/profile')}
                    style={{ width: '100%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <div>
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', margin: '0 0 3px', fontWeight: 500 }}>
                            Welcome, {user.name.split(' ')[0]} 👋
                        </p>
                        <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.5px' }}>
                            {user.totalPoints.toLocaleString('en-IN')}{' '}
                            <span style={{ fontSize: 13, fontWeight: 500 }}>Points</span>
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ background: tierColor, borderRadius: 8, padding: '4px 12px', marginBottom: 4 }}>
                            <p style={{ fontSize: 11, fontWeight: 800, color: '#fff', margin: 0 }}>{user.tier} Star</p>
                        </div>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: 0 }}>View Membership →</p>
                    </div>
                </button>
            </div>

            {/* ══════════════════════════════
                BODY
            ══════════════════════════════ */}

            {/* Scan banner */}
            <div style={{ margin: '12px 12px 0', background: '#fff', borderRadius: 14, border: '1.5px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', cursor: 'pointer', boxShadow: '0 1px 8px rgba(0,0,0,0.06)' }}
                onClick={() => router.push('/scan')}>
                <div style={{ width: 46, height: 46, background: NAVY, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <QrCode size={22} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: NAVY, margin: '0 0 2px' }}>Scan & Win Points</p>
                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Scan product QR codes to earn loyalty points</p>
                </div>
                <div style={{ background: NAVY, borderRadius: 8, padding: '7px 14px', flexShrink: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: '#fff', margin: 0 }}>Scan</p>
                </div>
            </div>

            {/* My Orders quick link */}
            <div style={{ margin: '10px 12px 0', background: '#fff', borderRadius: 14, border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', cursor: 'pointer', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                onClick={() => router.push('/orders')}>
                <div style={{ width: 40, height: 40, background: '#fffbeb', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 20 }}>
                    📦
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#1a2332', margin: '0 0 1px' }}>My Orders</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Track or return your product orders</p>
                </div>
                <ChevronRight size={16} color="#94a3b8" />
            </div>

            {/* Sections grid */}
            <div style={{ padding: '12px 12px 0' }}>
                <Section title="Schemes and Offers" cols={4} items={SCHEMES} nav={nav} />
                <Section title="Reward Store" cols={3} items={REWARDS} nav={nav} />
                <Section title="Announcement & Social" cols={4} items={ANNOUNCE} nav={nav} />
                <Section title="Help & Support" cols={4} items={HELP} nav={nav} />
            </div>

            <BottomNav />
        </div>
    );
}

/* ── Section component ── */
function Section({ title, cols, items, nav }: { title: string; cols: number; items: GridCell[]; nav: (p: string) => void }) {
    return (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e8ecf0', padding: '14px 12px', marginBottom: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <p style={{ fontSize: 14, fontWeight: 800, color: '#1a2332', margin: '0 0 12px' }}>{title}</p>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
                {items.map(({ icon, label, path }) => (
                    <button key={label} onClick={() => nav(path)}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '10px 4px 10px', background: '#f8f9fb', border: '1px solid #e8ecf0', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#eef2ff'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#f8f9fb'; e.currentTarget.style.borderColor = '#e8ecf0'; }}>
                        <div style={{ width: 44, height: 44, background: '#fff', borderRadius: 12, border: '1px solid #e8ecf0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                            {icon}
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#374151', textAlign: 'center', lineHeight: 1.3, whiteSpace: 'pre-line' }}>{label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
