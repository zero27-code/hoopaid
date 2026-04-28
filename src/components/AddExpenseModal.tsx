import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import './AddExpenseModal.css';

type AddExpenseModalProps = {
  onClose: () => void;
};

export const AddExpenseModal = ({ onClose }: AddExpenseModalProps) => {
  const { users, currentUser, addExpense } = useAppContext();
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState(currentUser?.id || '');
  
  // Default: split among everyone equally
  const [splitAmong, setSplitAmong] = useState<string[]>(users.map(u => u.id));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || isNaN(Number(amount)) || splitAmong.length === 0) return;

    addExpense({
      description,
      amount: Number(amount),
      date: new Date().toISOString(),
      paidBy,
      splitAmong
    });
    
    onClose();
  };

  const handleToggleSplit = (userId: string) => {
    if (splitAmong.includes(userId)) {
      setSplitAmong(splitAmong.filter(id => id !== userId));
    } else {
      setSplitAmong([...splitAmong, userId]);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel">
        <div className="modal-header flex-between">
          <h3>Add an Expense</h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              placeholder="e.g. Dinner at Mario's" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Amount ($)</label>
            <input 
              type="number" 
              step="0.01"
              placeholder="0.00" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Paid By</label>
            <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Split Among</label>
            <div className="split-options">
              {users.map(u => (
                <div 
                  key={u.id} 
                  className={`split-pill ${splitAmong.includes(u.id) ? 'selected' : ''}`}
                  onClick={() => handleToggleSplit(u.id)}
                >
                  {u.name}
                </div>
              ))}
            </div>
            {splitAmong.length > 0 && (
              <p className="text-sm text-muted mt-2">
                ${(Number(amount) / splitAmong.length || 0).toFixed(2)} / person
              </p>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={splitAmong.length === 0}>Save Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};
