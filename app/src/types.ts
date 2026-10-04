export type PaymentMethod = "UPI" | "Credit Card" | "Debit Card" | "Cash" | "Bank Transfer";
export type TransactionType = "income" | "expense";

export interface Transaction {
  id: string;
  amount: number;
  category: string;
  description: string;
  paymentMethod: PaymentMethod;
  date: string;      // ISO date, e.g. "2026-08-12"
  createdAt: string; // ISO timestamp
  type?: TransactionType;
}

export interface Budget {
  category: string;
  limit: number;
}
