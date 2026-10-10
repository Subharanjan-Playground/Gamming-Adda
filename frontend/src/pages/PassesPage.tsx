import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export const PassesPage: React.FC = () => {
  const { user, setUser, notify } = useApp();
  const [dateChoice, setDateChoice] = useState<'today' | 'tomorrow' | 'other'>('today');
  const [customDate, setCustomDate] = useState('2026-10-15');

  const buy = (type: '15_days' | '30_days') => {
    if (!user) return;
    const days = type === '15_days' ? 15 : 30;
    const hrs = type === '15_days' ? 30 : 75;
    const start = dateChoice === 'today' ? 'Today' : dateChoice === 'tomorrow' ? 'Tomorrow' : customDate;

    setUser({
      ...user,
      pass_type: type,
      pass_start_date: start,
      pass_end_date: `After ${days} Days`,
      days_remaining: days,
      hours_remaining: hrs,
    });
    notify(`Activated ${type === '15_days' ? '15-Day' : 'Monthly'} Pass starting ${start}!`, 'success');
  };

  return (
    <div>
      <div style={styles.title}>BUY GAMING PASS</div>
      <p style={styles.sub}>Choose activation start date to unlock discounted bulk hours.</p>

      {/* Date Choice */}
      <div style={styles.box}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#0066FF', marginBottom: 6 }}>SELECT START DATE</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {(['today', 'tomorrow', 'other'] as const).map((d) => (
            <button
              key={d}
              style={{ ...styles.pill, ...(dateChoice === d ? styles.pillActive : {}) }}
              onClick={() => setDateChoice(d)}
            >
              {d === 'today' ? 'Start Today' : d === 'tomorrow' ? 'Start Tomorrow' : 'Pick Date'}
            </button>
          ))}
        </div>
        {dateChoice === 'other' && (
          <input type="date" style={styles.input} value={customDate} onChange={(e) => setCustomDate(e.target.value)} />
        )}
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
        <div style={styles.passCard}>
          <span style={styles.badge}>15-DAY PASS</span>
          <div style={styles.price}>₹899</div>
          <div style={styles.perHr}>₹29.9 / hr (50% Off)</div>
          <div style={styles.details}>• 30 Hours Playtime<br />• Valid 15 Days<br />• PC & PS5</div>
          <button style={styles.buyBtn} onClick={() => buy('15_days')}>Buy 15-Day Pass</button>
        </div>

        <div style={{ ...styles.passCard, borderColor: '#0066FF' }}>
          <span style={{ ...styles.badge, background: '#0066FF', color: '#fff' }}>30-DAY MONTHLY</span>
          <div style={styles.price}>₹1,599</div>
          <div style={{ ...styles.perHr, color: '#0066FF' }}>₹21.3 / hr (65% Off)</div>
          <div style={styles.details}>• 75 Hours Playtime<br />• Valid 30 Days<br />• Priority Desk Booking</div>
          <button style={{ ...styles.buyBtn, background: '#0066FF' }} onClick={() => buy('30_days')}>Buy Monthly Pass</button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  title: { fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: 0.6 },
  sub: { fontSize: 12, color: '#6b7280', margin: '4px 0 12px 0' },
  box: { background: '#ffffff', borderRadius: 14, padding: 14, boxShadow: '0 2px 6px rgba(0,0,0,0.03)' },
  pill: { flex: 1, padding: '8px 0', borderRadius: 20, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, fontWeight: 800, cursor: 'pointer' },
  pillActive: { background: '#0066FF', color: '#fff', borderColor: '#0066FF' },
  input: { width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, marginTop: 8, boxSizing: 'border-box' },
  passCard: { background: '#ffffff', borderRadius: 16, padding: 14, border: '1.5px solid #e2e8f0', display: 'flex', flexDirection: 'column' },
  badge: { background: '#e0f2fe', color: '#0284c7', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4, alignSelf: 'flex-start' },
  price: { fontSize: 24, fontWeight: 900, margin: '6px 0 2px 0' },
  perHr: { fontSize: 11, color: '#059669', fontWeight: 800, marginBottom: 8 },
  details: { fontSize: 11, color: '#6b7280', lineHeight: 1.5, flex: 1 },
  buyBtn: { background: '#10b981', color: '#fff', border: 'none', padding: 8, borderRadius: 8, fontWeight: 900, fontSize: 12, marginTop: 10, cursor: 'pointer' },
};