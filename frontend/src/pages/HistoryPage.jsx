import { useState, useEffect } from 'react';
import { History, Trash2, Eye, X, ChevronDown } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const TONES = {
  professional: { label: 'Professional', color: '#3b82f6' },
  friendly:     { label: 'Friendly',     color: '#22c55e' },
  formal:       { label: 'Formal',       color: '#eab308' },
  apologetic:   { label: 'Apologetic',   color: '#f97316' },
  short:        { label: 'Short reply',  color: '#8b5cf6' },
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function HistoryPage() {
  const [replies, setReplies]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter]     = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    api.get('/history').then(({ data }) => setReplies(data.replies)).catch(() => toast.error('Failed to load')).finally(() => setLoading(false));
  }, []);

  const deleteReply = async id => {
    await api.delete(`/history/${id}`);
    setReplies(p => p.filter(r => r._id !== id));
    if (selected?._id === id) setSelected(null);
    toast.success('Deleted');
  };

  const filtered = filter === 'all' ? replies : replies.filter(r => r.tone === filter);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <History size={15} style={{ color: '#8b5cf6' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text0)' }}>History</span>
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>{replies.length} replies</span>
        </div>

        {/* Filter */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setFilterOpen(!filterOpen)} className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}>
            {filter === 'all' ? 'All tones' : TONES[filter]?.label} <ChevronDown size={11} />
          </button>
          {filterOpen && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', zIndex: 20, minWidth: 140, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
              {[['all', 'All tones'], ...Object.entries(TONES).map(([v, t]) => [v, t.label])].map(([v, l]) => (
                <button key={v} onClick={() => { setFilter(v); setFilterOpen(false); }} style={{
                  width: '100%', padding: '9px 14px', background: filter === v ? 'rgba(124,58,237,0.1)' : 'transparent',
                  border: 'none', cursor: 'pointer', fontSize: 13, color: filter === v ? '#a78bfa' : 'var(--text0)',
                  fontFamily: 'Inter', textAlign: 'left', transition: 'background 0.15s',
                }}>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* List */}
        <div style={{ width: selected ? '45%' : '100%', overflowY: 'auto', borderRight: selected ? '1px solid var(--border)' : 'none' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
              <span className="dot">●</span><span className="dot">●</span><span className="dot">●</span>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center' }}>
              <History size={28} style={{ color: 'var(--text2)', display: 'block', margin: '0 auto 12px' }} />
              <p style={{ fontSize: 13, color: 'var(--text1)' }}>No replies found</p>
            </div>
          ) : filtered.map((r, i) => {
            const t = TONES[r.tone] || TONES.professional;
            const active = selected?._id === r._id;
            return (
              <div key={r._id} onClick={() => setSelected(active ? null : r)}
                style={{
                  padding: '14px 18px', cursor: 'pointer',
                  borderBottom: '1px solid var(--border)',
                  background: active ? 'rgba(124,58,237,0.06)' : 'transparent',
                  transition: 'background 0.15s',
                  display: 'flex', gap: 14,
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg2)'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'var(--text0)', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.email_input.substring(0, 65)}…
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {r.generated_reply.substring(0, 70)}…
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: `${t.color}18`, color: t.color, border: `1px solid ${t.color}30` }}>
                    {t.label}
                  </span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button onClick={e => { e.stopPropagation(); setSelected(r); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', padding: 3, display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
                    ><Eye size={12} /></button>
                    <button onClick={e => { e.stopPropagation(); deleteReply(r._id); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', padding: 3, display: 'flex' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text2)'}
                    ><Trash2 size={12} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Preview panel */}
        {selected && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg1)', overflow: 'hidden' }} className="fade-up">
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text0)' }}>Preview</span>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: `${TONES[selected.tone]?.color}18`, color: TONES[selected.tone]?.color, border: `1px solid ${TONES[selected.tone]?.color}30` }}>
                  {TONES[selected.tone]?.label}
                </span>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'flex' }}>
                <X size={15} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text2)', marginBottom: 10 }}>Original email</p>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 16px' }}>
                  <p style={{ fontSize: 13, color: 'var(--text1)', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>{selected.email_input}</p>
                </div>
              </div>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--text2)', marginBottom: 10 }}>Generated reply</p>
                <div style={{ background: 'var(--bg2)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 10, padding: '14px 16px' }}>
                  <p style={{ fontSize: 13, color: 'var(--text0)', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>{selected.generated_reply}</p>
                </div>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text2)', textAlign: 'right' }}>{formatDate(selected.created_at)}</p>
            </div>

            <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
              <button onClick={() => navigator.clipboard.writeText(selected.generated_reply).then(() => toast.success('Copied!'))} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px' }}>
                Copy reply
              </button>
              <button onClick={() => deleteReply(selected._id)} className="btn-ghost" style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '8px', color: '#f87171', borderColor: 'rgba(248,113,113,0.2)' }}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
