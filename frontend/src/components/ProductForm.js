import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ProductForm({ onSubmit, initialData, onCancel }) {
  const { role } = useAuth();
  const isAdmin = role === 'admin';

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [supplier, setSupplier] = useState('');
  const [minStock, setMinStock] = useState(0);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSku(initialData.sku || '');
      setQuantity(initialData.quantity || 0);
      setPrice(initialData.unitPrice || 0);
      setSupplier(initialData.supplier || '');
      setMinStock(initialData.minStock || 0);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name,
      sku,
      quantity: Number(quantity),
      unitPrice: Number(price),
      supplier,
      minStock: Number(minStock),
      description: initialData?.description || ''
    };

    onSubmit(data);

    if (!initialData) {
      setName('');
      setSku('');
      setQuantity('');
      setPrice('');
      setSupplier('');
      setMinStock(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <input
        type="text"
        placeholder="Назва товару"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        readOnly={!isAdmin && !!initialData}
      /><br/>

      {isAdmin && (
        <>
          <input
            type="text"
            placeholder="Артикул (SKU)"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            required
          /><br/>

          <input
            type="number"
            placeholder="Ціна за одиницю"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          /><br/>

          <input
            type="text"
            placeholder="Постачальник"
            value={supplier}
            onChange={(e) => setSupplier(e.target.value)}
            required
          /><br/>

          <input
            type="number"
            placeholder="Мінімальний запас"
            value={minStock}
            onChange={(e) => setMinStock(e.target.value)}
            required
          /><br/>
        </>
      )}

      <input
        type="number"
        placeholder="Кількість"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        required
      /><br/>

      <button type="submit">{initialData ? 'Оновити товар' : 'Додати товар'}</button>
      {initialData && <button type="button" onClick={onCancel}>Скасувати</button>}
    </form>
  );
}
