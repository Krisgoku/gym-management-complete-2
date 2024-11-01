import { create } from 'zustand';
import api from '@/services/api';

interface PaymentsState {
  payments: any[];
  isLoading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  createPayment: (data: any) => Promise<void>;
  updatePaymentStatus: (id: string, status: string) => Promise<void>;
  sendReminder: (id: string, type: 'email' | 'whatsapp') => Promise<void>;
  importPayments: (file: File) => Promise<void>;
  exportPayments: (filters: any) => Promise<void>;
}

export const usePayments = create<PaymentsState>((set, get) => ({
  payments: [],
  isLoading: false,
  error: null,

  fetchPayments: async () => {
    try {
      set({ isLoading: true });
      const response = await api.get('/payments');
      set({ payments: response.data.content, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch payments', isLoading: false });
    }
  },

  createPayment: async (data) => {
    try {
      set({ isLoading: true });
      await api.post('/payments', data);
      get().fetchPayments();
    } catch (error) {
      set({ error: 'Failed to create payment', isLoading: false });
      throw error;
    }
  },

  updatePaymentStatus: async (id, status) => {
    try {
      set({ isLoading: true });
      await api.patch(`/payments/${id}/status`, { status });
      get().fetchPayments();
    } catch (error) {
      set({ error: 'Failed to update payment status', isLoading: false });
      throw error;
    }
  },

  sendReminder: async (id, type) => {
    try {
      set({ isLoading: true });
      await api.post(`/reminders/${id}/${type}`);
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to send reminder', isLoading: false });
      throw error;
    }
  },

  importPayments: async (file) => {
    try {
      set({ isLoading: true });
      const formData = new FormData();
      formData.append('file', file);
      await api.post('/payments/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      get().fetchPayments();
    } catch (error) {
      set({ error: 'Failed to import payments', isLoading: false });
      throw error;
    }
  },

  exportPayments: async (filters) => {
    try {
      set({ isLoading: true });
      const response = await api.post('/payments/export', filters, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payments-${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      set({ isLoading: false });
    } catch (error) {
      set({ error: 'Failed to export payments', isLoading: false });
      throw error;
    }
  },
}));