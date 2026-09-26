import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/submit';
  const { login, register } = useAuth();

  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        if (!name.trim()) throw new Error('Please enter your name.');
        await register(name, email, password);
      }
      nav(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="citizen-page">
      <header className="citizen-header">
        <Link to="/" className="brand">
          <span className="brand-mark">CS</span>
          <span><strong>CivicSignal AI</strong><small>Live Session</small></span>
        </Link>
        <div className="demo-chip">LIVE BACKEND</div>
      </header>
      <main className="citizen-shell" style={{ maxWidth: 440 }}>
        <div className="back-row">
          <Link to="/submit" className="back-link"><ArrowLeft size={15} /> Back to request form</Link>
        </div>
        <section className="intake-card">
          <div className="card-top">
            <div>
              <span className="section-label">SIGN IN</span>
              <h2>{tab === 'login' ? 'Sign in to submit' : 'Create an account'}</h2>
            </div>
          </div>
          <div className="mode-switch">
            <button type="button" className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setError(''); }}>
              <span>Sign in</span>
            </button>
            <button type="button" className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setError(''); }}>
              <span>Register</span>
            </button>
          </div>
          <form onSubmit={submit}>
            {tab === 'register' && (
              <div className="input-grid" style={{ gridTemplateColumns: '1fr', marginTop: 0, marginBottom: 12 }}>
                <label>Name
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" required
                    style={{ height: 40, border: '1px solid #cfd9e1', borderRadius: 8, padding: '0 10px' }} />
                </label>
              </div>
            )}
            <div className="input-grid" style={{ gridTemplateColumns: '1fr', marginTop: 0, marginBottom: 12 }}>
              <label>Email
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required
                  style={{ height: 40, border: '1px solid #cfd9e1', borderRadius: 8, padding: '0 10px' }} />
              </label>
            </div>
            <div className="input-grid" style={{ gridTemplateColumns: '1fr', marginTop: 0 }}>
              <label>Password
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6}
                  style={{ height: 40, border: '1px solid #cfd9e1', borderRadius: 8, padding: '0 10px' }} />
              </label>
            </div>
            {error && <div className="form-error">{error}</div>}
            <button className="btn btn-primary btn-lg full" disabled={busy} style={{ marginTop: 16 }}>
              {busy ? (tab === 'login' ? 'Signing in…' : 'Creating account…') : (tab === 'login' ? 'Sign in' : 'Create account')}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};
