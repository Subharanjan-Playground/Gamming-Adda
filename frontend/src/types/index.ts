export type PlatformType = 'PC' | 'PS5';
export type BranchId = 'shop_a' | 'shop_b';

export interface UserProfile {
  id: string;
  name: string;
  gamer_tag: string;
  email: string;
  phone: string;
  pass_type?: '15_days' | '30_days' | null;
  pass_start_date?: string | null;
  pass_end_date?: string | null;
  days_remaining: number;
  hours_remaining: number;
  sessions_completed: number;
}

export interface Game {
  id: string;
  title: string;
  platform: PlatformType;
  genre: string;
  badge?: string;
  icon: string;
}

export interface Station {
  id: string;
  branch_id: BranchId;
  name: string;
  station_type: 'pc' | 'ps';
  specs: string;
  hourly_rate: number;
  status: 'available' | 'occupied';
  customer_name?: string | null;
  active_game?: string | null;
  seconds_remaining: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  icon: string;
  desc: string;
}

export interface BookingSession {
  id: string;
  platform: PlatformType;
  station_id: string;
  station_name: string;
  game_title: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  snacks_summary: string;
  total_paid: number;
  used_pass: boolean;
  status: 'Active' | 'Upcoming' | 'Completed';
}