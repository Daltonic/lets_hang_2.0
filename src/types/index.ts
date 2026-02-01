export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at: string;
}