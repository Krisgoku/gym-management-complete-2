export type PaymentStatus = "pending" | "paid" | "overdue";

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Payment {
  id: string;
  memberId: string;
  member: Member;
  type: string;
  amount: number;
  dueDate: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}