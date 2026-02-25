'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCashbackStore, useAuthStore, useHistoryStore } from '@/store';
import { QrCode, CheckCircle, ArrowLeft, Building2, Smartphone, Send, Star, Shield, ChevronRight } from 'lucide-react';

type Step = 'scan' | 'phone' | 'otp' | 'cashback' | 'transfer' | 'success';

interface Product { name: string; brand: string; cashback: number; points: number; image: string; }

const PRODUCTS: Record<string, Product> = {
    'AP-001': { name: 'Premium Emulsion Paint 10L', brand: 'Asian Paints', cashback: 120, points: 550, image: '🎨' },
    'BP-002': { name: 'Silk Emulsion Paint 4L', brand: 'Berger Paints', cashback: 80, points: 400, image: '🖌️' },
    'NP-003': { name: 'Impressions HD 1L', brand: 'Nerolac', cashback: 50, points: 280, image: '🪣' },
    'GP-004': { name: 'Royal Paint Premium 20L', brand: 'Goodlass Paints', cashback: 200, points: 900, image: '🎨' },
    DEFAULT: { name: 'Branded Product', brand: 'Partner Brand', cashback: 75, points: 320, image: '📦' },
};

const NAVY = '#6366f1';
const INDIGO = NAVY; // Unified Navy theme throughout app

