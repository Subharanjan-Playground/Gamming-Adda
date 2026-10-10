import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface LoginPageProps {
  onGoToSignUp: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToSignUp }) => {
  const { setUser, notify } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      notify('Please enter both email and password', 'error');
      return;
    }
    // Simulation / API placeholder
    setUser({
      id: 'USR-8821',
      name: 'Kachi UI',
      gamer_tag: email.split('@')[0],
      email: email.trim(),
      phone: '+91 98192 83746',
      pass_type: '15_days',
      pass_start_date: 'Oct 05, 2026',
      pass_end_date: 'Oct 20, 2026',
      days_remaining: 10,
      hours_remaining: 21.5,
      sessions_completed: 18,
    });
    notify('Welcome back to your gaming space!', 'success');
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.icon}>🎮</div>
        <h2 style={styles.title}>CYBER <span style={{ color: '#0066FF' }}>ZONE</span></h2>
        <p style={styles.subtitle}>Sign in to your personal gamer dashboard</p>

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={styles.submitBtn}>
            ⚡ Sign In to My Space
          </button>
        </form>

        <div style={styles.footerRow}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>Don't have an account? </span>
          <button style={styles.linkBtn} onClick={onGoToSignUp}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    padding: 16,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  box: {
    maxWidth: 380,
    width: '100%',
    background: '#ffffff',
    borderRadius: 20,
    padding: 26,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    textAlign: 'center',
  },
  icon: { fontSize: 40, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: 900, color: '#111827', margin: '4px 0' },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 12 },
  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 10,
    border: '1px solid #e2e8f0',
    fontSize: 13,
    outline: 'none',
    boxSizing: 'border-box',
    background: '#f8fafc',
  },
  submitBtn: {
    background: '#0066FF',
    color: '#ffffff',
    border: 'none',
    padding: 12,
    borderRadius: 12,
    fontWeight: 900,
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 4,
  },
  footerRow: { marginTop: 18 },
  linkBtn: {
    background: 'transparent',
    border: 'none',
    color: '#0066FF',
    fontWeight: 800,
    fontSize: 13,
    cursor: 'pointer',
  },
};