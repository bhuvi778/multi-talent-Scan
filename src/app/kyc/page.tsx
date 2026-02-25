'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useLangStore, T } from '@/store';
import { ArrowLeft, Shield, CheckCircle, Clock, XCircle, MapPin, Upload, User, CreditCard, Loader, AlertCircle } from 'lucide-react';

const INDIGO = '#6366f1';
const INDIGO_LIGHT = '#eef2ff';

const KYC_STEPS = ['Personal Info', 'Identity Proof', 'Address & Location'];

export default function KYCPage() {
    const router = useRouter();
    const { user, updateUser, isLoggedIn } = useAuthStore();
    const { lang } = useLangStore();
    const t = T[lang];

    const [step, setStep] = useState(0);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [geoLoading, setGeoLoading] = useState(false);
    const [geoError, setGeoError] = useState('');

    const [form, setForm] = useState({
        name: user?.name || '',
        dob: user?.dob || '',
        gender: user?.gender || '',
        email: user?.email || '',
        aadhaar: user?.aadhaar || '',
        pan: user?.pan || '',
        upiId: user?.upiId || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
        geoAddress: user?.geoAddress || '',
        latitude: user?.latitude || 0,
        longitude: user?.longitude || 0,
    });

    useEffect(() => {
        if (!isLoggedIn) router.replace('/login');
    }, [isLoggedIn, router]);

    const update = (k: string, v: string | number) => setForm(f => ({ ...f, [k]: v }));

    const getLocation = () => {
        setGeoLoading(true);
        setGeoError('');
        if (!navigator.geolocation) {
            setGeoError('Geolocation not supported');
            setGeoLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                update('latitude', latitude);
                update('longitude', longitude);
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                    const data = await res.json();
                    const addr = data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
                    update('geoAddress', addr);
                    const city = data.address?.city || data.address?.town || data.address?.village || '';
                    const state = data.address?.state || '';
                    const pincode = data.address?.postcode || '';
                    if (city) update('city', city);
                    if (state) update('state', state);
                    if (pincode) update('pincode', pincode);
                } catch {
                    update('geoAddress', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
                }
                setGeoLoading(false);
            },
            (err) => {
                setGeoError('Location permission denied. Please enable location.');
                setGeoLoading(false);
            },
            { timeout: 10000 }
        );
    };

    const handleSubmit = () => {
        setSaving(true);
        setTimeout(() => {
            updateUser({
                ...form,
                gender: form.gender as 'male' | 'female' | 'other' | undefined,
                kycStatus: 'pending',
                kycSubmittedAt: new Date().toISOString(),
            });
            setSaving(false);
            setSaved(true);
            setTimeout(() => router.push('/profile'), 1500);
        }, 1500);
    };

    const kycStatus = user?.kycStatus || 'not_started';

    const statusConfig = {
        not_started: { icon: <AlertCircle size={18} color="#d97706" />, label: 'KYC Not Started', color: '#d97706', bg: '#fffbeb', border: '#fde68a' },
        pending: { icon: <Clock size={18} color="#2563eb" />, label: 'KYC Under Review', color: '#2563eb', bg: '#dbeafe', border: '#93c5fd' },
        verified: { icon: <CheckCircle size={18} color="#059669" />, label: 'KYC Verified ✓', color: '#059669', bg: '#d1fae5', border: '#6ee7b7' },
        rejected: { icon: <XCircle size={18} color="#dc2626" />, label: 'KYC Rejected', color: '#dc2626', bg: '#fee2e2', border: '#fca5a5' },
    };

    const cfg = statusConfig[kycStatus];

    if (!user) return null;

    // ── Verified state ──
    if (kycStatus === 'verified') {
        return (
            <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 40 }}>
                <Header onBack={() => router.push('/profile')} title={t.kycVerification} />
                <div style={{ padding: '40px 24px', textAlign: 'center' }}>
                    <div style={{ width: 80, height: 80, borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                        <CheckCircle size={40} color="#059669" />
                    </div>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', margin: '0 0 8px' }}>KYC Verified!</h2>
                    <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>Your identity has been successfully verified.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 60 }}>
            <Header onBack={() => router.push('/profile')} title={t.kycVerification} />

            <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>

                {/* Status banner */}
                <div style={{ background: cfg.bg, border: `1px solid ${cfg.border}`, borderRadius: 14, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    {cfg.icon}
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: cfg.color, margin: 0 }}>{cfg.label}</p>
                        <p style={{ fontSize: 11, color: cfg.color, opacity: 0.8, margin: 0 }}>{t.kycDesc}</p>
                    </div>
                </div>

                {/* Step indicator */}
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, gap: 4 }}>
                    {KYC_STEPS.map((s, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                                <div onClick={() => i < step + 1 && setStep(i)} style={{ width: 32, height: 32, borderRadius: '50%', background: i <= step ? INDIGO : '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: i <= step ? 'pointer' : 'default', transition: 'all 0.2s', boxShadow: i === step ? `0 0 0 4px ${INDIGO_LIGHT}` : 'none' }}>
                                    {i < step ? <CheckCircle size={16} color="#fff" /> : <span style={{ fontSize: 13, fontWeight: 700, color: i === step ? '#fff' : '#94a3b8' }}>{i + 1}</span>}
                                </div>
                                <p style={{ fontSize: 9, color: i <= step ? INDIGO : '#94a3b8', fontWeight: 600, margin: '4px 0 0', textAlign: 'center', lineHeight: 1.2 }}>{s}</p>
                            </div>
                            {i < KYC_STEPS.length - 1 && <div style={{ height: 2, flex: 1, background: i < step ? INDIGO : '#e2e8f0', margin: '0 4px', marginBottom: 18, transition: 'all 0.3s' }} />}
                        </div>
                    ))}
                </div>

                {/* Step 0: Personal Info */}
                {step === 0 && (
                    <div style={{ background: '#fff', borderRadius: 18, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 38, height: 38, background: INDIGO_LIGHT, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <User size={18} color={INDIGO} />
                            </div>
                            <div>
                                <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Personal Information</p>
                                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Basic details about you</p>
                            </div>
                        </div>
                        <Field label={t.name} value={form.name} onChange={v => update('name', v)} placeholder="Enter full name" />
                        <Field label={t.email} value={form.email} onChange={v => update('email', v)} placeholder="example@email.com" type="email" />
                        <Field label={t.dob} value={form.dob} onChange={v => update('dob', v)} type="date" />
                        <div style={{ marginBottom: 14 }}>
                            <p style={lbl}>{t.gender}</p>
                            <div style={{ display: 'flex', gap: 8 }}>
                                {(['male', 'female', 'other'] as const).map(g => (
                                    <button key={g} onClick={() => update('gender', g)}
                                        style={{ flex: 1, padding: '10px', border: `1.5px solid ${form.gender === g ? INDIGO : '#e2e8f0'}`, borderRadius: 10, background: form.gender === g ? INDIGO_LIGHT : '#f8fafc', color: form.gender === g ? INDIGO : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                                        {t[g]}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <Field label={t.upiId} value={form.upiId} onChange={v => update('upiId', v)} placeholder="yourname@paytm" />
                        <NavBtn onNext={() => setStep(1)} />
                    </div>
                )}

                {/* Step 1: Identity */}
                {step === 1 && (
                    <div style={{ background: '#fff', borderRadius: 18, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 38, height: 38, background: '#fef3c7', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <CreditCard size={18} color="#d97706" />
                            </div>
                            <div>
                                <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Identity Proof</p>
                                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Government-issued ID details</p>
                            </div>
                        </div>

                        <Field label={t.aadhaar} value={form.aadhaar} onChange={v => update('aadhaar', v.replace(/\D/g, '').slice(0, 12))} placeholder="XXXX XXXX XXXX" maxLength={12} hint="12-digit Aadhaar number" />
                        <Field label={t.pan} value={form.pan} onChange={v => update('pan', v.toUpperCase().slice(0, 10))} placeholder="ABCDE1234F" maxLength={10} hint="10-character PAN number" />

                        {/* Upload hint */}
                        <div style={{ background: '#f0fdf4', border: '1px dashed #86efac', borderRadius: 12, padding: '14px', display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                            <Upload size={20} color="#059669" />
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#15803d', margin: '0 0 2px' }}>Document Upload</p>
                                <p style={{ fontSize: 11, color: '#166534', margin: 0 }}>Physical verification done at store (coming soon)</p>
                            </div>
                        </div>

                        <NavBtn onBack={() => setStep(0)} onNext={() => setStep(2)} />
                    </div>
                )}

                {/* Step 2: Address + Geo */}
                {step === 2 && (
                    <div style={{ background: '#fff', borderRadius: 18, padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 38, height: 38, background: '#ecfdf5', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <MapPin size={18} color="#059669" />
                            </div>
                            <div>
                                <p style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>Address & Location</p>
                                <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>Residential address details</p>
                            </div>
                        </div>

                        {/* Geo-tag button */}
                        <button onClick={getLocation} disabled={geoLoading}
                            style={{ width: '100%', padding: '12px', background: geoLoading ? '#f1f5f9' : '#ecfdf5', border: `1.5px solid ${form.geoAddress ? '#6ee7b7' : '#a7f3d0'}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: geoLoading ? 'not-allowed' : 'pointer', marginBottom: 14, fontFamily: 'inherit', transition: 'all 0.2s' }}>
                            {geoLoading ? <Loader size={16} color="#059669" style={{ animation: 'spin 1s linear infinite' }} /> : <MapPin size={16} color={form.geoAddress ? '#059669' : '#34d399'} />}
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>
                                {geoLoading ? 'Detecting location...' : form.geoAddress ? '📍 ' + t.locationDetected : t.getLocation}
                            </span>
                        </button>
                        {geoError && <p style={{ fontSize: 12, color: '#dc2626', margin: '-8px 0 12px', display: 'flex', alignItems: 'center', gap: 4 }}><AlertCircle size={12} />{geoError}</p>}
                        {form.geoAddress && (
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 12px', marginBottom: 14 }}>
                                <p style={{ fontSize: 11, color: '#15803d', margin: 0, lineHeight: 1.5 }}>{form.geoAddress}</p>
                                {form.latitude ? <p style={{ fontSize: 10, color: '#86efac', margin: '4px 0 0', fontFamily: 'monospace' }}>📡 {form.latitude.toFixed(5)}, {form.longitude.toFixed(5)}</p> : null}
                            </div>
                        )}

                        <Field label={t.address} value={form.address} onChange={v => update('address', v)} placeholder="House No., Street, Area" />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                            <Field label={t.city} value={form.city} onChange={v => update('city', v)} placeholder="City" noMargin />
                            <Field label={t.state} value={form.state} onChange={v => update('state', v)} placeholder="State" noMargin />
                        </div>
                        <Field label={t.pincode} value={form.pincode} onChange={v => update('pincode', v.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit pincode" maxLength={6} />

                        {/* Submit */}
                        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '13px', background: '#f1f5f9', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>
                            <button onClick={handleSubmit} disabled={saving || saved}
                                style={{ flex: 2, padding: '13px', background: saved ? '#059669' : saving ? '#94a3b8' : INDIGO, border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800, cursor: saving || saved ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 6px 20px rgba(99,102,241,0.3)` }}>
                                {saved ? <><CheckCircle size={16} /> Submitted!</> : saving ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><Shield size={16} /> {t.submit} KYC</>}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function Header({ onBack, title }: { onBack: () => void; title: string }) {
    return (
        <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
            <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 4 }}>
                <ArrowLeft size={20} color="#6366f1" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={18} color="#6366f1" />
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{title}</span>
            </div>
        </div>
    );
}

function Field({ label, value, onChange, placeholder, type = 'text', maxLength, hint, noMargin }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string;
    type?: string; maxLength?: number; hint?: string; noMargin?: boolean;
}) {
    return (
        <div style={{ marginBottom: noMargin ? 0 : 14 }}>
            <p style={lbl}>{label}</p>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
                style={{ width: '100%', padding: '11px 12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            {hint && <p style={{ fontSize: 11, color: '#94a3b8', margin: '4px 0 0' }}>{hint}</p>}
        </div>
    );
}

function NavBtn({ onBack, onNext }: { onBack?: () => void; onNext?: () => void }) {
    return (
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            {onBack && <button onClick={onBack} style={{ flex: 1, padding: '13px', background: '#f1f5f9', border: 'none', borderRadius: 12, fontSize: 14, fontWeight: 700, color: '#64748b', cursor: 'pointer', fontFamily: 'inherit' }}>← Back</button>}
            {onNext && <button onClick={onNext} style={{ flex: 2, padding: '13px', background: '#6366f1', border: 'none', borderRadius: 12, color: '#fff', fontSize: 14, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 6px 20px rgba(99,102,241,0.3)' }}>Next →</button>}
        </div>
    );
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, letterSpacing: '0.03em' };
