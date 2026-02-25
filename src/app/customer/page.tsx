'use client';
import { useState } from 'react';
import { CheckCircle, Gift, Zap, ArrowRight, Camera } from 'lucide-react';

interface CashbackResult {
    amount: number;
    productName: string;
    brand: string;
    upiRequired: boolean;
}

const MOCK_RESULTS: CashbackResult[] = [
    { amount: 50, productName: 'Asian Paints Premium 10L', brand: 'Asian Paints', upiRequired: true },
    { amount: 25, productName: 'Berger Weathercoat 5L', brand: 'Berger Paints', upiRequired: true },
    { amount: 75, productName: 'Nerolac Impressions HD', brand: 'Nerolac', upiRequired: true },
];

type Step = 'landing' | 'scanning' | 'result' | 'upi' | 'success';

export default function CustomerPage() {
    const [step, setStep] = useState<Step>('landing');
    const [result, setResult] = useState<CashbackResult | null>(null);
    const [upi, setUpi] = useState('');
    const [upiVerified, setUpiVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [lineY, setLineY] = useState(50);
    const [lineDir] = useState({ val: 1 });

    const startScan = () => {
        setStep('scanning');
        // animate scan line
        let pos = 10;
        let dir = 1;
        const anim = setInterval(() => {
            pos += dir * 3;
            if (pos >= 90) dir = -1;
            if (pos <= 10) dir = 1;
            setLineY(pos);
        }, 30);
        // auto-detect after 2.5s
        setTimeout(() => {
            clearInterval(anim);
            const mock = MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)];
            setResult(mock);
            setStep('result');
        }, 2500);
    };

    const handleVerifyUPI = async () => {
        if (!upi.includes('@')) return;
        setVerifying(true);
        await new Promise(r => setTimeout(r, 1400));
        setUpiVerified(true);
        setVerifying(false);
    };

    const handleRedeem = async () => {
        await new Promise(r => setTimeout(r, 1500));
        setStep('success');
    };

    const reset = () => {
        setStep('landing');
        setResult(null);
        setUpi('');
        setUpiVerified(false);
    };

    return (
        <div
            className="min-h-screen flex flex-col"
            style={{ background: 'linear-gradient(160deg, #0F0C29 0%, #1a1740 50%, #0d1b2a 100%)' }}
        >
            {/* Decorative orbs */}
            <div style={{ position: 'fixed', top: '-5%', right: '-10%', width: 280, height: 280, background: 'radial-gradient(circle, rgba(108,99,255,0.18) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: '10%', left: '-8%', width: 200, height: 200, background: 'radial-gradient(circle, rgba(67,233,123,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div className="flex-1 flex flex-col max-w-[480px] mx-auto w-full px-5 py-8" style={{ zIndex: 1 }}>

                {/* ── LANDING ── */}
                {step === 'landing' && (
                    <div className="flex flex-col flex-1 animate-fade-in-up">
                        {/* Header */}
                        <div className="text-center mb-10">
                            <div style={{
                                width: 84, height: 84, borderRadius: '24px',
                                background: 'linear-gradient(135deg,#6C63FF,#3b82f6)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 20px',
                                boxShadow: '0 0 60px rgba(108,99,255,0.4)',
                                animation: 'pulse-glow 2s ease-in-out infinite',
                                fontSize: 40,
                            }}>🏆</div>
                            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'white', letterSpacing: '-1px', marginBottom: 8 }}>
                                Instant Cashback!
                            </h1>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.6 }}>
                                Scan the QR code on your product<br />and get instant cashback — no login needed!
                            </p>
                        </div>

                        {/* How it works */}
                        <div style={{ marginBottom: 36 }}>
                            {[
                                { icon: '📦', title: 'Buy Product', desc: 'Purchase any participating product' },
                                { icon: '📷', title: 'Scan QR', desc: 'Tap below and scan the QR on pack' },
                                { icon: '💰', title: 'Get Cashback', desc: 'Money credited to your UPI instantly' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 mb-5 animate-fade-in-up" style={{ animationDelay: `${i * 0.12}s` }}>
                                    <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
                                        {item.icon}
                                    </div>
                                    <div>
                                        <p style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 2 }}>{item.title}</p>
                                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{item.desc}</p>
                                    </div>
                                    {i < 2 && (
                                        <ArrowRight size={16} style={{ color: 'rgba(108,99,255,0.5)', flexShrink: 0, marginLeft: 'auto' }} />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Perks strip */}
                        <div className="flex gap-3 mb-8">
                            {[
                                { icon: '⚡', label: 'Instant' },
                                { icon: '🔒', label: 'Secure' },
                                { icon: '🎯', label: 'No Login' },
                            ].map((p, i) => (
                                <div key={i} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: '14px 8px' }}>
                                    <div style={{ fontSize: 22, marginBottom: 6 }}>{p.icon}</div>
                                    <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{p.label}</p>
                                </div>
                            ))}
                        </div>

                        <button
                            id="customer-scan-btn"
                            onClick={startScan}
                            className="btn-primary flex items-center justify-center gap-3 w-full"
                            style={{ padding: '18px', fontSize: 17, borderRadius: 18 }}
                        >
                            <Camera size={22} /> Scan QR Code
                        </button>

                        <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(255,255,255,0.25)', fontSize: 12 }}>
                            Sales person?{' '}
                            <a href="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>Login here →</a>
                        </p>
                    </div>
                )}

                {/* ── SCANNING ── */}
                {step === 'scanning' && (
                    <div className="flex flex-col flex-1 items-center justify-center animate-fade-in-up">
                        <p style={{ fontSize: 16, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
                            Point camera at QR code on product
                        </p>
                        <div style={{
                            position: 'relative',
                            width: '100%', maxWidth: 320,
                            aspectRatio: '1',
                            background: 'rgba(0,0,0,0.7)',
                            border: '2px solid var(--brand-primary)',
                            borderRadius: 24,
                            overflow: 'hidden',
                            boxShadow: '0 0 40px rgba(108,99,255,0.3)',
                        }}>
                            {/* corners */}
                            {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h], i) => (
                                <div key={i} style={{
                                    position: 'absolute', width: 32, height: 32,
                                    [v]: 14, [h]: 14,
                                    borderColor: '#43E97B', borderStyle: 'solid',
                                    borderWidth: v === 'top' && h === 'left' ? '4px 0 0 4px' :
                                        v === 'top' && h === 'right' ? '4px 4px 0 0' :
                                            v === 'bottom' && h === 'left' ? '0 0 4px 4px' : '0 4px 4px 0',
                                    borderRadius: v === 'top' && h === 'left' ? '8px 0 0 0' :
                                        v === 'top' && h === 'right' ? '0 8px 0 0' :
                                            v === 'bottom' && h === 'left' ? '0 0 0 8px' : '0 0 8px 0',
                                }} />
                            ))}
                            {/* scan line */}
                            <div style={{
                                position: 'absolute', left: 16, right: 16, height: 2,
                                top: `${lineY}%`,
                                background: 'linear-gradient(90deg, transparent, #43E97B, transparent)',
                                boxShadow: '0 0 12px #43E97B',
                            }} />
                            <p style={{ position: 'absolute', bottom: 20, left: 0, right: 0, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                                Scanning…
                            </p>
                        </div>
                    </div>
                )}

                {/* ── RESULT ── */}
                {step === 'result' && result && (
                    <div className="flex flex-col flex-1 animate-slide-up">
                        <div style={{ textAlign: 'center', marginBottom: 24, paddingTop: 20 }}>
                            <div style={{ fontSize: 56, marginBottom: 12, animation: 'bounce-in 0.5s ease' }}>🎉</div>
                            <h2 style={{ fontSize: 24, fontWeight: 800, color: 'white', marginBottom: 6 }}>Product Verified!</h2>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>You are eligible for instant cashback</p>
                        </div>

                        {/* Product card */}
                        <div className="card p-5 mb-5">
                            <div className="flex items-center gap-4 mb-4">
                                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🎨</div>
                                <div>
                                    <p style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 3 }}>{result.productName}</p>
                                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{result.brand}</p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(67,233,123,0.1)', border: '1px solid rgba(67,233,123,0.2)', borderRadius: 14, padding: '14px 18px' }}>
                                <div>
                                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Cashback Amount</p>
                                    <p style={{ fontSize: 32, fontWeight: 900, color: '#43E97B', lineHeight: 1 }}>₹{result.amount}</p>
                                </div>
                                <Zap size={32} style={{ color: '#43E97B', animation: 'float 2s ease-in-out infinite' }} />
                            </div>
                        </div>

                        <button
                            id="customer-proceed-btn"
                            onClick={() => setStep('upi')}
                            className="btn-primary flex items-center justify-center gap-2 w-full"
                            style={{ padding: 16, fontSize: 16 }}
                        >
                            <Gift size={18} /> Claim ₹{result.amount} Cashback
                        </button>
                        <button onClick={reset} className="btn-secondary w-full mt-3" style={{ padding: 14, fontSize: 14 }}>
                            Scan Another
                        </button>
                    </div>
                )}

                {/* ── UPI ENTRY ── */}
                {step === 'upi' && result && (
                    <div className="flex flex-col flex-1 animate-fade-in-up" style={{ paddingTop: 20 }}>
                        <div style={{ textAlign: 'center', marginBottom: 28 }}>
                            <div style={{ fontSize: 48, marginBottom: 12 }}>💳</div>
                            <h2 style={{ fontSize: 22, fontWeight: 800, color: 'white', marginBottom: 6 }}>Enter UPI ID</h2>
                            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14 }}>
                                ₹{result.amount} will be credited instantly
                            </p>
                        </div>

                        <label style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8, display: 'block' }}>Your UPI ID</label>
                        <div className="upi-input-wrapper mb-4">
                            <input
                                id="customer-upi-input"
                                className="input-field"
                                placeholder="yourname@paytm / @upi"
                                value={upi}
                                onChange={e => { setUpi(e.target.value); setUpiVerified(false); }}
                                style={{ paddingRight: 95 }}
                            />
                            <button
                                id="customer-verify-upi-btn"
                                onClick={handleVerifyUPI}
                                className="upi-verify-btn"
                                disabled={verifying || upiVerified || !upi.includes('@')}
                                style={{ background: upiVerified ? 'rgba(67,233,123,0.3)' : 'var(--brand-gradient)', color: upiVerified ? '#43E97B' : 'white' }}
                            >
                                {verifying ? '…' : upiVerified ? '✓ Done' : 'Verify'}
                            </button>
                        </div>

                        {upiVerified && (
                            <div className="flex items-center gap-2 mb-5 p-3 rounded-2xl animate-fade-in-up" style={{ background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)' }}>
                                <CheckCircle size={16} style={{ color: '#43E97B' }} />
                                <p style={{ fontSize: 13, color: '#43E97B' }}>UPI Verified — Cashback ready to send!</p>
                            </div>
                        )}

                        {/* Popular UPI apps */}
                        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 10 }}>Popular UPI formats</p>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {['@paytm', '@ybl', '@okhdfcbank', '@oksbi'].map(h => (
                                <button
                                    key={h}
                                    onClick={() => { setUpi(prev => prev.split('@')[0] + h); setUpiVerified(false); }}
                                    style={{ padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: 12, cursor: 'pointer' }}
                                >
                                    {h}
                                </button>
                            ))}
                        </div>

                        <button
                            id="customer-redeem-btn"
                            onClick={handleRedeem}
                            disabled={!upiVerified}
                            className="btn-primary w-full flex items-center justify-center gap-2"
                            style={{ padding: 16, fontSize: 16, opacity: !upiVerified ? 0.45 : 1 }}
                        >
                            <Zap size={18} /> Get ₹{result.amount} Instantly!
                        </button>
                    </div>
                )}

                {/* ── SUCCESS ── */}
                {step === 'success' && result && (
                    <div className="flex flex-col flex-1 items-center justify-center text-center animate-bounce-in">
                        <div className="success-circle mb-6" style={{ width: 100, height: 100 }}>
                            <CheckCircle size={50} style={{ color: '#43E97B' }} />
                        </div>
                        <h2 style={{ fontSize: 28, fontWeight: 900, color: 'white', marginBottom: 8 }}>Payment Sent! 🎉</h2>
                        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 6 }}>
                            ₹{result.amount} cashback is on its way
                        </p>
                        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 4 }}>to <span style={{ color: 'rgba(255,255,255,0.65)' }}>{upi}</span></p>
                        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 12, marginBottom: 40 }}>Usually credited within 2 minutes</p>

                        <div style={{ background: 'rgba(67,233,123,0.08)', border: '1px solid rgba(67,233,123,0.2)', borderRadius: 20, padding: '20px 28px', marginBottom: 32, width: '100%' }}>
                            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>Transaction ID</p>
                            <p style={{ fontSize: 15, fontWeight: 700, color: '#43E97B', letterSpacing: 1 }}>RWP{Date.now().toString().slice(-8)}</p>
                        </div>

                        <button id="customer-done-btn" onClick={reset} className="btn-primary w-full" style={{ padding: 16, fontSize: 16 }}>
                            Scan Another Product
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
