'use client';

export default function LoadingSpinner({ size = 40 }: { size?: number }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4" style={{ padding: '40px 0' }}>
            <div
                style={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    border: '3px solid rgba(255,255,255,0.1)',
                    borderTop: '3px solid var(--brand-primary)',
                    animation: 'spin-slow 0.8s linear infinite',
                }}
            />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>Loading...</p>
        </div>
    );
}

export function FullPageLoader({ message = 'Loading...' }: { message?: string }) {
    return (
        <div
            className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-mesh"
            style={{ background: 'var(--brand-dark)' }}
        >
            <div className="animate-bounce-in text-center">
                <div
                    style={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        background: 'var(--brand-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 0 40px var(--brand-glow)',
                        animation: 'pulse-glow 2s ease-in-out infinite',
                    }}
                >
                    <span style={{ fontSize: '32px' }}>🏆</span>
                </div>
                <h2 className="font-bold text-white text-xl mb-2">AvoPay</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>{message}</p>
                <div
                    style={{
                        width: 40,
                        height: 3,
                        background: 'var(--brand-gradient)',
                        borderRadius: '100px',
                        margin: '20px auto 0',
                        animation: 'shimmer 1.5s infinite',
                    }}
                />
            </div>
        </div>
    );
}
