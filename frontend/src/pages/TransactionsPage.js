import React, { useState, useEffect } from "react";
import { fetchTransactions, createTransaction } from "../api/transactions";
import TransactionForm from "../components/TransactionForm";
import { useNotifications } from "../context/NotificationContext";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const { addMessage } = useNotifications();

  const loadTransactions = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
    } catch (e) {
      addMessage(e.message, "error");
    }
  };

  useEffect(() => { loadTransactions(); }, []);

  const handleCreate = async (trx) => {
    try {
      const created = await createTransaction(trx);
      setTransactions([created, ...transactions]);
      addMessage("Транзакцію створено", "success");
    } catch (e) {
      addMessage(e.message, "error");
    }
  };

  return (
    <div className="container">
      <h2>Транзакції</h2>
      <div className="card">
        <TransactionForm onSubmit={handleCreate} isAdmin={false} />
      </div>

      <ul className="mt-4">
        {transactions.map((t) => (
          <li key={t.id} className="card mb-2 p-4">
            <strong>{t.type}</strong> | Загальна сума: {t.totalAmount} | Дата: {new Date(t.date).toLocaleString()}
            <ul>
              {t.lines?.map((l) => (
                <li key={l.id}>
                  Продукт: {l.Product?.name || l.productId}, Кількість: {l.quantity}, Ціна: {l.unitPrice}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