export default function CashbackPage() {
    const router = useRouter();
    const { addRequest } = useCashbackStore();
    const { addScan, addTransaction } = useHistoryStore();
    const { isLoggedIn, user, updateUser } = useAuthStore();

    const [step, setStep] = useState<Step>('scan');
    const [product, setProduct] = useState<Product | null>(null);
    const [code, setCode] = useState('');

    const [scanning, setScanning] = useState(false);
    const [scanPct, setScanPct] = useState(0);
    const [showManual, setShowManual] = useState(false);
    const [manualCode, setManualCode] = useState('');
    const ivRef = useRef<NodeJS.Timeout | null>(null);

    const linePos = useRef(0);
    const lineDir = useRef(1);
    const [lineY, setLineY] = useState(0);
    const rafRef = useRef<number | undefined>(undefined);
    useEffect(() => {
        if (scanning) {
            const tick = () => {
                linePos.current += lineDir.current * 2;
                if (linePos.current >= 100) lineDir.current = -1;
                if (linePos.current <= 0) lineDir.current = 1;
                setLineY(linePos.current);
                rafRef.current = requestAnimationFrame(tick);
            };
            rafRef.current = requestAnimationFrame(tick);
        }
        return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
    }, [scanning]);

    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [phoneErr, setPhoneErr] = useState('');
    const [otpErr, setOtpErr] = useState('');
    const [loading, setLoading] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [tMethod, setTMethod] = useState<'upi' | 'bank' | null>(null);
    const [upiId, setUpiId] = useState('');
    const [bankName, setBankName] = useState('');
    const [accNo, setAccNo] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [holder, setHolder] = useState('');
    const [txLoading, setTxLoading] = useState(false);

    const simulateScan = (qrCode?: string) => {
        const picked = qrCode || ['AP-001', 'BP-002', 'NP-003', 'GP-004'][Math.floor(Math.random() * 4)];
        setScanning(true); setScanPct(0);
        let p = 0;
        ivRef.current = setInterval(() => {
            p += 4; setScanPct(p);
            if (p >= 100) {
                clearInterval(ivRef.current!);
                setScanning(false); setScanPct(0);
                setCode(picked);
                setProduct(PRODUCTS[picked] || PRODUCTS.DEFAULT);
                setStep(isLoggedIn ? 'cashback' : 'phone');
            }
        }, 60);
    };

    const sendOTP = () => {
        if (phone.length !== 10) { setPhoneErr('Enter a valid 10-digit mobile number'); return; }
        setPhoneErr(''); setLoading(true);
        setTimeout(() => { setLoading(false); setStep('otp'); }, 1500);
    };

    const otpChange = (i: number, val: string) => {
        if (!/^\d?$/.test(val)) return;
        const n = [...otp]; n[i] = val; setOtp(n);
        if (val && i < 5) otpRefs.current[i + 1]?.focus();
    };

    const verifyOTP = () => {
        if (otp.join('').length < 6) { setOtpErr('Enter all 6 digits'); return; }
        setOtpErr(''); setLoading(true);
        setTimeout(() => { setLoading(false); setStep('cashback'); }, 1500);
    };

    const confirmAndGoProfile = () => {
        if (!product) return;
        addScan({ id: `s-${Date.now()}`, qrCode: code, productName: product.name, pointsEarned: product.points, scannedAt: new Date().toISOString(), status: 'success', type: 'sales' });
        addTransaction({ id: `t-${Date.now()}`, type: 'credit', category: 'scan', title: 'QR Scan Reward', subtitle: product.name, points: product.points, date: new Date().toISOString(), status: 'success' });
        addRequest({ productCode: code, productName: product.name, cashbackAmount: product.cashback, customerName: user?.name ?? '', mobileNumber: user?.phone ?? phone, upiId: '', tenantId: 'tenant-001' });
        updateUser({ totalPoints: (user?.totalPoints ?? 0) + product.points, lifetimePoints: (user?.lifetimePoints ?? 0) + product.points });
        router.push('/home');
    };

    const confirmGuest = (goTransfer: boolean) => {
        if (!product) return;
        addRequest({ productCode: code, productName: product.name, cashbackAmount: product.cashback, customerName: '', mobileNumber: phone, upiId: '', tenantId: 'tenant-001' });
        if (goTransfer) setStep('transfer'); else resetAll();
    };

    const doTransfer = () => {
        if (tMethod === 'upi' && !upiId) return;
        if (tMethod === 'bank' && (!accNo || !ifsc || !holder)) return;
        setTxLoading(true);
        setTimeout(() => { setTxLoading(false); setStep('success'); }, 2000);
    };

    const resetAll = () => {
        setProduct(null); setCode(''); setPhone(''); setOtp(['', '', '', '', '', '']);
        setPhoneErr(''); setOtpErr(''); setTMethod(null);
        setUpiId(''); setBankName(''); setAccNo(''); setIfsc(''); setHolder('');
        setStep('scan');
    };

    const TITLES: Record<Step, string> = {
        scan: 'Scan for Cashback', phone: 'Enter Mobile', otp: 'Verify OTP',
        cashback: 'Cashback Earned', transfer: 'Bank Transfer', success: 'Transfer Done!',
    };
    const STEPS: Step[] = ['scan', 'phone', 'otp', 'cashback'];
    const stepIdx = STEPS.indexOf(step as typeof STEPS[number]);

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

            {/* ── Header ── */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 20px', height: 60, display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
                <button onClick={() => { if (step === 'scan') router.push('/'); else if (step === 'phone') { setProduct(null); setStep('scan'); } else if (step === 'otp') { setOtp(['', '', '', '', '', '']); setStep('phone'); } else if (step === 'cashback') setStep(isLoggedIn ? 'scan' : 'phone'); else if (step === 'transfer') setStep('cashback'); else router.push('/'); }}
                    style={{ width: 36, height: 36, borderRadius: 10, background: '#f1f5f9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ArrowLeft size={16} color="#475569" />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={13} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{TITLES[step]}</span>
                </div>

                {isLoggedIn && user ? (
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 20, padding: '4px 10px' }}>
                        <Shield size={12} color="#059669" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>{user.name.split(' ')[0]} · {user.tier}</span>
                    </div>
                ) : !isLoggedIn && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                        {STEPS.map((s, i) => (
                            <div key={s} style={{ width: stepIdx > i ? 14 : 6, height: 6, borderRadius: 3, background: stepIdx >= i + 1 ? INDIGO : '#e2e8f0', transition: 'all 0.35s' }} />
                        ))}
                    </div>
                )}
            </div>

            {/* ── Body ── */}
            <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px 48px' }}>

                {/* ── SCAN ── */}
                {step === 'scan' && (
                    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                        {isLoggedIn && user && (
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px 16px', marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                                <div style={{ width: 44, height: 44, borderRadius: 13, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Shield size={20} color={INDIGO} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>Welcome, {user.name}!</p>
                                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{user.tier} Member · {user.totalPoints.toLocaleString()} pts · Scan to earn more</p>
                                </div>
                                <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 8, padding: '3px 8px' }}>
                                    <p style={{ fontSize: 9, fontWeight: 800, color: '#059669', margin: 0 }}>AUTO-VERIFY</p>
                                </div>
                            </div>
                        )}

                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '24px', marginBottom: 16, boxShadow: '0 1px 8px rgba(0,0,0,0.04)', textAlign: 'center' }}>
                            <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>
                                {isLoggedIn ? 'Scan a product QR code — points credited instantly' : 'Scan the QR code on your product to get cashback'}
                            </p>

                            {/* Scanner frame */}
                            <div style={{ position: 'relative', width: 220, height: 220, margin: '0 auto 20px', background: scanning ? '#f8fafc' : '#f1f5f9', borderRadius: 20, border: `2px solid ${scanning ? INDIGO : '#e2e8f0'}`, overflow: 'hidden', boxShadow: scanning ? `0 0 0 4px ${INDIGO}22` : 'none', transition: 'all 0.3s' }}>
                                {([['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']] as const).map(([v, h]) => (
                                    <div key={`${v}${h}`} style={{ position: 'absolute', width: 22, height: 22, [v]: 10, [h]: 10, borderColor: INDIGO, borderStyle: 'solid', borderWidth: v === 'top' && h === 'left' ? '3px 0 0 3px' : v === 'top' ? '3px 3px 0 0' : h === 'left' ? '0 0 3px 3px' : '0 3px 3px 0', borderRadius: v === 'top' && h === 'left' ? '4px 0 0 0' : v === 'top' ? '0 4px 0 0' : h === 'left' ? '0 0 0 4px' : '0 0 4px 0' }} />
                                ))}
                                {scanning ? (
                                    <>
                                        <div style={{ position: 'absolute', left: 10, right: 10, height: 2, top: `${lineY}%`, background: `linear-gradient(90deg,transparent,${INDIGO},transparent)`, boxShadow: `0 0 8px ${INDIGO}`, transition: 'top 0.016s linear' }} />
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <div style={{ background: '#fff', borderRadius: 10, padding: '8px 16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                                                <p style={{ fontSize: 12, color: '#475569', margin: 0, fontWeight: 600 }}>Scanning…</p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                                        <QrCode size={56} color="#cbd5e1" strokeWidth={1} />
                                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>Point camera at QR code</p>
                                    </div>
                                )}
                            </div>

                            {scanning && (
                                <div style={{ height: 4, background: '#e2e8f0', borderRadius: 2, overflow: 'hidden', maxWidth: 220, margin: '0 auto 16px' }}>
                                    <div style={{ height: '100%', width: `${scanPct}%`, background: INDIGO, borderRadius: 2, transition: 'width 0.06s linear' }} />
                                </div>
                            )}

                            <button id="scan-qr-btn" onClick={() => simulateScan()} disabled={scanning}
                                style={{ width: '100%', maxWidth: 260, padding: '13px 24px', background: scanning ? '#f1f5f9' : INDIGO, border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: scanning ? '#94a3b8' : '#fff', cursor: scanning ? 'not-allowed' : 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: scanning ? 'none' : `0 6px 20px rgba(79,70,229,0.3)`, fontFamily: 'inherit', transition: 'all 0.2s', marginBottom: 12 }}>
                                {scanning ? <><Spin />Scanning…</> : <><QrCode size={17} />Tap to Scan QR Code</>}
                            </button>

                            <br />
                            <button onClick={() => setShowManual(s => !s)} style={{ background: 'none', border: 'none', color: INDIGO, fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit' }}>
                                Enter product code manually
                            </button>

                            {showManual && (
                                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                    <input value={manualCode} onChange={e => setManualCode(e.target.value)} placeholder="e.g. AP-001, BP-002"
                                        onKeyDown={e => e.key === 'Enter' && (simulateScan(manualCode.toUpperCase()), setShowManual(false))}
                                        style={{ flex: 1, padding: '11px 13px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#0f172a' }} />
                                    <button onClick={() => { simulateScan(manualCode.toUpperCase()); setShowManual(false); }}
                                        style={{ padding: '11px 16px', background: INDIGO, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Go</button>
                                </div>
                            )}
                        </div>

                        <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                            💡 Demo codes: <strong style={{ color: '#475569' }}>AP-001</strong>, <strong style={{ color: '#475569' }}>BP-002</strong>, <strong style={{ color: '#475569' }}>NP-003</strong>
                        </p>
                    </div>
                )}

                {/* ── PHONE ── */}
                {step === 'phone' && product && (
                    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                        <ProdCard product={product} code={code} />
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 16 }}>
                            <label style={lbl}>Mobile Number</label>
                            <div style={{ display: 'flex', border: `1.5px solid ${phoneErr ? '#ef4444' : '#e2e8f0'}`, borderRadius: 11, overflow: 'hidden', background: '#f8fafc', marginBottom: 6 }}>
                                <span style={{ padding: '13px 14px', borderRight: '1.5px solid #e2e8f0', fontSize: 14, color: '#475569', fontWeight: 600, display: 'flex', alignItems: 'center' }}>+91</span>
                                <input id="cb-phone" type="tel" maxLength={10} value={phone} placeholder="9XXXXXXXXX"
                                    onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneErr(''); }}
                                    onKeyDown={e => e.key === 'Enter' && sendOTP()}
                                    style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15, background: 'transparent', color: '#0f172a', fontFamily: 'inherit', padding: '13px 14px', letterSpacing: '0.5px' }} />
                            </div>
                            {phoneErr && <p style={err}>{phoneErr}</p>}
                            <p style={{ fontSize: 12, color: '#64748b', margin: '8px 0 0', lineHeight: 1.5 }}>We'll send a 6-digit OTP. No account required.</p>
                        </div>
                        <button id="cb-send-otp" onClick={sendOTP} disabled={loading} style={primaryBtn(loading)}>
                            {loading ? <><Spin />Sending OTP…</> : <>📱 Send OTP <ChevronRight size={16} /></>}
                        </button>
                    </div>
                )}

                {/* ── OTP ── */}
                {step === 'otp' && product && (
                    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                        <ProdCard product={product} code={code} compact />
                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', marginBottom: 16 }}>
                            <p style={{ fontSize: 14, color: '#475569', margin: '0 0 16px' }}>OTP sent to <strong style={{ color: '#0f172a' }}>+91 {phone}</strong></p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8, marginBottom: 6 }}>
                                {otp.map((d, i) => (
                                    <input key={i} ref={el => { otpRefs.current[i] = el; }} id={`cb-otp-${i}`}
                                        type="tel" inputMode="numeric" maxLength={1} value={d}
                                        onChange={e => otpChange(i, e.target.value)}
                                        onKeyDown={e => { if (e.key === 'Backspace' && !d && i > 0) otpRefs.current[i - 1]?.focus(); }}
                                        style={{ width: '100%', minWidth: 0, aspectRatio: '1/1', textAlign: 'center', fontSize: 20, fontWeight: 800, border: `2px solid ${d ? INDIGO : '#e2e8f0'}`, borderRadius: 10, background: d ? '#eef2ff' : '#f8fafc', color: d ? INDIGO : '#0f172a', outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s', boxSizing: 'border-box' }} />
                                ))}
                            </div>
                            {otpErr && <p style={{ ...err, textAlign: 'center' }}>{otpErr}</p>}
                            <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', margin: '8px 0 0' }}>Demo OTP: <strong style={{ color: INDIGO }}>1 2 3 4 5 6</strong></p>
                        </div>
                        <button id="cb-verify-otp" onClick={verifyOTP} disabled={loading} style={primaryBtn(loading)}>
                            {loading ? <><Spin />Verifying…</> : <>✅ Verify & Get Cashback</>}
                        </button>
                        <button onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']); }} style={ghostBtn}>← Change number</button>
                    </div>
                )}

                {/* ── CASHBACK ── */}
                {step === 'cashback' && product && (
                    <div style={{ animation: 'fadeUp 0.4s ease both', textAlign: 'center' }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#ecfdf5', border: '2px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 0 14px #ecfdf540', animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
                            <CheckCircle size={42} color="#059669" />
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.5px' }}>Cashback Earned! 🎉</h2>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px' }}>
                            {isLoggedIn ? `Points credited to your ${user?.tier} account` : 'Choose how to receive your cashback'}
                        </p>

                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '20px', marginBottom: 16, textAlign: 'left', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                                <div>
                                    <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Cashback</p>
                                    <p style={{ fontSize: 42, fontWeight: 900, color: '#059669', margin: 0, lineHeight: 1 }}>₹{product.cashback}</p>
                                </div>
                                {isLoggedIn && (
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px' }}>Points</p>
                                        <p style={{ fontSize: 26, fontWeight: 900, color: '#d97706', margin: 0, lineHeight: 1 }}>+{product.points}</p>
                                    </div>
                                )}
                            </div>
                            <div style={{ height: 1, background: '#f1f5f9', margin: '0 0 12px' }} />
                            {[['Product', product.name], ['Brand', product.brand], isLoggedIn ? ['Account', `${user?.name} · ${user?.tier}`] : ['Mobile', `+91 ${phone}`]].map(([l, v]) => (
                                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                                    <span style={{ color: '#64748b' }}>{l}</span>
                                    <span style={{ color: '#0f172a', fontWeight: 600, maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                                </div>
                            ))}
                        </div>

                        {isLoggedIn ? (
                            <>
                                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '12px 14px', marginBottom: 16, display: 'flex', gap: 10, alignItems: 'center', textAlign: 'left' }}>
                                    <span style={{ fontSize: 18 }}>🎯</span>
                                    <p style={{ fontSize: 13, color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                                        <strong>+{product.points} points</strong> will be added to your <strong>{user?.tier}</strong> account when you go to your profile.
                                    </p>
                                </div>
                                <button id="cb-go-profile" onClick={confirmAndGoProfile} style={primaryBtn(false)}>🏠 Go to My Profile & Collect Points</button>
                                <button onClick={resetAll} style={ghostBtn}>Scan Another Product</button>
                            </>
                        ) : (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                                    <button id="cb-scan-another" onClick={() => confirmGuest(false)}
                                        style={{ padding: '16px 10px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.2s' }}>
                                        <div style={{ width: 40, height: 40, background: '#eef2ff', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><QrCode size={18} color={INDIGO} /></div>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Scan Another</p>
                                    </button>
                                    <button id="cb-bank-transfer" onClick={() => confirmGuest(true)}
                                        style={{ padding: '16px 10px', background: '#fff', border: '1.5px solid #a7f3d0', borderRadius: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', position: 'relative', transition: 'all 0.2s' }}>
                                        <span style={{ position: 'absolute', top: 8, right: 8, background: '#059669', borderRadius: 6, padding: '1px 6px', fontSize: 9, fontWeight: 800, color: '#fff' }}>INSTANT</span>
                                        <div style={{ width: 40, height: 40, background: '#ecfdf5', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building2 size={18} color="#059669" /></div>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', margin: 0 }}>Bank Transfer</p>
                                    </button>
                                </div>
                                <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
                                    Have an account?{' '}
                                    <span onClick={() => router.push('/login')} style={{ color: INDIGO, fontWeight: 600, cursor: 'pointer' }}>Login to save points →</span>
                                </p>
                            </>
                        )}
                    </div>
                )}

                {/* ── TRANSFER ── */}
                {step === 'transfer' && product && (
                    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 12, padding: '13px 16px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: 13, color: '#064e3b', fontWeight: 500 }}>Amount to transfer</span>
                            <span style={{ fontSize: 22, fontWeight: 900, color: '#059669' }}>₹{product.cashback}</span>
                        </div>

                        <label style={lbl}>Select Transfer Method</label>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                            {([
                                { key: 'upi', Icon: Smartphone, color: '#d97706', bg: '#fffbeb', border: '#fcd34d', label: 'UPI', sub: 'Instant' },
                                { key: 'bank', Icon: Building2, color: '#059669', bg: '#ecfdf5', border: '#6ee7b7', label: 'Bank', sub: '1-2 days' },
                            ] as const).map(({ key, Icon, color, bg, border, label, sub }) => {
                                const active = tMethod === key;
                                return (
                                    <button key={key} id={`cb-m-${key}`} onClick={() => setTMethod(key)}
                                        style={{ padding: '16px 12px', background: active ? bg : '#fff', border: `2px solid ${active ? border : '#e2e8f0'}`, borderRadius: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: active ? `0 2px 12px ${color}22` : '0 1px 4px rgba(0,0,0,0.04)' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 11, background: active ? color : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon size={18} color={active ? '#fff' : color} />
                                        </div>
                                        <p style={{ fontSize: 13, fontWeight: 700, color: active ? color : '#0f172a', margin: 0 }}>{label} Transfer</p>
                                        <p style={{ fontSize: 11, color: active ? color : '#94a3b8', margin: 0 }}>{sub}</p>
                                    </button>
                                );
                            })}
                        </div>

                        {tMethod === 'upi' && (
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animation: 'fadeUp 0.25s ease both' }}>
                                <label style={lbl}>UPI ID</label>
                                <input id="cb-upi" type="text" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)}
                                    style={inputSt} onFocus={e => { e.currentTarget.style.borderColor = '#d97706'; }} onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }} />
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                                    {['@paytm', '@ybl', '@oksbi', '@okhdfcbank'].map(h => (
                                        <button key={h} onClick={() => setUpiId(u => (u.split('@')[0] || 'name') + h)}
                                            style={{ padding: '3px 9px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 11, color: '#475569', cursor: 'pointer', fontFamily: 'inherit' }}>{h}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tMethod === 'bank' && (
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animation: 'fadeUp 0.25s ease both', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {([
                                    { id: 'cb-holder', l: 'Account Holder Name', ph: 'As per bank records', v: holder, s: setHolder },
                                    { id: 'cb-bank', l: 'Bank Name', ph: 'e.g. SBI, HDFC', v: bankName, s: setBankName },
                                    { id: 'cb-acc', l: 'Account Number', ph: 'Enter account number', v: accNo, s: setAccNo },
                                    { id: 'cb-ifsc', l: 'IFSC Code', ph: 'e.g. SBIN0001234', v: ifsc, s: setIfsc },
                                ] as const).map(({ id, l, ph, v, s }) => (
                                    <div key={id}>
                                        <label style={lbl}>{l}</label>
                                        <input id={id} type="text" placeholder={ph} value={v} onChange={e => s(e.target.value)}
                                            style={inputSt} onFocus={e => { e.currentTarget.style.borderColor = '#059669'; }} onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {tMethod && (
                            <button id="cb-tx-submit" onClick={doTransfer}
                                disabled={txLoading || (tMethod === 'upi' ? !upiId : !accNo || !ifsc || !holder)}
                                style={{
                                    width: '100%', padding: '14px', borderRadius: 13, border: 'none', fontFamily: 'inherit', fontSize: 15, fontWeight: 800,
                                    cursor: (txLoading || (tMethod === 'upi' ? !upiId : !accNo || !ifsc || !holder)) ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s',
                                    background: (txLoading || (tMethod === 'upi' ? !upiId : !accNo || !ifsc || !holder)) ? '#f1f5f9' : tMethod === 'upi' ? '#d97706' : '#059669',
                                    color: (txLoading || (tMethod === 'upi' ? !upiId : !accNo || !ifsc || !holder)) ? '#94a3b8' : '#fff',
                                    boxShadow: txLoading ? 'none' : tMethod === 'upi' ? '0 6px 20px rgba(217,119,6,0.3)' : '0 6px 20px rgba(5,150,105,0.3)',
                                }}>
                                {txLoading ? <><Spin />Processing…</> : <><Send size={16} />Send ₹{product.cashback} Now</>}
                            </button>
                        )}
                    </div>
                )}

                {/* ── SUCCESS ── */}
                {step === 'success' && product && (
                    <div style={{ animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both', textAlign: 'center' }}>
                        <div style={{ width: 90, height: 90, borderRadius: '50%', background: '#ecfdf5', border: '2px solid #6ee7b7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', boxShadow: '0 0 0 16px #ecfdf550' }}>
                            <CheckCircle size={46} color="#059669" />
                        </div>
                        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Transfer Initiated! 💚</h2>
                        <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 24px', lineHeight: 1.6 }}>
                            ₹{product.cashback} is on its way to your {tMethod === 'upi' ? 'UPI ID' : 'bank account'}.<br />
                            {tMethod === 'upi' ? 'Usually instant.' : 'Expect 1-2 business days.'}
                        </p>

                        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 18, padding: '18px', marginBottom: 20, textAlign: 'left', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 12px' }}>Transaction Summary</p>
                            {[['Amount', `₹${product.cashback}`], ['Product', product.name], ['Mobile', `+91 ${phone}`], ['Method', tMethod === 'upi' ? `UPI · ${upiId}` : `Bank · ${bankName || 'Account'}`], ['Status', '✅ Processing']].map(([l, v]) => (
                                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f1f5f9' }}>
                                    <span style={{ fontSize: 12, color: '#64748b' }}>{l}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', maxWidth: '55%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button id="cb-scan-again" onClick={resetAll} style={primaryBtn(false)}><QrCode size={16} /> Scan Another Product</button>
                            <button onClick={() => router.push('/')} style={ghostBtn}>Back to Home</button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeUp   { from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)} }
                @keyframes bounceIn { 0%{opacity:0;transform:scale(0.5)}70%{transform:scale(1.08)}100%{opacity:1;transform:scale(1)} }
                @keyframes spin     { to{transform:rotate(360deg)} }
            `}</style>
        </div>
    );
}

function ProdCard({ product, code, compact }: { product: Product; code: string; compact?: boolean }) {
    return (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 14, padding: compact ? '12px 14px' : '14px 16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
            <div style={{ width: compact ? 38 : 46, height: compact ? 38 : 46, background: '#eef2ff', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: compact ? 18 : 22, flexShrink: 0 }}>{product.image}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: '#0f172a', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{product.brand} · {code}</p>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <p style={{ fontSize: compact ? 16 : 20, fontWeight: 900, color: '#059669', margin: 0 }}>₹{product.cashback}</p>
                <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>cashback</p>
            </div>
        </div>
    );
}

function Spin() { return <div style={{ width: 17, height: 17, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite', flexShrink: 0 }} />; }

const lbl: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 };
const err: React.CSSProperties = { color: '#ef4444', fontSize: 12, margin: '4px 0 0', fontWeight: 500 };
const inputSt: React.CSSProperties = { width: '100%', padding: '12px 14px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, color: '#0f172a', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' };
const primaryBtn = (loading: boolean): React.CSSProperties => ({ width: '100%', padding: '14px', background: loading ? '#f1f5f9' : NAVY, border: 'none', borderRadius: 13, color: loading ? '#94a3b8' : '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 6px 20px rgba(99,102,241,0.3)' });
const ghostBtn: React.CSSProperties = { width: '100%', padding: '12px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: 13, color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 8, fontFamily: 'inherit' };
