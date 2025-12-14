import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    const success = login(email, password);

    if (!success) {
      alert("Невірні облікові дані");
      return;
    }

    window.location.href = "/";
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Вхід до системи</h1>
        <form onSubmit={submit} className="login-form">
          <input
            type="email"
            placeholder="Електронна пошта"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Увійти</button>
        </form>
      </div>

      <style>
        {`
          .login-page {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: linear-gradient(135deg, #eef1f7, #dfe4ee);
            padding: 1rem;
          }

          .login-card {
            background: rgba(255,255,255,0.85);
            backdrop-filter: blur(15px);
            border-radius: 20px;
            padding: 3rem 2.5rem;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 12px 28px rgba(0,0,0,0.18);
            text-align: center;
          }

          .login-title {
            font-size: 2rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #10b981;
          }

          .login-form input {
            display: block;
            width: 100%;
            margin-bottom: 1.2rem;
            padding: 0.9rem 1rem;
            border-radius: 12px;
            border: 1px solid #cfd6e3;
            background-color: #ffffff;
            box-shadow: 0 3px 12px rgba(0,0,0,0.05);
            font-size: 1rem;
          }

          .login-form input:focus {
            border-color: #10b981;
            box-shadow: 0 0 12px rgba(16,185,129,0.45);
            outline: none;
          }

          .login-form button {
            width: 100%;
            margin-top: 0.5rem;
          }
        `}
      </style>
    </div>
  );
}
