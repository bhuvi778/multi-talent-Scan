'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store';
import { QrCode, Gift, TrendingUp, Shield, ArrowRight, Zap, Star, Users } from 'lucide-react';

const FEATURES = [
  { icon: <QrCode size={22} />, title: 'Instant QR Cashback', desc: 'Scan any product QR code — get cashback directly to your UPI wallet in minutes.' },
  { icon: <Gift size={22} />, title: 'Loyalty Points', desc: 'Earn points on every purchase. Redeem for gifts, vouchers or cash.' },
  { icon: <TrendingUp size={22} />, title: 'Tier Rewards', desc: 'Climb from Bronze to Diamond. Higher tier means bigger rewards every scan.' },
  { icon: <Shield size={22} />, title: 'Secure & Instant', desc: 'Bank-grade UPI integration. Your cashback credited within 2 minutes.' },
];

const STATS = [
  { value: '2M+', label: 'Happy Customers' },
  { value: '₹15Cr', label: 'Cashback Paid' },
  { value: '50+', label: 'Brand Partners' },
  { value: '4.9★', label: 'App Rating' },
];

export default function LandingPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuthStore();

  useEffect(() => { if (isLoggedIn) router.replace('/home'); }, [isLoggedIn, router]);

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: "'Inter','Segoe UI',sans-serif" }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #e2e8f0', backdropFilter: 'blur(12px)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#6366f1,#4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={18} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>AvoPay</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => router.push('/cashback')} style={{ padding: '8px 16px', background: '#f1f5f9', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#475569', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            <QrCode size={15} /> Scan QR
          </button>
          <button onClick={() => router.push('/login')} style={{ padding: '8px 18px', background: '#6366f1', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer' }}>
            Login
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '72px 24px 60px', textAlign: 'center' }}>

        {/* Pill badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: 999, padding: '6px 14px', marginBottom: 28 }}>
          <Zap size={13} color="#6366f1" fill="#6366f1" />
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6366f1' }}>India #1 Loyalty Cashback Platform</span>
        </div>

        <h1 style={{ fontSize: 'clamp(36px,6vw,64px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 20 }}>
          Scan. Earn.<br />
          <span style={{ background: 'linear-gradient(135deg,#6366f1,#7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Get Cashback.</span>
        </h1>

        <p style={{ fontSize: 18, color: '#64748b', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.65, fontWeight: 400 }}>
          Scan the QR code on any product. Enter your UPI ID. Receive instant cashback — no app install, no login needed.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 48 }}>
          <button onClick={() => router.push('/cashback')} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: '#6366f1', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#fff', cursor: 'pointer', boxShadow: '0 8px 24px rgba(99,102,241,0.3)', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4f46e5'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#6366f1'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <QrCode size={20} />
            Scan QR for Cashback
            <ArrowRight size={18} />
          </button>
          <button onClick={() => router.push('/login')} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 28px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 14, fontSize: 16, fontWeight: 600, color: '#0f172a', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.color = '#6366f1'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#0f172a'; }}>
            Login to Dashboard
          </button>
        </div>

        {/* Hero visual */}
        <div style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)', borderRadius: 28, padding: 32, maxWidth: 480, margin: '0 auto', boxShadow: '0 32px 80px rgba(99,102,241,0.25)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 20, padding: '20px 24px', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)', marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>Cashback Credited</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 36, fontWeight: 900, color: '#fff' }}>₹120</span>
              <span style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '5px 12px', borderRadius: 999, fontSize: 13, fontWeight: 700, border: '1px solid rgba(16,185,129,0.3)' }}>✓ Paid</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: '4px 0 0' }}>Asian Paints Premium 10L • UPI: rahul@paytm</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            {[['500+', 'Points Earned'], ['₹1,200', 'Total Saved'], ['Gold', 'Member Tier']].map(([v, l]) => (
              <div key={l} style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
                <p style={{ fontSize: 17, fontWeight: 800, color: '#fff', margin: '0 0 2px' }}>{v}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', margin: 0 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '40px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24, textAlign: 'center' }}>
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p style={{ fontSize: 28, fontWeight: 900, color: '#6366f1', margin: '0 0 4px', letterSpacing: '-1px' }}>{value}</p>
              <p style={{ fontSize: 13, color: '#64748b', margin: 0, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '72px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-1px' }}>Why AvoPay?</h2>
          <p style={{ fontSize: 16, color: '#64748b', margin: 0 }}>Everything you need to earn and redeem rewards effortlessly</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 16 }}>
          {FEATURES.map(({ icon, title, desc }) => (
            <div key={title} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '24px', transition: 'all 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              <div style={{ width: 48, height: 48, background: '#eef2ff', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', marginBottom: 16 }}>
                {icon}
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a', margin: '0 0 8px' }}>{title}</h3>
              <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '72px 24px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: '#0f172a', margin: '0 0 12px', letterSpacing: '-1px' }}>Get Cashback in 3 Steps</h2>
          <p style={{ fontSize: 16, color: '#64748b', margin: '0 0 48px' }}>No login. No app. Just scan, fill, and receive cash.</p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { step: 1, icon: <QrCode size={26} color="#6366f1" />, title: 'Scan QR Code', desc: 'Find the QR code on the product packaging and scan it.' },
              { step: 2, icon: <Users size={26} color="#6366f1" />, title: 'Fill Your Details', desc: 'Enter your name, mobile number, and UPI ID.' },
              { step: 3, icon: <Zap size={26} color="#059669" />, title: 'Get Cashback!', desc: 'Cashback is instantly transferred to your UPI wallet.' },
            ].map(({ step, icon, title, desc }, i, arr) => (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flex: '1 1 180px', minWidth: 180 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, background: '#fff', border: '2px solid #e2e8f0', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.06)', marginBottom: 8 }}>{icon}</div>
                  <div style={{ width: 2, height: i < arr.length - 1 ? 0 : 0, background: '#e2e8f0' }} />
                </div>
                <div style={{ paddingTop: 8, textAlign: 'left' }}>
                  <div style={{ display: 'inline-block', background: '#eef2ff', color: '#6366f1', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700, marginBottom: 8 }}>Step {step}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>{title}</h3>
                  <p style={{ fontSize: 13, color: '#64748b', margin: 0, lineHeight: 1.55 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'linear-gradient(135deg,#6366f1,#4f46e5,#7c3aed)', padding: '72px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', margin: '0 0 12px', letterSpacing: '-1px' }}>Ready to Earn Rewards?</h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px', lineHeight: 1.6 }}>Start scanning product QR codes today and get instant cashback delivered to your UPI.</p>
          <button onClick={() => router.push('/cashback')} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 32px', background: '#fff', border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 700, color: '#6366f1', cursor: 'pointer', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
            <QrCode size={20} /> Scan for Cashback Now <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '28px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={14} color="#fff" fill="#fff" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>AvoPay</span>
        </div>
        <p style={{ fontSize: 13, color: '#94a3b8', margin: 0 }}>© 2026 AvoPay. All rights reserved.</p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy Policy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: 13, color: '#64748b', cursor: 'pointer', fontWeight: 500 }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
