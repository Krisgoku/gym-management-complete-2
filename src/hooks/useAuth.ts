import { create } from 'zustand';
import api from '@/services/api';
import { toast } from 'sonner';

interface AuthState {
  token: string | null;
  user: any | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isLoading: false,

  signIn: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, isLoading: false });
      
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error('Invalid credentials');
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (data) => {
    try {
      set({ isLoading: true });
      const response = await api.post('/auth/register', data);
      const { token } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, isLoading: false });
      
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error('Failed to create account');
      set({ isLoading: false });
      throw error;
    }
  },

  signOut: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
    window.location.href = '/auth/signin';
  },
}));