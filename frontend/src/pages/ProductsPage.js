import React, { useEffect, useState } from "react";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { useNotifications } from '../context/NotificationContext';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterSupplier, setFilterSupplier] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    quantity: "",
    price: 0,
    minStock: 0,
    supplier: ""
  });
  const [editId, setEditId] = useState(null);

  const { addMessage } = useNotifications();
  const pageSize = 5;

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const data = await fetchProducts();
      const normalized = data.map(p => ({
        ...p,
        price: p.unitPrice != null ? parseFloat(p.unitPrice) : 0,
        quantity: p.quantity != null ? parseInt(p.quantity) : 0,
        minStock: p.minStock != null ? p.minStock : 0,
        name: p.name || "",
        sku: p.sku || "",
        supplier: p.supplier || ""
      }));
      setProducts(normalized);
    } catch (e) {
      addMessage(e.message, 'error');
    }
  }

  function handleChange(e) {
    let value = e.target.value;
    if (e.target.name === "price") value = e.target.value === "" ? 0 : parseFloat(e.target.value);
    if (e.target.name === "quantity") value = e.target.value === "" ? 0 : parseInt(e.target.value);
    if (e.target.name === "minStock") value = e.target.value === "" ? 0 : parseInt(e.target.value);
    setForm({ ...form, [e.target.name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      name: form.name,
      sku: form.sku,
      quantity: form.quantity,
      unitPrice: form.price,
      minStock: form.minStock,
      supplier: form.supplier
    };

    try {
      if (editId) await updateProduct(editId, payload);
      else await createProduct(payload);

      addMessage(editId ? 'Товар оновлено' : 'Товар створено', 'success');
      setForm({ name: "", sku: "", quantity: 0, price: 0, minStock: 0, supplier: "" });
      setEditId(null);
      load();
    } catch (e) {
      addMessage(e.message, 'error');
    }
  }

  function startEdit(item) {
    setEditId(item.id);
    setForm({
      name: item.name || "",
      sku: item.sku || "",
      quantity: item.quantity != null ? item.quantity : 0,
      price: item.price != null ? item.price : 0,
      minStock: item.minStock != null ? item.minStock : 0,
      supplier: item.supplier || ""
    });
  }

  async function handleDelete(id) {
    if (!window.confirm('Видалити цей товар?')) return;
    try {
      await deleteProduct(id);
      addMessage('Товар видалено', 'warning');
      load();
    } catch (e) {
      addMessage(e.message, 'error');
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      products.forEach(p => {
        if (p.quantity < p.minStock) {
          addMessage(`Увага! Товар "${p.name}" (${p.sku}) нижче мінімального запасу!`, 'warning');
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [products, addMessage]);

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => (filterSupplier ? p.supplier === filterSupplier : true))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "quantity") return b.quantity - a.quantity;
      if (sortBy === "price") return (b.price || 0) - (a.price || 0);
      return 0;
    });

  const suppliers = [...new Set(products.map((p) => p.supplier))];
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="container">
      <h1>Керування товарами</h1>

      <div className="flex flex-between mb-4">
        <input placeholder="Пошук товарів..." value={search} onChange={(e) => setSearch(e.target.value)} className="input"/>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input">
          <option value="name">Сортувати: Назва</option>
          <option value="quantity">Сортувати: Кількість</option>
          <option value="price">Сортувати: Ціна</option>
        </select>
        <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)} className="input">
          <option value="">Всі постачальники</option>
          {suppliers.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <h2>{editId ? "Редагувати товар" : "Додати товар"}</h2>
      <form onSubmit={handleSubmit} className="card">
        <input name="name" placeholder="Назва" value={form.name} onChange={handleChange} required className="input"/>
        <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} required className="input"/>
        <input name="quantity" type="number" placeholder="Кількість" value={form.quantity} onChange={handleChange} required className="input"/>
        <input name="price" type="number" step="0.01" placeholder="Ціна" value={form.price} onChange={handleChange} required className="input"/>
        <input name="minStock" type="number" placeholder="Мінімальний запас" value={form.minStock} onChange={handleChange} required className="input"/>
        <input name="supplier" placeholder="Постачальник" value={form.supplier} onChange={handleChange} required className="input"/>

        <div className="flex gap-2 mt-2">
          <button type="submit">{editId ? "Оновити" : "Додати"}</button>
          {editId && <button type="button" onClick={() => { setEditId(null); setForm({ name: "", sku: "", quantity: 0, price: 0, minStock: 0, supplier: "" }); }}>Скасувати</button>}
        </div>
      </form>

      <div className="card mt-4">
        <table className="table">
          <thead>
            <tr>
              <th>Назва</th>
              <th>SKU</th>
              <th>Кількість</th>
              <th>Мінімальний запас</th>
              <th>Ціна</th>
              <th>Постачальник</th>
              <th>Дії</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => (
              <tr key={p.id} className={p.quantity < p.minStock ? 'low-stock' : ''}>
                <td>{p.name}</td>
                <td>{p.sku}</td>
                <td>{p.quantity}</td>
                <td>{p.minStock}</td>
                <td>{p.price.toFixed(2)}</td>
                <td>{p.supplier}</td>
                <td className="flex gap-2">
                  <button onClick={() => startEdit(p)}>Редагувати</button>
                  <button onClick={() => handleDelete(p.id)}>Видалити</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>

      <style>
        {`
          .low-stock { background-color: #ffe5e5; }
        `}
      </style>
    </div>
  );
}
