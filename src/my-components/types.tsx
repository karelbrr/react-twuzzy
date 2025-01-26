export interface Badge {
  id: number;
  created_at: string;
  user_id: string;
  badge_id: number;
  badges: {
    id: number;
    name: string;
  }
}

export interface User {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  avatar: string;
  desc: string;
  username: string;
  badges: Badge[];
  is_private: boolean;
  data_sharing: boolean;
  activity_tracking: boolean;
}
