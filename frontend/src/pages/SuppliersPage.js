import React, { useEffect, useState } from 'react';
import { supplierService } from '../api/suppliers';

const SuppliersPage = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    taxId: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    supplierService.list().then(setSuppliers);
  }, []);

  const handleCreate = async () => {
    const newS = await supplierService.create(form);
    setSuppliers([...suppliers, newS]);
    setForm({
      name: '',
      taxId: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: ''
    });
  };

  return (
    <div>
      <h1>Постачальники</h1>

      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="Назва"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="ІПН / Tax ID"
          value={form.taxId}
          onChange={e => setForm({ ...form, taxId: e.target.value })}
        />
        <input
          placeholder="Контактна особа"
          value={form.contactPerson}
          onChange={e => setForm({ ...form, contactPerson: e.target.value })}
        />
        <input
          placeholder="Телефон"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Адреса"
          value={form.address}
          onChange={e => setForm({ ...form, address: e.target.value })}
        />
        <button onClick={handleCreate}>Додати</button>
      </div>

      <table border={1} cellPadding={5} style={{ marginTop: 10, width: '100%' }}>
        <thead>
          <tr>
            <th>Назва</th>
            <th>ІПН</th>
            <th>Контактна особа</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>Адреса</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.taxId}</td>
              <td>{s.contactPerson}</td>
              <td>{s.phone}</td>
              <td>{s.email}</td>
              <td>{s.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SuppliersPage;
