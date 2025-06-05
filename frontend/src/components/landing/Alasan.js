import React from "react";
import { Container, Row, Col, Accordion } from "react-bootstrap";
import { FaCheckCircle } from "react-icons/fa";

const alasanList = [
  {
    title: "Menghemat kertas & biaya cetak logbook manual",
    detail: "Dengan digitalisasi logbook, tidak perlu lagi membeli kertas dan tinta untuk pencatatan manual. Semua data tersimpan secara elektronik dan ramah lingkungan.",
  },
  {
    title: "Mempermudah pencarian data historis",
    detail: "Data logbook terdahulu dapat dicari dengan cepat menggunakan fitur pencarian, tanpa harus membongkar arsip fisik yang menumpuk.",
  },
  {
    title: "Meminimalkan risiko kehilangan data",
    detail: "Data tersimpan secara cloud dan terbackup otomatis, sehingga risiko kehilangan akibat kerusakan atau kelalaian dapat dihindari.",
  },
  {
    title: "User-friendly dan ringan digunakan",
    detail: "Antarmuka aplikasi dirancang sederhana dan mudah dipahami, sehingga semua anggota tim dapat menggunakannya tanpa pelatihan khusus.",
  },
];

const styles = {
  section: {
    background: "#fff",
    padding: "3rem 0",
  },
  title: {
    textAlign: "center",
    fontWeight: 700,
    fontSize: "2rem",
    color: "var(--color-primary)",
    marginBottom: "2rem",
  },
  desc: {
    color: "var(--color-text)",
    fontSize: "1.08rem",
    margin: "0 auto 2.5rem auto",
    lineHeight: 1.7,
    maxWidth: 700,
    textAlign: "center",
  },
  accordionHeader: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontWeight: 600,
    color: "var(--color-primary)",
    fontSize: "1.08rem",
  },
  icon: {
    color: "var(--color-cta)",
    fontSize: "1.3rem",
    flexShrink: 0,
  },
  accordionBody: {
    color: "var(--color-text)",
    fontSize: "1.03rem",
    opacity: 0.95,
  },
};

const Alasan = () => (
  <section style={styles.section}>
    <Container>
      <h2 style={styles.title}>Kenapa Memilih LogAOE?</h2>
      <div style={styles.desc}>
        LogAOE membantu tim PKP-PK bandara beralih dari pencatatan manual ke digital, sehingga proses pencatatan, pencarian, dan pengarsipan data menjadi jauh lebih efisien, aman, dan mudah diakses kapan saja. Dengan tampilan yang user-friendly, semua anggota tim dapat beradaptasi dengan cepat tanpa pelatihan khusus.
      </div>
      <Row className="justify-content-center">
        <Col md={8}>
          <Accordion>
            {alasanList.map((alasan, idx) => (
              <Accordion.Item eventKey={idx.toString()} key={idx}>
                <Accordion.Header>
                  <span style={styles.accordionHeader}>
                    <FaCheckCircle style={styles.icon} />
                    {alasan.title}
                  </span>
                </Accordion.Header>
                <Accordion.Body style={styles.accordionBody}>
                  {alasan.detail}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Col>
      </Row>
    </Container>
  </section>
);

export default Alasan;