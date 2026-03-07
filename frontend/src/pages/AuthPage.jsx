import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function AuthPage({ mode }) {
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email: form.email, password: form.password } : form;
      const { data } = await api.post(endpoint, payload);
      login(data.user, data.token);
      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg0)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24
    }}>
      <div className="fade-up" style={{ width: '100%', maxWidth: 400 }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(135deg,#7c3aed,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Mail size={15} color="#fff" />
            </div>
            <span style={{ fontSize: 16, fontWeight: 700 }} className="shimmer-text">ReplyAI</span>
          </Link>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text0)', marginBottom: 6, display: 'block' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text1)' }}>
            {isLogin ? 'Sign in to continue' : 'Start generating AI replies for free'}
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

            {!isLogin && (
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text1)', marginBottom: 7 }}>
                  Full name
                </label>
                <input
                  name="name" type="text" value={form.name}
                  onChange={handleChange} placeholder="John Doe"
                  required className="input"
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text1)', marginBottom: 7 }}>
                Email
              </label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com"
                required className="input"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text1)', marginBottom: 7 }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password" type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 6 characters" required minLength={6}
                  className="input" style={{ paddingRight: 40 }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text2)', display: 'flex' }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: 4, fontSize: 14 }}>
              {loading
                ? <><span className="dot">●</span><span className="dot">●</span><span className="dot">●</span></>
                : <>{isLogin ? 'Sign in' : 'Create account'} <ArrowRight size={14} /></>
              }
            </button>
          </form>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid var(--border)', textAlign: 'center', fontSize: 13, color: 'var(--text1)' }}>
            {isLogin
              ? <>No account? <Link to="/signup" style={{ color: '#8b5cf6', fontWeight: 500, textDecoration: 'none' }}>Sign up</Link></>
              : <>Already have one? <Link to="/login" style={{ color: '#8b5cf6', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link></>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
