'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useHistoryStore, useAuthStore } from '@/store';
import { X, CheckCircle, Camera, Smartphone, Building2, ArrowLeft, Send } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────
interface ScanResult {
    productName: string;
    brand: string;
    cashback: number;   // ₹ cashback amount
    points: number;
    qrCode: string;
}

type Step =
    | 'scan'           // 1. QR scanning
    | 'phone'          // 2. Enter mobile number
    | 'otp'            // 3. Enter OTP
    | 'cashback'       // 4. Show cashback earned + options
    | 'transfer'       // 5. UPI / Bank details
    | 'success';       // 6. Transfer initiated

// ─── Mock data ──────────────────────────────────────────────────────────────
const MOCK_QR_RESULTS: ScanResult[] = [
    { productName: 'Asian Paints Royale Gloss 10L', brand: 'Asian Paints', cashback: 120, points: 550, qrCode: 'AP-001' },
    { productName: 'Berger Weathercoat 20L', brand: 'Berger Paints', cashback: 90, points: 400, qrCode: 'BP-002' },
    { productName: 'Nerolac Impressions HD Plus', brand: 'Nerolac', cashback: 75, points: 320, qrCode: 'NP-003' },
    { productName: 'Dulux Weathershield 5L', brand: 'Dulux', cashback: 60, points: 280, qrCode: 'DX-004' },
];

const NAVY = '#1c3f6e';
const GREEN = '#059669';

