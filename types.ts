export interface User {
  id: string;
  username: string;
  fullName: string;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string; // Simulated JWT
}

export interface ApiError {
  message: string;
}