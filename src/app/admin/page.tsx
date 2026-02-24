'use client';
import { useState } from 'react';
import { useCashbackStore, MOCK_TENANTS, useHistoryStore } from '@/store';
import {
    LayoutDashboard, Users, Gift, BarChart2, Building2, LogOut, Star,
    QrCode, CheckCircle, Clock, XCircle, TrendingUp, DollarSign, Zap,
    Search, Filter, Eye, ChevronDown, Bell, Settings
} from 'lucide-react';

type Tab = 'dashboard' | 'cashback' | 'tenants' | 'rewards' | 'users' | 'analytics';

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: '#92400e', bg: '#fef9c3', border: '#fde68a' },
    approved: { label: 'Approved', color: '#1e40af', bg: '#dbeafe', border: '#93c5fd' },
    paid: { label: 'Paid', color: '#065f46', bg: '#d1fae5', border: '#6ee7b7' },
    rejected: { label: 'Rejected', color: '#991b1b', bg: '#fee2e2', border: '#fca5a5' },
};

function Nav({ tab, setTab, setLoggedIn }: { tab: Tab; setTab: (t: Tab) => void; setLoggedIn: (v: boolean) => void }) {
    const items: { id: Tab; Icon: React.ElementType; label: string }[] = [
        { id: 'dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'cashback', Icon: QrCode, label: 'Cashback Requests' },
        { id: 'tenants', Icon: Building2, label: 'Tenants' },
        { id: 'rewards', Icon: Gift, label: 'Rewards' },
        { id: 'users', Icon: Users, label: 'Users' },
        { id: 'analytics', Icon: BarChart2, label: 'Analytics' },
    ];
    const { requests } = useCashbackStore();
    const pending = requests.filter(r => r.status === 'pending').length;

    return (
        <aside style={{ width: 220, flexShrink: 0, background: '#fff', borderRight: '1px solid #e2e8f0', height: '100vh', position: 'sticky', top: 0, display: 'flex', flexDirection: 'column', padding: '0 12px', overflowY: 'auto' }}>
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '20px 8px 24px' }}>
                <div style={{ width: 36, height: 36, background: '#6366f1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Star size={18} color="#fff" fill="#fff" />
                </div>
                <div>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.3px' }}>RewardsPro</p>
                    <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontWeight: 500 }}>Admin Panel</p>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {items.map(({ id, Icon, label }) => (
                    <button key={id} onClick={() => setTab(id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '10px 12px', border: 'none', background: tab === id ? '#eef2ff' : 'transparent', borderRadius: 10, color: tab === id ? '#6366f1' : '#64748b', fontWeight: tab === id ? 600 : 500, fontSize: 13.5, cursor: 'pointer', fontFamily: 'Inter, sans-serif', width: '100%', textAlign: 'left', transition: 'all 0.15s' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                            <Icon size={16} strokeWidth={tab === id ? 2.2 : 1.8} />
                            {label}
                        </div>
                        {id === 'cashback' && pending > 0 && (
                            <span style={{ background: '#dc2626', color: '#fff', borderRadius: 999, fontSize: 10, fontWeight: 700, padding: '2px 7px', lineHeight: 1.4 }}>{pending}</span>
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer */}
            <div style={{ borderTop: '1px solid #f1f5f9', padding: '12px 0', marginTop: 8 }}>
                <button onClick={() => setLoggedIn(false)} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '10px 12px', width: '100%', border: 'none', background: 'transparent', color: '#94a3b8', fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit', borderRadius: 10, transition: 'all 0.15s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}>
                    <LogOut size={16} /> Log Out
                </button>
            </div>
        </aside>
    );
}

function Dashboard() {
    const { requests } = useCashbackStore();
    const totalCashback = requests.filter(r => r.status === 'paid').reduce((a, r) => a + r.cashbackAmount, 0);
    const pending = requests.filter(r => r.status === 'pending').length;
    const stats = [
        { label: 'Total Cashbacks', value: `₹${totalCashback.toLocaleString('en-IN')}`, sub: `${requests.length} requests`, icon: <DollarSign size={20} color="#6366f1" />, bg: '#eef2ff' },
        { label: 'Pending Requests', value: pending, sub: 'Need review', icon: <Clock size={20} color="#d97706" />, bg: '#fffbeb' },
        { label: 'Total Scans', value: '1,248', sub: 'This month', icon: <QrCode size={20} color="#059669" />, bg: '#ecfdf5' },
        { label: 'Active Users', value: '843', sub: '+12% this week', icon: <TrendingUp size={20} color="#7c3aed" />, bg: '#f5f3ff' },
    ];

    return (
        <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.3px' }}>Dashboard Overview</h2>
            <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
                {stats.map(({ label, value, sub, icon, bg }) => (
                    <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                        <div style={{ width: 44, height: 44, background: bg, borderRadius: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>{icon}</div>
                        <p style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 3px', letterSpacing: '-0.5px' }}>{value}</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#475569', margin: '0 0 2px' }}>{label}</p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{sub}</p>
                    </div>
                ))}
            </div>

            {/* Recent cashback */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden' }}>
                <div style={{ padding: '18px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>Recent Cashback Requests</h3>
                    <span style={{ fontSize: 12, color: '#6366f1', fontWeight: 600, cursor: 'pointer' }}>View all →</span>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr>
                            {['Customer', 'Product', 'Amount', 'UPI ID', 'Time', 'Status'].map(h => (
                                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #f1f5f9' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {requests.slice(0, 5).map(r => {
                            const s = STATUS_CONFIG[r.status];
                            return (
                                <tr key={r.id} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                    <td style={{ padding: '12px 16px' }}>
                                        <p style={{ fontWeight: 600, color: '#0f172a', margin: '0 0 1px' }}>{r.customerName}</p>
                                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>+91 {r.mobileNumber}</p>
                                    </td>
                                    <td style={{ padding: '12px 16px', color: '#475569', maxWidth: 160 }}>
                                        <p style={{ margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>{r.productName}</p>
                                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>{r.productCode}</p>
                                    </td>
                                    <td style={{ padding: '12px 16px', fontWeight: 800, color: '#059669', fontSize: 15 }}>₹{r.cashbackAmount}</td>
                                    <td style={{ padding: '12px 16px', color: '#64748b', fontFamily: 'monospace', fontSize: 12 }}>{r.upiId}</td>
                                    <td style={{ padding: '12px 16px', color: '#94a3b8', fontSize: 12 }}>{new Date(r.submittedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</td>
                                    <td style={{ padding: '12px 16px' }}>
                                        <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700 }}>{s.label}</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CashbackRequests() {
    const { requests, updateStatus } = useCashbackStore();
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState<string>('all');

    const filtered = requests.filter(r => {
        const matchSearch = r.customerName.toLowerCase().includes(search.toLowerCase()) ||
            r.mobileNumber.includes(search) || r.upiId.toLowerCase().includes(search.toLowerCase()) ||
            r.productCode.toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === 'all' || r.status === filter;
        return matchSearch && matchFilter;
    });

    const totalPending = requests.filter(r => r.status === 'pending').reduce((a, r) => a + r.cashbackAmount, 0);

    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.3px' }}>Cashback Requests</h2>
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Review and process customer cashback claims</p>
                </div>
                {totalPending > 0 && (
                    <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Clock size={15} color="#d97706" />
                        <span style={{ fontSize: 13, color: '#92400e', fontWeight: 600 }}>₹{totalPending} pending approval</span>
                    </div>
                )}
            </div>

            {/* Summary cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 24 }}>
                {(['all', 'pending', 'approved', 'paid', 'rejected'] as const).filter(s => s !== 'all').map(status => {
                    const count = requests.filter(r => r.status === status).length;
                    const amount = requests.filter(r => r.status === status).reduce((a, r) => a + r.cashbackAmount, 0);
                    const s = STATUS_CONFIG[status];
                    return (
                        <button key={status} onClick={() => setFilter(filter === status ? 'all' : status)} style={{ background: filter === status ? s.bg : '#fff', border: `1.5px solid ${filter === status ? s.border : '#e2e8f0'}`, borderRadius: 14, padding: '14px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                            <p style={{ fontSize: 20, fontWeight: 900, color: s.color, margin: '0 0 2px' }}>{count}</p>
                            <p style={{ fontSize: 12, fontWeight: 700, color: s.color, margin: '0 0 2px', textTransform: 'capitalize' }}>{status}</p>
                            <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>₹{amount.toLocaleString()}</p>
                        </button>
                    );
                })}
            </div>

            {/* Search + Filter */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                    <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search by name, mobile, UPI or product code…"
                        style={{ width: '100%', padding: '11px 14px 11px 40px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 13.5, outline: 'none', color: '#0f172a', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' as const, transition: 'border-color 0.2s' }}
                        onFocus={e => { e.target.style.borderColor = '#6366f1'; }}
                        onBlur={e => { e.target.style.borderColor = '#e2e8f0'; }}
                    />
                </div>
                <div style={{ position: 'relative' }}>
                    <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '11px 36px 11px 14px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 13.5, color: '#0f172a', fontFamily: 'inherit', outline: 'none', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none' }}>
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="paid">Paid</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <ChevronDown size={14} color="#94a3b8" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                </div>
            </div>

            {/* Table */}
            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                        <tr style={{ background: '#f8fafc' }}>
                            {['#', 'Customer', 'Product', 'Amount', 'UPI ID', 'Submitted', 'Status', 'Actions'].map(h => (
                                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#94a3b8', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>No cashback requests found</td></tr>
                        ) : filtered.map((r, i) => {
                            const s = STATUS_CONFIG[r.status];
                            return (
                                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#fafafa'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                                    <td style={{ padding: '13px 14px', color: '#94a3b8', fontSize: 12, fontFamily: 'monospace' }}>{i + 1}</td>
                                    <td style={{ padding: '13px 14px' }}>
                                        <p style={{ fontWeight: 700, color: '#0f172a', margin: '0 0 1px', fontSize: 13 }}>{r.customerName}</p>
                                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>+91 {r.mobileNumber}</p>
                                    </td>
                                    <td style={{ padding: '13px 14px' }}>
                                        <p style={{ fontWeight: 500, color: '#475569', margin: '0 0 1px', maxWidth: 160, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.productName}</p>
                                        <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontFamily: 'monospace' }}>{r.productCode}</p>
                                    </td>
                                    <td style={{ padding: '13px 14px', fontWeight: 800, color: '#059669', fontSize: 15 }}>₹{r.cashbackAmount}</td>
                                    <td style={{ padding: '13px 14px', color: '#4f46e5', fontSize: 12, fontFamily: 'monospace' }}>{r.upiId}</td>
                                    <td style={{ padding: '13px 14px', color: '#94a3b8', fontSize: 11, whiteSpace: 'nowrap' }}>
                                        {new Date(r.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                        <br />
                                        {new Date(r.submittedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                    </td>
                                    <td style={{ padding: '13px 14px' }}>
                                        <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 999, padding: '4px 10px', fontSize: 11, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                                            {r.status === 'paid' ? <CheckCircle size={11} /> : r.status === 'pending' ? <Clock size={11} /> : r.status === 'rejected' ? <XCircle size={11} /> : null}
                                            {s.label}
                                        </span>
                                    </td>
                                    <td style={{ padding: '13px 14px' }}>
                                        <div style={{ display: 'flex', gap: 6 }}>
                                            {r.status === 'pending' && (
                                                <>
                                                    <button onClick={() => updateStatus(r.id, 'approved')} style={{ padding: '5px 10px', background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#1e40af', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Approve</button>
                                                    <button onClick={() => updateStatus(r.id, 'rejected')} style={{ padding: '5px 10px', background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#991b1b', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Reject</button>
                                                </>
                                            )}
                                            {r.status === 'approved' && (
                                                <button onClick={() => updateStatus(r.id, 'paid')} style={{ padding: '5px 10px', background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#065f46', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>Mark Paid</button>
                                            )}
                                            {(r.status === 'paid' || r.status === 'rejected') && (
                                                <span style={{ fontSize: 11, color: '#cbd5e1', fontStyle: 'italic' }}>Done</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

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
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 24px', letterSpacing: '-0.3px' }}>Analytics</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '24px' }}>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 20px' }}>Cashback Status Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                                        <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 4, transition: 'width 1s ease', opacity: 0.7 }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {[
                        { label: 'Total Requests', value: total, icon: <QrCode size={20} color="#6366f1" />, bg: '#eef2ff' },
                        { label: 'Total Paid Out', value: `₹${totalPaid.toLocaleString()}`, icon: <DollarSign size={20} color="#059669" />, bg: '#ecfdf5' },
                        { label: 'Avg. Cashback', value: total > 0 ? `₹${Math.round(requests.reduce((a, r) => a + r.cashbackAmount, 0) / total)}` : '₹0', icon: <BarChart2 size={20} color="#7c3aed" />, bg: '#f5f3ff' },
                        { label: 'Active Tenants', value: MOCK_TENANTS.length, icon: <Building2 size={20} color="#d97706" />, bg: '#fffbeb' },
                    ].map(({ label, value, icon, bg }) => (
                        <div key={label} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 13, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
                            <div>
                                <p style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{value}</p>
                                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontWeight: 500 }}>{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ── MAIN ──
export default function AdminPage() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [adminUser, setAdminUser] = useState('');
    const [adminPass, setAdminPass] = useState('');
    const [loginError, setLoginError] = useState('');
    const [tab, setTab] = useState<Tab>('dashboard');

    const handleLogin = () => {
        if (adminUser === 'admin' && adminPass === 'admin123') { setLoggedIn(true); setLoginError(''); }
        else setLoginError('Invalid credentials. Use admin / admin123');
    };

    if (!loggedIn) return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#f8fafc,#eef2ff,#f5f3ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'Inter, sans-serif' }}>
            <div style={{ width: '100%', maxWidth: 400 }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 64, height: 64, background: '#6366f1', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 12px 32px rgba(99,102,241,0.3)' }}>
                        <Star size={28} color="#fff" fill="#fff" />
                    </div>
                    <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Admin Panel</h1>
                    <p style={{ color: '#64748b', fontSize: 14, margin: 0 }}>Sign in to manage your platform</p>
                </div>

                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 22, padding: '32px 28px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Username</label>
                        <input id="admin-username" value={adminUser} onChange={e => { setAdminUser(e.target.value); setLoginError(''); }} placeholder="admin" onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '13px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' as const }} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                    <div style={{ marginBottom: 20 }}>
                        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Password</label>
                        <input id="admin-password" type="password" value={adminPass} onChange={e => { setAdminPass(e.target.value); setLoginError(''); }} placeholder="••••••••" onKeyDown={e => e.key === 'Enter' && handleLogin()} style={{ width: '100%', padding: '13px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 14, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box' as const }} onFocus={e => e.target.style.borderColor = '#6366f1'} onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
                    </div>
                    {loginError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 12px', marginBottom: 16 }}><p style={{ color: '#dc2626', fontSize: 13, margin: 0 }}>⚠️ {loginError}</p></div>}
                    <button id="admin-login-btn" onClick={handleLogin} style={{ width: '100%', padding: '14px', background: '#6366f1', border: 'none', borderRadius: 13, color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(99,102,241,0.3)' }}>Sign In to Admin</button>
                    <p style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginTop: 14, margin: '12px 0 0' }}>Demo: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>admin</code> / <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>admin123</code></p>
                </div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
            <Nav tab={tab} setTab={setTab} setLoggedIn={setLoggedIn} />

            {/* Main */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
                {/* Top bar */}
                <header style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
                    <div>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: 0, textTransform: 'capitalize' }}>{tab.replace(/([A-Z])/g, ' $1')}</h2>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>RewardsPro Admin Console</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <button style={{ width: 38, height: 38, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                            <Bell size={17} color="#64748b" />
                        </button>
                        <div style={{ width: 36, height: 36, background: '#6366f1', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15, cursor: 'pointer' }}>A</div>
                    </div>
                </header>

                {/* Content */}
                <main style={{ flex: 1, padding: '28px 28px', overflowY: 'auto' }}>
                    {tab === 'dashboard' && <Dashboard />}
                    {tab === 'cashback' && <CashbackRequests />}
                    {tab === 'analytics' && <Analytics />}
                    {tab === 'tenants' && (
                        <div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 24px' }}>Tenant Management</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {MOCK_TENANTS.map(t => (
                                    <div key={t.id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '24px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                            <div style={{ width: 52, height: 52, background: '#eef2ff', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>{t.logo}</div>
                                            <div>
                                                <p style={{ fontWeight: 800, color: '#0f172a', fontSize: 16, margin: '0 0 2px' }}>{t.name}</p>
                                                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{t.subdomain}.rewardspro.com</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                            {[['Points/₹', t.pointsPerRupee], ['Min Redeem', `${t.minRedeemPoints} pts`], ['Cashback Rate', `1:${t.cashbackRate}`]].map(([l, v]) => (
                                                <div key={String(l)} style={{ background: '#f8fafc', borderRadius: 10, padding: '10px 12px' }}>
                                                    <p style={{ fontSize: 11, color: '#94a3b8', margin: '0 0 2px', fontWeight: 500 }}>{l}</p>
                                                    <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: 0 }}>{v}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {tab === 'rewards' && <div style={{ textAlign: 'center', paddingTop: 80, color: '#94a3b8' }}><Gift size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} /><p style={{ fontSize: 16, fontWeight: 600 }}>Rewards management coming soon</p></div>}
                    {tab === 'users' && <div style={{ textAlign: 'center', paddingTop: 80, color: '#94a3b8' }}><Users size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} /><p style={{ fontSize: 16, fontWeight: 600 }}>User management coming soon</p></div>}
                </main>
            </div>
        </div>
    );
}