// ─── Component ───────────────────────────────────────────────────────────────
export default function ScanPage() {
    const router = useRouter();
    const { addScan, addTransaction } = useHistoryStore();
    const { user, updateUser } = useAuthStore();

    // ── Step state
    const [step, setStep] = useState<Step>('scan');
    const [scanResult, setScanResult] = useState<ScanResult | null>(null);

    // ── Scanner
    const [scanning, setScanning] = useState(false);
    const linePos = useRef(0);
    const lineDir = useRef(1);
    const [lineY, setLineY] = useState(0);
    const animRef = useRef<number | undefined>(undefined);

    // ── Phone / OTP
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [otpSent, setOtpSent] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [loading, setLoading] = useState(false);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    // ── Transfer
    const [transferMethod, setTransferMethod] = useState<'upi' | 'bank' | null>(null);
    const [upiId, setUpiId] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNo, setAccountNo] = useState('');
    const [ifsc, setIfsc] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [transferLoading, setTransferLoading] = useState(false);

    // ── Scan line animation
    useEffect(() => {
        if (scanning) {
            const animate = () => {
                linePos.current += lineDir.current * 2;
                if (linePos.current >= 100) lineDir.current = -1;
                if (linePos.current <= 0) lineDir.current = 1;
                setLineY(linePos.current);
                animRef.current = requestAnimationFrame(animate);
            };
            animRef.current = requestAnimationFrame(animate);
        }
        return () => { if (animRef.current) cancelAnimationFrame(animRef.current); };
    }, [scanning]);

    // ── Actions
    const startScanner = () => {
        setScanning(true);
        setTimeout(() => {
            const result = MOCK_QR_RESULTS[Math.floor(Math.random() * MOCK_QR_RESULTS.length)];
            setScanResult(result);
            setScanning(false);
            // Logged-in user → skip phone/OTP, record scan immediately
            addScan({ id: `s-${Date.now()}`, qrCode: result.qrCode, productName: result.productName, pointsEarned: result.points, scannedAt: new Date().toISOString(), status: 'success', type: 'sales' });
            addTransaction({ id: `t-${Date.now()}`, type: 'credit', category: 'scan', title: 'QR Scan Cashback', subtitle: result.productName, points: result.points, date: new Date().toISOString(), status: 'success' });
            updateUser({ totalPoints: (user?.totalPoints ?? 0) + result.points, lifetimePoints: (user?.lifetimePoints ?? 0) + result.points });
            setStep('cashback');
        }, 2500);
    };

    const handleSendOTP = () => {
        if (phone.length !== 10) { setPhoneError('Enter a valid 10-digit mobile number'); return; }
        setPhoneError('');
        setLoading(true);
        setTimeout(() => { setLoading(false); setOtpSent(true); }, 1500);
    };

    const handleOtpChange = (i: number, val: string) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...otp]; next[i] = val; setOtp(next);
        if (val && i < 5) otpRefs.current[i + 1]?.focus();
    };

    const handleOtpKeyDown = (i: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
    };

    const handleVerifyOTP = () => {
        const code = otp.join('');
        if (code.length < 6) { setOtpError('Enter all 6 digits'); return; }
        setOtpError('');
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            if (code === '123456' || code.length === 6) {
                // Record the scan
                if (scanResult) {
                    addScan({ id: `s-${Date.now()}`, qrCode: scanResult.qrCode, productName: scanResult.productName, pointsEarned: scanResult.points, scannedAt: new Date().toISOString(), status: 'success', type: 'sales' });
                    addTransaction({ id: `t-${Date.now()}`, type: 'credit', category: 'scan', title: 'QR Scan Cashback', subtitle: scanResult.productName, points: scanResult.points, date: new Date().toISOString(), status: 'success' });
                }
                setStep('cashback');
            } else {
                setOtpError('Invalid OTP. Demo: 1 2 3 4 5 6');
                setOtp(['', '', '', '', '', '']);
                otpRefs.current[0]?.focus();
            }
        }, 1500);
    };

    const handleTransfer = () => {
        if (transferMethod === 'upi' && !upiId) return;
        if (transferMethod === 'bank' && (!accountNo || !ifsc || !accountHolder)) return;
        setTransferLoading(true);
        setTimeout(() => { setTransferLoading(false); setStep('success'); }, 2000);
    };

    const resetForNewScan = () => {
        setScanResult(null); setPhone(''); setOtp(['', '', '', '', '', '']);
        setOtpSent(false); setPhoneError(''); setOtpError('');
        setTransferMethod(null); setUpiId(''); setBankName('');
        setAccountNo(''); setIfsc(''); setAccountHolder('');
        setStep('scan');
    };

    // ─────────────────────────────────────────────────────────────────────────
    //  RENDER
    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0f172a 0%, #1c3f6e 100%)', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', flexDirection: 'column' }}>

            {/* ── Header ── */}
            <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <button
                    onClick={() => step === 'scan' ? router.push('/home') : (step === 'phone' && !otpSent) ? resetForNewScan() : step === 'phone' ? setOtpSent(false) : step === 'otp' ? (() => { setOtpSent(false); setStep('phone'); })() : step === 'transfer' ? setStep('cashback') : router.push('/home')}
                    style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                >
                    {step === 'scan' ? <X size={18} color="rgba(255,255,255,0.8)" /> : <ArrowLeft size={18} color="rgba(255,255,255,0.8)" />}
                </button>
                <div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: '#fff', margin: 0 }}>
                        {step === 'scan' && 'Scan QR Code'}
                        {step === 'phone' && 'Verify Your Number'}
                        {step === 'otp' && 'Enter OTP'}
                        {step === 'cashback' && 'Cashback Earned!'}
                        {step === 'transfer' && 'Bank Transfer'}
                        {step === 'success' && 'Transfer Initiated'}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
                        {step === 'scan' && 'Point at product QR code'}
                        {step === 'phone' && 'Enter mobile number to get OTP'}
                        {step === 'otp' && `OTP sent to +91 ${phone}`}
                        {step === 'cashback' && scanResult?.productName}
                        {step === 'transfer' && 'Choose transfer method'}
                        {step === 'success' && 'Processing your cashback'}
                    </p>
                </div>

                {/* Step indicator */}
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
                    {(['scan', 'phone', 'otp', 'cashback'] as Step[]).map((s, i) => (
                        <div key={s} style={{ width: 6, height: 6, borderRadius: '50%', background: ['scan', 'phone', 'otp', 'cashback', 'transfer', 'success'].indexOf(step) >= i ? '#f5a623' : 'rgba(255,255,255,0.2)', transition: 'background 0.3s' }} />
                    ))}
                </div>
            </div>

            {/* ── Body ── */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px 20px 32px', maxWidth: 480, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>

                {/* ══════════ STEP 1: SCAN ══════════ */}
                {step === 'scan' && (
                    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                        {/* Scanner frame */}
                        <div style={{ position: 'relative', background: scanning ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.04)', border: `2px solid ${scanning ? '#f5a623' : 'rgba(255,255,255,0.12)'}`, borderRadius: 24, overflow: 'hidden', aspectRatio: '1', maxWidth: 300, margin: '0 auto 28px', width: '100%', transition: 'all 0.3s' }}>
                            {!scanning && (
                                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
                                    <div style={{ fontSize: 72 }}>📷</div>
                                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, textAlign: 'center', padding: '0 20px', margin: 0 }}>Tap below to scan product QR code</p>
                                </div>
                            )}
                            {scanning && (
                                <>
                                    {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h]) => (
                                        <div key={`${v}${h}`} style={{ position: 'absolute', width: 28, height: 28, [v]: 14, [h]: 14, borderColor: '#f5a623', borderStyle: 'solid', borderWidth: v === 'top' && h === 'left' ? '4px 0 0 4px' : v === 'top' ? '4px 4px 0 0' : h === 'left' ? '0 0 4px 4px' : '0 4px 4px 0', borderRadius: v === 'top' && h === 'left' ? '6px 0 0 0' : v === 'top' ? '0 6px 0 0' : h === 'left' ? '0 0 0 6px' : '0 0 6px 0' }} />
                                    ))}
                                    <div style={{ position: 'absolute', left: 14, right: 14, height: 2, top: `${lineY}%`, background: 'linear-gradient(90deg,transparent,#f5a623,transparent)', boxShadow: '0 0 10px #f5a623', transition: 'top 0.016s linear' }} />
                                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, background: 'rgba(0,0,0,0.6)', padding: '7px 16px', borderRadius: 20, margin: 0 }}>Searching for QR code...</p>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* How to steps */}
                        {!scanning && (
                            <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '16px 18px', marginBottom: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
                                <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 12px' }}>How it works</p>
                                {[
                                    ['📦', 'Scan QR on product packaging'],
                                    ['📱', 'Enter your mobile number'],
                                    ['✅', 'Verify OTP & get instant cashback'],
                                    ['💳', 'Transfer to UPI or bank account'],
                                ].map(([icon, text], i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: i < 3 ? 10 : 0 }}>
                                        <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                                        <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{text}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <button
                            id="start-scan-btn"
                            onClick={scanning ? () => setScanning(false) : startScanner}
                            style={{ width: '100%', padding: '16px', background: scanning ? 'rgba(255,255,255,0.1)' : '#f5a623', border: 'none', borderRadius: 16, color: scanning ? '#fff' : '#0f172a', fontSize: 16, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.2s', boxShadow: scanning ? 'none' : '0 8px 24px rgba(245,166,35,0.35)' }}
                        >
                            {scanning ? (
                                <><div style={{ width: 18, height: 18, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />Scanning...</>
                            ) : (
                                <><Camera size={20} />Start Scanning</>
                            )}
                        </button>
                        <p style={{ textAlign: 'center', marginTop: 14, color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>📝 Demo: simulates real QR detection</p>
                    </div>
                )}

                {/* ══════════ STEP 2: PHONE / OTP ══════════ */}
                {(step === 'phone' || step === 'otp') && scanResult && (
                    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                        {/* Product card */}
                        <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, padding: '14px 16px', marginBottom: 24, display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{ width: 48, height: 48, background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>🎨</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#fff', margin: '0 0 2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{scanResult.productName}</p>
                                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{scanResult.brand}</p>
                            </div>
                            <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                <p style={{ fontSize: 18, fontWeight: 900, color: '#f5a623', margin: 0 }}>₹{scanResult.cashback}</p>
                                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0 }}>cashback</p>
                            </div>
                        </div>

                        {!otpSent ? (
                            /* Phone input */
                            <>
                                <div style={{ marginBottom: 20 }}>
                                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>Mobile Number</label>
                                    <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${phoneError ? '#ef4444' : 'rgba(255,255,255,0.15)'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s' }}>
                                        <div style={{ padding: '14px 14px', borderRight: '1.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>+91</div>
                                        <input
                                            id="scan-phone-input"
                                            type="tel"
                                            maxLength={10}
                                            value={phone}
                                            onChange={e => { setPhone(e.target.value.replace(/\D/g, '')); setPhoneError(''); }}
                                            onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                                            placeholder="9XXXXXXXXX"
                                            style={{ flex: 1, border: 'none', outline: 'none', fontSize: 16, background: 'transparent', color: '#fff', fontFamily: 'inherit', padding: '14px 16px', letterSpacing: '0.5px' }}
                                        />
                                    </div>
                                    {phoneError && <p style={{ color: '#ef4444', fontSize: 12, margin: '6px 0 0', fontWeight: 500 }}>⚠ {phoneError}</p>}
                                </div>
                                <button
                                    id="scan-send-otp-btn"
                                    onClick={handleSendOTP}
                                    disabled={loading}
                                    style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,255,255,0.15)' : '#f5a623', border: 'none', borderRadius: 14, color: loading ? 'rgba(255,255,255,0.5)' : '#0f172a', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 6px 20px rgba(245,166,35,0.3)' }}
                                >
                                    {loading ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Sending OTP...</> : <>📱 Send OTP</>}
                                </button>
                            </>
                        ) : (
                            /* OTP input */
                            <>
                                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 20 }}>We sent a 6-digit OTP to <strong style={{ color: '#fff' }}>+91 {phone}</strong></p>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 8 }}>
                                    {otp.map((digit, i) => (
                                        <input
                                            key={i}
                                            ref={el => { otpRefs.current[i] = el; }}
                                            id={`scan-otp-${i}`}
                                            type="tel"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={e => handleOtpChange(i, e.target.value)}
                                            onKeyDown={e => handleOtpKeyDown(i, e)}
                                            style={{ width: '100%', minWidth: 0, aspectRatio: '1/1', textAlign: 'center', fontSize: 20, fontWeight: 800, border: `2px solid ${digit ? '#f5a623' : 'rgba(255,255,255,0.15)'}`, borderRadius: 12, background: digit ? 'rgba(245,166,35,0.12)' : 'rgba(255,255,255,0.05)', color: digit ? '#f5a623' : '#fff', outline: 'none', fontFamily: 'inherit', transition: 'all 0.15s', boxSizing: 'border-box' }}
                                        />
                                    ))}
                                </div>
                                {otpError && <p style={{ color: '#ef4444', fontSize: 12, margin: '4px 0 12px', fontWeight: 500, textAlign: 'center' }}>⚠ {otpError}</p>}
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', textAlign: 'center', margin: '8px 0 20px' }}>Demo OTP: <strong style={{ color: '#f5a623' }}>1 2 3 4 5 6</strong></p>
                                <button
                                    id="scan-verify-otp-btn"
                                    onClick={handleVerifyOTP}
                                    disabled={loading}
                                    style={{ width: '100%', padding: '15px', background: loading ? 'rgba(255,255,255,0.15)' : '#f5a623', border: 'none', borderRadius: 14, color: loading ? 'rgba(255,255,255,0.5)' : '#0f172a', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s', boxShadow: loading ? 'none' : '0 6px 20px rgba(245,166,35,0.3)' }}
                                >
                                    {loading ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Verifying...</> : <>✅ Verify & Get Cashback</>}
                                </button>
                                <button onClick={() => setOtpSent(false)} style={{ width: '100%', padding: '12px', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', marginTop: 10, fontFamily: 'inherit' }}>
                                    ← Change number
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* ══════════ STEP 3: CASHBACK EARNED ══════════ */}
                {step === 'cashback' && scanResult && (
                    <div style={{ animation: 'fadeUp 0.4s ease both', textAlign: 'center' }}>
                        {/* Big success badge */}
                        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(5,150,105,0.15)', border: '2px solid rgba(5,150,105,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 0 20px rgba(5,150,105,0.06)', animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>
                            <CheckCircle size={50} color="#10b981" />
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Cashback Earned! 🎉</h2>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 24px' }}>
                            Points credited to your loyalty account
                        </p>

                        {/* Cashback + Points card */}
                        <div style={{ background: 'linear-gradient(135deg, rgba(5,150,105,0.2), rgba(16,185,129,0.1))', border: '1.5px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '22px', marginBottom: 16, textAlign: 'left' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                                <div>
                                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px', fontWeight: 700 }}>Cashback</p>
                                    <p style={{ fontSize: 46, fontWeight: 900, color: '#10b981', margin: 0, lineHeight: 1 }}>₹{scanResult.cashback}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 4px', fontWeight: 700 }}>Points Earned</p>
                                    <p style={{ fontSize: 28, fontWeight: 900, color: '#f5a623', margin: 0, lineHeight: 1 }}>+{scanResult.points}</p>
                                </div>
                            </div>
                            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 0 12px' }} />
                            {[
                                ['Product', scanResult.productName],
                                ['Brand', scanResult.brand],
                                ['Account', `${user?.name ?? 'Your Account'} · ${user?.tier ?? 'Member'}`],
                                ['Status', '✅ Points Added'],
                            ].map(([l, v]) => (
                                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 8 }}>
                                    <span>{l}</span>
                                    <span style={{ color: '#fff', fontWeight: 600, maxWidth: '60%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v}</span>
                                </div>
                            ))}
                        </div>

                        {/* Campaign hint */}
                        <div style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.25)', borderRadius: 14, padding: '12px 16px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center', textAlign: 'left' }}>
                            <span style={{ fontSize: 20 }}>🎯</span>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0, lineHeight: 1.5 }}>
                                <strong style={{ color: '#f5a623' }}>+{scanResult.points} pts</strong> added to your <strong style={{ color: '#fff' }}>{user?.tier ?? 'Member'}</strong> account. View your updated balance on your profile!
                            </p>
                        </div>

                        {/* Primary CTA → Profile */}
                        <button
                            id="go-to-profile-btn"
                            onClick={() => router.push('/home')}
                            style={{ width: '100%', padding: '16px', background: '#f5a623', border: 'none', borderRadius: 14, color: '#0f172a', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, boxShadow: '0 6px 20px rgba(245,166,35,0.35)', fontFamily: 'inherit', marginBottom: 10, transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 10px 28px rgba(245,166,35,0.45)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(245,166,35,0.35)'; }}
                        >
                            🏠 Go to My Profile &amp; Collect Points
                        </button>

                        {/* Secondary → Scan Another */}
                        <button
                            id="scan-another-btn"
                            onClick={resetForNewScan}
                            style={{ width: '100%', padding: '13px', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                        >
                            <Camera size={16} /> Scan Another Product
                        </button>
                    </div>
                )}

                {/* ══════════ STEP 4: TRANSFER ══════════ */}
                {step === 'transfer' && scanResult && (
                    <div style={{ animation: 'fadeUp 0.4s ease both' }}>
                        {/* Amount reminder */}
                        <div style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: 14, padding: '14px 16px', marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>Amount to transfer</p>
                            <p style={{ fontSize: 22, fontWeight: 900, color: '#10b981', margin: 0 }}>₹{scanResult.cashback}</p>
                        </div>

                        {/* Method selector */}
                        <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', margin: '0 0 12px' }}>Choose Transfer Method</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
                            {[
                                { key: 'upi', icon: <Smartphone size={20} color={transferMethod === 'upi' ? '#fff' : '#f5a623'} />, label: 'UPI Transfer', sub: 'Instant · Free' },
                                { key: 'bank', icon: <Building2 size={20} color={transferMethod === 'bank' ? '#fff' : '#10b981'} />, label: 'Bank Account', sub: '1-2 Business days' },
                            ].map(({ key, icon, label, sub }) => (
                                <button
                                    key={key}
                                    id={`method-${key}`}
                                    onClick={() => setTransferMethod(key as 'upi' | 'bank')}
                                    style={{ padding: '16px 12px', background: transferMethod === key ? (key === 'upi' ? '#f5a623' : '#10b981') : 'rgba(255,255,255,0.05)', border: `2px solid ${transferMethod === key ? 'transparent' : 'rgba(255,255,255,0.1)'}`, borderRadius: 14, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'all 0.2s', fontFamily: 'inherit' }}
                                >
                                    <div style={{ width: 40, height: 40, borderRadius: 12, background: transferMethod === key ? 'rgba(255,255,255,0.2)' : key === 'upi' ? 'rgba(245,166,35,0.12)' : 'rgba(16,185,129,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {icon}
                                    </div>
                                    <p style={{ fontSize: 13, fontWeight: 800, color: transferMethod === key ? '#fff' : 'rgba(255,255,255,0.8)', margin: 0 }}>{label}</p>
                                    <p style={{ fontSize: 10, color: transferMethod === key ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)', margin: 0 }}>{sub}</p>
                                </button>
                            ))}
                        </div>

                        {/* UPI Form */}
                        {transferMethod === 'upi' && (
                            <div style={{ animation: 'fadeUp 0.3s ease both' }}>
                                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>UPI ID</label>
                                <input
                                    id="upi-id-input"
                                    type="text"
                                    placeholder="yourname@upi"
                                    value={upiId}
                                    onChange={e => setUpiId(e.target.value)}
                                    style={{ width: '100%', padding: '14px 16px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 14, color: '#fff', fontSize: 15, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', marginBottom: 6 }}
                                />
                                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: '0 0 20px' }}>e.g. name@paytm, 9999999999@ybl, name@okaxis</p>
                            </div>
                        )}

                        {/* Bank Form */}
                        {transferMethod === 'bank' && (
                            <div style={{ animation: 'fadeUp 0.3s ease both', display: 'flex', flexDirection: 'column', gap: 14 }}>
                                {[
                                    { id: 'account-holder', label: 'Account Holder Name', placeholder: 'Full name as per bank', value: accountHolder, setter: setAccountHolder },
                                    { id: 'bank-name', label: 'Bank Name', placeholder: 'e.g. SBI, HDFC, ICICI', value: bankName, setter: setBankName },
                                    { id: 'account-no', label: 'Account Number', placeholder: 'Enter account number', value: accountNo, setter: setAccountNo },
                                    { id: 'ifsc', label: 'IFSC Code', placeholder: 'e.g. SBIN0001234', value: ifsc, setter: setIfsc },
                                ].map(({ id, label, placeholder, value, setter }) => (
                                    <div key={id}>
                                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 7 }}>{label}</label>
                                        <input
                                            id={id}
                                            type="text"
                                            placeholder={placeholder}
                                            value={value}
                                            onChange={e => setter(e.target.value)}
                                            style={{ width: '100%', padding: '13px 16px', background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 13, color: '#fff', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                            onFocus={e => { e.currentTarget.style.borderColor = '#10b981'; }}
                                            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                                        />
                                    </div>
                                ))}
                                <div style={{ marginBottom: 4 }} />
                            </div>
                        )}

                        {/* Submit button */}
                        {transferMethod && (
                            <button
                                id="transfer-submit-btn"
                                onClick={handleTransfer}
                                disabled={transferLoading || (transferMethod === 'upi' ? !upiId : !accountNo || !ifsc || !accountHolder)}
                                style={{ width: '100%', padding: '16px', background: transferLoading || (transferMethod === 'upi' ? !upiId : !accountNo || !ifsc || !accountHolder) ? 'rgba(255,255,255,0.12)' : transferMethod === 'upi' ? '#f5a623' : '#10b981', border: 'none', borderRadius: 14, color: transferLoading ? 'rgba(255,255,255,0.5)' : transferMethod === 'upi' ? '#0f172a' : '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transition: 'all 0.25s', marginTop: 4, boxShadow: transferLoading ? 'none' : transferMethod === 'upi' ? '0 6px 20px rgba(245,166,35,0.3)' : '0 6px 20px rgba(16,185,129,0.3)', fontFamily: 'inherit' }}
                            >
                                {transferLoading
                                    ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />Processing Transfer...</>
                                    : <><Send size={18} />Send ₹{scanResult.cashback} Now</>
                                }
                            </button>
                        )}
                    </div>
                )}

                {/* ══════════ STEP 5: SUCCESS ══════════ */}
                {step === 'success' && scanResult && (
                    <div style={{ animation: 'bounceIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both', textAlign: 'center' }}>
                        <div style={{ width: 110, height: 110, borderRadius: '50%', background: 'rgba(16,185,129,0.15)', border: '2px solid rgba(16,185,129,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: '0 0 0 24px rgba(16,185,129,0.06)' }}>
                            <CheckCircle size={55} color="#10b981" />
                        </div>

                        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Transfer Initiated! 💚</h2>
                        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px', lineHeight: 1.6 }}>
                            ₹{scanResult.cashback} is being transferred to your {transferMethod === 'upi' ? 'UPI ID' : 'bank account'}.<br />
                            {transferMethod === 'upi' ? 'You\'ll receive it instantly.' : 'It will reflect in 1-2 business days.'}
                        </p>

                        {/* Summary box */}
                        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 18, padding: '20px', marginBottom: 28, textAlign: 'left' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 14px' }}>Transaction Summary</p>
                            {[
                                ['Amount', `₹${scanResult.cashback}`],
                                ['Product', scanResult.productName],
                                ['Mobile', `+91 ${phone}`],
                                ['Method', transferMethod === 'upi' ? `UPI · ${upiId}` : `Bank · ${bankName || 'Account'}`],
                                ['Status', '✅ Processing'],
                            ].map(([label, value]) => (
                                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff', maxWidth: '55%', textAlign: 'right', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <button
                                id="scan-again-after-success"
                                onClick={resetForNewScan}
                                style={{ width: '100%', padding: '15px', background: '#f5a623', border: 'none', borderRadius: 14, color: '#0f172a', fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(245,166,35,0.3)' }}
                            >
                                <Camera size={18} /> Scan Another Product
                            </button>
                            <button
                                onClick={() => router.push('/home')}
                                style={{ width: '100%', padding: '13px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}
                            >
                                Back to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeUp  { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
                @keyframes spin    { to { transform:rotate(360deg); } }
                @keyframes bounceIn { 0% { opacity:0; transform:scale(0.5); } 70% { transform:scale(1.08); } 100% { opacity:1; transform:scale(1); } }
            `}</style>
        </div>
    );
}
