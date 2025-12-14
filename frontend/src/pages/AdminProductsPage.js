import React, { useState, useEffect, useRef } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/products';
import ProductForm from '../components/ProductForm';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const { addMessage } = useNotifications();
  const { role } = useAuth();
  const canEdit = role && ['admin', 'user', 'worker'].includes(role);

  const productsRef = useRef(products);
  productsRef.current = products;

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (e) {
      addMessage(e.message, 'error');
    }
  };

  useEffect(() => {
    loadProducts();

    const interval = setInterval(() => {
      const lowStockItems = productsRef.current.filter(p => p.quantity < p.minStock);
      lowStockItems.forEach(item => {
        addMessage(`Увага! Товар "${item.name}" (${item.sku}) нижче мінімального запасу!`, 'warning');
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [addMessage]); // products не додаємо

  const handleCreateOrUpdate = async (productData) => {
    try {
      if (!canEdit) return;

      if (editingProduct) {
        const updated = await updateProduct(editingProduct.id, productData);
        setProducts(products.map(p => p.id === updated.id ? updated : p));
        addMessage('Товар оновлено', 'success');
        setEditingProduct(null);
      } else {
        const created = await createProduct(productData);
        setProducts([...products, created]);
        addMessage('Товар створено', 'success');
      }
    } catch (e) {
      addMessage(e.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm('Видалити цей товар?')) return;

    try {
      await deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      addMessage('Товар видалено', 'warning');
    } catch (e) {
      addMessage(e.message, 'error');
    }
  };

  return (
    <div className="container">
      <h2>Керування товарами{role === 'admin' ? ' (Адмін)' : ''}</h2>

      {canEdit && (
        <div className="card">
          <ProductForm
            onSubmit={handleCreateOrUpdate}
            initialData={editingProduct}
            onCancel={() => setEditingProduct(null)}
          />
        </div>
      )}

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>Артикул (SKU)</th>
              <th>Ціна за одиницю</th>
              <th>Кількість</th>
              <th>Мінімальний запас</th>
              <th>Постачальник</th>
              {canEdit && <th>Дії</th>}
            </tr>
          </thead>
          <tbody>
            {(products || []).map(p => (
              <tr key={p.id} className={p.quantity < p.minStock ? 'low-stock' : ''}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.unitPrice}</td>
                <td>{p.quantity}</td>
                <td>{p.minStock}</td>
                <td>{p.supplier}</td>
                {canEdit && (
                  <td className="flex flex-center gap-2">
                    <button onClick={() => setEditingProduct(p)}>Редагувати</button>
                    <button onClick={() => handleDelete(p.id)}>Видалити</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>
        {`
          .low-stock {
            background-color: #ffe5e5;
          }
        `}
      </style>
    </div>
  );
}
