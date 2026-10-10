import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface SignUpPageProps {
  onGoToLogin: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onGoToLogin }) => {
  const { setUser, notify } = useApp();
  const [name, setName] = useState('');
  const [gamerTag, setGamerTag] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !gamerTag || !phone || !email || !password) {
      notify('Please fill out all registration fields', 'error');
      return;
    }
    setUser({
      id: `USR-${Date.now().toString().slice(-4)}`,
      name: name.trim(),
      gamer_tag: gamerTag.trim(),
      email: email.trim(),
      phone: phone.trim(),
      pass_type: null,
      days_remaining: 0,
      hours_remaining: 0,
      sessions_completed: 0,
    });
    notify(`Welcome, ${gamerTag}! Your space has been created.`, 'success');
  };

  return (
    <div style={styles.container}>
      <div style={styles.box}>
        <div style={styles.icon}>🚀</div>
        <h2 style={styles.title}>JOIN <span style={{ color: '#0066FF' }}>CYBER ZONE</span></h2>
        <p style={styles.subtitle}>Create your profile to book desks & buy passes</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Full Name (e.g. Saurabh Sharma)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            style={styles.input}
            placeholder="GamerTag / Nickname (e.g. Shadow_Ninja)"
            value={gamerTag}
            onChange={(e) => setGamerTag(e.target.value)}
          />
          <input
            style={styles.input}
            type="tel"
            placeholder="Mobile Number (e.g. +91 98192 83746)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
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
            placeholder="Choose Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" style={styles.submitBtn}>
            🎮 Create My Account & Enter
          </button>
        </form>

        <div style={styles.footerRow}>
          <span style={{ color: '#6b7280', fontSize: 13 }}>Already have an account? </span>
          <button style={styles.linkBtn} onClick={onGoToLogin}>
            Sign In
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
    maxWidth: 400,
    width: '100%',
    background: '#ffffff',
    borderRadius: 20,
    padding: 26,
    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
    textAlign: 'center',
  },
  icon: { fontSize: 38, marginBottom: 4 },
  title: { fontSize: 24, fontWeight: 900, color: '#111827', margin: '4px 0' },
  subtitle: { fontSize: 13, color: '#6b7280', marginBottom: 20 },
  form: { display: 'flex', flexDirection: 'column', gap: 11 },
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