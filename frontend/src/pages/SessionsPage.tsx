import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BookingSession, MenuItem } from '../types';

const SNACKS: MenuItem[] = [
  { id: 'snk-1', name: 'Red Bull Energy 250ml', price: 125, icon: '⚡', desc: 'Chilled energy boost' },
  { id: 'snk-2', name: 'Monster Energy 350ml', price: 120, icon: '⚡', desc: 'Original claw blend' },
  { id: 'snk-3', name: 'Cheese Butter Maggi', price: 75, icon: '🧀', desc: 'Loaded mozzarella butter' },
  { id: 'snk-4', name: 'Classic Maggi Masala', price: 50, icon: '🍜', desc: 'Double spicy noodles' },
  { id: 'snk-5', name: 'Cold Coffee Frappe', price: 90, icon: '☕', desc: 'Creamy iced coffee' },
];

export const SessionsPage: React.FC = () => {
  const { bookingHistory, setBookingHistory, notify } = useApp();
  const [activeSession, setActiveSession] = useState<BookingSession | null>(null);
  const [cart, setCart] = useState<Record<string, number>>({});

  const handleOrderSnacks = () => {
    if (!activeSession) return;
    const summary = Object.entries(cart)
      .filter(([_, q]) => q > 0)
      .map(([id, q]) => `${SNACKS.find((s) => s.id === id)?.name} (x${q})`)
      .join(', ');

    if (!summary) {
      notify('Select at least one snack item!', 'error');
      return;
    }

    setBookingHistory((prev) =>
      prev.map((s) =>
        s.id === activeSession.id
          ? {
              ...s,
              snacks_summary: s.snacks_summary === 'None yet (Order from Sessions)'
                ? summary
                : `${s.snacks_summary}, ${summary}`,
            }
          : s
      )
    );

    notify(`Snack order sent to kitchen! Delivering to desk ${activeSession.station_id}. 🍿`, 'success');
    setActiveSession(null);
  };

  return (
    <div>
      <div style={styles.title}>MY GAMING SESSIONS ({bookingHistory.length})</div>
      <p style={styles.subtitle}>Order food & drinks directly to your chair while gaming!</p>

      {bookingHistory.length === 0 ? (
        <div style={styles.empty}>No bookings yet. Go to Home to pick a station & game!</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {bookingHistory.map((b) => (
            <div key={b.id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={styles.tag}>{b.platform}</span>
                <span style={b.status === 'Active' ? styles.statusActive : styles.statusUpcoming}>{b.status}</span>
              </div>
              <div style={styles.name}>{b.station_name} ({b.station_id})</div>
              <div style={styles.game}>🎮 {b.game_title}</div>
              <div style={styles.time}>📅 {b.date} • ⏰ {b.start_time} - {b.end_time} ({b.duration_hours}h)</div>
              <div style={styles.snackInfo}>🍿 Snacks on Desk: <strong>{b.snacks_summary}</strong></div>

              <div style={styles.footerRow}>
                <span style={styles.cost}>{b.used_pass ? 'Pass Applied' : `₹${b.total_paid}`}</span>
                <button
                  style={styles.orderBtn}
                  onClick={() => {
                    setActiveSession(b);
                    setCart({});
                  }}
                >
                  + Order Snacks to Desk {b.station_id}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-Session Snack Tray Modal */}
      {activeSession && (
        <div style={styles.modalBackdrop}>
          <div style={styles.modalSheet}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: 16 }}>Order to Desk {activeSession.station_id}</h3>
              <button style={styles.closeBtn} onClick={() => setActiveSession(null)}>✕</button>
            </div>
            <div style={styles.modalBody}>
              {SNACKS.map((it) => {
                const count = cart[it.id] || 0;
                return (
                  <div key={it.id} style={styles.snackRow}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span style={{ fontSize: 24 }}>{it.icon}</span>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 800 }}>{it.name}</div>
                        <div style={{ fontSize: 11, color: '#059669', fontWeight: 800 }}>₹{it.price}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button style={styles.qtyBtn} onClick={() => setCart({ ...cart, [it.id]: Math.max(0, count - 1) })}>-</button>
                      <span style={{ fontSize: 13, fontWeight: 900 }}>{count}</span>
                      <button style={{ ...styles.qtyBtn, background: '#0066FF', color: '#fff' }} onClick={() => setCart({ ...cart, [it.id]: count + 1 })}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={styles.modalFooter}>
              <button style={styles.cancelBtn} onClick={() => setActiveSession(null)}>Cancel</button>
              <button style={styles.deliverBtn} onClick={handleOrderSnacks}>Deliver to Desk →</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  title: { fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: 0.6 },
  subtitle: { fontSize: 12, color: '#6b7280', margin: '4px 0 14px 0' },
  empty: { background: '#ffffff', borderRadius: 14, padding: 24, textAlign: 'center', color: '#94a3b8', fontSize: 13 },
  card: { background: '#ffffff', borderRadius: 16, padding: 16, boxShadow: '0 4px 16px rgba(0,0,0,0.04)' },
  tag: { background: '#e0f2fe', color: '#0284c7', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4 },
  statusActive: { background: '#dcfce7', color: '#15803d', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 12 },
  statusUpcoming: { background: '#e0e7ff', color: '#4338ca', fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 12 },
  name: { fontSize: 16, fontWeight: 900, color: '#111827', marginTop: 6 },
  game: { fontSize: 13, color: '#0066FF', fontWeight: 800 },
  time: { fontSize: 12, color: '#6b7280', marginTop: 4 },
  snackInfo: { fontSize: 11, color: '#4b5563', background: '#f8fafc', padding: '6px 8px', borderRadius: 8, marginTop: 8 },
  footerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTop: '1px solid #f3f4f6', paddingTop: 10 },
  cost: { fontSize: 13, fontWeight: 900, color: '#059669' },
  orderBtn: { background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' },
  modalBackdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 },
  modalSheet: { background: '#ffffff', borderRadius: '24px 24px 0 0', maxWidth: 540, width: '100%', padding: 16 },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  closeBtn: { background: '#f1f5f9', border: 'none', width: 28, height: 28, borderRadius: 14, cursor: 'pointer', fontWeight: 900 },
  modalBody: { display: 'flex', flexDirection: 'column', gap: 8 },
  snackRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: '#f8fafc', borderRadius: 10 },
  qtyBtn: { width: 26, height: 26, borderRadius: 8, border: 'none', background: '#e2e8f0', cursor: 'pointer', fontWeight: 900 },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 },
  cancelBtn: { background: 'transparent', border: '1px solid #cbd5e1', padding: '8px 12px', borderRadius: 8, cursor: 'pointer' },
  deliverBtn: { background: '#0066FF', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: 8, fontWeight: 900, cursor: 'pointer' },
};