import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformType, Game } from '../types';
import { BookingModal } from './BookingModal';

const GAMES: Game[] = [
  { id: 'pc-1', title: 'Valorant', platform: 'PC', genre: 'Tactical Shooter', badge: 'TOP', icon: '🎯' },
  { id: 'pc-2', title: 'Counter-Strike 2', platform: 'PC', genre: 'Competitive FPS', badge: 'HOT', icon: '💣' },
  { id: 'pc-3', title: 'GTA V / FiveM', platform: 'PC', genre: 'Open World RPG', badge: 'POPULAR', icon: '🚗' },
  { id: 'ps-1', title: 'EA Sports FC 26', platform: 'PS5', genre: 'Football Sim', badge: 'HOT', icon: '⚽' },
  { id: 'ps-2', title: 'Tekken 8', platform: 'PS5', genre: 'Fighting Game', badge: 'TOP', icon: '🥊' },
  { id: 'ps-3', title: 'Spider-Man 2', platform: 'PS5', genre: 'Action Marvel', badge: 'POPULAR', icon: '🕸️' },
];

export const HomePage: React.FC = () => {
  const { user, selectedBranch, stations } = useApp();
  const [bookingPlatform, setBookingPlatform] = useState<PlatformType | null>(null);

  const branchStations = stations.filter((s) => s.branch_id === selectedBranch);

  return (
    <div>
      {/* Platform Pickers: PC vs PS5 */}
      <div style={styles.sectionTitle}>CHOOSE PLATFORM TO PLAY</div>
      <div style={styles.grid}>
        <div style={styles.platformCard} onClick={() => setBookingPlatform('PC')}>
          <div style={styles.icon}>🖥️</div>
          <h3 style={styles.cardTitle}>PC Gaming Rig</h3>
          <div style={styles.price}>₹60 / hour</div>
          <div style={styles.specs}>RTX 4080 • i7-14700K • 280Hz Display</div>
          <button style={styles.bookBtn}>Pick PC & Choose Time →</button>
        </div>

        <div style={styles.platformCard} onClick={() => setBookingPlatform('PS5')}>
          <div style={{ ...styles.icon, background: '#e0e7ff', color: '#4338ca' }}>🎮</div>
          <h3 style={styles.cardTitle}>PS5 VIP Lounge</h3>
          <div style={{ ...styles.price, color: '#4f46e5' }}>₹80 / hour</div>
          <div style={styles.specs}>PS5 Slim • 65" 4K OLED • DualSense</div>
          <button style={{ ...styles.bookBtn, background: '#4f46e5' }}>Pick PS5 & Choose Time →</button>
        </div>
      </div>

      {/* Station Fleet Overview */}
      <div style={{ marginTop: 20 }}>
        <div style={styles.sectionTitle}>AVAILABLE STATIONS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          {branchStations.map((st) => (
            <div key={st.id} style={styles.stationRow}>
              <div>
                <span style={st.station_type === 'pc' ? styles.pcTag : styles.psTag}>
                  {st.station_type.toUpperCase()}
                </span>
                <span style={{ fontSize: 14, fontWeight: 900, marginLeft: 6 }}>{st.name}</span>
                <div style={{ fontSize: 11, color: '#6b7280' }}>{st.specs}</div>
              </div>
              <button
                style={st.status === 'available' ? styles.stationBtn : styles.stationBtnBusy}
                onClick={() => setBookingPlatform(st.station_type === 'pc' ? 'PC' : 'PS5')}
                disabled={st.status !== 'available'}
              >
                {st.status === 'available' ? 'Book' : 'Playing'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Booking Modal */}
      {bookingPlatform && (
        <BookingModal
          platform={bookingPlatform}
          games={GAMES.filter((g) => g.platform === bookingPlatform)}
          onClose={() => setBookingPlatform(null)}
        />
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  sectionTitle: { fontSize: 11, fontWeight: 900, color: '#64748b', letterSpacing: 0.6 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 },
  platformCard: { background: '#ffffff', borderRadius: 16, padding: 14, boxShadow: '0 4px 12px rgba(0,0,0,0.04)', cursor: 'pointer' },
  icon: { width: 38, height: 38, borderRadius: 10, background: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 },
  cardTitle: { fontSize: 16, fontWeight: 900, color: '#111827', margin: '6px 0 2px 0' },
  price: { fontSize: 12, color: '#0066FF', fontWeight: 800 },
  specs: { fontSize: 11, color: '#6b7280', marginTop: 4 },
  bookBtn: { background: '#0066FF', color: '#ffffff', border: 'none', borderRadius: 20, padding: '8px 0', fontSize: 11, fontWeight: 900, marginTop: 10, width: '100%', cursor: 'pointer' },
  stationRow: { background: '#ffffff', borderRadius: 14, padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' },
  pcTag: { background: '#e0f2fe', color: '#0284c7', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4 },
  psTag: { background: '#e0e7ff', color: '#4338ca', fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4 },
  stationBtn: { background: '#0066FF', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' },
  stationBtnBusy: { background: '#f3f4f6', color: '#9ca3af', border: 'none', padding: '6px 14px', borderRadius: 8, fontSize: 11, fontWeight: 800 },
};