import React from 'react';

interface TimeWheelPickerProps {
  pickerHour: number;
  setPickerHour: (h: number) => void;
  pickerMinute: string;
  setPickerMinute: (m: string) => void;
  pickerPeriod: 'am' | 'pm';
  setPickerPeriod: (p: 'am' | 'pm') => void;
  onDone: () => void;
}

export const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({
  pickerHour,
  setPickerHour,
  pickerMinute,
  setPickerMinute,
  pickerPeriod,
  setPickerPeriod,
  onDone,
}) => {
  const applyPreset = (h: number, p: 'am' | 'pm') => {
    setPickerHour(h);
    setPickerMinute('00');
    setPickerPeriod(p);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>Time</div>

      {/* Drum-Wheel with center selection band */}
      <div style={styles.wheelContainer}>
        <div style={styles.selectionBand} />

        {/* Hour Column */}
        <div style={styles.column}>
          {[pickerHour - 2, pickerHour - 1, pickerHour, pickerHour + 1, pickerHour + 2].map((h, i) => {
            const displayH = ((h - 1 + 12) % 12) + 1;
            const isCenter = i === 2;
            return (
              <div
                key={i}
                style={{ ...styles.item, ...(isCenter ? styles.itemCenter : styles.itemFaded) }}
                onClick={() => setPickerHour(displayH)}
              >
                {displayH}
              </div>
            );
          })}
        </div>

        <div style={styles.colon}>:</div>

        {/* Minute Column */}
        <div style={styles.column}>
          {['45', '59', pickerMinute, '01', '15'].map((m, i) => {
            const isCenter = i === 2;
            return (
              <div
                key={i}
                style={{ ...styles.item, ...(isCenter ? styles.itemCenter : styles.itemFaded) }}
                onClick={() => setPickerMinute(m === '45' || m === '15' ? m : '00')}
              >
                {m}
              </div>
            );
          })}
        </div>

        {/* AM / PM Column */}
        <div style={styles.column}>
          {['', '', pickerPeriod, '', ''].map((p, i) => {
            const isCenter = i === 2;
            return (
              <div
                key={i}
                style={{
                  ...styles.item,
                  ...(isCenter ? styles.itemCenter : styles.itemFaded),
                  fontSize: isCenter ? 20 : 16,
                }}
                onClick={() => setPickerPeriod(pickerPeriod === 'am' ? 'pm' : 'am')}
              >
                {isCenter ? p : pickerPeriod === 'am' ? 'pm' : 'am'}
              </div>
            );
          })}
        </div>
      </div>

      {/* Presets Bar */}
      <div style={{ marginTop: 18 }}>
        <div style={styles.presetLabel}>Presets</div>
        <div style={styles.presetsRow}>
          <button
            style={{ ...styles.presetPill, ...(pickerHour === 9 && pickerPeriod === 'am' ? styles.presetActive : {}) }}
            onClick={() => applyPreset(9, 'am')}
          >
            9 am
          </button>
          <button
            style={{ ...styles.presetPill, ...(pickerHour === 12 && pickerPeriod === 'pm' ? styles.presetActive : {}) }}
            onClick={() => applyPreset(12, 'pm')}
          >
            12 pm
          </button>
          <button
            style={{ ...styles.presetPill, ...(pickerHour === 4 && pickerPeriod === 'pm' ? styles.presetActive : {}) }}
            onClick={() => applyPreset(4, 'pm')}
          >
            4 pm
          </button>
          <button
            style={{ ...styles.presetPill, ...(pickerHour === 6 && pickerPeriod === 'pm' ? styles.presetActive : {}) }}
            onClick={() => applyPreset(6, 'pm')}
          >
            6 pm
          </button>
        </div>
      </div>

      {/* Done Button */}
      <button style={styles.doneBtn} onClick={onDone}>
        Done
      </button>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  wrapper: { textAlign: 'center', marginTop: 10 },
  title: { fontSize: 17, fontWeight: 900, color: '#111827', marginBottom: 10 },
  wheelContainer: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 140,
    gap: 16,
    overflow: 'hidden',
  },
  selectionBand: {
    position: 'absolute',
    left: '18%',
    right: '18%',
    top: '35%',
    height: 42,
    background: '#f3f4f6',
    borderRadius: 12,
    zIndex: 1,
  },
  column: { display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 },
  item: { height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  itemCenter: { fontSize: 26, fontWeight: 900, color: '#111827' },
  itemFaded: { fontSize: 16, fontWeight: 700, color: '#9ca3af', opacity: 0.5 },
  colon: { fontSize: 24, fontWeight: 900, color: '#111827', zIndex: 2, paddingBottom: 4 },
  presetLabel: { fontSize: 11, fontWeight: 800, color: '#6b7280', marginBottom: 6, textAlign: 'left' },
  presetsRow: { display: 'flex', gap: 8, overflowX: 'auto' },
  presetPill: {
    padding: '8px 14px',
    borderRadius: 12,
    background: '#ffffff',
    border: '1.5px solid #e5e7eb',
    color: '#1f2937',
    fontSize: 13,
    fontWeight: 800,
    cursor: 'pointer',
  },
  presetActive: { borderColor: '#0066FF', color: '#0066FF', background: '#eff6ff' },
  doneBtn: {
    width: '100%',
    background: '#0066FF',
    color: '#ffffff',
    border: 'none',
    padding: '12px 0',
    borderRadius: 14,
    fontSize: 15,
    fontWeight: 900,
    cursor: 'pointer',
    marginTop: 18,
  },
};