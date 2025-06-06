import React from "react";
import Sidebar from "../components/Admin/Sidebar";
import Dashboard from "../components/Admin/Dashboard";
import Manajemen from "../components/Admin/Manajemen";
import Data from "../components/Admin/Data";
import { Routes, Route, Navigate } from "react-router-dom";

const Admin = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: 250, width: "100%", minHeight: "100vh", background: "#f8f9fa" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Manajemen />} />
          <Route path="/logbook" element={<Data />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;