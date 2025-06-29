import { useEffect, useState } from "react";
import { Badge, Card, Col, ListGroup, Row } from "react-bootstrap";
import { FaCalendarAlt, FaClipboardList, FaClock, FaFileAlt, FaTachometerAlt, FaUser } from "react-icons/fa";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [logbooks, setLogbooks] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLogbooks, setLoadingLogbooks] = useState(true);

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

  // Fetch data pengguna dari backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://web-logbook-bvjl.vercel.app/api/users/users");
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
        const response = await fetch("https://web-logbook-bvjl.vercel.app/api/logbooks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil data logbook");
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
            flights: Array.isArray(log.flights) ? log.flights : JSON.parse(log.flights || "[]"),
            koja: parseIfNeeded(log.koja) || "Tidak tersedia",
            regu: parseIfNeeded(log.regu) || "Tidak tersedia",
          };
        });

        // Sort by date descending (terbaru dulu)
        formattedLogs.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
        
        setLogbooks(formattedLogs);
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
  
  // Statistik logbook berdasarkan bulan ini
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const logbooksThisMonth = logbooks.filter(log => {
    const logDate = new Date(log.tanggal);
    return logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear;
  }).length;

  // Logbook terbaru
  const latestLogbooks = logbooks.slice(0, 5);
  
  // User yang paling aktif (paling banyak membuat logbook)
  const userActivity = {};
  logbooks.forEach(log => {
    const userId = log.user_id;
    if (userActivity[userId]) {
      userActivity[userId].count++;
    } else {
      const user = users.find(u => u.id === userId);
      userActivity[userId] = {
        count: 1,
        name: user ? user.name : 'Unknown User',
        email: user ? user.email : ''
      };
    }
  });
  
  const mostActiveUsers = Object.values(userActivity)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
        <FaTachometerAlt style={{ fontSize: 28 }} /> Dashboard
      </h2>
      <Row className="mb-4" xs={1} md={4} style={{ gap: "1rem 0" }}>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-accent)" }}>
            <Card.Body>
              <FaClipboardList style={{ fontSize: 32, color: "var(--color-accent)", marginBottom: 8 }} />
              <div style={{ fontSize: 22, fontWeight: 700 }}>{totalLogbook}</div>
              <div style={{ color: "#888" }}>Total Logbook</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-primary)" }}>
            <Card.Body>
              <FaUser style={{ fontSize: 32, color: "var(--color-primary)", marginBottom: 8 }} />
              <div style={{ fontSize: 22, fontWeight: 700 }}>{totalUser}</div>
              <div style={{ color: "#888" }}>Total User</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid var(--color-cta)" }}>
            <Card.Body>
              <FaCalendarAlt style={{ fontSize: 32, color: "var(--color-cta)", marginBottom: 8 }} />
              <div style={{ fontSize: 22, fontWeight: 700 }}>{logbooksThisMonth}</div>
              <div style={{ color: "#888" }}>Logbook Bulan Ini</div>
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card style={{ textAlign: "center", borderLeft: "5px solid #28a745" }}>
            <Card.Body>
              <FaClock style={{ fontSize: 32, color: "#28a745", marginBottom: 8 }} />
              <div style={{ fontSize: 22, fontWeight: 700 }}>
                {latestLogbooks.length > 0 ? formatDateForDisplay(latestLogbooks[0].tanggal) : "-"}
              </div>
              <div style={{ color: "#888" }}>Terakhir Dicatat</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col md={6}>
          <Card className="h-100">
            <Card.Header style={{ fontWeight: 600, background: "var(--color-accent)", color: "#fff" }}>
              <FaFileAlt style={{ marginRight: 8 }} />
              Logbook Terbaru
            </Card.Header>
            <ListGroup variant="flush">
              {loadingLogbooks ? (
                <ListGroup.Item>Memuat data logbook...</ListGroup.Item>
              ) : latestLogbooks.length > 0 ? (
                latestLogbooks.map((log) => (
                  <ListGroup.Item key={log.id}>
                    <div style={{ fontWeight: 600 }}>{log.laporan}</div>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      {formatDateForDisplay(log.tanggal)} {formatTimeForDisplay(log.jam)} 
                      {log.user && <span> &mdash; {log.user}</span>}
                    </div>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>Data logbook tidak tersedia.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100">
            <Card.Header style={{ fontWeight: 600, background: "var(--color-primary)", color: "#fff" }}>
              <FaUser style={{ marginRight: 8 }} />
              User Paling Aktif
            </Card.Header>
            <ListGroup variant="flush">
              {loadingUsers ? (
                <ListGroup.Item>Memuat data pengguna...</ListGroup.Item>
              ) : mostActiveUsers.length > 0 ? (
                mostActiveUsers.map((user, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <div>
                      <div style={{ fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>{user.email}</div>
                    </div>
                    <Badge bg="primary" pill>{user.count} logbook</Badge>
                  </ListGroup.Item>
                ))
              ) : (
                <ListGroup.Item>Data pengguna tidak tersedia.</ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;