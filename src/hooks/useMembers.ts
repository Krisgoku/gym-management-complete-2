import { create } from 'zustand';
import api from '@/services/api';

interface MembersState {
  members: any[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  getMember: (id: string) => Promise<any>;
  createMember: (data: any) => Promise<void>;
  updateMember: (id: string, data: any) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  updateMemberStatus: (id: string, status: string) => Promise<void>;
}

export const useMembers = create<MembersState>((set, get) => ({
  members: [],
  isLoading: false,
  error: null,

  fetchMembers: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/members');
      set({ members: response.data.content, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch members', isLoading: false });
    }
  },

  getMember: async (id) => {
    try {
      const response = await api.get(`/members/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Failed to fetch member');
    }
  },

  createMember: async (data) => {
    try {
      set({ isLoading: true });
      await api.post('/members', data);
      get().fetchMembers();
    } catch (error) {
      set({ error: 'Failed to create member', isLoading: false });
      throw error;
    }
  },

  updateMember: async (id, data) => {
    try {
      set({ isLoading: true });
      await api.put(`/members/${id}`, data);
      get().fetchMembers();
    } catch (error) {
      set({ error: 'Failed to update member', isLoading: false });
      throw error;
    }
  },

  deleteMember: async (id) => {
    try {
      set({ isLoading: true });
      await api.delete(`/members/${id}`);
      get().fetchMembers();
    } catch (error) {
      set({ error: 'Failed to delete member', isLoading: false });
      throw error;
    }
  },

  updateMemberStatus: async (id, status) => {
    try {
      set({ isLoading: true });
      await api.patch(`/members/${id}/status`, { status });
      get().fetchMembers();
    } catch (error) {
      set({ error: 'Failed to update member status', isLoading: false });
      throw error;
    }
  },
}));