import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const TEST_USERS = [
  {
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
    token: "test-admin-token-123",
  },
  {
    email: "worker@example.com",
    password: "worker123",
    role: "worker",
    token: "test-worker-token-456",
  },
];

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  });

  const login = (email, password) => {
    const user = TEST_USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) return false;

    localStorage.setItem("token", user.token);
    localStorage.setItem("role", user.role);

    setAuth({ token: user.token, role: user.role });
    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setAuth({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ ...auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
