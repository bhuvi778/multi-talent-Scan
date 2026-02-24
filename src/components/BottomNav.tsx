'use client';
import { useRouter, usePathname } from 'next/navigation';
import { Home, FileText, ShieldCheck, PhoneCall } from 'lucide-react';

const NAVY = '#1c3f6e';

const TABS = [
    { path: '/home', Icon: Home, label: 'Home' },
    { path: '/history', Icon: FileText, label: 'My Statement' },
    { path: '/asli-vs-nakli', Icon: ShieldCheck, label: 'Asli vs Nakli' },
    { path: '/contact', Icon: PhoneCall, label: 'Contact us' },
];

export default function BottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
            background: NAVY,
            display: 'flex',
            padding: '8px 0 env(safe-area-inset-bottom, 10px)',
            boxShadow: '0 -2px 16px rgba(0,0,0,0.18)',
        }}>
            {TABS.map(({ path, Icon, label }) => {
                const active = pathname === path || (path === '/home' && (pathname === '/' || pathname === ''));
                return (
                    <button key={path} id={`nav-${label.toLowerCase().replace(/\s+/g, '-')}`} onClick={() => router.push(path)}
                        style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '6px 4px', border: 'none', background: 'transparent', cursor: 'pointer', transition: 'opacity 0.15s' }}>
                        <div style={{ width: 38, height: 38, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 11, background: active ? 'rgba(255,255,255,0.18)' : 'transparent', transition: 'background 0.2s' }}>
                            <Icon size={20} color={active ? '#fff' : 'rgba(255,255,255,0.5)'} strokeWidth={active ? 2.2 : 1.8} />
                        </div>
                        <span style={{ fontSize: 9, fontWeight: active ? 700 : 500, color: active ? '#fff' : 'rgba(255,255,255,0.5)', textAlign: 'center', lineHeight: 1.2, letterSpacing: '0.01em', whiteSpace: 'nowrap' }}>{label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
