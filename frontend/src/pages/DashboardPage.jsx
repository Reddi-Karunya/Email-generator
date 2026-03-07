import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, History, ArrowRight, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const TONE_COLORS = {
  professional: '#3b82f6', friendly: '#22c55e',
  formal: '#eab308', apologetic: '#f97316', short: '#8b5cf6',
};
const TONE_LABELS = {
  professional: 'Professional', friendly: 'Friendly',
  formal: 'Formal', apologetic: 'Apologetic', short: 'Short',
};

function timeAgo(d) {
  const m = Math.round((Date.now() - new Date(d)) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/history').then(({ data }) => setReplies(data.replies.slice(0, 6))).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div className="fade-up" style={{ padding: '40px 48px', maxWidth: 860, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 4 }}>Good to see you,</p>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text0)' }}>{user?.name}</h1>
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36 }}>
        <Link to="/generator" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text0)', marginBottom: 4 }}>Generate reply</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>Paste email → AI writes a reply</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} style={{ color: '#8b5cf6' }} />
            </div>
          </div>
        </Link>

        <Link to="/history" style={{ textDecoration: 'none' }}>
          <div className="card" style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#7c3aed'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text0)', marginBottom: 4 }}>Browse history</div>
              <div style={{ fontSize: 12, color: 'var(--text2)' }}>{replies.length} saved replies</div>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: 'rgba(124,58,237,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={16} style={{ color: '#8b5cf6' }} />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent replies */}
      <div className="card">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} style={{ color: 'var(--text2)' }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text0)' }}>Recent replies</span>
          </div>
          <Link to="/history" style={{ fontSize: 12, color: '#8b5cf6', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
            View all <ArrowRight size={11} />
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--text2)', fontSize: 13 }}>
            <span className="dot">●</span> <span className="dot">●</span> <span className="dot">●</span>
          </div>
        ) : replies.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Sparkles size={24} style={{ color: 'var(--text2)', marginBottom: 10, display: 'block', margin: '0 auto 12px' }} />
            <p style={{ fontSize: 13, color: 'var(--text1)', marginBottom: 10 }}>No replies yet</p>
            <Link to="/generator" style={{ fontSize: 12, color: '#8b5cf6', textDecoration: 'none' }}>Generate your first →</Link>
          </div>
        ) : (
          replies.map((r, i) => (
            <div key={r._id} style={{
              padding: '14px 20px',
              borderBottom: i < replies.length - 1 ? '1px solid var(--border)' : 'none',
              display: 'flex', alignItems: 'center', gap: 16,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, color: 'var(--text0)', marginBottom: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.email_input.substring(0, 70)}…
                </p>
                <p style={{ fontSize: 12, color: 'var(--text2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {r.generated_reply.substring(0, 80)}…
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                  background: `${TONE_COLORS[r.tone]}18`,
                  color: TONE_COLORS[r.tone],
                  border: `1px solid ${TONE_COLORS[r.tone]}30`,
                }}>
                  {TONE_LABELS[r.tone]}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text2)' }}>{timeAgo(r.created_at)}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
