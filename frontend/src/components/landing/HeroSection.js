import React from "react";
import { Container, Button } from "react-bootstrap";
import { FaShieldAlt } from "react-icons/fa";

// Ganti URL di bawah dengan gambar bandara/watchroom/operasional PKP-PK yang Anda miliki
const backgroundUrl =
  "https://plus.unsplash.com/premium_photo-1679758629557-117eb86fa650?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const styles = {
  section: {
    background: `linear-gradient(rgba(0, 34, 68, 0.55), rgba(0, 34, 68, 0.55)), url('${backgroundUrl}') center/cover no-repeat`,
    padding: "6rem 0",
    minHeight: "70vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100vw",
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
  },
  content: {
    textAlign: "center",
    color: "#fff",
    width: "100%",
    maxWidth: "800px",
    margin: "0 auto",
    zIndex: 2,
    position: "relative",
  },
  icon: {
    fontSize: "3rem",
    color: "var(--color-accent)",
    marginBottom: "1.5rem",
    background: "#fff",
    borderRadius: "50%",
    padding: "0.7rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    display: "inline-block",
  },
  title: {
    fontWeight: 900,
    fontSize: "2.7rem",
    color: "#fff",
    marginBottom: "1.2rem",
    textShadow: "0 2px 16px rgba(0,0,0,0.18)",
    lineHeight: 1.2,
  },
  subtitle: {
    color: "#f1f1f1",
    fontSize: "1.25rem",
    marginBottom: "2.5rem",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    textShadow: "0 1px 8px rgba(0,0,0,0.12)",
  },
  ctaGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "2rem",
  },
  ctaButton: {
    backgroundColor: "var(--color-cta)",
    border: "none",
    fontWeight: 700,
    padding: "0.85rem 2.5rem",
    fontSize: "1.1rem",
    borderRadius: "2rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
  },
  demoButton: {
    backgroundColor: "var(--color-accent)",
    border: "none",
    fontWeight: 700,
    padding: "0.85rem 2.5rem",
    fontSize: "1.1rem",
    borderRadius: "2rem",
    color: "#fff",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
  },
};

const HeroSection = () => (
  <section style={styles.section}>
    <Container>
      <div style={styles.content}>
        <div style={styles.icon}>
          <FaShieldAlt color="var(--color-accent)" />
        </div>
        <h1 style={styles.title}>
          Catat, Pantau, dan Arsipkan Operasi PKP-PK Secara Digital
        </h1>
        <p style={styles.subtitle}>
          Tinggalkan sistem manual yang rawan hilang dan tidak efisien. LogAOE hadir sebagai solusi e-logbook berbasis web yang mendukung efektivitas kerja tim PKP-PK di bandara.
        </p>
        <div style={styles.ctaGroup}>
          <Button style={styles.ctaButton} size="lg">
            Coba Sekarang
          </Button>
          <Button style={styles.demoButton} size="lg" variant="primary">
            Lihat Demo
          </Button>
        </div>
      </div>
    </Container>
  </section>
);

export default HeroSection;