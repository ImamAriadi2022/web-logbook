import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTachometerAlt, FaBook, FaPlusCircle, FaCalendarAlt, FaFileAlt, FaUserCog } from "react-icons/fa";

const sidebarItems = [
  {
    label: "Dashboard",
    icon: <FaTachometerAlt />,
    to: "/dashboard",
  },
  {
    label: "Halaman Logbook",
    icon: <FaBook />,
    to: "/logbook",
  },
  {
    label: "Tambah / Edit Logbook",
    icon: <FaPlusCircle />,
    to: "/logbook/tambah",
  },
  {
    label: "Detail Logbook",
    icon: <FaFileAlt />,
    to: "/logbook/detail",
  },
  {
    label: "Profil / Pengaturan Akun",
    icon: <FaUserCog />,
    to: "/profil",
  },
];

const styles = {
  sidebar: {
    width: "250px",
    background: "var(--color-accent, #023E8A)",
    color: "#fff",
    minHeight: "100vh",
    padding: "2rem 0.5rem 1rem 0.5rem",
    boxShadow: "2px 0 12px rgba(0,0,0,0.07)",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    position: "fixed",
    left: 0,
    top: 0,
    zIndex: 100,
  },
  item: {
    display: "flex",
    alignItems: "flex-start",
    gap: "1rem",
    padding: "0.9rem 1.1rem",
    borderRadius: "0.6rem",
    cursor: "pointer",
    transition: "background 0.18s",
    textDecoration: "none",
    color: "#fff",
    fontWeight: 600,
    fontSize: "1.05rem",
  },
  itemActive: {
    background: "rgba(255,255,255,0.13)",
    color: "#fff",
  },
};

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside style={styles.sidebar}>
      {sidebarItems.map((item) => (
        <Link
          key={item.label}
          to={item.to}
          style={{
            ...styles.item,
            ...(location.pathname.startsWith(item.to) ? styles.itemActive : {}),
          }}
        >
          <span style={{ fontSize: "1.25rem", marginTop: "2px" }}>{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </aside>
  );
};

export default Sidebar;