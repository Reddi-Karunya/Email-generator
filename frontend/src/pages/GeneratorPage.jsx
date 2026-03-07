import { useState } from 'react';
import { Sparkles, Copy, RefreshCw, Save, CheckCheck, ChevronDown, Wand2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TONES = [
  { value: 'professional', label: 'Professional', desc: 'Business-appropriate & polished' },
  { value: 'friendly',     label: 'Friendly',     desc: 'Warm and conversational' },
  { value: 'formal',       label: 'Formal',       desc: 'Highly structured' },
  { value: 'apologetic',   label: 'Apologetic',   desc: 'Empathetic and understanding' },
  { value: 'short',        label: 'Short reply',  desc: '2–3 sentences only' },
];

export default function GeneratorPage() {
  const [emailText, setEmailText] = useState('');
  const [tone, setTone] = useState('professional');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toneOpen, setToneOpen] = useState(false);

  const selectedTone = TONES.find(t => t.value === tone);

  const generate = async () => {
    if (!emailText.trim()) return toast.error('Paste an email first');
    setLoading(true); setSaved(false);
    try {
      const { data } = await api.post('/generate-reply', { emailText, tone });
      setReply(data.reply);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate');
    } finally { setLoading(false); }
  };

  const copyReply = async () => {
    await navigator.clipboard.writeText(reply);
    setCopied(true); toast.success('Copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const saveReply = async () => {
    try {
      await api.post('/save-reply', { emailText, generatedReply: reply, tone });
      setSaved(true); toast.success('Saved to history');
    } catch { toast.error('Save failed'); }
  };

  const words = (t) => t.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header bar */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Sparkles size={15} style={{ color: '#8b5cf6' }} />
        <div>
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text0)' }}>AI Generator</span>
          <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 10 }}>Paste an email, choose a tone, generate a reply</span>
        </div>
      </div>

      {/* Two panels */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* LEFT — Input */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--border)' }}>
          {/* Panel label */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', letterSpacing: 0.5, textTransform: 'uppercase' }}>Received email</span>
            {emailText && <span style={{ fontSize: 11, color: 'var(--text2)' }}>{words(emailText)} words</span>}
          </div>

          {/* Textarea */}
          <textarea
            value={emailText}
            onChange={e => setEmailText(e.target.value)}
            placeholder={"Paste the email you received here…\n\nExample:\nHi, could you send the project update? Thanks, Alex"}
            style={{
              flex: 1, background: 'transparent', border: 'none', resize: 'none',
              padding: '18px 18px', fontSize: 13, color: 'var(--text0)',
              lineHeight: 1.75, outline: 'none', fontFamily: 'Inter, sans-serif',
            }}
          />

          {/* Controls */}
          <div style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Tone dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setToneOpen(!toneOpen)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 9,
                  padding: '9px 14px', cursor: 'pointer', fontSize: 13, color: 'var(--text0)',
                  fontFamily: 'Inter', transition: 'border-color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ fontWeight: 500 }}>{selectedTone?.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>{selectedTone?.desc}</span>
                  <ChevronDown size={13} style={{ color: 'var(--text2)', transform: toneOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                </div>
              </button>

              {toneOpen && (
                <div style={{
                  position: 'absolute', bottom: 'calc(100% + 6px)', left: 0, right: 0,
                  background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10,
                  overflow: 'hidden', zIndex: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                  {TONES.map(t => (
                    <button key={t.value} onClick={() => { setTone(t.value); setToneOpen(false); }}
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '10px 14px', background: tone === t.value ? 'rgba(124,58,237,0.1)' : 'transparent',
                        border: 'none', cursor: 'pointer', fontFamily: 'Inter', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { if (tone !== t.value) e.currentTarget.style.background = 'rgba(124,58,237,0.05)'; }}
                      onMouseLeave={e => { if (tone !== t.value) e.currentTarget.style.background = 'transparent'; }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 500, color: tone === t.value ? '#a78bfa' : 'var(--text0)' }}>{t.label}</span>
                      <span style={{ fontSize: 11, color: 'var(--text2)' }}>{t.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Generate button */}
            <button onClick={generate} disabled={loading || !emailText.trim()} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '11px' }}>
              {loading
                ? <><span className="dot">●</span><span className="dot">●</span><span className="dot">●</span> <span style={{ marginLeft: 6 }}>Generating…</span></>
                : <><Wand2 size={14} /> Generate reply</>
              }
            </button>
          </div>
        </div>

        {/* RIGHT — AI reply */}
        <div style={{ width: '50%', display: 'flex', flexDirection: 'column', background: 'var(--bg1)' }}>
          {/* Panel label */}
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 18, height: 18, borderRadius: 5, background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={10} color="#fff" />
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#a78bfa', letterSpacing: 0.5, textTransform: 'uppercase' }}>AI assistant</span>
              <span style={{ fontSize: 11, color: 'var(--text2)', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 99, padding: '1px 8px' }}>
                {selectedTone?.label}
              </span>
            </div>
            {reply && <span style={{ fontSize: 11, color: 'var(--text2)' }}>{words(reply)} words</span>}
          </div>

          {/* Reply content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px' }}>
            {loading ? (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <Sparkles size={24} style={{ color: '#7c3aed', opacity: 0.6 }} />
                <p style={{ fontSize: 13, color: 'var(--text1)', fontWeight: 500 }}>Writing your reply…</p>
                <div><span className="dot" style={{ color: '#7c3aed', fontSize: 18 }}>●</span> <span className="dot" style={{ color: '#7c3aed', fontSize: 18 }}>●</span> <span className="dot" style={{ color: '#7c3aed', fontSize: 18 }}>●</span></div>
              </div>
            ) : reply ? (
              <div className="fade-up">
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text2)', marginBottom: 12, letterSpacing: 0.5, textTransform: 'uppercase' }}>Generated reply</div>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '16px 18px' }}>
                  <p style={{ fontSize: 13, color: 'var(--text0)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{reply}</p>
                </div>
              </div>
            ) : (
              <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, textAlign: 'center' }}>
                <Sparkles size={28} style={{ color: 'var(--text2)' }} />
                <p style={{ fontSize: 13, color: 'var(--text1)', fontWeight: 500 }}>AI assistant ready</p>
                <p style={{ fontSize: 12, color: 'var(--text2)', maxWidth: 220, lineHeight: 1.6 }}>Paste an email on the left, pick a tone, and hit Generate.</p>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {reply && !loading && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <button onClick={copyReply} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px' }}>
                {copied ? <><CheckCheck size={13} style={{ color: '#22c55e' }} /> Copied</> : <><Copy size={13} /> Copy</>}
              </button>
              <button onClick={generate} disabled={loading} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px' }}>
                <RefreshCw size={13} /> Regenerate
              </button>
              <button onClick={saveReply} disabled={saved} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px', color: saved ? '#22c55e' : undefined }}>
                {saved ? <><CheckCheck size={13} /> Saved</> : <><Save size={13} /> Save</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
