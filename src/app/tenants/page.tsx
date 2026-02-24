'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, MOCK_TENANTS } from '@/store';
import { CheckCircle } from 'lucide-react';

export default function TenantSelectPage() {
    const router = useRouter();
    const { setTenant, tenant: currentTenant } = useAuthStore();
    const [selected, setSelected] = useState(currentTenant.id);
    const [confirming, setConfirming] = useState(false);

    const handleSelect = async (tenantId: string) => {
        setSelected(tenantId);
        setConfirming(true);
        const t = MOCK_TENANTS.find(x => x.id === tenantId)!;
        await new Promise(r => setTimeout(r, 800));
        setTenant(t);
        router.replace('/login');
    };

    return (
        <div className="min-h-screen bg-mesh flex flex-col items-center justify-center px-6 py-10"
            style={{ background: 'linear-gradient(135deg,#0F0C29,#1a1740)' }}>
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-10">
                    <div style={{ fontSize: 48, marginBottom: 16, animation: 'float 3s ease-in-out infinite' }}>🌐</div>
                    <h1 style={{ fontSize: 26, fontWeight: 800, color: 'white', marginBottom: 8 }}>Select Client Portal</h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                        Each client has its own branded loyalty experience.<br />
                        Choose a portal to continue.
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    {MOCK_TENANTS.map(t => (
                        <button
                            key={t.id}
                            id={`tenant-${t.id}`}
                            onClick={() => handleSelect(t.id)}
                            disabled={confirming}
                            className="card p-5 flex items-center gap-5 text-left w-full"
                            style={{
                                border: selected === t.id ? `1px solid ${t.primaryColor}60` : '1px solid rgba(255,255,255,0.08)',
                                background: selected === t.id ? `${t.primaryColor}12` : 'rgba(255,255,255,0.03)',
                                cursor: confirming ? 'wait' : 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: selected === t.id ? `0 0 30px ${t.primaryColor}20` : 'none',
                            }}
                        >
                            <div style={{
                                width: 56, height: 56, borderRadius: 18, flexShrink: 0,
                                background: `linear-gradient(135deg,${t.gradientFrom},${t.gradientTo})`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
                                boxShadow: `0 8px 24px ${t.primaryColor}30`,
                            }}>
                                {t.logo}
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 16, fontWeight: 700, color: 'white', marginBottom: 3 }}>{t.name}</p>
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 8 }}>
                                    {t.subdomain}.rewardspro.in
                                </p>
                                <div className="flex flex-wrap gap-1">
                                    {Object.entries(t.features).filter(([, v]) => v).slice(0, 3).map(([k]) => (
                                        <span key={k} style={{ fontSize: 10, background: `${t.primaryColor}18`, color: t.primaryColor, border: `1px solid ${t.primaryColor}30`, borderRadius: 6, padding: '2px 8px', fontWeight: 500 }}>
                                            {k.replace(/([A-Z])/g, ' $1').trim()}
                                        </span>
                                    ))}
                                    {Object.entries(t.features).filter(([, v]) => v).length > 3 && (
                                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', padding: '2px 4px' }}>
                                            +{Object.entries(t.features).filter(([, v]) => v).length - 3} more
                                        </span>
                                    )}
                                </div>
                            </div>
                            {selected === t.id && confirming ? (
                                <div style={{ width: 24, height: 24, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.2)', borderTop: `2px solid ${t.primaryColor}`, animation: 'spin-slow 0.8s linear infinite', flexShrink: 0 }} />
                            ) : selected === t.id ? (
                                <CheckCircle size={22} style={{ color: t.primaryColor, flexShrink: 0 }} />
                            ) : null}
                        </button>
                    ))}
                </div>

                <p style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>
                    In production, clients are auto-detected via subdomain.<br />
                    This selector is for demo purposes.
                </p>

                <button onClick={() => router.push('/admin')} style={{ display: 'block', margin: '16px auto 0', fontSize: 12, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    → Admin Panel
                </button>
            </div>
        </div>
    );
}
