import React from 'react';

export default function ProductList({ products, onEdit, onDelete }) {
  return (
    <table border="1" cellPadding="5" style={{ marginTop: 20, width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>Назва</th>
          <th>Артикул (SKU)</th>
          <th>Ціна за одиницю</th>
          <th>Кількість</th>
          <th>Мінімальний запас</th>
          <th>Постачальник</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        {(products || []).map(p => (
          <tr key={p.id}>
            <td>{p.name}</td>
            <td>{p.sku}</td>
            <td>{p.unitPrice}</td>
            <td>{p.quantity}</td>
            <td>{p.minStock}</td>
            <td>{p.supplier}</td>
            <td>
              <button onClick={() => onEdit(p)}>Редагувати</button>
              <button onClick={() => onDelete(p.id)}>Видалити</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
