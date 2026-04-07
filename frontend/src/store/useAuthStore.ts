import { create } from 'zustand';
import type { User, AuthResponse } from '../types';
import api from '../api/client';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem('accessToken'),
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  login: async (email, password) => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    set({ isAuthenticated: true });
  },
  register: async (name, email, password) => {
    const res = await api.post<AuthResponse>('/auth/register', { name, email, password });
    localStorage.setItem('accessToken', res.data.accessToken);
    localStorage.setItem('refreshToken', res.data.refreshToken);
    set({ isAuthenticated: true });
  },
  logout: () => {
    const rf = localStorage.getItem('refreshToken');
    if (rf) api.post('/auth/logout', { refreshToken: rf });
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    set({ user: null, isAuthenticated: false });
  }
}));
