import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaQuoteLeft } from "react-icons/fa";

const styles = {
  section: {
    background: "var(--color-secondary)",
    padding: "3rem 0",
  },
  card: {
    border: "none",
    borderRadius: "1.5rem",
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    padding: "2.5rem 2rem",
    textAlign: "center",
    background: "#fff",
    maxWidth: "600px",
    margin: "0 auto",
  },
  quoteIcon: {
    color: "var(--color-accent)",
    fontSize: "2rem",
    marginBottom: "1rem",
  },
  text: {
    fontStyle: "italic",
    color: "var(--color-text)",
    fontSize: "1.15rem",
    marginBottom: "1.5rem",
  },
  author: {
    fontWeight: 600,
    color: "var(--color-primary)",
    fontSize: "1rem",
  },
};

const Testimoni = () => (
  <section style={styles.section}>
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <Card style={styles.card}>
            <FaQuoteLeft style={styles.quoteIcon} />
            <div style={styles.text}>
              “Sebelumnya kami kewalahan menyimpan catatan manual yang sering rusak atau hilang. Dengan LogAOE, semua jadi lebih ringkas dan efisien.”
            </div>
            <div style={styles.author}>
              — Petugas Watchroom PKP-PK Hang Nadim Batam
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  </section>
);

export default Testimoni;