'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '@/components/BottomNav';
import { ArrowLeft, Phone, Mail, MessageCircle, MapPin, Clock, ChevronRight, Send, CheckCircle } from 'lucide-react';

const NAVY = '#6366f1';

const FAQS = [
    { q: 'How do I earn points?', a: 'Scan product QR codes to earn loyalty points. Each product has a set number of points.' },
    { q: 'When do points expire?', a: 'Points are valid for 24 months from the date of earning.' },
    { q: 'How do I redeem points?', a: 'Go to the Redeem section and choose from vouchers, products, or bank transfer.' },
    { q: 'What is Asli vs Nakli?', a: 'It\'s our product authenticity verification feature. Scan any product QR to check if it\'s genuine.' },
    { q: 'How to report a fake product?', a: 'Use the Asli vs Nakli feature and tap "Report Product" if the verification fails.' },
];

export default function ContactPage() {
    const router = useRouter();
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [sent, setSent] = useState(false);
    const [sending, setSending] = useState(false);

    const handleSend = () => {
        if (!name || !message) return;
        setSending(true);
        setTimeout(() => { setSending(false); setSent(true); }, 1800);
    };

    return (
        <div style={{ minHeight: '100vh', background: '#f4f6f9', fontFamily: "'Inter','Segoe UI',sans-serif", paddingBottom: 80 }}>

            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e8ecf0', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => router.push('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                    <ArrowLeft size={18} color={NAVY} />
                </button>
                <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#1a2332', margin: 0 }}>Contact Us</p>
                    <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>We're here to help</p>
                </div>
            </div>

            <div style={{ maxWidth: 480, margin: '0 auto', padding: '16px' }}>

                {/* Contact cards */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                        { icon: <Phone size={22} color={NAVY} />, title: 'Call Us', sub: '1800-XXX-XXXX', bg: '#eef2ff', border: '#c7d2fe' },
                        { icon: <Mail size={22} color="#059669" />, title: 'Email Us', sub: 'support@avopay.in', bg: '#ecfdf5', border: '#a7f3d0' },
                        { icon: <MessageCircle size={22} color="#d97706" />, title: 'WhatsApp', sub: '+91 9XXXXXXXXX', bg: '#fffbeb', border: '#fcd34d' },
                        { icon: <Clock size={22} color="#6366f1" />, title: 'Hours', sub: 'Mon–Sat 9–6 PM', bg: '#f5f3ff', border: '#d8b4fe' },
                    ].map(({ icon, title, sub, bg, border }) => (
                        <div key={title} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '14px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center' }}>
                            <div style={{ width: 46, height: 46, borderRadius: 13, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>{icon}</div>
                            <div>
                                <p style={{ fontSize: 13, fontWeight: 700, color: '#1a2332', margin: '0 0 3px' }}>{title}</p>
                                <p style={{ fontSize: 11, color: '#64748b', margin: 0 }}>{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Office address */}
                <div style={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 16, padding: '16px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'flex-start', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ width: 40, height: 40, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <MapPin size={20} color="#ea580c" />
                    </div>
                    <div>
                        <p style={{ fontSize: 13, fontWeight: 700, color: '#1a2332', margin: '0 0 4px' }}>Head Office</p>
                        <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                            Ozone Overseas Pvt. Ltd.<br />
                            Plot No. 12, Sector 5, IMT Manesar,<br />
                            Gurugram, Haryana – 122051
                        </p>
                    </div>
                </div>

                {/* Contact form */}
                {!sent ? (
                    <div style={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 16, padding: '18px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#1a2332', margin: '0 0 16px' }}>Send us a message</p>
                        {[
                            { id: 'ct-name', label: 'Your Name *', ph: 'Enter your name', v: name, s: setName },
                            { id: 'ct-email', label: 'Email (optional)', ph: 'your@email.com', v: email, s: setEmail },
                        ].map(({ id, label, ph, v, s }) => (
                            <div key={id} style={{ marginBottom: 12 }}>
                                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{label}</label>
                                <input id={id} type="text" placeholder={ph} value={v} onChange={e => s(e.target.value)}
                                    style={{ width: '100%', padding: '11px 13px', background: '#f8f9fb', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', color: '#1a2332', boxSizing: 'border-box' }} />
                            </div>
                        ))}
                        <div style={{ marginBottom: 14 }}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#475569', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>Message *</label>
                            <textarea id="ct-msg" value={message} onChange={e => setMessage(e.target.value)} placeholder="How can we help you?" rows={4}
                                style={{ width: '100%', padding: '11px 13px', background: '#f8f9fb', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 14, fontFamily: 'inherit', outline: 'none', resize: 'none', color: '#1a2332', boxSizing: 'border-box' }} />
                        </div>
                        <button onClick={handleSend} disabled={sending || !name || !message}
                            style={{ width: '100%', padding: '13px', background: (!name || !message) ? '#f1f5f9' : NAVY, border: 'none', borderRadius: 12, color: (!name || !message) ? '#94a3b8' : '#fff', fontSize: 14, fontWeight: 700, cursor: (!name || !message) ? 'not-allowed' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
                            {sending ? <><Spin />Sending…</> : <><Send size={15} />Send Message</>}
                        </button>
                    </div>
                ) : (
                    <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: 16, padding: '24px 20px', marginBottom: 16, textAlign: 'center', animation: 'fadeUp 0.4s ease both' }}>
                        <CheckCircle size={40} color="#059669" style={{ margin: '0 auto 12px' }} />
                        <p style={{ fontSize: 16, fontWeight: 800, color: '#065f46', margin: '0 0 6px' }}>Message Sent!</p>
                        <p style={{ fontSize: 13, color: '#047857', margin: '0 0 16px', lineHeight: 1.6 }}>Thank you, {name}! We'll get back to you within 24 hours.</p>
                        <button onClick={() => { setSent(false); setName(''); setEmail(''); setMessage(''); }}
                            style={{ padding: '10px 24px', background: '#059669', border: 'none', borderRadius: 10, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                            Send Another
                        </button>
                    </div>
                )}

                {/* FAQs */}
                <div style={{ background: '#fff', border: '1px solid #e8ecf0', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: '#1a2332', margin: 0 }}>Frequently Asked Questions</p>
                    </div>
                    {FAQS.map((faq, i) => (
                        <div key={i} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                            <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                style={{ width: '100%', padding: '14px 16px', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontFamily: 'inherit', gap: 12 }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#1a2332', textAlign: 'left' }}>{faq.q}</span>
                                <ChevronRight size={16} color="#94a3b8" style={{ transform: openFaq === i ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }} />
                            </button>
                            {openFaq === i && (
                                <div style={{ padding: '0 16px 14px', animation: 'fadeUp 0.2s ease both' }}>
                                    <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.7 }}>{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes spin    { to { transform: rotate(360deg); } }
                @keyframes fadeUp  { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
            `}</style>
            <BottomNav />
        </div>
    );
}

function Spin() {
    return <div style={{ width: 16, height: 16, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', animation: 'spin 0.8s linear infinite' }} />;
}
