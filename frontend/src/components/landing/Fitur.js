import React, { useEffect, useRef, useState } from "react";
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
    transition: "transform 0.3s cubic-bezier(.4,2,.6,1), box-shadow 0.3s cubic-bezier(.4,2,.6,1)",
    cursor: "pointer",
    opacity: 0,
    transform: "translateY(40px) scale(0.98)",
    animation: "fadeInUp 0.7s forwards",
    animationPlayState: "paused",
  },
  cardVisible: {
    animationPlayState: "running",
  },
  cardHover: {
    transform: "translateY(-8px) scale(1.04)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.14)",
  },
  iconWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "1.2rem",
    transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
  },
  iconWrapHover: {
    transform: "scale(1.18) rotate(-8deg)",
    filter: "drop-shadow(0 4px 12px rgba(2,62,138,0.13))",
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: "1.18rem",
    margin: "0.5rem 0 0.7rem 0",
    color: "var(--color-accent)",
    letterSpacing: "0.2px",
    transition: "color 0.2s",
  },
  cardDesc: {
    color: "var(--color-text)",
    fontSize: "1rem",
    opacity: 0.92,
    marginTop: "auto",
    transition: "opacity 0.2s",
  },
  // Keyframes for fadeInUp
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: "translateY(40px) scale(0.98)" },
    to: { opacity: 1, transform: "translateY(0) scale(1)" },
  },
};

function getCardStyle(idx, hovered, visible) {
  return {
    ...styles.card,
    animationDelay: `${0.1 + idx * 0.13}s`,
    ...(visible ? styles.cardVisible : {}),
    ...(hovered === idx ? styles.cardHover : {}),
  };
}

function getIconWrapStyle(hovered, idx) {
  return {
    ...styles.iconWrap,
    ...(hovered === idx ? styles.iconWrapHover : {}),
  };
}

const Fitur = () => {
  const [hovered, setHovered] = React.useState(null);
  const [visible, setVisible] = React.useState(false);
  const sectionRef = React.useRef(null);

  // Inject keyframes for fadeInUp animation
  React.useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(40px) scale(0.98);}
        to { opacity: 1; transform: translateY(0) scale(1);}
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  // Only trigger animation when section is scrolled into view
  React.useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || visible) return;
      const rect = sectionRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Jangan panggil handleScroll() di sini agar animasi hanya berjalan saat scroll
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  return (
    <section style={styles.section} ref={sectionRef}>
      <Container>
        <h2 style={styles.title}>Fitur Utama</h2>
        <Row>
          {fiturList.map((fitur, idx) => (
            <Col key={idx} md={6} lg={3} className="d-flex">
              <Card
                style={getCardStyle(idx, hovered, visible)}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
              >
                <div style={getIconWrapStyle(hovered, idx)}>{fitur.icon}</div>
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