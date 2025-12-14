import React, { useEffect, useState } from 'react';
import { actService } from '../api/acts';

const ActsPage = () => {
  const [acts, setActs] = useState([]);
  const [form, setForm] = useState({
    number: '',
    date: '',
    type: '',
    details: '',
    total: 0
  });

  useEffect(() => {
    actService.list().then(setActs).catch(console.error);
  }, []);

  const handleCreate = async () => {
    const newA = await actService.create(form);
    setActs([...acts, newA]);
    setForm({ number: '', date: '', type: '', details: '', total: 0 });
  };

  return (
    <div>
      <h1>Акти</h1>

      <div style={{ marginBottom: '20px' }}>
        <input
          placeholder="Number"
          value={form.number}
          onChange={e => setForm({ ...form, number: e.target.value })}
        />
        <input
          type="date"
          placeholder="Date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />
        <input
          placeholder="Type"
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value })}
        />
        <input
          placeholder="Details"
          value={form.details}
          onChange={e => setForm({ ...form, details: e.target.value })}
        />
        <input
          type="number"
          placeholder="Total"
          value={form.total}
          onChange={e => setForm({ ...form, total: parseFloat(e.target.value) })}
        />
        <button onClick={handleCreate}>Add</button>
      </div>

      <table border="1" cellPadding="5" cellSpacing="0">
        <thead>
          <tr>
            <th>ID</th>
            <th>Number</th>
            <th>Type</th>
            <th>Date</th>
            <th>Details</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {acts.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.number}</td>
              <td>{a.type}</td>
              <td>{a.date}</td>
              <td>{a.details}</td>
              <td>{a.total != null ? Number(a.total).toFixed(2) : '0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActsPage;
