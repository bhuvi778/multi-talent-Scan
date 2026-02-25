'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, QrCode, CheckCircle, XCircle, AlertTriangle, Search } from 'lucide-react';

const NAVY = '#6366f1';

type VerifyResult = 'genuine' | 'fake' | null;

const GENUINE_CODES = ['OZONE-001', 'OZ-2024-A', 'CDC3800', 'NSK680', 'OZ100'];

export default function AsliVsNakliPage() {
    const router = useRouter();
    const { isLoggedIn } = useAuthStore();

    const [code, setCode] = useState('');
    const [scanning, setScanning] = useState(false);
    const [result, setResult] = useState<VerifyResult>(null);
    const [verifiedCode, setVerifiedCode] = useState('');
    const [checking, setChecking] = useState(false);

    if (!isLoggedIn) { router.replace('/login'); return null; }

    const verify = (inputCode: string) => {
        const cleaned = inputCode.trim().toUpperCase();
        if (!cleaned) return;
        setChecking(true);
        setResult(null);
        setTimeout(() => {
            const isGenuine = GENUINE_CODES.some(c => cleaned.includes(c) || c.includes(cleaned));
            setResult(isGenuine ? 'genuine' : 'fake');
            setVerifiedCode(cleaned);
            setChecking(false);
        }, 1800);
    };

    const simulateScan = () => {
        setScanning(true);
        setTimeout(() => {
            setScanning(false);
            const mock = GENUINE_CODES[Math.floor(Math.random() * GENUINE_CODES.length)];
            setCode(mock);
            verify(mock);
        }, 2500);
    };

    const reset = () => { setCode(''); setResult(null); setVerifiedCode(''); };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={18} color={NAVY} />
                </button>
                <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#1a2332', margin: 0 }}>Asli vs Nakli</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>Verify product authenticity</p>
                </div>
            </div>

            <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>

                {/* Info banner */}
                <div style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #2d5a9e 100%)`, borderRadius: 18, padding: '20px', marginBottom: 20, color: '#fff', textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 10 }}>🛡️</div>
                    <h2 style={{ fontSize: 18, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.3px' }}>Product Verification</h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0, lineHeight: 1.6 }}>Scan or enter the product code to verify if it's a genuine Ozone product</p>
                </div>

                {/* Scan button */}
                {!result && (
                    <div style={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 18, padding: '20px', marginBottom: 16, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', margin: '0 0 16px', textAlign: 'center' }}>Scan Product QR Code</p>

                        {/* Scanner area */}
                        <div style={{ width: 180, height: 180, margin: '0 auto 16px', background: scanning ? '#f0f4ff' : '#f8f9fb', borderRadius: 20, border: `2px solid ${scanning ? NAVY : '#e2e8f0'}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative', overflow: 'hidden', transition: 'all 0.3s', boxShadow: scanning ? `0 0 0 4px ${NAVY}22` : 'none' }}>
                            {/* Corner marks */}
                            {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(pos => {
                                const [v, h] = pos.split('-') as ['top' | 'bottom', 'left' | 'right'];
                                return (
                                    <div key={pos} style={{ position: 'absolute', width: 20, height: 20, [v]: 10, [h]: 10, borderColor: NAVY, borderStyle: 'solid', borderWidth: v === 'top' && h === 'left' ? '3px 0 0 3px' : v === 'top' ? '3px 3px 0 0' : h === 'left' ? '0 0 3px 3px' : '0 3px 3px 0', borderRadius: 2 }} />
                                );
                            })}
                            {scanning ? (
                                <>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid rgba(28,63,110,0.2)`, borderTopColor: NAVY, animation: 'spin 0.8s linear infinite' }} />
                                    <p style={{ fontSize: 12, color: NAVY, margin: 0, fontWeight: 600 }}>Scanning…</p>
                                </>
                            ) : (
                                <>
                                    <QrCode size={50} color="#cbd5e1" strokeWidth={1.2} />
                                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0 }}>Point at QR code</p>
                                </>
                            )}
                        </div>

                        <button onClick={simulateScan} disabled={scanning || checking}
                            style={{ width: '100%', padding: '13px', background: scanning ? '#f1f5f9' : NAVY, border: 'none', borderRadius: 12, color: scanning ? '#94a3b8' : '#fff', fontSize: 14, fontWeight: 700, cursor: scanning ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12, transition: 'all 0.2s' }}>
                            <QrCode size={16} /> {scanning ? 'Scanning…' : 'Scan QR Code'}
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                            <div style={{ flex: 1, height: 1, background: '#e8ecf0' }} />
                            <span style={{ fontSize: 12, color: '#94a3b8' }}>OR</span>
                            <div style={{ flex: 1, height: 1, background: '#e8ecf0' }} />
                        </div>

                        {/* Manual entry */}
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter product code (e.g. OZONE-001)"
                                onKeyDown={e => e.key === 'Enter' && verify(code)}
                                style={{ flex: 1, padding: '11px 13px', background: '#f8f9fb', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', fontFamily: 'inherit', color: '#1a2332' }} />
                            <button onClick={() => verify(code)} disabled={checking || !code.trim()}
                                style={{ padding: '11px 16px', background: code.trim() ? NAVY : '#e2e8f0', border: 'none', borderRadius: 10, color: code.trim() ? '#fff' : '#94a3b8', fontWeight: 700, cursor: code.trim() ? 'pointer' : 'not-allowed', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                                {checking ? '…' : <><Search size={14} />Verify</>}
                            </button>
                        </div>
                        <p style={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', margin: '10px 0 0' }}>
                            Demo genuine codes: <strong style={{ color: '#475569' }}>OZONE-001</strong>, <strong style={{ color: '#475569' }}>OZ100</strong>
                        </p>
                    </div>
                )}

                {/* Result */}
                {(checking || result) && (
                    <div style={{ background: '#fff', border: `2px solid ${result === 'genuine' ? '#a7f3d0' : result === 'fake' ? '#fca5a5' : '#e2e8f0'}`, borderRadius: 18, padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', animation: 'fadeUp 0.4s ease both' }}>
                        {checking && (
                            <>
                                <div style={{ width: 52, height: 52, borderRadius: '50%', border: `4px solid #e8ecf0`, borderTopColor: NAVY, animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                                <p style={{ fontSize: 15, fontWeight: 700, color: '#374151', margin: 0 }}>Verifying product…</p>
                            </>
                        )}
                        {result === 'genuine' && (
                            <>
                                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#ecfdf5', border: '2px solid #a7f3d0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 0 12px #ecfdf540' }}>
                                    <CheckCircle size={38} color="#059669" />
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#059669', margin: '0 0 6px' }}>✅ Genuine Product!</h3>
                                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.6 }}>
                                    Code <strong>{verifiedCode}</strong> is a verified authentic Ozone product. You can trust this product.
                                </p>
                                <div style={{ background: '#ecfdf5', borderRadius: 12, padding: '12px 16px', marginBottom: 16, textAlign: 'left' }}>
                                    <p style={{ fontSize: 12, color: '#065f46', margin: '0 0 4px', fontWeight: 600 }}>✓ Manufacturer verified</p>
                                    <p style={{ fontSize: 12, color: '#065f46', margin: '0 0 4px', fontWeight: 600 }}>✓ Quality certified</p>
                                    <p style={{ fontSize: 12, color: '#065f46', margin: 0, fontWeight: 600 }}>✓ Warranty valid</p>
                                </div>
                            </>
                        )}
                        {result === 'fake' && (
                            <>
                                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fef2f2', border: '2px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 0 0 12px #fef2f240' }}>
                                    <XCircle size={38} color="#dc2626" />
                                </div>
                                <h3 style={{ fontSize: 20, fontWeight: 900, color: '#dc2626', margin: '0 0 6px' }}>⚠️ Suspect Product!</h3>
                                <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px', lineHeight: 1.6 }}>
                                    Code <strong>{verifiedCode}</strong> could not be verified. This may be a counterfeit product. Please contact us.
                                </p>
                                <div style={{ background: '#fef2f2', borderRadius: 12, padding: '12px 16px', marginBottom: 16, textAlign: 'left' }}>
                                    <p style={{ fontSize: 12, color: '#7f1d1d', margin: '0 0 4px', fontWeight: 600 }}>✗ Not in manufacturer database</p>
                                    <p style={{ fontSize: 12, color: '#7f1d1d', margin: '0 0 4px', fontWeight: 600 }}>✗ Warranty may not apply</p>
                                    <p style={{ fontSize: 12, color: '#7f1d1d', margin: 0, fontWeight: 600 }}>✗ Report to Ozone support</p>
                                </div>
                            </>
                        )}
                        {result && (
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={reset}
                                    style={{ flex: 1, padding: '12px', background: '#f8f9fb', border: '1px solid #e8ecf0', borderRadius: 12, color: '#374151', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                    Verify Another
                                </button>
                                {result === 'fake' && (
                                    <button onClick={() => router.push('/contact')}
                                        style={{ flex: 1, padding: '12px', background: '#dc2626', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                                        Report Product
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
            `}</style>
            <BottomNav />
        </div>
    );
}
