'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSuperAdminStore } from '@/store';
import { Shield, Eye, EyeOff, AlertCircle, Zap, Lock, Mail } from 'lucide-react';

export default function SuperAdminLoginPage() {
    const router = useRouter();
    const { login } = useSuperAdminStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) { setError('Please enter email and password.'); return; }
        setLoading(true);
        setError('');
        await new Promise(r => setTimeout(r, 1200));
        const ok = login(email, password);
        setLoading(false);
        if (ok) { router.replace('/superadmin/dashboard'); }
        else { setError('Invalid credentials. Check email & password.'); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter','Segoe UI',sans-serif", padding: 16 }}>

            {/* Background blobs */}
            <div style={{ position: 'fixed', top: -120, left: -120, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.25),transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'fixed', bottom: -100, right: -100, width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle,rgba(168,85,247,0.2),transparent 70%)', pointerEvents: 'none' }} />

            <div style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}>

                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 72, height: 72, borderRadius: 20, background: 'linear-gradient(135deg,#6366f1,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(99,102,241,0.5)' }}>
                        <Shield size={36} color="#fff" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
                        <Zap size={18} color="#f59e0b" fill="#f59e0b" />
                        <span style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px' }}>Avopasy</span>
                    </div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600 }}>Super Admin Portal</p>
                </div>

                {/* Card */}
                <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 24, padding: '32px 28px', backdropFilter: 'blur(20px)', boxShadow: '0 24px 64px rgba(0,0,0,0.4)' }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Welcome back</h2>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 28px' }}>Sign in to your super admin account</p>

                    {/* Email */}
                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8, letterSpacing: '0.05em' }}>EMAIL ADDRESS</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="admin@avopasy.com"
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                style={{ width: '100%', padding: '13px 14px 13px 42px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 12, fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginBottom: 8, letterSpacing: '0.05em' }}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={16} color="rgba(255,255,255,0.3)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            <input
                                type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Enter password"
                                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                style={{ width: '100%', padding: '13px 44px 13px 42px', background: 'rgba(255,255,255,0.08)', border: '1.5px solid rgba(255,255,255,0.15)', borderRadius: 12, fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                                onFocus={e => e.target.style.borderColor = '#6366f1'}
                                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
                            />
                            <button onClick={() => setShowPass(s => !s)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
                                {showPass ? <EyeOff size={16} color="rgba(255,255,255,0.4)" /> : <Eye size={16} color="rgba(255,255,255,0.4)" />}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <AlertCircle size={14} color="#f87171" />
                            <p style={{ fontSize: 12, color: '#f87171', margin: 0 }}>{error}</p>
                        </div>
                    )}

                    {/* Login Button */}
                    <button onClick={handleLogin} disabled={loading}
                        style={{ width: '100%', padding: '14px', background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg,#6366f1,#a855f7)', border: 'none', borderRadius: 12, color: '#fff', fontSize: 15, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxShadow: '0 8px 24px rgba(99,102,241,0.4)', transition: 'all 0.2s', letterSpacing: '-0.2px' }}>
                        {loading ? '⏳ Verifying...' : '🔐 Sign In to Dashboard'}
                    </button>

                    {/* Hint */}
                    <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10 }}>
                        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0, textAlign: 'center', lineHeight: 1.6 }}>
                            📧 <strong style={{ color: 'rgba(255,255,255,0.6)' }}>admin@avopasy.com</strong><br />
                            🔑 <strong style={{ color: 'rgba(255,255,255,0.6)' }}>superadmin123</strong>
                        </p>
                    </div>
                </div>

                <p style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.05em' }}>© 2026 Avopasy · All rights reserved</p>
            </div>
        </div>
    );
}
