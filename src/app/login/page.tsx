'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { Phone, ArrowRight, QrCode, ChevronRight, Shield, Star, CheckCircle } from 'lucide-react';

const NAVY = '#6366f1';
const NAVY2 = '#4f46e5';
const NAVYlight = '#eef2ff';

export default function LoginPage() {
    const router = useRouter();
    const { login, verifyOTP, loading, otpSent, phone, setPhone, setOtpSent } = useAuthStore();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpError, setOtpError] = useState('');
    const [agreedTerms, setAgreedTerms] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [showTerms, setShowTerms] = useState(false);
    const [refs] = useState<(HTMLInputElement | null)[]>([]);
    const [timer, setTimer] = useState(0);

    useEffect(() => { if (useAuthStore.getState().isLoggedIn) router.replace('/home'); }, [router]);

    // Countdown timer for OTP resend
    useEffect(() => {
        if (otpSent && timer === 0) setTimer(30);
    }, [otpSent]);
    useEffect(() => {
        if (timer <= 0) return;
        const t = setTimeout(() => setTimer(t => t - 1), 1000);
        return () => clearTimeout(t);
    }, [timer]);

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
        else { setOtpError('Incorrect OTP. Try 1 2 3 4 5 6 for demo'); setOtp(['', '', '', '', '', '']); refs[0]?.focus(); }
    };

    const otpChange = (i: number, val: string) => {
        if (!/^\d?$/.test(val)) return;
        const n = [...otp]; n[i] = val; setOtp(n);
        if (val && i < 5) refs[i + 1]?.focus();
    };

    const TRUST = [
        { icon: '🔒', text: 'Bank-grade security' },
        { icon: '⚡', text: 'Instant rewards' },
        { icon: '🏆', text: '2M+ members' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column' }}>

            {/* ── Top hero strip ── */}
            <div style={{ background: `linear-gradient(160deg, ${NAVY} 0%, ${NAVY2} 100%)`, padding: '40px 24px 32px', position: 'relative', overflow: 'hidden' }}>
                {/* BG blobs */}
                <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: 20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />

                {/* Brand */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28, position: 'relative' }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,0.15)' }}>
                        <Star size={20} color={NAVY} fill={NAVY} />
                    </div>
                    <div>
                        <p style={{ fontSize: 18, fontWeight: 900, color: '#fff', margin: 0, letterSpacing: '-0.4px' }}>AvoPay</p>
                        <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', margin: 0 }}>एक पहल, बेहतरी के साथ</p>
                    </div>
                </div>

                <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: 1.2 }}>
                    India's #1<br />Loyalty Platform
                </h1>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '0 0 24px', lineHeight: 1.6 }}>
                    Scan products, earn points & redeem amazing rewards
                </p>

                {/* Trust badges */}
                <div style={{ display: 'flex', gap: 12 }}>
                    {TRUST.map(({ icon, text }) => (
                        <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '5px 10px', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                            <span style={{ fontSize: 13 }}>{icon}</span>
                            <span style={{ fontSize: 10, color: '#fff', fontWeight: 600, whiteSpace: 'nowrap' }}>{text}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Quick Scan banner ── */}
            <div style={{ background: NAVYlight, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', borderBottom: '1px solid #d8e4f0' }}
                onClick={() => router.push('/cashback')}>
                <div style={{ width: 40, height: 40, background: NAVY, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <QrCode size={20} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: NAVY, margin: '0 0 1px' }}>Scan QR & Get Instant Cashback</p>
                    <p style={{ fontSize: 11, color: '#4a6fa0', margin: 0 }}>No login needed · Direct bank/UPI transfer</p>
                </div>
                <ChevronRight size={18} color={NAVY} />
            </div>

            {/* ── Login form ── */}
            <div style={{ flex: 1, padding: '28px 24px 40px', background: '#fff' }}>

                {!otpSent ? (
                    /* ── Phone step ── */
                    <div>
                        <p style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 4px' }}>Sign in to AvoPay</p>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px' }}>Enter your registered mobile number</p>

                        {/* Phone input */}
                        <p style={lbl}>Mobile Number</p>
                        <div style={{ display: 'flex', border: `1.5px solid ${phoneError ? '#ef4444' : '#dde5f0'}`, borderRadius: 12, overflow: 'hidden', background: '#f8fafc', marginBottom: 8, transition: 'all 0.2s' }}
                            onFocusCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = NAVY; (e.currentTarget as HTMLDivElement).style.background = '#fff'; (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 0 3px ${NAVYlight}`; }}
                            onBlurCapture={e => { (e.currentTarget as HTMLDivElement).style.borderColor = phoneError ? '#ef4444' : '#dde5f0'; (e.currentTarget as HTMLDivElement).style.background = '#f8fafc'; (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 14px', borderRight: '1.5px solid #dde5f0', flexShrink: 0, background: '#f0f4fa' }}>
                                <Phone size={15} color="#64748b" />
                                <span style={{ fontSize: 14, color: '#374151', fontWeight: 700 }}>+91</span>
                            </div>
                            <input id="login-phone" type="tel" maxLength={10} value={phone}
                                placeholder="9XXXXXXXXX"
                                onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                                style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#0f172a', fontFamily: 'inherit', padding: '14px', letterSpacing: '1px', fontWeight: 600 }} />
                        </div>
                        {phoneError && <p style={err}>{phoneError}</p>}

                        {/* Terms */}
                        <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', margin: '16px 0 22px', userSelect: 'none' }}>
                            <div onClick={() => setAgreedTerms(a => !a)}
                                style={{ width: 20, height: 20, borderRadius: 6, border: `2px solid ${agreedTerms ? NAVY : '#cbd5e1'}`, background: agreedTerms ? NAVY : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, transition: 'all 0.15s', cursor: 'pointer' }}>
                                {agreedTerms && <svg width="11" height="8" viewBox="0 0 11 8" fill="none"><path d="M1 4L4 7L10 1" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <span style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6 }}>
                                I agree to the{' '}
                                <span onClick={e => { e.stopPropagation(); setShowTerms(true); }} style={{ color: NAVY, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Terms & Conditions</span>
                                {' '}and{' '}
                                <span style={{ color: NAVY, fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>
                            </span>
                        </label>

                        {/* CTA */}
                        <button id="login-send-otp" onClick={handleSendOTP} disabled={loading}
                            style={{ width: '100%', padding: '15px', background: loading ? '#94a3b8' : NAVY, border: 'none', borderRadius: 13, color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: loading ? 'none' : `0 6px 24px rgba(28,63,110,0.35)`, transition: 'all 0.2s', letterSpacing: '-0.2px' }}>
                            {loading ? <><Spin /> Sending OTP…</> : <>Get OTP <ArrowRight size={17} /></>}
                        </button>

                        {/* Security note */}
                        <div style={{ marginTop: 18, padding: '12px 16px', background: '#f0f4fa', borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                            <Shield size={15} color={NAVY} style={{ marginTop: 1, flexShrink: 0 }} />
                            <p style={{ fontSize: 12, color: '#4a6fa0', margin: 0, lineHeight: 1.5 }}>Your number is 100% secure. OTP-based login — no passwords, no spam.</p>
                        </div>

                        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 20 }}>
                            New user?{' '}
                            <span onClick={() => router.push('/register')} style={{ color: NAVY, fontWeight: 700, cursor: 'pointer' }}>Register here →</span>
                        </p>
                    </div>
                ) : (
                    /* ── OTP step ── */
                    <div>
                        <button onClick={() => { setOtpSent(false); setOtp(['', '', '', '', '', '']); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: NAVY, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, marginBottom: 20, padding: 0 }}>
                            ← Change number
                        </button>

                        <p style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', margin: '0 0 6px' }}>Verify OTP</p>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
                            6-digit OTP sent to <strong style={{ color: '#0f172a', fontWeight: 700 }}>+91 {phone}</strong>
                        </p>

                        {/* OTP boxes */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, marginBottom: 8 }}>
                            {otp.map((d, i) => (
                                <input key={i} ref={el => { refs[i] = el; }} id={`login-otp-${i}`}
                                    type="tel" inputMode="numeric" maxLength={1} value={d}
                                    onChange={e => otpChange(i, e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) refs[i - 1]?.focus(); }}
                                    style={{ width: '100%', aspectRatio: '1/1', textAlign: 'center', fontSize: 22, fontWeight: 900, border: `2.5px solid ${d ? NAVY : '#dde5f0'}`, borderRadius: 12, background: d ? NAVYlight : '#f8fafc', color: d ? NAVY : '#0f172a', outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s', boxSizing: 'border-box', cursor: 'text' }} />
                            ))}
                        </div>
                        {otpError && <p style={{ ...err, textAlign: 'center', marginBottom: 10 }}>{otpError}</p>}

                        {/* Demo hint */}
                        <div style={{ background: '#f0f4fa', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 22 }}>
                            <CheckCircle size={14} color={NAVY} />
                            <p style={{ fontSize: 12, color: '#4a6fa0', margin: 0 }}>Demo OTP: <strong style={{ color: NAVY, letterSpacing: '2px' }}>1 2 3 4 5 6</strong></p>
                        </div>

                        {/* Verify CTA */}
                        <button id="login-verify-otp" onClick={handleVerifyOTP} disabled={loading}
                            style={{ width: '100%', padding: '15px', background: loading ? '#94a3b8' : NAVY, border: 'none', borderRadius: 13, color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: loading ? 'none' : `0 6px 24px rgba(28,63,110,0.35)`, transition: 'all 0.2s', marginBottom: 12 }}>
                            {loading ? <><Spin /> Verifying…</> : <>Verify & Login <ArrowRight size={17} /></>}
                        </button>

                        {/* Resend */}
                        <p style={{ fontSize: 13, color: '#64748b', textAlign: 'center', margin: 0 }}>
                            {timer > 0
                                ? <>Resend OTP in <strong style={{ color: NAVY }}>{timer}s</strong></>
                                : <span onClick={() => { login(phone); setTimer(30); setOtp(['', '', '', '', '', '']); }} style={{ color: NAVY, fontWeight: 700, cursor: 'pointer' }}>Resend OTP</span>
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* ── Terms modal ── */}
            {showTerms && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end', padding: 0 }} onClick={() => setShowTerms(false)}>
                    <div style={{ background: '#fff', borderRadius: '20px 20px 0 0', padding: '24px 24px 40px', width: '100%', maxHeight: '75vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
                        <div style={{ width: 36, height: 4, background: '#e2e8f0', borderRadius: 2, margin: '0 auto 20px' }} />
                        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', margin: '0 0 14px' }}>Terms & Conditions</h3>
                        <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.75 }}>
                            By using AvoPay, you agree that cashback and loyalty points are subject to campaign-specific terms. Points have no cash value unless explicitly redeemed through our platform. AvoPay reserves the right to modify, suspend, or revoke rewards at any time without prior notice. Your mobile number is used solely for verification and essential communications.
                        </p>
                        <button onClick={() => { setAgreedTerms(true); setShowTerms(false); }}
                            style={{ width: '100%', marginTop: 20, padding: '14px', background: NAVY, border: 'none', borderRadius: 13, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: `0 6px 20px rgba(28,63,110,0.3)` }}>
                            I Agree & Continue
                        </button>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

function Spin() {
    return <div style={{ width: 18, height: 18, borderRadius: '50%', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />;
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#4a6fa0', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 };
const err: React.CSSProperties = { color: '#ef4444', fontSize: 12, margin: '4px 0 0', fontWeight: 600 };
