import { create } from 'zustand';
import axios from 'axios';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string) => Promise<void>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  isAuthenticated: () => boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });
      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);
      set({ token: accessToken, loading: false });
      
      // Fetch current user
      const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      set({ user: userResponse.data });
    } catch (error) {
      set({ error: 'Login failed', loading: false });
      throw error;
    }
  },

  register: async (email: string, password: string, firstName?: string, lastName?: string) => {
    set({ loading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        email,
        password,
        firstName,
        lastName,
      });
      const { accessToken } = response.data;
      localStorage.setItem('token', accessToken);
      set({ token: accessToken, loading: false });
      
      // Fetch current user
      const userResponse = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      set({ user: userResponse.data });
    } catch (error) {
      set({ error: 'Registration failed', loading: false });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('selectedBrandId');
    set({ user: null, token: null });
  },

  getCurrentUser: async () => {
    set({ loading: true });
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ loading: false });
        return;
      }

      const response = await axios.get(`${API_URL}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ user: response.data, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user', loading: false });
      localStorage.removeItem('token');
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
}));
