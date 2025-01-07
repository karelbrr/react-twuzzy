interface ChatMember {
  user_id: string;
  profiles: Profiles
}


interface Profiles {
  first_name: string;
  last_name: string;
  avatar: string
}
export interface ChatRequest {
  id: string;
  created_at: string;
  is_group: boolean;
  updated_at: string;
  is_started: boolean;
  created_by: string;
  chat_members: ChatMember[];
  profiles: Profiles;
}

export interface User {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  avatar: string;
  desc: string;
  username: string;
}
