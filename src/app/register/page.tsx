'use client';
import { useRouter } from 'next/navigation';
import { Star, ArrowLeft } from 'lucide-react';

const INDIGO = '#4f46e5';

export default function RegisterPage() {
    const router = useRouter();
    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: "'Inter','Segoe UI',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 24, padding: '36px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.07)', border: '1px solid #e2e8f0' }}>
                <button onClick={() => router.push('/login')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#64748b', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 24, fontFamily: 'inherit' }}>
                    <ArrowLeft size={16} /> Back to Login
                </button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: INDIGO, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Star size={17} color="#fff" fill="#fff" />
                    </div>
                    <span style={{ fontSize: 19, fontWeight: 900, color: INDIGO }}>AvoPay</span>
                </div>
                <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Create Account</h2>
                <p style={{ fontSize: 14, color: '#64748b', margin: '0 0 28px' }}>Join AvoPay and start earning rewards</p>

                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '14px 16px', marginBottom: 20, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, color: '#166534', margin: 0, fontWeight: 500 }}>
                        🎉 New members get <strong>500 welcome points</strong> on signup!
                    </p>
                </div>

                <p style={{ fontSize: 14, color: '#475569', textAlign: 'center', margin: '16px 0 0' }}>
                    Registration is done automatically on first login.{' '}
                    <span onClick={() => router.push('/login')} style={{ color: INDIGO, fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>
                        Go to Login →
                    </span>
                </p>
            </div>
        </div>
    );
}
