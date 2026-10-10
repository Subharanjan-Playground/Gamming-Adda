import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Station, BookingSession, BranchId } from '../types';

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  selectedBranch: BranchId;
  setSelectedBranch: (branch: BranchId) => void;
  stations: Station[];
  setStations: React.Dispatch<React.SetStateAction<Station[]>>;
  bookingHistory: BookingSession[];
  setBookingHistory: React.Dispatch<React.SetStateAction<BookingSession[]>>;
  toast: { msg: string; type: 'success' | 'error' } | null;
  notify: (msg: string, type?: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_STATIONS: Station[] = [
  { id: 'A-PC-01', branch_id: 'shop_a', name: 'RTX 4080 Rig 01', station_type: 'pc', specs: 'i7-14700K • RTX 4080 • 280Hz', hourly_rate: 60, status: 'occupied', customer_name: 'Valkyrie_99', active_game: 'Valorant', seconds_remaining: 3120 },
  { id: 'A-PC-02', branch_id: 'shop_a', name: 'RTX 4080 Rig 02', station_type: 'pc', specs: 'i7-14700K • RTX 4080 • 280Hz', hourly_rate: 60, status: 'available', seconds_remaining: 0 },
  { id: 'A-PC-03', branch_id: 'shop_a', name: 'RTX 4070Ti Rig 03', station_type: 'pc', specs: 'Ryzen 7 7800X3D • 240Hz', hourly_rate: 60, status: 'available', seconds_remaining: 0 },
  { id: 'A-PS-01', branch_id: 'shop_a', name: 'PS5 VIP Lounge 01', station_type: 'ps', specs: 'PS5 Slim • 65" 4K OLED • DualSense Duo', hourly_rate: 80, status: 'available', seconds_remaining: 0 },
  { id: 'A-PS-02', branch_id: 'shop_a', name: 'PS5 VIP Lounge 02', station_type: 'ps', specs: 'PS5 Slim • 65" 4K OLED • Surround 7.1', hourly_rate: 80, status: 'occupied', customer_name: 'Striker_Pro', active_game: 'EA Sports FC 26', seconds_remaining: 4200 },
  { id: 'B-PC-01', branch_id: 'shop_b', name: 'Titan Arena Rig 01', station_type: 'pc', specs: 'i9-14900KF • RTX 4090 • 360Hz', hourly_rate: 60, status: 'available', seconds_remaining: 0 },
  { id: 'B-PS-01', branch_id: 'shop_b', name: 'PS5 Stadium Pod 01', station_type: 'ps', specs: 'PS5 Pro • 75" Mini-LED Suite', hourly_rate: 80, status: 'available', seconds_remaining: 0 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<BranchId>('shop_a');
  const [stations, setStations] = useState<Station[]>(INITIAL_STATIONS);
  const [bookingHistory, setBookingHistory] = useState<BookingSession[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const notify = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setStations((prev) =>
        prev.map((s) => {
          if (s.status === 'occupied' && s.seconds_remaining > 0) {
            const next = s.seconds_remaining - 1;
            if (next <= 0) {
              return { ...s, status: 'available', customer_name: null, active_game: null, seconds_remaining: 0 };
            }
            return { ...s, seconds_remaining: next };
          }
          return s;
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        selectedBranch,
        setSelectedBranch,
        stations,
        setStations,
        bookingHistory,
        setBookingHistory,
        toast,
        notify,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};