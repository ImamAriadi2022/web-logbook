import React from "react";
import { Card, Row, Col, ListGroup } from "react-bootstrap";
import { FaTachometerAlt, FaUser, FaClipboardList, FaFileAlt } from "react-icons/fa";

// Dummy data, ganti dengan data asli dari backend/props jika ada
const dummyLogbook = [
  { id: 1, tanggal: "2025-01-04", jam: "10:29", user: "Siti", laporan: "Wildlife hazard di Runway 04" },
  { id: 2, tanggal: "2025-01-05", jam: "08:10", user: "Andi", laporan: "Pengecekan alat pemadam" },
];
const dummyUsers = [
  { id: 1, nama: "Siti" },
  { id: 2, nama: "Andi" },
  { id: 3, nama: "Budi" },
];

const Dashboard = () => {
  const totalLogbook = dummyLogbook.length;
  const totalUser = dummyUsers.length;
  const laporanTerakhir = dummyLogbook[0];

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
        <FaTachometerAlt style={{ fontSize: 28 }} /> Dashboard
      </h2>
      <Row className="mb-4" xs={1} md={3} style={{ gap: "1rem 0" }}>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-accent)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{totalLogbook}</div>
              <div style={{ color: "#888" }}>Total Logbook</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-primary)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{totalUser}</div>
              <div style={{ color: "#888" }}>User Aktif</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-cta)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{laporanTerakhir ? laporanTerakhir.laporan : "-"}</div>
              <div style={{ color: "#888" }}>Laporan Terakhir</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Card>
        <Card.Header style={{ fontWeight: 600, background: "var(--color-accent)", color: "#fff" }}>
          Logbook Terbaru
        </Card.Header>
        <ListGroup variant="flush">
          {dummyLogbook.map((log) => (
            <ListGroup.Item key={log.id}>
              <div style={{ fontWeight: 600 }}>{log.laporan}</div>
              <div style={{ fontSize: "0.97rem", color: "#888" }}>
                {log.tanggal} {log.jam} &mdash; {log.user}
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card>
    </div>
  );
};

export default Dashboard;