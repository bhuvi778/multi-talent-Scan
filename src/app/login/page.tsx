'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Phone, Shield, ArrowRight, QrCode, Zap, Users, Star, ChevronRight } from 'lucide-react';

const INDIGO = '#4f46e5';
const INDIGO_LIGHT = '#eef2ff';

export default function LoginPage() {
    const router = useRouter();
    const { login, verifyOTP, loading, otpSent, phone, setPhone, setOtpSent } = useAuthStore();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [refs] = useState<(HTMLInputElement | null)[]>([]);

    useEffect(() => { if (useAuthStore.getState().isLoggedIn) router.replace('/home'); }, [router]);

    const handleSendOTP = () => {
        if (!agreedTerms) { setPhoneError('Please agree to Terms & Conditions first'); return; }
        if (!/^\d{10}$/.test(phone)) { setPhoneError('Enter a valid 10-digit mobile number'); return; }
        setPhoneError(''); login(phone);
    };

    const handleVerifyOTP = async () => {
        const code = otp.join('');
        if (code.length < 6) { setOtpError('Enter the complete 6-digit OTP'); return; }
        setOtpError('');
        const ok = await verifyOTP(code);
        if (ok) router.replace('/home');
        else { setOtpError('Invalid OTP. Demo: 1 2 3 4 5 6'); setOtp(['', '', '', '', '', '']); refs[0]?.focus(); }
    };

    const otpChange = (i: number, val: string) => {
        if (!/^\d?$/.test(val)) return;
        const n = [...otp]; n[i] = val; setOtp(n);
        if (val && i < 5) refs[i + 1]?.focus();
    };

    const STATS = [
        { value: '2M+', label: 'Customers' },
        { value: '₹15Cr', label: 'Cashback Paid' },
        { value: '50+', label: 'Brands' },
        { value: '4.9★', label: 'Rating' },
    ];

    return (
        <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter','Segoe UI',sans-serif", background: '#fff' }}>

            {/* ── Left panel ── */}
            <div className="login-left" style={{ width: '42%', background: `linear-gradient(145deg, ${INDIGO} 0%, #312e81 100%)`, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', position: 'relative', overflow: 'hidden' }}>
                {/* BG orbs */}
                <div style={{ position: 'absolute', top: -80, right: -80, width: 320, height: 320, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                {/* Logo */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 48, position: 'relative', zIndex: 1 }}>
                    <div style={{ width: 42, height: 42, borderRadius: 13, background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={20} color="#fff" fill="#fff" />
                    </div>
                    <div>
                        <span style={{ fontSize: 20, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>OzoSTARS</span>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 500 }}>Loyalty & Rewards</p>
                    </div>
                </div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', lineHeight: 1.15, margin: '0 0 14px', letterSpacing: '-1px' }}>
                        Scan. Earn.<br />
                        <span style={{ color: '#c7d2fe' }}>Get Rewarded.</span>
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.65, margin: '0 0 40px', fontWeight: 400 }}>
                        India's most trusted loyalty platform. Scan product QR codes and earn instant cashback.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
                        {STATS.map(({ value, label }) => (
                            <div key={label} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 14, padding: '16px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <p style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 2px', letterSpacing: '-0.5px' }}>{value}</p>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', margin: 0, fontWeight: 500 }}>{label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick Scan CTA for desktop */}
                    <button onClick={() => router.push('/cashback')}
                        style={{ width: '100%', padding: '14px 18px', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: 14, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'inherit', backdropFilter: 'blur(8px)', transition: 'all 0.2s' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}>
                        <QrCode size={18} />
                        <span style={{ flex: 1, textAlign: 'left' }}>Scan QR & Get Cashback</span>
                        <ChevronRight size={16} color="rgba(255,255,255,0.6)" />
                    </button>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '8px 0 0', textAlign: 'center' }}>No account needed · Instant bank/UPI transfer</p>
                </div>
            </div>

            {/* ── Right panel ── */}
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: '#fff', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: 400 }}>

                    {/* Mobile logo */}
                    <div className="login-mobile-logo" style={{ display: 'none', alignItems: 'center', gap: 10, marginBottom: 28, justifyContent: 'center' }}>
                        <div style={{ width: 38, height: 38, borderRadius: 11, background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Star size={18} color="#fff" fill="#fff" /></div>
                        <span style={{ fontSize: 20, fontWeight: 900, color: INDIGO }}>OzoSTARS</span>
                    </div>

                    {/* Mobile: Scan banner */}
                    <div className="login-scan-banner" style={{ display: 'none', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 14, padding: '14px 16px', marginBottom: 20, cursor: 'pointer', alignItems: 'center', gap: 12 }}
                        onClick={() => router.push('/cashback')}>
                        <div style={{ width: 42, height: 42, borderRadius: 12, background: INDIGO_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <QrCode size={20} color={INDIGO} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>Scan QR & Get Instant Cashback</p>
                            <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>No login needed · Direct bank/UPI transfer</p>
                        </div>
                        <ChevronRight size={16} color="#94a3b8" />
                    </div>

                    <div className="login-divider" style={{ display: 'none', alignItems: 'center', gap: 12, marginBottom: 22 }}>
                        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap' }}>or sign in to your account</span>
                        <div style={{ flex: 1, height: 1, background: '#e2e8f0' }} />
                    </div>

                    <h2 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                        {otpSent ? 'Enter OTP' : 'Welcome back'}
                    </h2>
                    <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px', lineHeight: 1.6 }}>
                        {otpSent
                            ? <>OTP sent to <strong style={{ color: '#0f172a' }}>+91 {phone}</strong></>
                            : 'Enter your mobile number to continue'}
                    </p>

                    {!otpSent ? (
                        /* ── Phone step ── */
                        <div>
                            <label style={lbl}>Mobile Number</label>
                            <div style={{ display: 'flex', border: `1.5px solid ${phoneError ? '#ef4444' : '#e2e8f0'}`, borderRadius: 12, overflow: 'hidden', background: '#f8fafc', marginBottom: 8, transition: 'border-color 0.2s' }}
                                onFocusCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = INDIGO; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 3px ${INDIGO_LIGHT}`; }}
                                onBlurCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = phoneError ? '#ef4444' : '#e2e8f0'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '13px 14px', borderRight: '1.5px solid #e2e8f0', flexShrink: 0 }}>
                                    <Phone size={15} color="#94a3b8" />
                                    <span style={{ fontSize: 14, color: '#475569', fontWeight: 600 }}>+91</span>
                                </div>
                                <input id="login-phone" type="tel" maxLength={10} value={phone}
                                    placeholder="9XXXXXXXXX"
                                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                                    onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent', color: '#0f172a', fontFamily: 'inherit', padding: '13px 14px', letterSpacing: '0.5px' }} />
                            </div>
                            {phoneError && <p style={err}>{phoneError}</p>}

                            {/* Terms */}
                            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', margin: '14px 0 24px', userSelect: 'none' }}>
                                <div onClick={() => setAgreedTerms(a => !a)}
                                    style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${agreedTerms ? INDIGO : '#cbd5e1'}`, background: agreedTerms ? INDIGO : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s', cursor: 'pointer' }}>
                                    {agreedTerms && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </div>
                                <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
                                    I agree to the{' '}
                                    <span onClick={e => { e.stopPropagation(); setShowTerms(true); }} style={{ color: INDIGO, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Terms & Conditions</span>
                                    {' '}and{' '}
                                    <span style={{ color: INDIGO, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
                                </span>
                            </label>

                            <button id="login-send-otp" onClick={handleSendOTP} disabled={loading}
                                style={{ width: '100%', padding: '14px', background: loading ? '#e2e8f0' : INDIGO, border: 'none', borderRadius: 12, color: loading ? '#94a3b8' : '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: loading ? 'none' : `0 6px 20px rgba(79,70,229,0.3)`, transition: 'all 0.2s' }}>
                                {loading ? <><Spin />Sending OTP…</> : <>Get OTP <ArrowRight size={16} /></>}
                            </button>

                            <div style={{ marginTop: 24, padding: '14px 16px', background: INDIGO_LIGHT, borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                                <Shield size={16} color={INDIGO} style={{ flexShrink: 0, marginTop: 1 }} />
                                <p style={{ fontSize: 12, color: '#4338ca', margin: 0, lineHeight: 1.5 }}>Your number is secure. We use OTP-based login — no passwords needed.</p>
                            </div>
                        </div>
                    ) : (
                        /* ── OTP step ── */
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, marginBottom: 8 }}>
                                {otp.map((d, i) => (
                                    <input key={i} ref={el => { refs[i] = el; }} id={`login-otp-${i}`}
                                        type="tel" inputMode="numeric" maxLength={1} value={d}
                                        onChange={e => otpChange(i, e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) refs[i - 1]?.focus(); }}
                                        style={{ width: '100%', minWidth: 0, aspectRatio: '1/1', textAlign: 'center', fontSize: 20, fontWeight: 800, border: `2px solid ${d ? INDIGO : '#e2e8f0'}`, borderRadius: 10, background: d ? INDIGO_LIGHT : '#f8fafc', color: d ? INDIGO : '#0f172a', outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s', boxSizing: 'border-box' }} />
                                ))}
                            </div>
                            {otpError && <p style={{ ...err, textAlign: 'center' }}>{otpError}</p>}
                            <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', margin: '8px 0 22px' }}>Demo OTP: <strong style={{ color: INDIGO }}>1 2 3 4 5 6</strong></p>

                            <button id="login-verify-otp" onClick={handleVerifyOTP} disabled={loading}
                                style={{ width: '100%', padding: '14px', background: loading ? '#e2e8f0' : INDIGO, border: 'none', borderRadius: 12, color: loading ? '#94a3b8' : '#fff', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: loading ? 'none' : `0 6px 20px rgba(79,70,229,0.3)`, transition: 'all 0.2s' }}>
                                {loading ? <><Spin />Verifying…</> : <>Verify & Login <ArrowRight size={16} /></>}
                            </button>
                            <button onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']); }}
                                style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: '#64748b', fontSize: 13, cursor: 'pointer', marginTop: 10, fontFamily: 'inherit', fontWeight: 500 }}>
                                ← Change number
                            </button>
                        </div>
                    )}

                    <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 28 }}>
                        Don&apos;t have an account?{' '}
                        <span onClick={() => router.push('/register')} style={{ color: INDIGO, fontWeight: 600, cursor: 'pointer' }}>Register here →</span>
                    </p>
                </div>
            </div>

            {/* Terms modal */}
            {showTerms && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setShowTerms(false)}>
                    <div style={{ background: '#fff', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: '0 0 16px' }}>Terms & Conditions</h3>
                        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>By using OzoSTARS, you agree that cashback/points are subject to campaign terms. Points have no cash value unless explicitly redeemed. OzoSTARS reserves the right to modify or revoke rewards at any time. Your mobile number is used solely for verification and communication.</p>
                        <button onClick={() => { setAgreedTerms(true); setShowTerms(false); }}
                            style={{ width: '100%', marginTop: 20, padding: '13px', background: INDIGO, border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
                            I Agree & Continue
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .login-left { display: none !important; }
                    .login-mobile-logo { display: flex !important; }
                    .login-scan-banner { display: flex !important; }
                    .login-divider { display: flex !important; }
                }
            `}</style>
        </div>
    );
}

function Spin() {
    return <div style={{ width: 17, height: 17, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />;
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 };
const err: React.CSSProperties = { color: '#ef4444', fontSize: 12, margin: '4px 0 0', fontWeight: 500 };
