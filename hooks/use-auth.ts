'use client';

import { create } from 'zustand';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
  tier: string;
  credits: number;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email, password) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    const data = await res.json();
    set({ user: data.user, isAuthenticated: true, isLoading: false });
  },

  register: async (email, password, name) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error);
    }

    const data = await res.json();
    set({ user: data.user, isAuthenticated: true, isLoading: false });
  },

  loginWithGoogle: async () => {
    window.location.href = '/api/auth/google';
  },

  logout: async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  refreshUser: async () => {
    try {
      const res = await fetch('/api/me');
      if (res.ok) {
        const data = await res.json();
        set({ user: data.user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));

export const useAuth = () => {
  const store = useAuthStore();
  return store;
};
