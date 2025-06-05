import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaBookOpen, FaLock, FaFilePdf, FaUsers } from "react-icons/fa";

const fiturList = [
  {
    icon: <FaBookOpen size={40} color="var(--color-accent)" />,
    title: "Logbook Digital Terintegrasi",
    desc: "Pencatatan kegiatan operasional dan pergerakan pesawat langsung dari watchroom hanya dalam beberapa klik.",
  },
  {
    icon: <FaLock size={40} color="var(--color-accent)" />,
    title: "Aman & Mudah Diakses",
    desc: "Data tersimpan secara cloud dan bisa diakses dari berbagai perangkat, kapan pun dibutuhkan.",
  },
  {
    icon: <FaFilePdf size={40} color="var(--color-accent)" />,
    title: "Export ke PDF & Arsip Otomatis",
    desc: "Buat dan unduh laporan logbook dalam format PDF. Tidak ada lagi kehilangan data atau penumpukan dokumen fisik.",
  },
  {
    icon: <FaUsers size={40} color="var(--color-accent)" />,
    title: "Manajemen Pengguna",
    desc: "Petugas watchroom dapat mengisi log, supervisor dapat memverifikasi, semua terpantau secara real-time.",
  },
];

const styles = {
  section: {
    background: "var(--color-secondary)",
    padding: "3rem 0",
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "2rem",
    color: "var(--color-primary)",
    marginBottom: "2.5rem",
  },
  card: {
    border: "none",
    borderRadius: "1.25rem",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "2.5rem 1.5rem",
    textAlign: "center",
    background: "#fff",
    minHeight: "320px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  cardHover: {
    transform: "translateY(-8px) scale(1.03)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
  },
  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.2rem",
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: "1.18rem",
    margin: "0.5rem 0 0.7rem 0",
    color: "var(--color-accent)",
    letterSpacing: "0.2px",
  },
  cardDesc: {
    color: "var(--color-text)",
    fontSize: "1rem",
    opacity: 0.92,
    marginTop: "auto",
  },
};

const Fitur = () => {
  const [hovered, setHovered] = React.useState(null);

  return (
    <section style={styles.section}>
      <Container>
        <h2 style={styles.title}>Fitur Utama</h2>
        <Row>
          {fiturList.map((fitur, idx) => (
            <Col key={idx} md={6} lg={3} className="d-flex">
              <Card
                style={{
                  ...styles.card,
                  ...(hovered === idx ? styles.cardHover : {}),
                }}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={styles.iconWrap}>{fitur.icon}</div>
                <div style={styles.cardTitle}>{fitur.title}</div>
                <div style={styles.cardDesc}>{fitur.desc}</div>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Fitur;