'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdminStore, useTenantStore, MOCK_TENANTS } from '@/store';
import {
    LayoutDashboard, Building2, Users, BarChart2, Settings, LogOut, Bell,
    TrendingUp, TrendingDown, DollarSign, Star, ShoppingBag, CheckCircle,
    Clock, XCircle, Plus, Trash2, Edit, Eye, Search, ChevronDown, Menu, X,
    Globe, Shield, Zap, Activity, PieChart, AlertCircle, ChevronRight, Download
} from 'lucide-react';

type Tab = 'dashboard' | 'tenants' | 'users' | 'analytics' | 'settings';

const DARK = '#0f172a';
const DARKER = '#020617';
const CARD = '#1e293b';
const BORDER = '#334155';
const INDIGO = '#6366f1';
const PURPLE = '#a855f7';
const GREEN = '#10b981';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const CYAN = '#06b6d4';

// ── MOCK DATA ──────────────────────────────────────────────
const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
const REVENUE_DATA = [42, 58, 47, 71, 65, 89, 103];
const USERS_DATA = [120, 180, 240, 310, 380, 450, 520];
const SCANS_DATA = [800, 1200, 950, 1600, 1400, 1900, 2200];

const MOCK_USERS = [
    { id: 'U001', name: 'Rahul Sharma', phone: '9876543210', tier: 'Gold', points: 4750, kyc: 'verified', tenant: 'Avopasy', joined: 'Jan 2024' },
    { id: 'U002', name: 'Priya Singh', phone: '9812345678', tier: 'Silver', points: 2100, kyc: 'pending', tenant: 'LoyalMart', joined: 'Feb 2024' },
    { id: 'U003', name: 'Amit Kumar', phone: '9898989898', tier: 'Platinum', points: 18200, kyc: 'verified', tenant: 'Avopasy', joined: 'Nov 2023' },
    { id: 'U004', name: 'Sunita Devi', phone: '9765432109', tier: 'Bronze', points: 450, kyc: 'not_started', tenant: 'AsiaPaint', joined: 'Mar 2024' },
    { id: 'U005', name: 'Vijay Patel', phone: '9654321098', tier: 'Diamond', points: 9800, kyc: 'verified', tenant: 'Berger', joined: 'Oct 2023' },
    { id: 'U006', name: 'Kavya Menon', phone: '9543210987', tier: 'Gold', points: 5200, kyc: 'rejected', tenant: 'Nerolac', joined: 'Dec 2023' },
];

const MOCK_TENANTS_FULL = [
    { id: 'T001', name: 'Avopasy', subdomain: 'avopasy', plan: 'Enterprise', users: 284, revenue: 1.24, status: 'active', color: '#6366f1', created: 'Jan 2024' },
    { id: 'T002', name: 'LoyalMart', subdomain: 'loyalmart', plan: 'Pro', users: 147, revenue: 0.68, status: 'active', color: '#f59e0b', created: 'Feb 2024' },
    { id: 'T003', name: 'AsiaPaint', subdomain: 'asiapaint', plan: 'Starter', users: 58, revenue: 0.22, status: 'active', color: '#dc2626', created: 'Mar 2024' },
    { id: 'T004', name: 'Berger Paints', subdomain: 'berger', plan: 'Pro', users: 93, revenue: 0.41, status: 'inactive', color: '#7c3aed', created: 'Dec 2023' },
    { id: 'T005', name: 'Nerolac', subdomain: 'nerolac', plan: 'Starter', users: 31, revenue: 0.14, status: 'active', color: '#059669', created: 'Apr 2024' },
];

const RECENT_ACTIVITY = [
    { icon: '👤', text: 'New user registered on LoyalMart', time: '2m ago', type: 'user' },
    { icon: '🏢', text: 'Tenant "PaintZone" requested activation', time: '15m ago', type: 'tenant' },
    { icon: '💰', text: 'Cashback ₹2,400 approved for Avopasy', time: '1h ago', type: 'payment' },
    { icon: '⚠️', text: 'KYC rejection spike on AsiaPaint', time: '2h ago', type: 'alert' },
    { icon: '📊', text: 'Monthly report generated', time: '3h ago', type: 'report' },
    { icon: '🔐', text: 'Admin login from new device', time: '5h ago', type: 'security' },
];

