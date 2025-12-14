import React, { useEffect, useState } from 'react';
import { invoiceService } from '../api/invoices';
import { useParams } from 'react-router-dom';

export default function InvoiceDetailsPage() {
  const { invoiceId } = useParams();
  const [items, setItems] = useState([]);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    invoiceService.get(invoiceId)
      .then(setInvoice)
      .catch(err => console.error('Помилка завантаження рахунку:', err));

    invoiceService.getItems(invoiceId)
      .then(setItems)
      .catch(err => console.error('Помилка завантаження рядків:', err));
  }, [invoiceId]);

  if (!invoice) return <div>Завантаження...</div>;

  return (
    <div>
      <h2>Рахунок №{invoice.number}</h2>
      <p>Дата: {invoice.date}</p>
      <p>Клієнт: {invoice.customerName || invoice.customerId}</p>

      <h3>Рядки рахунку</h3>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Товар</th>
            <th>Кількість</th>
            <th>Ціна за одиницю</th>
            <th>Сума</th>
          </tr>
        </thead>
        <tbody>
          {items.map(i => (
            <tr key={i.id}>
              <td>{i.productId}</td>
              <td>{i.qty}</td>
              <td>{Number(i.unitPrice).toFixed(2)}</td>
              <td>{Number(i.lineTotal).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>Всього: {items.reduce((sum, i) => sum + Number(i.lineTotal), 0).toFixed(2)} грн</h4>
    </div>
  );
}
