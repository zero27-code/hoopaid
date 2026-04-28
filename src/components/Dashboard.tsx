import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AddExpenseModal } from './AddExpenseModal';
import './Dashboard.css';

export const Dashboard = () => {
  const { currentUser, getBalances, getSettlements, expenses, users } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentUser) return null;

  const balances = getBalances();
  const myBalance = balances[currentUser.id] || { owes: 0, isOwed: 0, net: 0 };
  const settlements = getSettlements();

  const mySettlementsToPay = settlements.filter(s => s.from === currentUser.id);
  const mySettlementsToReceive = settlements.filter(s => s.to === currentUser.id);

  const getUserName = (id: string) => users.find(u => u.id === id)?.name || 'Unknown';

  return (
    <div className="dashboard">
      <header className="dashboard-header flex-between">
        <div>
          <h2>Welcome back, <span className="text-gradient">{currentUser.name}</span></h2>
          <p className="text-muted">Here's your expense summary.</p>
        </div>
        <button className="btn-primary flex-center gap-2" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} />
          Add Expense
        </button>
      </header>

      <div className="balance-cards">
        <div className="glass-panel balance-card total-balance">
          <p className="text-secondary">Total Balance</p>
          <h3 className={myBalance.net >= 0 ? 'text-success' : 'text-danger'}>
            ${Math.abs(myBalance.net).toFixed(2)}
          </h3>
          <p className="text-sm">
            {myBalance.net >= 0 ? 'you are owed' : 'you owe'}
          </p>
        </div>

        <div className="glass-panel balance-card">
          <div className="icon-wrapper bg-danger-light">
            <ArrowUpRight className="text-danger" />
          </div>
          <div className="card-content">
            <p className="text-secondary">You Owe</p>
            <h3>${myBalance.owes.toFixed(2)}</h3>
          </div>
        </div>

        <div className="glass-panel balance-card">
          <div className="icon-wrapper bg-success-light">
            <ArrowDownLeft className="text-success" />
          </div>
          <div className="card-content">
            <p className="text-secondary">You are Owed</p>
            <h3>${myBalance.isOwed.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="glass-panel section settlements-section">
          <h3>Suggested Settlements</h3>
          {settlements.length === 0 ? (
            <div className="empty-state">
              <p className="text-muted">You're all settled up! 🎉</p>
            </div>
          ) : (
            <ul className="settlement-list">
              {settlements.map((s, idx) => (
                <li key={idx} className="settlement-item flex-between">
                  <div className="settlement-info">
                    <span className="name">{getUserName(s.from)}</span>
                    <span className="text-muted"> owes </span>
                    <span className="name">{getUserName(s.to)}</span>
                  </div>
                  <span className="amount font-bold">${s.amount.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="glass-panel section recent-expenses">
          <h3>Recent Expenses</h3>
          {expenses.length === 0 ? (
            <div className="empty-state">
              <p className="text-muted">No expenses yet. Add one!</p>
            </div>
          ) : (
             <ul className="expense-list">
              {expenses.slice(0, 5).map(exp => (
                <li key={exp.id} className="expense-item flex-between">
                  <div className="expense-info">
                    <h4>{exp.description}</h4>
                    <p className="text-sm text-muted">
                      Paid by {getUserName(exp.paidBy)} • {new Date(exp.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="expense-amount">
                    <h4>${exp.amount.toFixed(2)}</h4>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {isModalOpen && <AddExpenseModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
