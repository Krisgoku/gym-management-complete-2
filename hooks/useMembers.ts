"use client";

import { create } from 'zustand';
import api from '@/lib/api';
import { toast } from 'sonner';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  membershipType: string;
  status: string;
  joinDate: string;
  photo: string;
  membershipExpiry: string;
}

interface MembersState {
  members: Member[];
  currentMember: Member | null;
  isLoading: boolean;
  error: string | null;
  fetchMembers: () => Promise<void>;
  fetchMemberById: (id: string) => Promise<void>;
  createMember: (data: Partial<Member>) => Promise<void>;
  updateMemberStatus: (id: string, status: string) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  clearError: () => void;
}

export const useMembers = create<MembersState>((set, get) => ({
  members: [],
  currentMember: null,
  isLoading: false,
  error: null,

  clearError: () => set({ error: null }),

  fetchMembers: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get('/api/members');
      set({ members: response.data.content || [], isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch members';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  fetchMemberById: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get(`/api/members/${id}`);
      set({ currentMember: response.data, isLoading: false });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch member details';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
    }
  },

  createMember: async (data: Partial<Member>) => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.post('/api/members', data);
      set((state) => ({
        members: [...state.members, response.data],
        isLoading: false
      }));
      toast.success('Member created successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create member';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error; // Re-throw for component-level handling
    }
  },

  updateMemberStatus: async (id: string, status: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.patch(`/api/members/${id}/status`, { status });
      
      set((state) => ({
        members: state.members.map((member) =>
          member.id === id ? { ...member, status } : member
        ),
        currentMember: state.currentMember?.id === id 
          ? { ...state.currentMember, status }
          : state.currentMember,
        isLoading: false
      }));
      
      toast.success('Member status updated successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update member status';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  },

  deleteMember: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/api/members/${id}`);
      
      set((state) => ({
        members: state.members.filter((member) => member.id !== id),
        isLoading: false
      }));
      
      toast.success('Member deleted successfully');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to delete member';
      set({ error: errorMessage, isLoading: false });
      toast.error(errorMessage);
      throw error;
    }
  }
}));