import { useAuth } from "../context/AuthContext";
import { FaUserShield, FaUser } from "react-icons/fa";
import "./HomePage.css";

export default function HomePage() {
  const { role } = useAuth() || {};

  const getRoleContent = () => {
    if (role === "admin") {
      return {
        text: "Ви увійшли як адміністратор. Можете керувати усім складом",
        icon: <FaUserShield className="role-icon admin" />
      };
    } else if (role) {
      return {
        text: "Ви увійшли як працівник складу. Можете керувати товарами та транзакціями.",
        icon: <FaUser className="role-icon worker" />
      };
    } else {
      return {
        text: "Будь ласка, увійдіть для доступу до системи.",
        icon: null
      };
    }
  };

  const { text, icon } = getRoleContent();

  return (
    <div className="homepage-container">
      <div
        className="welcome-card"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "none"
        }}
      >
        <h1 className="welcome-title">Ласкаво просимо до Системи складського обліку</h1>
        {icon && <div className="role-icon-wrapper">{icon}</div>}
        <p className="welcome-text">{text}</p>
      </div>
    </div>
  );
}
