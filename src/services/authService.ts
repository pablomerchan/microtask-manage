import { User, AuthResponse } from '../types';

// MOCK CONSTANTS
const DELAY_MS = 600;
const STORAGE_USERS_KEY = 'micro_users';
const STORAGE_SESSION_KEY = 'micro_session';

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const authService = {
  /**
   * Register a new user.
   * Simulates POST /api/v1/auth/register
   */
  register: async (username: string, fullName: string, password: string): Promise<AuthResponse> => {
    await delay(DELAY_MS);
    
    const usersRaw = localStorage.getItem(STORAGE_USERS_KEY);
    const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];

    if (users.find((u) => u.username === username)) {
      throw new Error('El nombre de usuario ya existe.');
    }

    const newUser = {
      id: crypto.randomUUID(),
      username,
      fullName,
      password, // In a real app, this would be hashed on the backend
    };

    users.push(newUser);
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

    const response: AuthResponse = {
      user: { id: newUser.id, username: newUser.username, fullName: newUser.fullName },
      token: `mock-jwt-${Date.now()}`
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(response));
    return response;
  },

  /**
   * Authenticate a user.
   * Simulates POST /api/v1/auth/login
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    await delay(DELAY_MS);

    const usersRaw = localStorage.getItem(STORAGE_USERS_KEY);
    const users: any[] = usersRaw ? JSON.parse(usersRaw) : [];

    const foundUser = users.find(u => u.username === username && u.password === password);

    if (!foundUser) {
      throw new Error('Credenciales inválidas.');
    }

    const response: AuthResponse = {
      user: { id: foundUser.id, username: foundUser.username, fullName: foundUser.fullName },
      token: `mock-jwt-${Date.now()}`
    };

    localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(response));
    return response;
  },

  /**
   * Get current session.
   * Simulates checking HTTP Only cookie or local storage token
   */
  getSession: (): AuthResponse | null => {
    const session = localStorage.getItem(STORAGE_SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  logout: async (): Promise<void> => {
    await delay(200);
    localStorage.removeItem(STORAGE_SESSION_KEY);
  }
};