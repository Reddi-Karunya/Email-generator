import { Link } from 'react-router-dom';
import { Sparkles, Zap, ShieldCheck, History, ArrowRight, Mail, CheckCircle } from 'lucide-react';

const steps = [
  { num: '01', title: 'Paste your email', desc: 'Drop in the email you received.' },
  { num: '02', title: 'Pick a tone', desc: 'Professional, friendly, formal, and more.' },
  { num: '03', title: 'Generate & copy', desc: 'One click. Done in seconds.' },
];

const features = [
  { icon: Sparkles, title: 'AI-powered replies', desc: 'GPT-3.5 crafts contextually perfect responses.' },
  { icon: Zap, title: 'Five tones', desc: 'Professional, Friendly, Formal, Apologetic, Short.' },
  { icon: History, title: 'Reply history', desc: 'Every reply saved and searchable.' },
  { icon: ShieldCheck, title: 'Secure', desc: 'JWT-authenticated. Your emails stay private.' },
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--bg0)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        padding: '0 40px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(13,11,24,0.85)',
        backdropFilter: 'blur(16px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Mail size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15 }} className="shimmer-text">ReplyAI</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/login" style={{ color: 'var(--text1)', fontSize: 14, fontWeight: 500, padding: '6px 14px', textDecoration: 'none' }}>Sign in</Link>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '7px 16px', fontSize: 13 }}>
            Get started <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="fade-up" style={{ padding: '96px 40px 80px', maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 99, padding: '4px 12px', marginBottom: 32,
          fontSize: 12, color: '#a78bfa',
        }}>
          <Sparkles size={12} />
          Powered by NVIDIA AI
        </div>

        <h1 style={{ fontSize: 44, fontWeight: 700, lineHeight: 1.2, marginBottom: 16, color: 'var(--text0)' }}>
          Generate professional<br />
          <span className="shimmer-text">email replies instantly</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text1)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
          Paste any email, pick your tone, get a polished reply in under 3 seconds.
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '11px 24px', fontSize: 14 }}>
            Try for free <ArrowRight size={14} />
          </Link>
          <Link to="/login" className="btn-ghost" style={{ textDecoration: 'none' }}>Sign in</Link>
        </div>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 24 }}>
          {['No setup', 'Free to use', 'Instant'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text2)' }}>
              <CheckCircle size={11} style={{ color: '#7c3aed' }} /> {t}
            </span>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', maxWidth: 700, margin: '0 auto' }} />

      {/* How it works */}
      <section style={{ padding: '72px 40px', maxWidth: 820, margin: '0 auto' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: 'var(--text2)', textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>HOW IT WORKS</p>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: 'var(--text0)', marginBottom: 40 }}>Three steps to a perfect reply</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {steps.map(s => (
            <div key={s.num} className="card" style={{ padding: '28px 24px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7c3aed', letterSpacing: 1, marginBottom: 14 }}>{s.num}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text0)', marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--text1)', lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 40px 72px', maxWidth: 820, margin: '0 auto' }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: 2, color: 'var(--text2)', textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>FEATURES</p>
        <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: 'var(--text0)', marginBottom: 40 }}>Everything you need</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card" style={{ padding: '22px 24px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} style={{ color: '#8b5cf6' }} />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text0)', marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: 'var(--text1)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 40px 80px', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '48px 40px' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text0)', marginBottom: 10 }}>Ready to reply smarter?</h2>
          <p style={{ fontSize: 14, color: 'var(--text1)', marginBottom: 28 }}>Generate your first reply today — free.</p>
          <Link to="/signup" className="btn-primary" style={{ textDecoration: 'none', padding: '11px 28px' }}>
            Get started <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '20px 40px', textAlign: 'center', fontSize: 12, color: 'var(--text2)' }}>
        ReplyAI — Built with React, Node.js & OpenAI
      </div>
    </div>
  );
}