// ── MINI CHART (SVG) ──────────────────────────────────────
function LineChart({ data, color, height = 60, label }: { data: number[]; color: string; height?: number; label?: string }) {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const w = 280; const h = height;
    const pts = data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / (max - min + 1)) * h;
        return `${x},${y}`;
    }).join(' ');
    const areaPath = `M0,${h} L${pts.split(' ').map(p => p).join(' L')} L${w},${h} Z`;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height }} preserveAspectRatio="none">
            <defs>
                <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <path d={areaPath} fill={`url(#grad-${color.replace('#', '')})`} />
            <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {data.map((v, i) => {
                const x = (i / (data.length - 1)) * w;
                const y = h - ((v - min) / (max - min + 1)) * h;
                return i === data.length - 1 ? <circle key={i} cx={x} cy={y} r="4" fill={color} /> : null;
            })}
        </svg>
    );
}

function BarChart({ data, color }: { data: number[]; color: string }) {
    const max = Math.max(...data);
    const w = 280; const h = 80;
    const bw = w / data.length - 4;
    return (
        <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: h }}>
            {data.map((v, i) => {
                const bh = (v / max) * h;
                const x = i * (w / data.length) + 2;
                const y = h - bh;
                return (
                    <g key={i}>
                        <rect x={x} y={y} width={bw} height={bh} rx={3} fill={`${color}33`} />
                        <rect x={x} y={y} width={bw} height={4} rx={2} fill={color} />
                    </g>
                );
            })}
        </svg>
    );
}

