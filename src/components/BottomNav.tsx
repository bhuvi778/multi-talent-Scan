'use client';
import { usePathname, useRouter } from 'next/navigation';
import { Home, ArrowLeftRight, Star, Gift, User } from 'lucide-react';

const NAVY = '#6366f1';

const TABS = [
    { id: 'home', Icon: Home, label: 'Home', path: '/home' },
    { id: 'history', Icon: ArrowLeftRight, label: 'Transaction', path: '/history' },
    { id: 'points', Icon: Star, label: 'Points', path: '/profile' },
    { id: 'reward', Icon: Gift, label: 'Reward', path: '/redeem' },
    { id: 'profile', Icon: User, label: 'Profile', path: '/profile' },
];

export default function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();

    const activeId = (() => {
        if (pathname === '/home') return 'home';
        if (pathname === '/history') return 'history';
        if (pathname === '/redeem') return 'reward';
        if (pathname === '/profile') return 'profile';
        return '';
    })();

    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff', borderTop: '1px solid #e8ecf0',
            display: 'flex', zIndex: 150,
            paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
        }}>
            {TABS.map(({ id, Icon, label, path }) => {
                const active = activeId === id;
                return (
                    <button key={id} onClick={() => router.push(path)}
                        style={{
                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: 3, padding: '8px 2px 10px', border: 'none', background: 'transparent',
                            cursor: 'pointer', fontFamily: 'inherit', position: 'relative',
                        }}>
                        {/* Active indicator line */}
                        {active && (
                            <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 28, height: 3, background: NAVY, borderRadius: '0 0 3px 3px' }} />
                        )}
                        {/* Icon container */}
                        <div style={{
                            width: 38, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                            borderRadius: 10, background: active ? '#e8eef7' : 'transparent',
                            transition: 'all 0.2s',
                        }}>
                            <Icon size={19} color={active ? NAVY : '#94a3b8'} strokeWidth={active ? 2.3 : 1.8} />
                        </div>
                        <span style={{ fontSize: 9.5, fontWeight: active ? 700 : 500, color: active ? NAVY : '#94a3b8', letterSpacing: '0.01em' }}>
                            {label}
                        </span>
                    </button>
                );
            })}
        </nav>
    );
}
