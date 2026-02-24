'use client';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    right?: React.ReactNode;
    showBack?: boolean;
    onBack?: () => void;
}

export default function PageHeader({ title, subtitle, right, showBack, onBack }: PageHeaderProps) {
    return (
        <header className="app-header px-4 py-3">
            <div className="flex items-center justify-between max-w-[480px] mx-auto">
                <div className="flex items-center gap-3">
                    {showBack && (
                        <button
                            onClick={onBack}
                            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-white/10"
                            id="header-back-btn"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                            </svg>
                        </button>
                    )}
                    <div>
                        <h1 className="font-bold text-white" style={{ fontSize: '18px', lineHeight: 1.2 }}>{title}</h1>
                        {subtitle && (
                            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{subtitle}</p>
                        )}
                    </div>
                </div>
                {right && <div>{right}</div>}
            </div>
        </header>
    );
}
