'use client';
import { useState } from 'react';
import { useCashbackStore, useTenantStore, MOCK_TENANTS } from '@/store';
import {
    LayoutDashboard, QrCode, Building2, Gift, Users, BarChart2,
    LogOut, Star, Clock, CheckCircle, XCircle, TrendingUp, DollarSign,
    Search, ChevronDown, Bell, Menu, X, ChevronRight
} from 'lucide-react';

type Tab = 'dashboard' | 'cashback' | 'tenants' | 'rewards' | 'users' | 'analytics';

const INDIGO = '#6366f1';
const INDIGO_LIGHT = '#eef2ff';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#92400e', bg: '#fef9c3', border: '#fde68a' },
    approved: { label: 'Approved', color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
    paid: { label: 'Paid', color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
    rejected: { label: 'Rejected', color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
};

const NAV_ITEMS: { id: Tab; Icon: React.ElementType; label: string }[] = [
    { id: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'cashback', Icon: QrCode, label: 'Cashback' },
    { id: 'tenants', Icon: Building2, label: 'Tenants' },
    { id: 'rewards', Icon: Gift, label: 'Rewards' },
    { id: 'users', Icon: Users, label: 'Users' },
    { id: 'analytics', Icon: BarChart2, label: 'Analytics' },
];

/* ══════════════════════════════════════
   SIDEBAR
══════════════════════════════════════ */
function Sidebar({ tab, setTab, setLoggedIn, open, onClose }:
    { tab: Tab; setTab: (t: Tab) => void; setLoggedIn: (v: boolean) => void; open: boolean; onClose: () => void }) {
    const { requests } = useCashbackStore();
    const pending = requests.filter(r => r.status === 'pending').length;

    return (
        <>
            {/* Overlay — mobile only */}
            {open && (
                <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 299, backdropFilter: 'blur(2px)' }} />
            )}

            <aside style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: 220, zIndex: 300,
                background: '#fff', borderRight: '1px solid #e2e8f0',
                display: 'flex', flexDirection: 'column', padding: '0 12px',
                transform: open ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: open ? '4px 0 40px rgba(0,0,0,0.12)' : 'none',
            }}>
                {/* Close on mobile */}
                <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 10, background: '#f1f5f9', border: 'none', borderRadius: 8, width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                    <X size={16} color="#64748b" />
                </button>

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 8px 24px' }}>
                    <div style={{ width: 36, height: 36, background: INDIGO, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Star size={18} color="#fff" fill="#fff" />
                    </div>
                    <div>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>AvoPay</p>
                        <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>Admin Panel</p>
                    </div>
                </div>

                {/* Nav links */}
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
                    {NAV_ITEMS.map(({ id, Icon, label }) => {
                        const active = tab === id;
                        return (
                            <button key={id} onClick={() => { setTab(id); onClose(); }}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', border: 'none', background: active ? INDIGO_LIGHT : 'transparent', borderRadius: 10, color: active ? INDIGO : '#64748b', fontWeight: active ? 700 : 500, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', width: '100%', textAlign: 'left', transition: 'all 0.15s' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                                    <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
                                    {label}
                                </div>
                                {id === 'cashback' && pending > 0 && (
                                    <span style={{ background: '#dc2626', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '2px 7px' }}>{pending}</span>
                                )}
                            </button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 0' }}>
                    <button onClick={() => setLoggedIn(false)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', width: '100%', border: 'none', background: 'transparent', color: '#dc2626', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 10 }}>
                        <LogOut size={16} /> Log Out
                    </button>
                </div>
            </aside>
        </>
    );
}

/* ══════════════════════════════════════
   STAT CARD
══════════════════════════════════════ */
function StatCard({ label, value, sub, icon, bg }: { label: string; value: string | number; sub: string; icon: React.ReactNode; bg: string }) {
    return (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '18px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ width: 42, height: 42, background: bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>{icon}</div>
            <p style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{value}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 2px' }}>{label}</p>
            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>{sub}</p>
        </div>
    );
}

/* ══════════════════════════════════════
   DASHBOARD
══════════════════════════════════════ */
function Dashboard() {
    const { requests } = useCashbackStore();
    const totalCashback = requests.filter(r => r.status === 'paid').reduce((a, r) => a + r.cashbackAmount, 0);
    const pending = requests.filter(r => r.status === 'pending').length;

    return (
        <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Dashboard Overview</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>Welcome back, Admin. Here is what is happening today.</p>

            {/* Stats grid — 2 cols on mobile, 4 on desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 24 }}>
                <StatCard label="Total Cashbacks" value={`₹${totalCashback.toLocaleString('en-IN')}`} sub={`${requests.length} requests`} icon={<DollarSign size={20} color={INDIGO} />} bg={INDIGO_LIGHT} />
                <StatCard label="Pending Requests" value={pending} sub="Need review" icon={<Clock size={20} color="#d97706" />} bg="#fffbeb" />
                <StatCard label="Total Scans" value="1,248" sub="This month" icon={<QrCode size={20} color="#059669" />} bg="#ecfdf5" />
                <StatCard label="Active Users" value="843" sub="+12% this week" icon={<TrendingUp size={20} color="#7c3aed" />} bg="#f5f3ff" />
            </div>

            {/* Recent cashback — card list on mobile */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, overflow: 'hidden' }}>
                <div style={{ padding: '16px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Cashback Requests</h3>
                    <span style={{ fontSize: 12, color: INDIGO, fontWeight: 600, cursor: 'pointer' }}>View all →</span>
                </div>
                {/* Card list — works on all screen sizes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                    {requests.slice(0, 5).map((r, i) => {
                        const s = STATUS_CONFIG[r.status];
                        return (
                            <div key={r.id} style={{ padding: '14px 18px', borderBottom: i < 4 ? '1px solid #f8fafc' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 1px', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.customerName}</p>
                                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.productName}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                                    <p style={{ fontSize: 14, fontWeight: 800, color: '#059669', margin: 0 }}>₹{r.cashbackAmount}</p>
                                    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 999, padding: '2px 8px', fontSize: 10, fontWeight: 700 }}>{s.label}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   CASHBACK REQUESTS
══════════════════════════════════════ */
function CashbackRequests() {
    const { requests, updateStatus } = useCashbackStore();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');

    const filtered = requests.filter(r => {
        const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) || r.mobileNumber.includes(search) || r.productCode.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || r.status === filter;
        return matchSearch && matchFilter;
    });

    return (
        <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Cashback Requests</h2>
            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 18px' }}>Review and process customer cashback claims</p>

            {/* Status filter chips */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 6, marginBottom: 14 }}>
                {(['all', 'pending', 'approved', 'paid', 'rejected'] as const).map(s => {
                    const active = filter === s;
                    const cfg = s !== 'all' ? STATUS_CONFIG[s] : null;
                    return (
                        <button key={s} onClick={() => setFilter(s)}
                            style={{ padding: '7px 14px', borderRadius: 999, border: `1.5px solid ${active && cfg ? cfg.border : active ? INDIGO : '#e2e8f0'}`, background: active && cfg ? cfg.bg : active ? INDIGO_LIGHT : '#fff', color: active && cfg ? cfg.color : active ? INDIGO : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', textTransform: 'capitalize', flexShrink: 0 }}>
                            {s === 'all' ? 'All' : s} {s !== 'all' && `(${requests.filter(r => r.status === s).length})`}
                        </button>
                    );
                })}
            </div>

            {/* Search */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, mobile, or product code…"
                    style={{ width: '100%', padding: '11px 14px 11px 40px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 13.5, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = INDIGO} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>

            {/* Cards — works on any screen size */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filtered.length === 0 ? (
                    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #e2e8f0', padding: '48px 24px', textAlign: 'center', color: '#94a3b8' }}>No requests found</div>
                ) : filtered.map(r => {
                    const s = STATUS_CONFIG[r.status];
                    return (
                        <div key={r.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '16px 18px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 700, color: '#0f172a', fontSize: 14, margin: '0 0 2px' }}>{r.customerName}</p>
                                    <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>+91 {r.mobileNumber} · {r.upiId}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, marginLeft: 12 }}>
                                    <p style={{ fontSize: 20, fontWeight: 900, color: '#059669', margin: 0 }}>₹{r.cashbackAmount}</p>
                                    <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                                </div>
                            </div>

                            <div style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px', marginBottom: 12 }}>
                                <p style={{ fontSize: 13, fontWeight: 600, color: '#374151', margin: '0 0 2px' }}>{r.productName}</p>
                                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>{r.productCode}</p>
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: 8 }}>
                                {r.status === 'pending' && (
                                    <>
                                        <button onClick={() => updateStatus(r.id, 'approved')} style={{ flex: 1, padding: '9px', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#1e40af', cursor: 'pointer', fontFamily: 'inherit' }}>✓ Approve</button>
                                        <button onClick={() => updateStatus(r.id, 'rejected')} style={{ flex: 1, padding: '9px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#991b1b', cursor: 'pointer', fontFamily: 'inherit' }}>✕ Reject</button>
                                    </>
                                )}
                                {r.status === 'approved' && (
                                    <button onClick={() => updateStatus(r.id, 'paid')} style={{ flex: 1, padding: '9px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, fontSize: 13, fontWeight: 700, color: '#065f46', cursor: 'pointer', fontFamily: 'inherit' }}>💰 Mark as Paid</button>
                                )}
                                {(r.status === 'paid' || r.status === 'rejected') && (
                                    <p style={{ color: '#94a3b8', fontSize: 12, margin: 0, padding: '9px 0', fontStyle: 'italic' }}>No further action required</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   ANALYTICS
══════════════════════════════════════ */
function Analytics() {
    const { requests } = useCashbackStore();
    const byStatus = {
        paid: requests.filter(r => r.status === 'paid').length,
        approved: requests.filter(r => r.status === 'approved').length,
        pending: requests.filter(r => r.status === 'pending').length,
        rejected: requests.filter(r => r.status === 'rejected').length,
    };
    const total = requests.length;
    const totalPaid = requests.filter(r => r.status === 'paid').reduce((a, r) => a + r.cashbackAmount, 0);

    return (
        <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 20px' }}>Analytics</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 20 }}>
                {[
                    { label: 'Total Requests', value: total, color: INDIGO, bg: INDIGO_LIGHT },
                    { label: 'Total Paid Out', value: `₹${totalPaid.toLocaleString()}`, color: '#059669', bg: '#ecfdf5' },
                    { label: 'Avg. Cashback', value: total > 0 ? `₹${Math.round(requests.reduce((a, r) => a + r.cashbackAmount, 0) / total)}` : '₹0', color: '#7c3aed', bg: '#f5f3ff' },
                    { label: 'Active Tenants', value: MOCK_TENANTS.length, color: '#d97706', bg: '#fffbeb' },
                ].map(({ label, value, color, bg }) => (
                    <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '16px' }}>
                        <p style={{ fontSize: 22, fontWeight: 900, color, margin: '0 0 4px' }}>{value}</p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0, fontWeight: 600 }}>{label}</p>
                    </div>
                ))}
            </div>

            {/* Status bars */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '20px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: '0 0 18px' }}>Cashback Status Breakdown</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {Object.entries(byStatus).map(([status, count]) => {
                        const s = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG];
                        const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                        return (
                            <div key={status}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: s.color, textTransform: 'capitalize' }}>{status}</span>
                                    <span style={{ fontSize: 13, color: '#475569', fontWeight: 700 }}>{count} ({pct}%)</span>
                                </div>
                                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                                    <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 4, opacity: 0.75 }} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════
   TENANT LOGO — image with fallback
══════════════════════════════════════ */
function TenantLogo({ logoUrl, name, color, size = 48 }: { logoUrl?: string; name: string; color: string; size?: number }) {
    const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    if (logoUrl) {
        return (
            <img
                src={logoUrl} alt={name}
                style={{ width: size, height: size, borderRadius: size * 0.28, objectFit: 'cover', border: `2px solid ${color}22`, flexShrink: 0 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
        );
    }
    return (
        <div style={{ width: size, height: size, borderRadius: size * 0.28, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: size * 0.38, fontWeight: 900, color: '#fff', letterSpacing: '-1px' }}>{initials}</span>
        </div>
    );
}

/* ══════════════════════════════════════
   TENANTS
══════════════════════════════════════ */
function Tenants() {
    const { tenants, addTenant, removeTenant } = useTenantStore();
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: '', subdomain: '', logoUrl: '',
        primaryColor: '#6366f1', pointsPerRupee: '10', minRedeemPoints: '500', cashbackRate: '100',
    });
    const [preview, setPreview] = useState('');
    const [copied, setCopied] = useState<string | null>(null);

    const handleCreate = () => {
        if (!form.name.trim()) return;
        const sub = form.subdomain || form.name.toLowerCase().replace(/\s+/g, '');
        const newTenant = {
            id: `tenant-${Date.now()}`,
            name: form.name,
            subdomain: sub,
            logo: form.name[0] || '🏢',
            logoUrl: form.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=${form.primaryColor.replace('#', '')}&color=fff&size=128&bold=true&font-size=0.4&rounded=true`,
            primaryColor: form.primaryColor,
            secondaryColor: '#94a3b8',
            accentColor: '#10b981',
            gradientFrom: form.primaryColor,
            gradientTo: form.primaryColor,
            features: { cashRedemption: true, whiteGoods: false, giftCards: true, electronics: false, beauty: false, holidays: false },
            pointsPerRupee: Number(form.pointsPerRupee) || 10,
            minRedeemPoints: Number(form.minRedeemPoints) || 500,
            cashbackRate: Number(form.cashbackRate) || 100,
        };
        addTenant(newTenant);
        setForm({ name: '', subdomain: '', logoUrl: '', primaryColor: '#6366f1', pointsPerRupee: '10', minRedeemPoints: '500', cashbackRate: '100' });
        setPreview('');
        setShowForm(false);
    };

    const copyLink = (sub: string) => {
        const url = `${window.location.origin}/t/${sub}`;
        navigator.clipboard.writeText(url).catch(() => { });
        setCopied(sub);
        setTimeout(() => setCopied(null), 2000);
    };

    const inp: React.CSSProperties = { width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' };
    const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, letterSpacing: '0.03em' };

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: 0 }}>Tenant Management</h2>
                <button onClick={() => setShowForm(v => !v)}
                    style={{ padding: '8px 18px', background: INDIGO, border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                    {showForm ? 'Cancel' : '+ New Tenant'}
                </button>
            </div>

            {/* ── How subdomains work — info box ── */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 14, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20 }}>🌐</span>
                <div>
                    <p style={{ fontSize: 13, fontWeight: 800, color: '#15803d', margin: '0 0 4px' }}>How Tenant URLs Work</p>
                    <p style={{ fontSize: 12, color: '#166534', margin: '0 0 4px', lineHeight: 1.6 }}>
                        <strong>Local (dev):</strong> <code style={{ background: '#dcfce7', padding: '1px 5px', borderRadius: 4 }}>localhost:3000/t/[subdomain]</code><br />
                        <strong>Production:</strong> <code style={{ background: '#dcfce7', padding: '1px 5px', borderRadius: 4 }}>[subdomain].AvoPay.in</code>
                    </p>
                    <p style={{ fontSize: 11, color: '#4ade80', margin: 0 }}>Each tenant gets a fully branded login portal at their URL.</p>
                </div>
            </div>

            {/* ── Create form ── */}
            {showForm && (
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '20px', marginBottom: 20, boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Create New Tenant</p>

                    {/* Logo preview + URL input */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, background: '#f8fafc', borderRadius: 14, padding: '14px' }}>
                        <div style={{ width: 72, height: 72, borderRadius: 20, overflow: 'hidden', border: '2px solid #e2e8f0', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            {preview ? (
                                <img src={preview} alt="logo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={() => setPreview('')} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', background: form.primaryColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <span style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{form.name?.[0]?.toUpperCase() || '?'}</span>
                                </div>
                            )}
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={lbl}>Logo Image URL</label>
                            <input style={inp} placeholder="https://example.com/logo.png"
                                value={form.logoUrl}
                                onChange={e => { setForm(f => ({ ...f, logoUrl: e.target.value })); setPreview(e.target.value); }}
                            />
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>Leave blank to auto-generate from name.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                        <div>
                            <label style={lbl}>Tenant Name *</label>
                            <input style={inp} placeholder="e.g. Asian Paints"
                                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                        </div>
                        <div>
                            <label style={lbl}>Subdomain</label>
                            <div style={{ position: 'relative' }}>
                                <input style={{ ...inp, paddingRight: 80 }} placeholder="auto-filled"
                                    value={form.subdomain} onChange={e => setForm(f => ({ ...f, subdomain: e.target.value }))} />
                                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 11, color: '#94a3b8', pointerEvents: 'none' }}>.AvoPay.in</span>
                            </div>
                        </div>
                        <div>
                            <label style={lbl}>Brand Color</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input type="color" value={form.primaryColor}
                                    onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))}
                                    style={{ width: 40, height: 38, borderRadius: 8, border: '1px solid #e2e8f0', cursor: 'pointer', padding: 2 }} />
                                <input style={{ ...inp, flex: 1 }} value={form.primaryColor}
                                    onChange={e => setForm(f => ({ ...f, primaryColor: e.target.value }))} />
                            </div>
                        </div>
                        <div>
                            <label style={lbl}>Points per ₹1</label>
                            <input style={inp} type="number" value={form.pointsPerRupee}
                                onChange={e => setForm(f => ({ ...f, pointsPerRupee: e.target.value }))} />
                        </div>
                        <div>
                            <label style={lbl}>Min Redeem Points</label>
                            <input style={inp} type="number" value={form.minRedeemPoints}
                                onChange={e => setForm(f => ({ ...f, minRedeemPoints: e.target.value }))} />
                        </div>
                        <div>
                            <label style={lbl}>Cashback Rate</label>
                            <input style={inp} type="number" value={form.cashbackRate}
                                onChange={e => setForm(f => ({ ...f, cashbackRate: e.target.value }))} />
                        </div>
                    </div>

                    {/* Preview URL */}
                    {form.name && (
                        <div style={{ background: '#eef2ff', borderRadius: 10, padding: '10px 14px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 14 }}>🔗</span>
                            <span style={{ fontSize: 12, color: INDIGO, fontWeight: 600 }}>
                                Portal URL: <strong>localhost:3000/t/{form.subdomain || form.name.toLowerCase().replace(/\s+/g, '')}</strong>
                            </span>
                        </div>
                    )}

                    <button onClick={handleCreate}
                        style={{ width: '100%', padding: '12px', background: INDIGO, border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
                        Create Tenant
                    </button>
                </div>
            )}

            {/* ── Tenant cards ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {tenants.map(t => (
                    <div key={t.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                            <TenantLogo logoUrl={t.logoUrl} name={t.name} color={t.primaryColor} size={52} />
                            <div style={{ flex: 1 }}>
                                <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 15, margin: '0 0 4px' }}>{t.name}</p>
                                {/* Clickable subdomain URL */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <a href={`/t/${t.subdomain}`} target="_blank" rel="noopener noreferrer"
                                        style={{ fontSize: 11, color: INDIGO, fontWeight: 600, textDecoration: 'none', background: '#eef2ff', padding: '3px 8px', borderRadius: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                                        🔗 /t/{t.subdomain}
                                    </a>
                                    <button onClick={() => copyLink(t.subdomain)}
                                        style={{ fontSize: 10, padding: '3px 8px', background: copied === t.subdomain ? '#dcfce7' : '#f1f5f9', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, color: copied === t.subdomain ? '#15803d' : '#64748b', fontFamily: 'inherit' }}>
                                        {copied === t.subdomain ? '✓ Copied!' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981' }} />
                                <button onClick={() => removeTenant(t.id)}
                                    style={{ fontSize: 11, padding: '4px 10px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 7, cursor: 'pointer', color: '#dc2626', fontFamily: 'inherit', fontWeight: 600 }}>
                                    Remove
                                </button>
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                            {([['Pts/₹', t.pointsPerRupee], ['Min Redeem', `${t.minRedeemPoints} pts`], ['Cashback', `1:${t.cashbackRate}`]] as [string, string | number][]).map(([l, v]) => (
                                <div key={l} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px' }}>
                                    <p style={{ fontSize: 10, color: '#94a3b8', margin: '0 0 3px', fontWeight: 500 }}>{l}</p>
                                    <p style={{ fontSize: 14, fontWeight: 700, color: '#0f172a', margin: 0 }}>{v}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}


/* ══════════════════════════════════════
   MAIN ADMIN PAGE
══════════════════════════════════════ */
export default function AdminPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [tab, setTab] = useState<Tab>('dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogin = () => {
        if (adminUser === 'admin' && adminPass === 'admin123') { setLoggedIn(true); setLoginError(''); }
        else setLoginError('Invalid credentials. Use admin / admin123');
    };

    /* ── Login screen ── */
    if (!loggedIn) return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f8fafc,#eef2ff,#f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                    <div style={{ width: 60, height: 60, background: INDIGO, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 12px 32px rgba(99,102,241,0.3)' }}>
                        <Star size={26} color="#fff" fill="#fff" />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 4px' }}>Admin Panel</h1>
                    <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Sign in to manage your platform</p>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 22, padding: '28px 24px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                    <div style={{ marginBottom: 14 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Username</label>
                        <input id="admin-username" value={adminUser} onChange={e => { setAdminUser(e.target.value); setLoginError(''); }}
                            placeholder="admin" onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            style={{ width: '100%', padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = INDIGO} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                    <div style={{ marginBottom: 18 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Password</label>
                        <input id="admin-password" type="password" value={adminPass} onChange={e => { setAdminPass(e.target.value); setLoginError(''); }}
                            placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()}
                            style={{ width: '100%', padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            onFocus={e => e.target.style.borderColor = INDIGO} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                    {loginError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}><p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>⚠️ {loginError}</p></div>}
                    <button id="admin-login-btn" onClick={handleLogin} style={{ width: '100%', padding: '13px', background: INDIGO, border: 'none', borderRadius: 13, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(99,102,241,0.3)' }}>Sign In to Admin</button>
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', margin: '12px 0 0' }}>Demo: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>admin</code> / <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>admin123</code></p>
                </div>
            </div>
        </div>
    );

    /* ── Main admin layout ── */
    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <Sidebar tab={tab} setTab={setTab} setLoggedIn={setLoggedIn} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            {/* Main content — full width, sidebar is an overlay on mobile */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: '100vh' }}>
                {/* Top bar */}
                <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, position: 'sticky', top: 0, zIndex: 100, flexShrink: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        {/* Hamburger */}
                        <button id="admin-menu-btn" onClick={() => setSidebarOpen(true)}
                            style={{ width: 38, height: 38, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                            <Menu size={18} color="#64748b" />
                        </button>
                        <div>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0, textTransform: 'capitalize' }}>{tab.replace(/([A-Z])/g, ' $1')}</p>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>AvoPay Admin</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button style={{ width: 36, height: 36, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Bell size={16} color="#64748b" />
                        </button>
                        <div style={{ width: 34, height: 34, background: INDIGO, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>A</div>
                    </div>
                </header>

                {/* Page content */}
                <main style={{ flex: 1, padding: '20px 16px', overflowY: 'auto' }}>
                    {tab === 'dashboard' && <Dashboard />}
                    {tab === 'cashback' && <CashbackRequests />}
                    {tab === 'analytics' && <Analytics />}
                    {tab === 'tenants' && <Tenants />}
                    {tab === 'rewards' && (
                        <div style={{ textAlign: 'center', paddingTop: 80, color: '#94a3b8' }}>
                            <Gift size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
                            <p style={{ fontSize: 15, fontWeight: 600 }}>Rewards management coming soon</p>
                        </div>
                    )}
                    {tab === 'users' && (
                        <div style={{ textAlign: 'center', paddingTop: 80, color: '#94a3b8' }}>
                            <Users size={48} color="#cbd5e1" style={{ margin: '0 auto 16px' }} />
                            <p style={{ fontSize: 15, fontWeight: 600 }}>User management coming soon</p>
                        </div>
                    )}
                </main>

                {/* Bottom tab bar — shown on mobile as extra nav */}
                <nav style={{ background: '#fff', borderTop: '1px solid #e2e8f0', display: 'flex', padding: '6px 0 8px' }}>
                    {NAV_ITEMS.slice(0, 5).map(({ id, Icon, label }) => {
                        const active = tab === id;
                        return (
                            <button key={id} onClick={() => setTab(id)}
                                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 2px', border: 'none', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <Icon size={19} color={active ? INDIGO : '#94a3b8'} strokeWidth={active ? 2.2 : 1.8} />
                                <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? INDIGO : '#94a3b8' }}>{label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <style>{`
                @media (min-width: 768px) {
                    /* On desktop, push main over for sidebar */
                    #admin-sidebar { transform: translateX(0) !important; position: sticky !important; }
                }
            `}</style>
        </div>
    );
}