function DonutChart({ vals, colors }: { vals: number[]; colors: string[] }) {
    const total = vals.reduce((a, b) => a + b, 0);
    const r = 40; const cx = 50; const cy = 50;
    let angle = -90;
    const slices = vals.map((v, i) => {
        const sweep = (v / total) * 360;
        const rad1 = (angle * Math.PI) / 180;
        const rad2 = ((angle + sweep) * Math.PI) / 180;
        const x1 = cx + r * Math.cos(rad1);
        const y1 = cy + r * Math.sin(rad1);
        const x2 = cx + r * Math.cos(rad2);
        const y2 = cy + r * Math.sin(rad2);
        const large = sweep > 180 ? 1 : 0;
        const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`;
        angle += sweep;
        return <path key={i} d={d} fill={colors[i]} stroke={CARD} strokeWidth="2" />;
    });
    return (
        <svg viewBox="0 0 100 100" style={{ width: 90, height: 90 }}>
            {slices}
            <circle cx={cx} cy={cy} r={24} fill={CARD} />
        </svg>
    );
}

// ── STAT CARD ─────────────────────────────────────────────
function StatCard({ label, value, sub, trend, color, icon, chart }: {
    label: string; value: string; sub: string; trend: number; color: string; icon: React.ReactNode; chart?: React.ReactNode;
}) {
    const up = trend >= 0;
    return (
        <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, background: `${color}15`, borderRadius: '0 16px 0 80px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, background: `${color}20`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: up ? '#10b98120' : '#ef444420', borderRadius: 8, padding: '3px 8px' }}>
                    {up ? <TrendingUp size={12} color={GREEN} /> : <TrendingDown size={12} color={RED} />}
                    <span style={{ fontSize: 11, fontWeight: 700, color: up ? GREEN : RED }}>{Math.abs(trend)}%</span>
                </div>
            </div>
            <p style={{ fontSize: 26, fontWeight: 900, color: '#f8fafc', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{value}</p>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#94a3b8', margin: '0 0 8px' }}>{label}</p>
            {chart && <div style={{ marginTop: 8 }}>{chart}</div>}
            <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>{sub}</p>
        </div>
    );
}

// ── MAIN ──────────────────────────────────────────────────
export default function SuperAdminDashboard() {
    const router = useRouter();
    const { isLoggedIn, email, logout } = useSuperAdminStore();
    const [tab, setTab] = useState<Tab>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [showAddTenant, setShowAddTenant] = useState(false);
    const [newTenant, setNewTenant] = useState({ name: '', subdomain: '', plan: 'Starter', color: '#6366f1' });
    const [tenants, setTenants] = useState(MOCK_TENANTS_FULL);
    const [saving, setSaving] = useState(false);

    useEffect(() => { if (!isLoggedIn) router.replace('/superadmin/login'); }, [isLoggedIn, router]);
    if (!isLoggedIn) return null;

    const NAV = [
        { id: 'dashboard' as Tab, Icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'tenants' as Tab, Icon: Building2, label: 'Tenants' },
        { id: 'users' as Tab, Icon: Users, label: 'Users' },
        { id: 'analytics' as Tab, Icon: BarChart2, label: 'Analytics' },
        { id: 'settings' as Tab, Icon: Settings, label: 'Settings' },
    ];

    const filteredUsers = MOCK_USERS.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.phone.includes(search) || u.tenant.toLowerCase().includes(search.toLowerCase())
    );

    const filteredTenants = tenants.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) || t.subdomain.includes(search)
    );

    const handleAddTenant = () => {
        if (!newTenant.name || !newTenant.subdomain) return;
        setSaving(true);
        setTimeout(() => {
            setTenants(prev => [...prev, {
                id: `T00${prev.length + 1}`,
                name: newTenant.name,
                subdomain: newTenant.subdomain,
                plan: newTenant.plan,
                users: 0,
                revenue: 0,
                status: 'active',
                color: newTenant.color,
                created: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
            }]);
            setSaving(false);
            setShowAddTenant(false);
            setNewTenant({ name: '', subdomain: '', plan: 'Starter', color: '#6366f1' });
        }, 1000);
    };

    const deleteTenant = (id: string) => setTenants(prev => prev.filter(t => t.id !== id));

    // Sidebar
    const Sidebar = () => (
        <>
            {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 299 }} />}
            <aside style={{ position: 'fixed', top: 0, left: 0, bottom: 0, width: 220, zIndex: 300, background: DARKER, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)', transition: 'transform 0.25s', boxShadow: '4px 0 24px rgba(0,0,0,0.5)' }}>
                {/* Logo */}
                <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${BORDER}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#6366f1,#a855f7)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={18} color="#fff" /></div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 900, color: '#f8fafc', margin: 0 }}>Avopasy</p>
                            <p style={{ fontSize: 10, color: '#475569', margin: 0 }}>Super Admin</p>
                        </div>
                    </div>
                </div>
                {/* Nav */}
                <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
                    {NAV.map(({ id, Icon, label }) => {
                        const active = tab === id;
                        return (
                            <button key={id} onClick={() => { setTab(id); setSidebarOpen(false); }}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 10, border: 'none', background: active ? `${INDIGO}20` : 'none', cursor: 'pointer', fontFamily: 'inherit', marginBottom: 2, textAlign: 'left', borderLeft: active ? `3px solid ${INDIGO}` : '3px solid transparent', transition: 'all 0.15s' }}>
                                <Icon size={16} color={active ? INDIGO : '#64748b'} />
                                <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? INDIGO : '#64748b' }}>{label}</span>
                            </button>
                        );
                    })}
                </nav>
                {/* User info */}
                <div style={{ padding: '12px', borderTop: `1px solid ${BORDER}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>SA</span></div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#f8fafc', margin: 0 }}>Super Admin</p>
                            <p style={{ fontSize: 10, color: '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</p>
                        </div>
                    </div>
                    <button onClick={() => { logout(); router.replace('/superadmin/login'); }}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#ef444415', border: '1px solid #ef444430', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
                        <LogOut size={13} color={RED} /><span style={{ fontSize: 12, fontWeight: 700, color: RED }}>Sign Out</span>
                    </button>
                </div>
            </aside>
        </>
    );

    // Header
    const Header = () => (
        <div style={{ background: DARKER, borderBottom: `1px solid ${BORDER}`, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 4 }}><Menu size={20} color="#94a3b8" /></button>
            <div style={{ flex: 1 }}>
                <p style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', margin: 0, textTransform: 'capitalize' }}>{tab}</p>
                <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>Avopasy Super Admin Portal</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button style={{ background: `${BORDER}60`, border: `1px solid ${BORDER}`, borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
                    <Bell size={16} color="#94a3b8" />
                    <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, background: RED, borderRadius: '50%', border: `2px solid ${DARKER}` }} />
                </button>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>SA</span>
                </div>
            </div>
        </div>
    );

    // ── DASHBOARD TAB ──
    const DashboardTab = () => (
        <div style={{ padding: '20px 16px' }}>
            {/* Welcome */}
            <div style={{ background: `linear-gradient(135deg,${INDIGO},${PURPLE})`, borderRadius: 20, padding: '20px 24px', marginBottom: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', bottom: -20, right: 40, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <Zap size={20} color="#fbbf24" fill="#fbbf24" />
                    <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0 }}>Good morning, Super Admin! 👋</p>
                </div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: '0 0 16px' }}>Here's what's happening across all tenants today.</p>
                <div style={{ display: 'flex', gap: 20 }}>
                    {[{ label: 'Total Revenue', val: '₹2.69L' }, { label: 'Active Tenants', val: '4/5' }, { label: 'Online Users', val: '127' }].map(({ label, val }) => (
                        <div key={label}>
                            <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 2px' }}>{val}</p>
                            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)', margin: 0 }}>{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                <StatCard label="Total Users" value="613" sub="+42 this month" trend={7.4} color={INDIGO} icon={<Users size={18} color={INDIGO} />} chart={<LineChart data={USERS_DATA} color={INDIGO} height={40} />} />
                <StatCard label="Revenue" value="₹2.69L" sub="Across all tenants" trend={15.2} color={GREEN} icon={<DollarSign size={18} color={GREEN} />} chart={<LineChart data={REVENUE_DATA} color={GREEN} height={40} />} />
                <StatCard label="Total Scans" value="8,050" sub="QR codes scanned" trend={12.8} color={AMBER} icon={<Activity size={18} color={AMBER} />} chart={<BarChart data={SCANS_DATA.slice(-5)} color={AMBER} />} />
                <StatCard label="Points Issued" value="4.8M" sub="Lifetime total" trend={-2.1} color={PURPLE} icon={<Star size={18} color={PURPLE} />} chart={<LineChart data={[38, 44, 41, 55, 49, 62, 58]} color={PURPLE} height={40} />} />
            </div>

            {/* Charts Row */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px', marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: 0 }}>Revenue Trend</p>
                        <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>Last 7 months (in Lakhs)</p>
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: GREEN, background: '#10b98120', padding: '3px 8px', borderRadius: 6 }}>+15.2%</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 100 }}>
                    {REVENUE_DATA.map((v, i) => {
                        const max = Math.max(...REVENUE_DATA);
                        const h = (v / max) * 80;
                        const isLast = i === REVENUE_DATA.length - 1;
                        return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <p style={{ fontSize: 9, color: isLast ? GREEN : '#475569', fontWeight: 700, margin: 0 }}>{v}</p>
                                <div style={{ width: '100%', height: h, background: isLast ? `linear-gradient(180deg,${GREEN},${GREEN}88)` : `${INDIGO}40`, borderRadius: '4px 4px 2px 2px', transition: 'all 0.3s' }} />
                                <p style={{ fontSize: 8, color: '#334155', margin: 0 }}>{MONTHS[i]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tenant Distribution + Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {/* Donut */}
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px' }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', margin: '0 0 12px' }}>User Distribution</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <DonutChart vals={[284, 147, 58, 93, 31]} colors={[INDIGO, AMBER, RED, PURPLE, GREEN]} />
                        <div style={{ flex: 1 }}>
                            {[{ l: 'Avopasy', c: INDIGO, v: 47 }, { l: 'LoyalMart', c: AMBER, v: 24 }, { l: 'AsiaPaint', c: RED, v: 10 }, { l: 'Berger', c: PURPLE, v: 15 }, { l: 'Nerolac', c: GREEN, v: 5 }].map(({ l, c, v }) => (
                                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: 2, background: c, flexShrink: 0 }} />
                                    <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, flex: 1 }}>{l}</p>
                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{v}%</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* KYC Stats */}
                <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '16px' }}>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', margin: '0 0 12px' }}>KYC Status</p>
                    {[
                        { label: 'Verified', val: 342, color: GREEN, pct: 56 },
                        { label: 'Pending', val: 178, color: AMBER, pct: 29 },
                        { label: 'Not Started', val: 71, color: '#475569', pct: 12 },
                        { label: 'Rejected', val: 22, color: RED, pct: 3 },
                    ].map(({ label, val, color, pct }) => (
                        <div key={label} style={{ marginBottom: 10 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                                <span style={{ fontSize: 11, color: '#94a3b8' }}>{label}</span>
                                <span style={{ fontSize: 11, fontWeight: 700, color }}>{val}</span>
                            </div>
                            <div style={{ height: 4, background: '#1e293b', borderRadius: 2 }}>
                                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2, transition: 'width 0.6s' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <p style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: 0 }}>Recent Activity</p>
                    <span style={{ fontSize: 11, color: INDIGO, fontWeight: 600, cursor: 'pointer' }}>View All</span>
                </div>
                {RECENT_ACTIVITY.map((a, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < RECENT_ACTIVITY.length - 1 ? `1px solid ${BORDER}` : 'none' }}>
                        <span style={{ fontSize: 20 }}>{a.icon}</span>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, flex: 1 }}>{a.text}</p>
                        <span style={{ fontSize: 10, color: '#334155', whiteSpace: 'nowrap' }}>{a.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    // ── TENANTS TAB ──
    const TenantsTab = () => (
        <div style={{ padding: '20px 16px' }}>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenants..." style={{ width: '100%', padding: '10px 12px 10px 34px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 13, color: '#f8fafc', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                </div>
                <button onClick={() => setShowAddTenant(true)} style={{ padding: '10px 16px', background: `linear-gradient(135deg,${INDIGO},${PURPLE})`, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    <Plus size={14} /> Add Tenant
                </button>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                {[
                    { label: 'Total', val: tenants.length, color: INDIGO },
                    { label: 'Active', val: tenants.filter(t => t.status === 'active').length, color: GREEN },
                    { label: 'Revenue', val: '₹2.69L', color: AMBER },
                ].map(({ label, val, color }) => (
                    <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 12, padding: '14px 12px', textAlign: 'center' }}>
                        <p style={{ fontSize: 20, fontWeight: 900, color, margin: '0 0 2px' }}>{val}</p>
                        <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>{label}</p>
                    </div>
                ))}
            </div>

            {/* Tenant Cards */}
            {filteredTenants.map(t => (
                <div key={t.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px', marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${t.color}25`, border: `2px solid ${t.color}50`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span style={{ fontSize: 16, fontWeight: 900, color: t.color }}>{t.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <p style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: 0 }}>{t.name}</p>
                                <span style={{ fontSize: 9, fontWeight: 700, background: t.status === 'active' ? '#10b98120' : '#ef444420', color: t.status === 'active' ? GREEN : RED, border: `1px solid ${t.status === 'active' ? '#10b98140' : '#ef444440'}`, borderRadius: 6, padding: '1px 6px', textTransform: 'uppercase' }}>{t.status}</span>
                            </div>
                            <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>{t.subdomain}.avopasy.com · {t.plan}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 6 }}>
                            <button style={{ width: 30, height: 30, background: `${INDIGO}20`, border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Eye size={13} color={INDIGO} /></button>
                            <button onClick={() => deleteTenant(t.id)} style={{ width: 30, height: 30, background: `${RED}15`, border: 'none', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Trash2 size={13} color={RED} /></button>
                        </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                        {[{ label: 'Users', val: t.users }, { label: 'Revenue', val: `₹${t.revenue}L` }, { label: 'Since', val: t.created }].map(({ label, val }) => (
                            <div key={label} style={{ background: DARKER, borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                                <p style={{ fontSize: 13, fontWeight: 800, color: '#f8fafc', margin: 0 }}>{val}</p>
                                <p style={{ fontSize: 10, color: '#475569', margin: 0 }}>{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    // ── USERS TAB ──
    const UsersTab = () => (
        <div style={{ padding: '20px 16px' }}>
            <div style={{ position: 'relative', marginBottom: 16 }}>
                <Search size={14} color="#475569" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name, phone or tenant..." style={{ width: '100%', padding: '10px 12px 10px 34px', background: CARD, border: `1px solid ${BORDER}`, borderRadius: 10, fontSize: 13, color: '#f8fafc', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
            </div>
            {filteredUsers.map(u => {
                const kycClr = u.kyc === 'verified' ? GREEN : u.kyc === 'pending' ? AMBER : u.kyc === 'rejected' ? RED : '#475569';
                const tierClr: Record<string, string> = { Bronze: '#cd7f32', Silver: '#94a3b8', Gold: AMBER, Diamond: INDIGO, Platinum: PURPLE };
                return (
                    <div key={u.id} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '14px', marginBottom: 10 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: `${INDIGO}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: 14, fontWeight: 900, color: INDIGO }}>{u.name.split(' ').map(w => w[0]).join('').slice(0, 2)}</span>
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', margin: 0 }}>{u.name}</p>
                                    <span style={{ fontSize: 9, fontWeight: 800, color: tierClr[u.tier] || AMBER, background: `${tierClr[u.tier] || AMBER}20`, borderRadius: 5, padding: '1px 6px' }}>{u.tier}</span>
                                </div>
                                <p style={{ fontSize: 11, color: '#475569', margin: 0 }}>📱 {u.phone} · 🏢 {u.tenant}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: 14, fontWeight: 900, color: AMBER, margin: '0 0 2px' }}>{u.points.toLocaleString()}</p>
                                <p style={{ fontSize: 9, color: '#475569', margin: 0 }}>pts</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}` }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                {u.kyc === 'verified' ? <CheckCircle size={12} color={GREEN} /> : u.kyc === 'pending' ? <Clock size={12} color={AMBER} /> : <XCircle size={12} color={RED} />}
                                <span style={{ fontSize: 11, color: kycClr, fontWeight: 600, textTransform: 'capitalize' }}>KYC {u.kyc.replace('_', ' ')}</span>
                            </div>
                            <span style={{ fontSize: 10, color: '#334155' }}>Joined {u.joined}</span>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    // ── ANALYTICS TAB ──
    const AnalyticsTab = () => (
        <div style={{ padding: '20px 16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
                {[
                    { label: 'Avg Points/User', val: '7,834', trend: '+8.2%', color: INDIGO },
                    { label: 'Redemption Rate', val: '34.7%', trend: '+3.1%', color: GREEN },
                    { label: 'Churn Rate', val: '4.2%', trend: '-1.8%', color: CYAN },
                    { label: 'KYC Completion', val: '56%', trend: '+5.4%', color: PURPLE },
                ].map(({ label, val, trend, color }) => (
                    <div key={label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 14, padding: '16px' }}>
                        <p style={{ fontSize: 22, fontWeight: 900, color, margin: '0 0 4px' }}>{val}</p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: '0 0 6px' }}>{label}</p>
                        <span style={{ fontSize: 11, fontWeight: 700, color: trend.startsWith('+') ? GREEN : RED }}>{trend} vs last month</span>
                    </div>
                ))}
            </div>

            {/* Monthly Users Chart */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>User Growth</p>
                <p style={{ fontSize: 11, color: '#475569', margin: '0 0 16px' }}>Monthly active users — last 7 months</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
                    {USERS_DATA.map((v, i) => {
                        const max = Math.max(...USERS_DATA);
                        const h = (v / max) * 80;
                        const isLast = i === USERS_DATA.length - 1;
                        return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <p style={{ fontSize: 8, color: isLast ? CYAN : '#334155', fontWeight: 700, margin: 0 }}>{v}</p>
                                <div style={{ width: '100%', height: h, background: isLast ? `linear-gradient(180deg,${CYAN},${CYAN}88)` : `${CYAN}30`, borderRadius: '4px 4px 2px 2px' }} />
                                <p style={{ fontSize: 8, color: '#1e3a5f', margin: 0 }}>{MONTHS[i]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Tier Distribution */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>Tier Distribution</p>
                {[
                    { tier: 'Diamond', val: 82, color: INDIGO, pct: 13 },
                    { tier: 'Platinum', val: 48, color: PURPLE, pct: 8 },
                    { tier: 'Gold', val: 198, color: AMBER, pct: 32 },
                    { tier: 'Silver', val: 167, color: '#94a3b8', pct: 27 },
                    { tier: 'Bronze', val: 118, color: '#cd7f32', pct: 20 },
                ].map(({ tier, val, color, pct }) => (
                    <div key={tier} style={{ marginBottom: 12 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
                                <span style={{ fontSize: 12, color: '#94a3b8' }}>{tier}</span>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <span style={{ fontSize: 12, color }}>{val} users</span>
                                <span style={{ fontSize: 12, color: '#334155' }}>{pct}%</span>
                            </div>
                        </div>
                        <div style={{ height: 6, background: DARKER, borderRadius: 3 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg,${color},${color}88)`, borderRadius: 3, transition: 'width 0.7s ease' }} />
                        </div>
                    </div>
                ))}
            </div>

            {/* QR Scans trend */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '18px' }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: '0 0 4px' }}>QR Scan Activity</p>
                <p style={{ fontSize: 11, color: '#475569', margin: '0 0 16px' }}>Total scans over time</p>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 100 }}>
                    {SCANS_DATA.map((v, i) => {
                        const max = Math.max(...SCANS_DATA);
                        const h = (v / max) * 80;
                        const isLast = i === SCANS_DATA.length - 1;
                        return (
                            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                <p style={{ fontSize: 8, color: isLast ? AMBER : '#334155', fontWeight: 700, margin: 0 }}>{(v / 1000).toFixed(1)}k</p>
                                <div style={{ width: '100%', height: h, background: isLast ? `linear-gradient(180deg,${AMBER},${AMBER}88)` : `${AMBER}30`, borderRadius: '4px 4px 2px 2px' }} />
                                <p style={{ fontSize: 8, color: '#1e3a5f', margin: 0 }}>{MONTHS[i]}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );

    // ── SETTINGS TAB ──
    const SettingsTab = () => (
        <div style={{ padding: '20px 16px' }}>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>Super Admin Profile</p>
                {[
                    { label: 'Email', val: email },
                    { label: 'Role', val: 'Super Administrator' },
                    { label: 'Access Level', val: 'Full Access — All Tenants' },
                    { label: 'Last Login', val: new Date().toLocaleString('en-IN') },
                ].map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${BORDER}` }}>
                        <span style={{ fontSize: 12, color: '#475569', fontWeight: 600 }}>{label}</span>
                        <span style={{ fontSize: 12, color: '#f8fafc', fontWeight: 700 }}>{val}</span>
                    </div>
                ))}
            </div>
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: '20px', marginBottom: 12 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: '#f8fafc', margin: '0 0 16px' }}>Platform Settings</p>
                {[
                    { label: 'Default Points per Rupee', val: '1.0' },
                    { label: 'Min Redeem Points', val: '500' },
                    { label: 'OTP Validity', val: '5 minutes' },
                    { label: 'KYC Auto-Reject Days', val: '30 days' },
                ].map(({ label, val }) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${BORDER}` }}>
                        <span style={{ fontSize: 12, color: '#475569' }}>{label}</span>
                        <span style={{ fontSize: 12, color: INDIGO, fontWeight: 700 }}>{val}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => { logout(); router.replace('/superadmin/login'); }}
                style={{ width: '100%', padding: '14px', background: '#ef444415', border: '1px solid #ef444440', borderRadius: 12, color: RED, fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                <LogOut size={16} />&nbsp;Sign Out of Super Admin
            </button>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: DARK, fontFamily: "'Inter','Segoe UI',sans-serif", color: '#f8fafc' }}>
            <Sidebar />
            <div style={{ paddingBottom: 40 }}>
                <Header />
                {tab === 'dashboard' && <DashboardTab />}
                {tab === 'tenants' && <TenantsTab />}
                {tab === 'users' && <UsersTab />}
                {tab === 'analytics' && <AnalyticsTab />}
                {tab === 'settings' && <SettingsTab />}
            </div>

            {/* Add Tenant Modal */}
            {showAddTenant && (
                <div onClick={() => setShowAddTenant(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 400, display: 'flex', alignItems: 'flex-end' }}>
                    <div onClick={e => e.stopPropagation()} style={{ background: CARD, borderRadius: '20px 20px 0 0', padding: '24px 20px 40px', width: '100%', maxWidth: 480, margin: '0 auto', border: `1px solid ${BORDER}` }}>
                        <div style={{ width: 36, height: 4, background: BORDER, borderRadius: 2, margin: '0 auto 20px' }} />
                        <p style={{ fontSize: 17, fontWeight: 800, color: '#f8fafc', margin: '0 0 20px' }}>Add New Tenant</p>
                        {[
                            { label: 'Tenant Name', key: 'name', placeholder: 'e.g. SuperMart' },
                            { label: 'Subdomain', key: 'subdomain', placeholder: 'e.g. supermart' },
                        ].map(({ label, key, placeholder }) => (
                            <div key={key} style={{ marginBottom: 14 }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: '0 0 6px', letterSpacing: '0.05em' }}>{label.toUpperCase()}</p>
                                <input value={newTenant[key as 'name' | 'subdomain']} onChange={e => setNewTenant(n => ({ ...n, [key]: e.target.value }))} placeholder={placeholder}
                                    style={{ width: '100%', padding: '11px 12px', background: DARKER, border: `1.5px solid ${BORDER}`, borderRadius: 10, fontSize: 14, color: '#f8fafc', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 14 }}>
                            <p style={{ fontSize: 12, fontWeight: 700, color: '#64748b', margin: '0 0 6px', letterSpacing: '0.05em' }}>PLAN</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {['Starter', 'Pro', 'Enterprise'].map(p => (
                                    <button key={p} onClick={() => setNewTenant(n => ({ ...n, plan: p }))}
                                        style={{ flex: 1, padding: '9px', border: `1.5px solid ${newTenant.plan === p ? INDIGO : BORDER}`, borderRadius: 10, background: newTenant.plan === p ? `${INDIGO}20` : DARKER, color: newTenant.plan === p ? INDIGO : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>{p}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => setShowAddTenant(false)} style={{ flex: 1, padding: '13px', background: DARKER, border: `1px solid ${BORDER}`, borderRadius: 12, color: '#64748b', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>Cancel</button>
                            <button onClick={handleAddTenant} disabled={saving}
                                style={{ flex: 2, padding: '13px', background: `linear-gradient(135deg,${INDIGO},${PURPLE})`, border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(99,102,241,0.4)' }}>
                                {saving ? '⏳ Creating...' : '🏢 Create Tenant'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
