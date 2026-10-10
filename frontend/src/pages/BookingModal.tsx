import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PlatformType, Game, Station, BookingSession } from '../types';
import { TimeWheelPicker } from '../components/TimeWheelPicker';

interface BookingModalProps {
  platform: PlatformType;
  games: Game[];
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ platform, games, onClose }) => {
  const { user, setUser, selectedBranch, stations, setStations, bookingHistory, setBookingHistory, notify } = useApp();

  const [selectedGame, setSelectedGame] = useState<Game>(games[0]);
  const [dateType, setDateType] = useState<'today' | 'tomorrow' | 'other'>('today');
  const [customDate, setCustomDate] = useState('2026-10-12');

  const [pickerHour, setPickerHour] = useState(9);
  const [pickerMinute, setPickerMinute] = useState('00');
  const [pickerPeriod, setPickerPeriod] = useState<'am' | 'pm'>('am');
  const [duration, setDuration] = useState(2);

  const availableStations = stations.filter(
    (s) => s.branch_id === selectedBranch && s.station_type === (platform === 'PC' ? 'pc' : 'ps')
  );
  const [selectedStationId, setSelectedStationId] = useState(availableStations[0]?.id || '');
  const [applyPass, setApplyPass] = useState(false);

  const formattedStartTime = `${pickerHour}:${pickerMinute} ${pickerPeriod.toUpperCase()}`;
  const endHour = (pickerHour % 12) + (pickerPeriod === 'pm' ? 12 : 0) + duration;
  const formattedEndTime = `${((endHour - 1) % 12) + 1}:${pickerMinute} ${endHour >= 12 && endHour < 24 ? 'PM' : 'AM'}`;

  const activeDateText = dateType === 'today' ? 'Today' : dateType === 'tomorrow' ? 'Tomorrow' : customDate;

  const handleConfirm = () => {
    if (!user) return;
    const station = stations.find((s) => s.id === selectedStationId);
    if (!station) return;

    let cost = station.hourly_rate * duration;
    if (applyPass) {
      if (!user.pass_type || user.days_remaining <= 0 || user.hours_remaining < duration) {
        notify('Insufficient pass hours!', 'error');
        return;
      }
      setUser({
        ...user,
        hours_remaining: user.hours_remaining - duration,
        sessions_completed: user.sessions_completed + 1,
      });
      cost = 0;
    }

    const newSession: BookingSession = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      platform,
      station_id: station.id,
      station_name: station.name,
      game_title: selectedGame.title,
      date: activeDateText,
      start_time: formattedStartTime,
      end_time: formattedEndTime,
      duration_hours: duration,
      snacks_summary: 'None yet (Order from Sessions)',
      total_paid: cost,
      used_pass: applyPass,
      status: dateType === 'today' && pickerPeriod === 'am' && pickerHour <= 10 ? 'Active' : 'Upcoming',
    };

    setBookingHistory([newSession, ...bookingHistory]);

    if (newSession.status === 'Active') {
      setStations((prev) =>
        prev.map((s) =>
          s.id === station.id
            ? { ...s, status: 'occupied', customer_name: user.gamer_tag, active_game: selectedGame.title, seconds_remaining: duration * 3600 }
            : s
        )
      );
    }

    notify(`Reserved ${station.name} for ${selectedGame.title} at ${formattedStartTime}!`, 'success');
    onClose();
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.sheet}>
        <div style={styles.header}>
          <div>
            <span style={styles.platformBadge}>{platform} BOOKING</span>
            <h3 style={{ fontSize: 17, fontWeight: 900, margin: '4px 0 0 0' }}>Reserve Gaming Session</h3>
          </div>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div style={styles.content}>
          {/* 1. Games Carousel */}
          <div>
            <div style={styles.stepTitle}>1. SELECT GAME</div>
            <div style={styles.carousel}>
              {games.map((g) => {
                const active = selectedGame.id === g.id;
                return (
                  <div
                    key={g.id}
                    style={{ ...styles.gameCard, ...(active ? styles.gameCardActive : {}) }}
                    onClick={() => setSelectedGame(g)}
                  >
                    <div style={{ fontSize: 24 }}>{g.icon}</div>
                    <div style={{ fontSize: 12, fontWeight: 800, marginTop: 4, color: active ? '#0066FF' : '#111827' }}>{g.title}</div>
                    <div style={{ fontSize: 10, color: '#6b7280' }}>{g.genre}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Date Selection */}
          <div style={{ marginTop: 12 }}>
            <div style={styles.stepTitle}>2. CHOOSE DATE</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              {(['today', 'tomorrow', 'other'] as const).map((d) => (
                <button
                  key={d}
                  style={{ ...styles.dateBtn, ...(dateType === d ? styles.dateBtnActive : {}) }}
                  onClick={() => setDateType(d)}
                >
                  {d === 'today' ? 'Today' : d === 'tomorrow' ? 'Tomorrow' : 'Other Date'}
                </button>
              ))}
            </div>
            {dateType === 'other' && (
              <input
                type="date"
                style={styles.dateInput}
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            )}
          </div>

          {/* 3. Time Picker (Drum-Wheel Component) */}
          <TimeWheelPicker
            pickerHour={pickerHour}
            setPickerHour={setPickerHour}
            pickerMinute={pickerMinute}
            setPickerMinute={setPickerMinute}
            pickerPeriod={pickerPeriod}
            setPickerPeriod={setPickerPeriod}
            onDone={handleConfirm}
          />

          {/* 4. Desk Picker */}
          <div style={{ marginTop: 14 }}>
            <div style={styles.stepTitle}>4. SELECT DESK</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
              {availableStations.map((st) => (
                <label
                  key={st.id}
                  style={{ ...styles.deskRow, ...(selectedStationId === st.id ? styles.deskRowActive : {}) }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      type="radio"
                      name="station"
                      checked={selectedStationId === st.id}
                      onChange={() => setSelectedStationId(st.id)}
                    />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 900 }}>{st.name} ({st.id})</div>
                      <div style={{ fontSize: 11, color: '#6b7280' }}>{st.specs}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#0066FF' }}>₹{st.hourly_rate}/hr</span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Redeem Pass */}
          {user?.pass_type && user.days_remaining > 0 && (
            <div style={styles.passBox}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer', color: '#0f766e', fontWeight: 800 }}>
                <input type="checkbox" checked={applyPass} onChange={(e) => setApplyPass(e.target.checked)} />
                Apply Active Pass ({user.hours_remaining} hrs left)
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  backdrop: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 1000 },
  sheet: { background: '#ffffff', borderRadius: '24px 24px 0 0', maxWidth: 540, width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  platformBadge: { background: '#e0f2fe', color: '#0284c7', fontSize: 10, fontWeight: 900, padding: '2px 6px', borderRadius: 4 },
  closeBtn: { background: '#f1f5f9', border: 'none', width: 28, height: 28, borderRadius: 14, cursor: 'pointer', fontWeight: 900 },
  content: { padding: 16, overflowY: 'auto' },
  stepTitle: { fontSize: 11, fontWeight: 900, color: '#0066FF', letterSpacing: 0.5 },
  carousel: { display: 'flex', gap: 8, overflowX: 'auto', padding: '6px 0' },
  gameCard: { minWidth: 110, padding: 8, borderRadius: 12, border: '1.5px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer', textAlign: 'center' },
  gameCardActive: { borderColor: '#0066FF', background: '#eff6ff' },
  dateBtn: { flex: 1, padding: '8px 0', borderRadius: 20, background: '#f1f5f9', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 11, fontWeight: 800, cursor: 'pointer' },
  dateBtnActive: { background: '#0066FF', color: '#ffffff', borderColor: '#0066FF' },
  dateInput: { width: '100%', padding: 8, borderRadius: 8, border: '1px solid #d1d5db', fontSize: 12, marginTop: 8, boxSizing: 'border-box' },
  deskRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 10, border: '1px solid #e2e8f0', background: '#f8fafc', cursor: 'pointer' },
  deskRowActive: { borderColor: '#0066FF', background: '#eff6ff' },
  passBox: { background: '#ccfbf1', border: '1px solid #99f6e4', padding: 10, borderRadius: 10, marginTop: 12 },
};