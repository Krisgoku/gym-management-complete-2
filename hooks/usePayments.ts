"use client";

import { create } from 'zustand';
import { toast } from 'sonner';

interface PaymentFilters {
  memberName?: string;
  status?: string;
  dueDate?: Date;
  type?: string;
}

interface PaymentStats {
  totalDue: number;
  overdue: number;
  paid: number;
  pending: number;
  overdueCount: number;
  paidCount: number;
  pendingCount: number;
  dueTrend: string;
  overdueTrend: string;
  paidTrend: string;
  pendingTrend: string;
}

interface Payment {
  id: string;
  memberId: string;
  member: {
    name: string;
    email: string;
    phone: string;
  };
  amount: number;
  type: string;
  dueDate: string;
  status: 'pending' | 'paid' | 'overdue';
  description?: string;
  reminders?: {
    types: string[];
    days: number[];
  };
}

interface PaymentsState {
  payments: Payment[];
  filteredPayments: Payment[];
  filters: PaymentFilters;
  stats: PaymentStats | null;
  isLoading: boolean;
  error: string | null;
  fetchPayments: () => Promise<void>;
  fetchPaymentStats: () => Promise<void>;
  createPayment: (data: any) => Promise<void>;
  updatePaymentStatus: (id: string, status: string) => Promise<void>;
  sendReminder: (id: string, type: 'email' | 'whatsapp') => Promise<void>;
  setFilter: (key: keyof PaymentFilters, value: any) => void;
  clearFilters: () => void;
}

// Mock data
const mockPayments: Payment[] = [
  {
    id: "1",
    memberId: "1",
    member: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+1234567890"
    },
    amount: 99.99,
    type: "Monthly Membership",
    dueDate: "2024-04-01",
    status: "pending",
    reminders: {
      types: ["email", "whatsapp"],
      days: [3, 1, 0]
    }
  },
  {
    id: "2",
    memberId: "2",
    member: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+1234567891"
    },
    amount: 149.99,
    type: "Annual Membership",
    dueDate: "2024-03-25",
    status: "overdue",
    reminders: {
      types: ["email", "whatsapp"],
      days: [3, 1, 0]
    }
  }
];

const mockStats: PaymentStats = {
  totalDue: 2500,
  overdue: 500,
  paid: 1500,
  pending: 500,
  overdueCount: 5,
  paidCount: 15,
  pendingCount: 5,
  dueTrend: "+12%",
  overdueTrend: "-5%",
  paidTrend: "+8%",
  pendingTrend: "-2%"
};

export const usePayments = create<PaymentsState>((set, get) => ({
  payments: mockPayments,
  filteredPayments: mockPayments,
  filters: {},
  stats: mockStats,
  isLoading: false,
  error: null,

  fetchPayments: async () => {
    try {
      set({ isLoading: true });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ 
        payments: mockPayments, 
        filteredPayments: mockPayments,
        isLoading: false 
      });
    } catch (error) {
      set({ error: 'Failed to fetch payments', isLoading: false });
    }
  },

  fetchPaymentStats: async () => {
    try {
      set({ isLoading: true });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set({ stats: mockStats, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch payment stats', isLoading: false });
    }
  },

  createPayment: async (data) => {
    try {
      set({ isLoading: true });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newPayment = {
        id: Date.now().toString(),
        ...data,
        status: 'pending'
      };
      set(state => ({
        payments: [...state.payments, newPayment],
        filteredPayments: [...state.filteredPayments, newPayment],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create payment', isLoading: false });
    }
  },

  updatePaymentStatus: async (id, status) => {
    try {
      set({ isLoading: true });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      set(state => ({
        payments: state.payments.map(payment =>
          payment.id === id ? { ...payment, status } : payment
        ),
        filteredPayments: state.filteredPayments.map(payment =>
          payment.id === id ? { ...payment, status } : payment
        ),
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update payment status', isLoading: false });
    }
  },

  sendReminder: async (id, type) => {
    try {
      set({ isLoading: true });
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Reminder sent via ${type}`);
      set({ isLoading: false });
    } catch (error) {
      set({ error: `Failed to send ${type} reminder`, isLoading: false });
      throw error;
    }
  },

  setFilter: (key, value) => {
    set(state => {
      const newFilters = {
        ...state.filters,
        [key]: value === 'all' ? undefined : value
      };

      const filtered = state.payments.filter(payment => {
        const matchesName = !newFilters.memberName || 
          payment.member.name.toLowerCase().includes(newFilters.memberName.toLowerCase());
        
        const matchesStatus = !newFilters.status || 
          payment.status === newFilters.status;
        
        const matchesType = !newFilters.type || 
          payment.type === newFilters.type;
        
        const matchesDueDate = !newFilters.dueDate || 
          new Date(payment.dueDate).toDateString() === newFilters.dueDate.toDateString();

        return matchesName && matchesStatus && matchesType && matchesDueDate;
      });

      return {
        filters: newFilters,
        filteredPayments: filtered
      };
    });
  },

  clearFilters: () => {
    set(state => ({
      filters: {},
      filteredPayments: state.payments
    }));
  }
}));