'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useLangStore, T } from '@/store';
import { ArrowLeft, User, CheckCircle, Loader, Camera, Mail, MapPin, Phone } from 'lucide-react';

const INDIGO = '#6366f1';
const INDIGO_LIGHT = '#eef2ff';

export default function EditProfilePage() {
    const router = useRouter();
    const { user, updateUser, isLoggedIn } = useAuthStore();
    const { lang } = useLangStore();
    const t = T[lang];

    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        dob: user?.dob || '',
        gender: user?.gender || '',
        address: user?.address || '',
        city: user?.city || '',
        state: user?.state || '',
        pincode: user?.pincode || '',
        upiId: user?.upiId || '',
    });

    useEffect(() => {
        if (!isLoggedIn) router.replace('/login');
    }, [isLoggedIn, router]);

    const upd = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

    const handleSave = () => {
        setSaving(true);
        setTimeout(() => {
            updateUser({
                ...form,
                gender: form.gender as 'male' | 'female' | 'other' | undefined,
            });
            setSaving(false);
            setSaved(true);
            setTimeout(() => router.push('/profile'), 1200);
        }, 1200);
    };

    if (!user) return null;

    const initials = user.name?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'U';

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 40 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 50 }}>
                <button onClick={() => router.push('/profile')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                    <ArrowLeft size={20} color={INDIGO} />
                </button>
                <User size={18} color={INDIGO} />
                <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a' }}>{t.editProfile}</span>
            </div>

            <div style={{ maxWidth: 480, margin: '0 auto', padding: '20px 16px' }}>

                {/* Avatar section */}
                <div style={{ background: '#fff', borderRadius: 18, padding: '24px', marginBottom: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', marginBottom: 12 }}>
                        <div style={{ width: 80, height: 80, borderRadius: '50%', background: `linear-gradient(135deg, ${INDIGO}, #a855f7)`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(99,102,241,0.35)' }}>
                            <span style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{initials}</span>
                        </div>
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, background: INDIGO, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', cursor: 'pointer' }}>
                            <Camera size={12} color="#fff" />
                        </div>
                    </div>
                    <p style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 2px' }}>{user.name}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Phone size={12} color="#94a3b8" />
                        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>+91 {user.phone}</p>
                    </div>
                </div>

                {/* Personal Info */}
                <SectionCard title="Personal Details" icon={<User size={16} color={INDIGO} />}>
                    <Field label={t.name} value={form.name} onChange={v => upd('name', v)} placeholder="Full name" />
                    <Field label={t.email} value={form.email} onChange={v => upd('email', v)} placeholder="example@email.com" type="email" icon={<Mail size={14} color="#94a3b8" />} />
                    <Field label={t.dob} value={form.dob} onChange={v => upd('dob', v)} type="date" />
                    <div style={{ marginBottom: 14 }}>
                        <p style={lbl}>{t.gender}</p>
                        <div style={{ display: 'flex', gap: 8 }}>
                            {(['male', 'female', 'other'] as const).map(g => (
                                <button key={g} onClick={() => upd('gender', g)}
                                    style={{ flex: 1, padding: '9px', border: `1.5px solid ${form.gender === g ? INDIGO : '#e2e8f0'}`, borderRadius: 10, background: form.gender === g ? INDIGO_LIGHT : '#f8fafc', color: form.gender === g ? INDIGO : '#64748b', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s', textTransform: 'capitalize' }}>
                                    {t[g]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <Field label={t.upiId} value={form.upiId} onChange={v => upd('upiId', v)} placeholder="yourname@paytm" />
                </SectionCard>

                {/* Address */}
                <SectionCard title="Address" icon={<MapPin size={16} color="#059669" />}>
                    <Field label={t.address} value={form.address} onChange={v => upd('address', v)} placeholder="House No., Street, Area" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                        <Field label={t.city} value={form.city} onChange={v => upd('city', v)} placeholder="City" noMargin />
                        <Field label={t.state} value={form.state} onChange={v => upd('state', v)} placeholder="State" noMargin />
                    </div>
                    <Field label={t.pincode} value={form.pincode} onChange={v => upd('pincode', v.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit pincode" maxLength={6} />
                </SectionCard>

                {/* Save button */}
                <button onClick={handleSave} disabled={saving || saved}
                    style={{ width: '100%', padding: '15px', background: saved ? '#059669' : saving ? '#94a3b8' : INDIGO, border: 'none', borderRadius: 14, color: '#fff', fontSize: 15, fontWeight: 800, cursor: saving || saved ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: `0 6px 24px rgba(99,102,241,0.35)`, transition: 'all 0.2s' }}>
                    {saved ? <><CheckCircle size={18} /> Saved!</> : saving ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Saving…</> : t.save}
                </button>
            </div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
    return (
        <div style={{ background: '#fff', borderRadius: 18, padding: '18px', marginBottom: 14, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #f1f5f9' }}>
                {icon}
                <p style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</p>
            </div>
            {children}
        </div>
    );
}

function Field({ label, value, onChange, placeholder, type = 'text', maxLength, noMargin, icon }: {
    label: string; value: string; onChange: (v: string) => void; placeholder?: string;
    type?: string; maxLength?: number; noMargin?: boolean; icon?: React.ReactNode;
}) {
    return (
        <div style={{ marginBottom: noMargin ? 0 : 14 }}>
            <p style={lbl}>{label}</p>
            <div style={{ position: 'relative' }}>
                {icon && <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>{icon}</div>}
                <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
                    style={{ width: '100%', padding: icon ? '11px 12px 11px 34px' : '11px 12px', background: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, outline: 'none', color: '#0f172a', fontFamily: 'inherit', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = '#e2e8f0'} />
            </div>
        </div>
    );
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 5, letterSpacing: '0.03em' };
