import React, { useEffect, useState } from "react";
import { Card, Row, Col, ListGroup } from "react-bootstrap";
import { FaTachometerAlt, FaUser, FaClipboardList, FaFileAlt } from "react-icons/fa";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [logbooks, setLogbooks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogbooks, setLoadingLogbooks] = useState(true);

  // Fetch data pengguna dari backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://web-logbook-bvjl.vercel.app/users/users");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil data pengguna");
        }

        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Fetch data logbook dari backend
  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        const response = await fetch("https://web-logbook-bvjl.vercel.app/logbooks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil data logbook");
        }

        setLogbooks(data.logbooks);
      } catch (error) {
        console.error("Error fetching logbooks:", error.message);
      } finally {
        setLoadingLogbooks(false);
      }
    };

    fetchLogbooks();
  }, []);

  const totalLogbook = logbooks.length;
  const totalUser = users.length;
  const laporanTerakhir = logbooks[0];

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
      <Card className="mb-4">
        <Card.Header style={{ fontWeight: 600, background: "var(--color-accent)", color: "#fff" }}>
          Logbook Terbaru
        </Card.Header>
        <ListGroup variant="flush">
          {loadingLogbooks ? (
            <ListGroup.Item>Memuat data logbook...</ListGroup.Item>
          ) : logbooks.length > 0 ? (
            logbooks.map((log) => (
              <ListGroup.Item key={log.id}>
                <div style={{ fontWeight: 600 }}>{log.laporan}</div>
                <div style={{ fontSize: "0.97rem", color: "#888" }}>
                  {log.tanggal} {log.jam} &mdash; {log.user}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>Data logbook tidak tersedia.</ListGroup.Item>
          )}
        </ListGroup>
      </Card>
      <Card>
        <Card.Header style={{ fontWeight: 600, background: "var(--color-primary)", color: "#fff" }}>
          Daftar Pengguna
        </Card.Header>
        <ListGroup variant="flush">
          {loadingUsers ? (
            <ListGroup.Item>Memuat data pengguna...</ListGroup.Item>
          ) : users.length > 0 ? (
            users.map((user) => (
              <ListGroup.Item key={user.id}>
                <div style={{ fontWeight: 600 }}>{user.name}</div>
                <div style={{ fontSize: "0.97rem", color: "#888" }}>
                  {user.email} &mdash; {user.role}
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>Data pengguna tidak tersedia.</ListGroup.Item>
          )}
        </ListGroup>
      </Card>
    </div>
  );
};

export default Dashboard;