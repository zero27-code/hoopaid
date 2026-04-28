export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  paidBy: string; // User ID
  splitAmong: string[]; // User IDs
};

export type Balance = {
  userId: string;
  owes: number;
  isOwed: number;
  net: number;
};
