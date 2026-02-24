'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// quick-scan is just an alias for /cashback — redirect there
export default function QuickScanPage() {
    const router = useRouter();
    useEffect(() => { router.replace('/cashback'); }, [router]);
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: "'Inter',sans-serif" }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
                <p style={{ color: '#64748b', fontSize: 14 }}>Redirecting…</p>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}
