import React, { useState, useEffect } from "react";
import { fetchValuation, fetchStockOnDate } from "../api/reports";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function ReportsPage() {
  const [strategy, setStrategy] = useState("FIFO");
  const [valuationResult, setValuationResult] = useState([]);
  const [stockDate, setStockDate] = useState("");
  const [stockResult, setStockResult] = useState([]);
  const [chartData, setChartData] = useState([]);

  const loadValuation = async () => {
    try {
      const data = await fetchValuation(strategy);
      setValuationResult(data);
      setChartData(data.map(p => ({ name: p.name, value: p.value })));
    } catch (err) {
      console.error("Помилка завантаження оцінки:", err);
    }
  };

  const loadStockOnDate = async () => {
    if (!stockDate) return;
    try {
      const data = await fetchStockOnDate(stockDate);
      setStockResult(data);
    } catch (err) {
      console.error("Помилка завантаження стану складу:", err);
    }
  };

  useEffect(() => { loadValuation(); }, [strategy]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ color: "#fff", textShadow: "1px 1px 4px rgba(0,0,0,0.7)" }}>Звіти</h2>

      <div style={{ marginBottom: 20 }}>
        <label style={{ color: "#fff" }}>
          Стратегія оцінки залишків:{" "}
          <select value={strategy} onChange={e => setStrategy(e.target.value)}>
            <option value="FIFO">FIFO</option>
            <option value="LIFO">LIFO</option>
          </select>
        </label>
      </div>

      <h3 style={{ color: "#fff", textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}>
        Фінансова оцінка товарних залишків
      </h3>
      <div style={{
        background: "rgba(255, 255, 255, 0.85)",
        padding: "15px",
        borderRadius: "12px",
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <table border={1} cellPadding={5} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Товар</th><th>SKU</th><th>Залишок</th><th>Оцінка (грн)</th>
            </tr>
          </thead>
          <tbody>
            {valuationResult.map(v => (
              <tr key={v.productId}>
                <td>{v.name}</td>
                <td>{v.sku}</td>
                <td>{v.quantity}</td>
                <td>{Number(v.value).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ color: "#fff", marginTop: 40, textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}>
        Стан складу на дату
      </h3>
      <div style={{
        background: "rgba(255, 255, 255, 0.85)",
        padding: "15px",
        borderRadius: "12px",
        backdropFilter: "blur(6px)",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <div style={{ marginBottom: "10px" }}>
          <input type="date" value={stockDate} onChange={e => setStockDate(e.target.value)} />
          <button onClick={loadStockOnDate}>Показати</button>
        </div>
        <table border={1} cellPadding={5} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Товар</th><th>SKU</th><th>Залишок</th>
            </tr>
          </thead>
          <tbody>
            {stockResult.map(v => (
              <tr key={v.productId}>
                <td>{v.name}</td>
                <td>{v.sku}</td>
                <td>{v.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 style={{ color: "#fff", marginTop: 40, textShadow: "1px 1px 3px rgba(0,0,0,0.6)" }}>
        Динаміка руху товарів ({strategy})
      </h3>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          padding: "15px",
          borderRadius: "12px",
          backdropFilter: "blur(6px)",
          boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
          marginTop: "10px"
        }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
