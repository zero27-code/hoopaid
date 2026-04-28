import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Expense, Balance } from '../types';

type AppContextType = {
  users: User[];
  expenses: Expense[];
  currentUser: User | null;
  addUser: (name: string) => void;
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  getBalances: () => Record<string, Balance>;
  getSettlements: () => { from: string; to: string; amount: number }[];
};

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial mock data
const initialUsers: User[] = [
  { id: '1', name: 'You' },
  { id: '2', name: 'Alice' },
  { id: '3', name: 'Bob' },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('hoopaid_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('hoopaid_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const currentUser = users[0] || null;

  useEffect(() => {
    localStorage.setItem('hoopaid_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('hoopaid_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addUser = (name: string) => {
    setUsers([...users, { id: Date.now().toString(), name }]);
  };

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses([{ ...expense, id: Date.now().toString() }, ...expenses]);
  };

  const getBalances = () => {
    const balances: Record<string, Balance> = {};
    
    users.forEach(u => {
      balances[u.id] = { userId: u.id, owes: 0, isOwed: 0, net: 0 };
    });

    expenses.forEach(exp => {
      const splitAmount = exp.amount / exp.splitAmong.length;
      
      exp.splitAmong.forEach(userId => {
        if (userId === exp.paidBy) return;
        
        // Person who didn't pay owes money
        if (balances[userId]) {
          balances[userId].owes += splitAmount;
          balances[userId].net -= splitAmount;
        }
        
        // Payer is owed money
        if (balances[exp.paidBy]) {
          balances[exp.paidBy].isOwed += splitAmount;
          balances[exp.paidBy].net += splitAmount;
        }
      });
    });

    return balances;
  };

  const getSettlements = () => {
    const balances = getBalances();
    const debtors: { id: string; net: number }[] = [];
    const creditors: { id: string; net: number }[] = [];

    Object.values(balances).forEach(b => {
      if (b.net < -0.01) debtors.push({ id: b.userId, net: b.net });
      else if (b.net > 0.01) creditors.push({ id: b.userId, net: b.net });
    });

    debtors.sort((a, b) => a.net - b.net); // Most in debt first
    creditors.sort((a, b) => b.net - a.net); // Most owed first

    const settlements = [];
    let d = 0;
    let c = 0;

    while (d < debtors.length && c < creditors.length) {
      const debtor = debtors[d];
      const creditor = creditors[c];
      
      const amount = Math.min(-debtor.net, creditor.net);
      
      settlements.push({
        from: debtor.id,
        to: creditor.id,
        amount: Math.round(amount * 100) / 100
      });

      debtor.net += amount;
      creditor.net -= amount;

      if (Math.abs(debtor.net) < 0.01) d++;
      if (Math.abs(creditor.net) < 0.01) c++;
    }

    return settlements;
  };

  return (
    <AppContext.Provider value={{ users, expenses, currentUser, addUser, addExpense, getBalances, getSettlements }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
