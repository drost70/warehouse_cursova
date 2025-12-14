import React, { useState, useEffect } from 'react';
import { fetchTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transactions';
import TransactionForm from '../components/TransactionForm';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { addMessage } = useNotifications();
  const { role } = useAuth();
  const canEdit = role === 'admin' || role === 'user';

  const loadTransactions = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (e) {
      addMessage(e.message, 'error');
    }
  };

  useEffect(() => { loadTransactions(); }, []);

  const handleCreateOrUpdate = async (transactionData) => {
    try {
      if (!canEdit) return;

      if (editingTransaction) {
        const updated = await updateTransaction(editingTransaction.id, transactionData);
        setTransactions(transactions.map(t => t.id === updated.id ? updated : t));
        addMessage('Транзакція оновлена', 'success');
        setEditingTransaction(null);
      } else {
        const created = await createTransaction(transactionData);
        setTransactions([...transactions, created]);
        addMessage('Транзакція створена', 'success');
      }
    } catch (e) {
      addMessage(e.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm('Видалити цю транзакцію?')) return;

    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
      addMessage('Транзакція видалена', 'warning');
    } catch (e) {
      addMessage(e.message, 'error');
    }
  };

  return (
    <div className="container">
      <h2>Керування транзакціями</h2>

      {canEdit && (
        <div className="card">
          <TransactionForm
            onSubmit={handleCreateOrUpdate}
            initialData={editingTransaction}
            onCancel={() => setEditingTransaction(null)}
          />
        </div>
      )}

      <div className="card mt-4">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Тип</th>
              <th>Дата</th>
              <th>Сума</th>
              {canEdit && <th>Дії</th>}
            </tr>
          </thead>
          <tbody>
            {(transactions || []).map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.type}</td>
                <td>{t.date}</td>
                <td>
                  {t.lines && t.lines.length > 0
                    ? t.lines.reduce((sum, l) => sum + (l.unitPrice || 0) * (l.quantity || 0), 0).toFixed(2)
                    : '0.00'}
                </td>
                {canEdit && (
                  <td className="flex gap-2">
                    <button onClick={() => setEditingTransaction(t)}>Редагувати</button>
                    <button onClick={() => handleDelete(t.id)}>Видалити</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
