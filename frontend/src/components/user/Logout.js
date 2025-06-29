import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const styles = {
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.7rem 1.2rem",
    borderRadius: "2rem",
    backgroundColor: "var(--color-accent, #023E8A)",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
    transition: "background 0.2s",
  },
  logoutButtonHover: {
    backgroundColor: "#E63946",
  },
  icon: {
    fontSize: "1.2rem",
  },
};

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch("https://web-logbook-bvjl.vercel.app/api/users/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat logout");
      }

      // Hapus ID pengguna dari localStorage
      localStorage.removeItem("userId");

      // Redirect ke halaman login
      navigate("/login");
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <button
      style={styles.logoutButton}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor)}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor)}
      onClick={handleLogout}
    >
      <FaSignOutAlt style={styles.icon} />
      Logout
    </button>
  );
};

export default LogoutButton;