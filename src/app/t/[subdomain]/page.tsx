'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTenantStore, useAuthStore } from '@/store';
import { Zap, Phone, ArrowRight, CheckCircle, Star, Shield, Gift } from 'lucide-react';

export default function TenantPortalPage() {
    const params = useParams();
    const router = useRouter();
    const subdomain = params?.subdomain as string;

    const { getTenantBySubdomain } = useTenantStore();
    const { setTenant } = useAuthStore();

    const [phone, setPhone] = useState('');
    const [step, setStep] = useState<'landing' | 'login'>('landing');

    const tenant = getTenantBySubdomain(subdomain);

    // If tenant not found, show 404-style message
    if (!tenant) {
        return (
            <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Segoe UI',sans-serif", padding: 24 }}>
                <div style={{ textAlign: 'center', maxWidth: 360 }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🏢</div>
                    <h1 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>Tenant Not Found</h1>
                    <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
                        No tenant exists for subdomain <strong>&ldquo;{subdomain}&rdquo;</strong>.<br />
                        Please check the URL or contact your administrator.
                    </p>
                    <button onClick={() => router.push('/admin')}
                        style={{ padding: '10px 24px', background: '#6366f1', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                        Go to Admin Panel
                    </button>
                </div>
            </div>
        );
    }

    const PRIMARY = tenant.primaryColor;
    const GRADIENT = `linear-gradient(160deg, ${tenant.gradientFrom}, ${tenant.gradientTo})`;

    const handleEnter = () => {
        // Set this tenant as the active tenant in auth store, then go to login
        setTenant(tenant);
        router.push('/login');
    };

    const FEATURES = [
        { icon: <Gift size={18} color={PRIMARY} />, label: 'Earn Reward Points', desc: 'On every qualifying purchase' },
        { icon: <Star size={18} color={PRIMARY} />, label: 'Exclusive Offers', desc: 'Members-only deals & discounts' },
        { icon: <Shield size={18} color={PRIMARY} />, label: 'Secure & Trusted', desc: 'Your data is always protected' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

            {/* ── Hero gradient header ── */}
            <div style={{ background: GRADIENT, padding: '0 0 60px', position: 'relative', overflow: 'hidden' }}>
                {/* BG circles */}
                <div style={{ position: 'absolute', top: -60, right: -60, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

                {/* Nav */}
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {tenant.logoUrl ? (
                            <img src={tenant.logoUrl} alt={tenant.name}
                                style={{ width: 40, height: 40, borderRadius: 12, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)' }} />
                        ) : (
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <span style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{tenant.name[0]}</span>
                            </div>
                        )}
                        <span style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>{tenant.name}</span>
                    </div>
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, background: 'rgba(255,255,255,0.12)', padding: '4px 10px', borderRadius: 20 }}>
                        Loyalty Platform
                    </span>
                </div>

                {/* Hero content */}
                <div style={{ position: 'relative', textAlign: 'center', padding: '20px 24px 0' }}>
                    {/* Big logo */}
                    <div style={{ margin: '0 auto 20px', width: 90, height: 90, borderRadius: 28, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {tenant.logoUrl ? (
                            <img src={tenant.logoUrl} alt={tenant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span style={{ fontSize: 40, fontWeight: 900, color: '#fff' }}>{tenant.name[0]}</span>
                        )}
                    </div>

                    <h1 style={{ fontSize: 'clamp(24px,5vw,36px)', fontWeight: 900, color: '#fff', margin: '0 0 10px', letterSpacing: '-1px', lineHeight: 1.1 }}>
                        Welcome to<br />{tenant.name} Rewards
                    </h1>
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: '0 0 28px', lineHeight: 1.6, maxWidth: 340, marginLeft: 'auto', marginRight: 'auto' }}>
                        Earn points, unlock exclusive rewards and enjoy premium loyalty benefits.
                    </p>

                    {/* CTA Button */}
                    <button onClick={handleEnter}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: 'none', borderRadius: 16, padding: '14px 28px', cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
                        <span style={{ fontSize: 15, fontWeight: 800, color: PRIMARY }}>Join / Login</span>
                        <ArrowRight size={18} color={PRIMARY} />
                    </button>
                </div>
            </div>

            {/* ── Stats strip ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', display: 'flex' }}>
                {[
                    { label: 'Points/₹1', value: `${tenant.pointsPerRupee}x` },
                    { label: 'Min Redeem', value: `${(tenant.minRedeemPoints / 1000).toFixed(1)}K pts` },
                    { label: 'Cashback Rate', value: `₹${tenant.cashbackRate}` },
                ].map(({ label, value }) => (
                    <div key={label} style={{ flex: 1, textAlign: 'center', padding: '14px 8px', borderRight: '1px solid #e8ecf0' }}>
                        <p style={{ fontSize: 17, fontWeight: 900, color: PRIMARY, margin: '0 0 2px' }}>{value}</p>
                        <p style={{ fontSize: 10, color: '#94a3b8', margin: 0, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Features ── */}
            <div style={{ padding: '28px 20px' }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px' }}>
                    Why Join {tenant.name}?
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {FEATURES.map(({ icon, label, desc }) => (
                        <div key={label} style={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 16, padding: '16px', display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <div style={{ width: 44, height: 44, borderRadius: 14, background: `${PRIMARY}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {icon}
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 800, color: '#1a2332', margin: '0 0 2px' }}>{label}</p>
                                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>{desc}</p>
                            </div>
                            <CheckCircle size={16} color="#10b981" style={{ marginLeft: 'auto', flexShrink: 0 }} />
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Bottom CTA ── */}
            <div style={{ padding: '0 20px 40px' }}>
                <div style={{ background: GRADIENT, borderRadius: 20, padding: '24px', textAlign: 'center', boxShadow: `0 8px 32px ${PRIMARY}33` }}>
                    <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: '0 0 6px' }}>Ready to start earning?</p>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: '0 0 18px' }}>Login with your mobile number to get started</p>
                    <button onClick={handleEnter}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff', border: 'none', borderRadius: 14, padding: '12px 28px', cursor: 'pointer', fontFamily: 'inherit' }}>
                        <Phone size={16} color={PRIMARY} />
                        <span style={{ fontSize: 14, fontWeight: 800, color: PRIMARY }}>Login with Mobile</span>
                    </button>
                </div>
            </div>

            {/* Powered by footer */}
            <div style={{ textAlign: 'center', paddingBottom: 24 }}>
                <p style={{ fontSize: 11, color: '#cbd5e1', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    Powered by <Zap size={11} color="#6366f1" fill="#6366f1" style={{ display: 'inline' }} /> <strong style={{ color: '#6366f1' }}>AvoPay</strong>
                </p>
            </div>
        </div>
    );
}
