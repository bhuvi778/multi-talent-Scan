'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useHistoryStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, ChevronRight, SlidersHorizontal, Star, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const NAVY = '#6366f1';

export default function HistoryPage() {
    const router = useRouter();
    const { user, isLoggedIn } = useAuthStore();
    const { transactions } = useHistoryStore();
    const [showStatement, setShowStatement] = useState(false);
    const [txType, setTxType] = useState('My Sale');
    const [period, setPeriod] = useState('');

    if (!isLoggedIn) { router.replace('/login'); return null; }

    // Group transactions by month-year
    const grouped: Record<string, typeof transactions> = {};
    transactions.forEach(t => {
        const d = new Date(t.date);
        const key = d.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(t);
    });

    const totalPoints = user?.totalPoints ?? 0;

    if (showStatement) {
        return (
            <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>
                {/* Header */}
                <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setShowStatement(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: NAVY, fontFamily: 'inherit', fontWeight: 700 }}>
                        <ArrowLeft size={18} color={NAVY} />
                    </button>
                    <span style={{ fontSize: 16, fontWeight: 700, color: '#1a2332' }}>Request statement</span>
                </div>

                <div style={{ padding: '24px 20px' }}>
                    {/* Select Transaction Type */}
                    <div style={{ borderBottom: '1px solid #e8ecf0', paddingBottom: 16, marginBottom: 16 }}>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 4px' }}>Select Transaction Type</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#1a2332', margin: 0 }}>{txType || 'Select type'}</p>
                            <span style={{ color: '#94a3b8' }}><ChevronRight size={18} /></span>
                        </div>
                    </div>

                    {/* Select Time Period */}
                    <div style={{ borderBottom: '1px solid #e8ecf0', paddingBottom: 16, marginBottom: 32 }}>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 4px' }}>Select Time Period</p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: 14, fontWeight: 700, color: '#1a2332', margin: 0 }}>{period || ''}</p>
                            <span style={{ color: '#94a3b8' }}><ChevronRight size={18} /></span>
                        </div>
                    </div>

                    <button onClick={() => setShowStatement(false)}
                        style={{ width: '100%', padding: '15px', background: NAVY, border: 'none', borderRadius: 12, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.02em' }}>
                        Proceed
                    </button>
                </div>
                <BottomNav />
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={18} color={NAVY} />
                </button>
                <span style={{ fontSize: 16, fontWeight: 700, color: '#1a2332' }}>Transaction</span>
            </div>

            <div style={{ maxWidth: 480, margin: '0 auto' }}>

                {/* Points Balance */}
                <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <p style={{ fontSize: 14, fontWeight: 600, color: '#374151', margin: 0 }}>Points Balance</p>
                        <p style={{ fontSize: 26, fontWeight: 900, color: '#1a2332', margin: 0, letterSpacing: '-0.5px' }}>
                            <span style={{ fontFamily: 'serif' }}>₹</span>{totalPoints.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* Request Statement */}
                <button onClick={() => setShowStatement(true)}
                    style={{ width: '100%', padding: '14px 20px', background: '#fff', border: 'none', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'inherit' }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: '#f4f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={15} color="#64748b" />
                    </div>
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: '#374151', textAlign: 'left' }}>Request Statement</span>
                    <ChevronRight size={18} color="#94a3b8" />
                </button>

                {/* Transaction History header */}
                <div style={{ padding: '16px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: '#1a2332', margin: 0 }}>Transaction History</p>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <SlidersHorizontal size={18} color={NAVY} />
                    </button>
                </div>

                {/* Grouped transactions */}
                {Object.keys(grouped).length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                        <p style={{ fontSize: 32, margin: '0 0 8px' }}>📭</p>
                        <p style={{ fontSize: 14, color: '#94a3b8' }}>No transactions yet</p>
                    </div>
                ) : (
                    Object.entries(grouped).map(([month, txs]) => (
                        <div key={month}>
                            <div style={{ padding: '8px 20px 6px', background: '#f8f9fb' }}>
                                <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', margin: 0 }}>{month}</p>
                            </div>
                            {txs.map(tx => {
                                const isCredit = tx.type === 'credit';
                                const pts = tx.points ?? 0;
                                const d = new Date(tx.date);
                                const dateStr = d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                const timeStr = d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
                                return (
                                    <div key={tx.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f8f9fb', display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {/* Icon */}
                                        <div style={{ width: 36, height: 36, borderRadius: 8, background: isCredit ? '#ecfdf5' : '#fff0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {isCredit
                                                ? <ArrowDownLeft size={18} color="#059669" />
                                                : <ArrowUpRight size={18} color="#dc2626" />}
                                        </div>
                                        {/* Text */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.title}</p>
                                            <p style={{ fontSize: 11, color: '#64748b', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.subtitle}</p>
                                            <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>{dateStr} &nbsp; {timeStr.toUpperCase()}</p>
                                        </div>
                                        {/* Points */}
                                        <p style={{ fontSize: 16, fontWeight: 900, color: isCredit ? '#059669' : '#dc2626', margin: 0, flexShrink: 0 }}>
                                            {isCredit ? '+' : '−'}{pts}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>

            <BottomNav />
        </div>
    );
}
