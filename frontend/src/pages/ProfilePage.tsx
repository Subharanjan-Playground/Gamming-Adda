import React from 'react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { user } = useApp();

  return (
    <div>
      <div style={styles.card}>
        <div style={styles.avatar}>{user?.gamer_tag[0]}</div>
        <h2 style={styles.tag}>{user?.gamer_tag}</h2>
        <div style={styles.name}>{user?.name}</div>
        <div style={styles.rides}>Sessions Completed: {user?.sessions_completed} 🎮</div>

        <hr style={styles.hr} />

        <div style={styles.row}><span>📞</span><span>{user?.phone}</span></div>
        <div style={styles.row}><span>✉️</span><span>{user?.email}</span></div>
        <div style={styles.row}><span>💳</span><span>UPI & Net Banking Active</span></div>
      </div>

      {/* Active Pass Section with Days Left */}
      <div style={{ ...styles.card, marginTop: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 900, color: '#0066FF' }}>MEMBERSHIP PASS STATUS</span>
          {user?.pass_type && <span style={styles.activePill}>ACTIVE PASS</span>}
        </div>

        {user?.pass_type ? (
          <div style={{ marginTop: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 900 }}>
              {user.pass_type === '15_days' ? '15-Day Pass' : '30-Day Monthly Pass'}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
              <div style={styles.counter}>
                <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 800 }}>DAYS REMAINING</span>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#059669' }}>{user.days_remaining}</div>
                <span style={{ fontSize: 10, color: '#059669' }}>Days until renewal</span>
              </div>
              <div style={styles.counter}>
                <span style={{ fontSize: 10, color: '#6b7280', fontWeight: 800 }}>PLAYTIME BALANCE</span>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#d97706' }}>{user.hours_remaining}</div>
                <span style={{ fontSize: 10, color: '#d97706' }}>Hours available</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ color: '#6b7280', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
            No active pass on this profile.
          </div>
        )}
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: { background: '#ffffff', borderRadius: 18, padding: 18, boxShadow: '0 4px 16px rgba(0,0,0,0.05)', textAlign: 'center' },
  avatar: { width: 68, height: 68, borderRadius: 34, background: '#0066FF', color: '#fff', fontSize: 28, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' },
  tag: { fontSize: 20, fontWeight: 900, margin: '8px 0 2px 0' },
  name: { fontSize: 13, color: '#6b7280' },
  rides: { fontSize: 12, color: '#0066FF', fontWeight: 800, marginTop: 4 },
  hr: { border: 'none', borderTop: '1px solid #f1f5f9', margin: '14px 0' },
  row: { display: 'flex', gap: 10, alignItems: 'center', padding: '6px 0', fontSize: 13, color: '#374151' },
  activePill: { background: '#ccfbf1', color: '#0f766e', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 10 },
  counter: { background: '#f8fafc', padding: 10, borderRadius: 12 },
};