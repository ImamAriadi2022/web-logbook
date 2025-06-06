import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/user/Sidebar";
import Dashboard from "../components/user/Dashboard";
import ReadLogbook from "../components/user/ReadLogbook";
import AddLogbook from "../components/user/AddLogbook";
import DetailLogbook from "../components/user/DetailLogbook";
import Profil from "../components/user/Profil";

const User = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div style={{ marginLeft: 250, width: "100%" }}>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/logbook" element={<ReadLogbook />} />
          <Route path="/logbook/tambah" element={<AddLogbook />} />
          <Route path="/logbook/detail" element={<DetailLogbook />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default User;