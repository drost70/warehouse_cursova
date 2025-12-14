import React, { useState, useEffect } from 'react';
import { invoiceService } from '../api/invoices';
import { contractorService } from '../api/contractors';
import { fetchProducts } from '../api/products';
import './InvoicesPage.css';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [products, setProducts] = useState([]);
  const [newInvoiceData, setNewInvoiceData] = useState({
    contractorId: '',
    items: [],
    status: 'Чернетка',
  });
  const [notification, setNotification] = useState(null);

  const loadInvoices = async () => {
    try {
      const data = await invoiceService.list();
      setInvoices(data);
      setSelectedInvoice(null);
    } catch (err) {
      console.error('Помилка завантаження накладних:', err);
    }
  };

  const loadContractors = async () => {
    try {
      const data = await contractorService.list();
      setContractors(data);
    } catch (err) {
      console.error('Помилка завантаження контрагентів:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error('Помилка завантаження товарів:', err);
    }
  };

  useEffect(() => {
    loadInvoices();
    loadContractors();
    loadProducts();
  }, []);

  const toggleInvoiceItems = async (invoice) => {
    if (selectedInvoice?.id === invoice.id) {
      setSelectedInvoice(null);
      return;
    }

    try {
      const detailedInvoice = await invoiceService.get(invoice.id);
      setSelectedInvoice(detailedInvoice);
    } catch (err) {
      console.error('Помилка завантаження позицій накладної:', err);
    }
  };

  const handleNewInvoiceChange = (field, value) => {
    setNewInvoiceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddItem = () => {
    setNewInvoiceData((prev) => ({
      ...prev,
      items: [...prev.items, { productId: '', qty: 1, unitPrice: 0 }],
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...newInvoiceData.items];
    if (field === 'qty') value = parseInt(value) || 0;
    if (field === 'unitPrice') value = parseFloat(value) || 0;
    updatedItems[index][field] = value;

    if (field === 'productId') {
      const prod = products.find((p) => p.id === value);
      if (prod) updatedItems[index].unitPrice = parseFloat(prod.unitPrice);
    }

    setNewInvoiceData((prev) => ({ ...prev, items: updatedItems }));
  };

  const calculateTotal = () => {
    return newInvoiceData.items.reduce(
      (sum, item) => sum + item.qty * item.unitPrice,
      0
    );
  };

  const createInvoice = async () => {
    if (!newInvoiceData.contractorId) {
      setNotification({ type: 'error', message: 'Оберіть контрагента!' });
      return;
    }

    try {
      const invoicePayload = {
        ...newInvoiceData,
        number: `INV-${Date.now()}`,
        date: new Date(),
        total: parseFloat(calculateTotal().toFixed(2)),
      };

      const createdInvoice = await invoiceService.create(invoicePayload);
      setInvoices((prev) => [...prev, createdInvoice]);
      setNewInvoiceData({ contractorId: '', items: [], status: 'Чернетка' });
      setNotification({ type: 'success', message: `Накладну №${createdInvoice.number} створено!` });
    } catch (err) {
      console.error('Помилка створення накладної:', err);
      setNotification({ type: 'error', message: err.message });
    }

    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div style={{ color: '#fff' }}>
      <h1>Накладні</h1>

      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
        </div>
      )}

      <div style={{ border: '1px solid #ccc', padding: '10px', marginBottom: 20 }}>
        <h2>Створити нову накладну</h2>
        <div>
          <label style={{ color: '#fff' }}>Контрагент: </label>
          <select
            value={newInvoiceData.contractorId}
            onChange={(e) => handleNewInvoiceChange('contractorId', e.target.value)}
            style={{ color: '#000' }}
          >
            <option value="">Оберіть...</option>
            {contractors.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <h3>Товари</h3>
        {newInvoiceData.items.map((item, idx) => (
          <div key={idx} style={{ marginBottom: 5 }}>
            <select
              value={item.productId}
              onChange={(e) => handleItemChange(idx, 'productId', e.target.value)}
              style={{ color: '#000' }}
            >
              <option value="">Оберіть товар</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={item.qty}
              min={1}
              onChange={(e) => handleItemChange(idx, 'qty', e.target.value)}
              style={{ width: 60, marginLeft: 5, color: '#000' }}
            />
            <input
              type="number"
              step="0.01"
              value={item.unitPrice}
              onChange={(e) => handleItemChange(idx, 'unitPrice', e.target.value)}
              style={{ width: 80, marginLeft: 5, color: '#000' }}
            />
            <span style={{ marginLeft: 5 }}>Разом: {(item.qty * item.unitPrice).toFixed(2)}</span>
          </div>
        ))}
        <button onClick={handleAddItem}>Додати товар</button>

        <div style={{ marginTop: 10 }}>
          <strong>Сума: {calculateTotal().toFixed(2)}</strong>
        </div>
        <div style={{ marginTop: 10 }}>
          <button onClick={createInvoice}>Створити накладну</button>
        </div>
      </div>

      <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Номер</th>
            <th>Дата</th>
            <th>Сума</th>
            <th>Статус</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv) => (
            <tr key={inv.id}>
              <td>{inv.id}</td>
              <td>{inv.number}</td>
              <td>{new Date(inv.date).toLocaleDateString()}</td>
              <td>{Number(inv.total || 0).toFixed(2)}</td>
              <td>{inv.status}</td>
              <td>
                <button onClick={() => toggleInvoiceItems(inv)}>
                  {selectedInvoice?.id === inv.id ? 'Сховати' : 'Переглянути'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedInvoice && (
        <div style={{ marginTop: 20 }}>
          <h2>Деталі накладної #{selectedInvoice.number}</h2>
          <table border={1} cellPadding={5} style={{ width: '100%', borderCollapse: 'collapse', color: '#fff' }}>
            <thead>
              <tr>
                <th>Товар</th>
                <th>SKU</th>
                <th>Кількість</th>
                <th>Ціна за одиницю</th>
                <th>Разом</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoice.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.Product?.name || '-'}</td>
                  <td>{item.Product?.sku || '-'}</td>
                  <td>{item.qty}</td>
                  <td>{Number(item.unitPrice || 0).toFixed(2)}</td>
                  <td>{Number(item.lineTotal || item.qty * item.unitPrice || 0).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
