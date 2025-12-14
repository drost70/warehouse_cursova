import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../api/products';
import { useNotifications } from '../context/NotificationContext';

export default function TransactionForm({ onSubmit, initialData }) {
  const [products, setProducts] = useState([]);
  const [trx, setTrx] = useState(initialData || {
    type: 'IN',
    lines: [{ productId: '', quantity: '', unitPrice: '' }]
  });
  const { addMessage } = useNotifications();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (e) {
        addMessage(e.message, 'error');
      }
    };
    loadProducts();
  }, []);

  const handleLineChange = (index, field, value) => {
    const newLines = [...trx.lines];
    newLines[index][field] = value;
    setTrx({ ...trx, lines: newLines });
  };

  const handleAddLine = () => {
    setTrx({ ...trx, lines: [...trx.lines, { productId: '', quantity: '', unitPrice: '' }] });
  };

  const handleRemoveLine = (index) => {
    const newLines = trx.lines.filter((_, i) => i !== index);
    setTrx({ ...trx, lines: newLines });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    for (let line of trx.lines) {
      if (!line.productId || !line.quantity || !line.unitPrice) {
        addMessage('Заповніть всі поля у кожному рядку', 'error');
        return;
      }
    }
    onSubmit(trx);
    setTrx({ type: 'IN', lines: [{ productId: '', quantity: '', unitPrice: '' }] });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <select
        value={trx.type}
        onChange={e => setTrx({ ...trx, type: e.target.value })}
      >
        <option value="IN">Надходження</option>
        <option value="OUT">Відвантаження</option>
        <option value="ADJUST">Списання/Коригування</option>
      </select>

      {trx.lines.map((line, index) => (
        <div key={index} style={{ marginTop: 10, border: '1px solid #ccc', padding: 5 }}>
          <select
            value={line.productId}
            onChange={e => handleLineChange(index, 'productId', e.target.value)}
            required
          >
            <option value="">Оберіть продукт</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} | Залишок: {p.quantity} | Ціна: {p.unitPrice}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Кількість"
            value={line.quantity}
            onChange={e => handleLineChange(index, 'quantity', Number(e.target.value))}
            required
          />
          <input
            type="number"
            placeholder="Ціна за одиницю"
            value={line.unitPrice}
            onChange={e => handleLineChange(index, 'unitPrice', Number(e.target.value))}
            required
          />
          {trx.lines.length > 1 && <button type="button" onClick={() => handleRemoveLine(index)}>Видалити рядок</button>}
        </div>
      ))}

      <button type="button" onClick={handleAddLine} style={{ marginTop: 10 }}>Додати рядок</button>
      <button type="submit" style={{ marginTop: 10 }}>Зберегти транзакцію</button>
    </form>
  );
}
