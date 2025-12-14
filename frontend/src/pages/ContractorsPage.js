import React, { useEffect, useState } from 'react';
import { contractorService } from '../api/contractors';

const ContractorsPage = () => {
  const [contractors, setContractors] = useState([]);
  const [form, setForm] = useState({
    name: '',
    taxId: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    contractorService.list().then(setContractors);
  }, []);

  const handleCreate = async () => {
    const newC = await contractorService.create(form);
    setContractors([...contractors, newC]);
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
      <h1>Контрагенти</h1>

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
          {contractors.map(c => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.taxId}</td>
              <td>{c.contactPerson}</td>
              <td>{c.phone}</td>
              <td>{c.email}</td>
              <td>{c.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContractorsPage;
