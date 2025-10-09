interface user {
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
}

export interface VolunteerResponse {
  created_at: string;
  updated_at: string;
  id: number;
  users: user;
  phone: string
}
