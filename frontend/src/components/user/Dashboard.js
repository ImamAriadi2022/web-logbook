import { useEffect, useState } from "react";
import { Button, Card, Col, ListGroup, Row } from "react-bootstrap";
import { FaBook, FaPlusCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState({ totalLog: 0, totalShift: 0, totalPetugas: 0 });
  const [aktivitasTerbaru, setAktivitasTerbaru] = useState([]);
  const [error, setError] = useState("");

  // Helper function untuk format tanggal ke format Indonesia
  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "Tidak tersedia") return "Tidak tersedia";
    
    try {
      let date;
      
      if (dateString.includes('T')) {
        date = new Date(dateString);
      } else if (dateString.includes('-')) {
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          date = new Date(dateString);
        } else {
          date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        date = new Date(dateString);
      }

      if (isNaN(date.getTime())) {
        return dateString;
      }

      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      const day = date.getDate().toString().padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error) {
      return dateString;
    }
  };

  // Helper function untuk format waktu
  const formatTimeForDisplay = (timeString) => {
    if (!timeString || timeString === "Tidak tersedia") return "Tidak tersedia";
    
    try {
      if (timeString.includes('T')) {
        const date = new Date(timeString);
        if (isNaN(date.getTime())) return timeString;
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      } else if (timeString.includes(':')) {
        const timeParts = timeString.split(':');
        if (timeParts.length >= 2) {
          return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
        }
      }
      
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("https://web-logbook-bvjl.vercel.app/api/logbooks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil logbook");
        }

        // Parse JSON fields dan format data
        const formattedLogs = data.logbooks.map((log) => {
          const parseIfNeeded = (value) => {
            if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
              try {
                return JSON.parse(value);
              } catch (e) {
                return value;
              }
            }
            return value;
          };

          return {
            ...log,
            petugas: Array.isArray(log.petugas) ? log.petugas : JSON.parse(log.petugas || "[]"),
          };
        });

        setLogs(formattedLogs);

        // Hitung ringkasan data
        const totalLog = formattedLogs.length;
        const shiftSet = new Set(formattedLogs.map((log) => formatTimeForDisplay(log.jam)));
        const petugasSet = new Set(formattedLogs.flatMap((log) => 
          Array.isArray(log.petugas) ? log.petugas : []
        ));
        setSummary({
          totalLog,
          totalShift: shiftSet.size,
          totalPetugas: petugasSet.size,
        });

        // Ambil aktivitas terbaru
        const aktivitas = formattedLogs
          .map((log) => ({
            id: log.id,
            waktu: `${formatDateForDisplay(log.tanggal)} ${formatTimeForDisplay(log.jam)}`,
            aktivitas: log.laporan || log.report?.kejadian || "Tidak ada kejadian",
            petugas: Array.isArray(log.petugas) ? log.petugas.join(", ") : "Tidak ada petugas",
          }))
          .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal))
          .slice(0, 5);

        setAktivitasTerbaru(aktivitas);
      } catch (error) {
        console.error("Error fetching logbooks:", error.message);
        setError(error.message);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: "1.5rem" }}>
        Dashboard
      </h2>
      {error && <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>}
      <Row className="mb-4" xs={1} md={3} style={{ gap: "1rem 0" }}>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-accent)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{summary.totalLog}</div>
              <div style={{ color: "#888" }}>Total Logbook</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-cta)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{summary.totalShift}</div>
              <div style={{ color: "#888" }}>Total Shift</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-primary)" }}>
            <Card.Body>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{summary.totalPetugas}</div>
              <div style={{ color: "#888" }}>Total Petugas</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={8} className="mb-4">
          <Card>
            <Card.Header style={{ fontWeight: 600, background: "var(--color-accent)", color: "#fff" }}>
              Aktivitas Terbaru
            </Card.Header>
            <ListGroup variant="flush">
              {aktivitasTerbaru.map((a) => (
                <ListGroup.Item key={a.id}>
                  <div style={{ fontWeight: 600 }}>{a.aktivitas}</div>
                  <div style={{ fontSize: "0.97rem", color: "#888" }}>
                    {a.waktu} &mdash; {a.petugas}
                  </div>
                </ListGroup.Item>
              ))}
              {aktivitasTerbaru.length === 0 && (
                <ListGroup.Item>Tidak ada aktivitas terbaru.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header style={{ fontWeight: 600 }}>Shortcut</Card.Header>
            <Card.Body style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Button as={Link} to="/logbook" variant="primary">
                <FaBook style={{ marginRight: 8 }} />
                Lihat Logbook
              </Button>
              <Button as={Link} to="/logbook/tambah" variant="success">
                <FaPlusCircle style={{ marginRight: 8 }} />
                Tambah Logbook
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;