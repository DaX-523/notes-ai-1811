export interface Note {
  id: string;
  title: string;
  content: string;
  summary: string | null;
  created_at: string;
  user_id?: string;
}

export interface User {
  id: string;
  name: string;
}
