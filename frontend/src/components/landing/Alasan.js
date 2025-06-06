import React, { useEffect, useRef, useState } from "react";
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
    transition: "color 0.2s",
  },
  icon: {
    color: "var(--color-cta)",
    fontSize: "1.3rem",
    flexShrink: 0,
    transition: "transform 0.3s cubic-bezier(.4,2,.6,1)",
  },
  accordionBody: {
    color: "var(--color-text)",
    fontSize: "1.03rem",
    opacity: 0.95,
    animation: "fadeAccordionBody 0.5s",
  },
};

const Alasan = () => {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Inject keyframes for fade-in and accordion animation
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-24px);}
        to { opacity: 1; transform: translateY(0);}
      }
      @keyframes fadeAccordionBody {
        from { opacity: 0; transform: translateY(16px);}
        to { opacity: 1; transform: translateY(0);}
      }
      .accordion-header .fa-check-circle {
        transition: transform 0.3s cubic-bezier(.4,2,.6,1);
      }
      .accordion-button:not(.collapsed) .fa-check-circle {
        transform: scale(1.25) rotate(-10deg);
        filter: drop-shadow(0 4px 12px rgba(2,62,138,0.13));
      }
      .alasan-accordion-item {
        opacity: 0;
        animation: fadeInDown 0.7s forwards;
        animation-play-state: paused;
      }
      .alasan-accordion-item.visible {
        opacity: 1 !important;
        animation-play-state: running;
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
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
        <h2
          style={{
            ...styles.title,
            animation: visible ? "fadeInDown 0.7s 0.1s both" : "none",
          }}
        >
          Kenapa Memilih LogAOE?
        </h2>
        <div
          style={{
            ...styles.desc,
            animation: visible ? "fadeInDown 0.7s 0.25s both" : "none",
          }}
        >
          LogAOE membantu tim PKP-PK bandara beralih dari pencatatan manual ke digital, sehingga proses pencatatan, pencarian, dan pengarsipan data menjadi jauh lebih efisien, aman, dan mudah diakses kapan saja. Dengan tampilan yang user-friendly, semua anggota tim dapat beradaptasi dengan cepat tanpa pelatihan khusus.
        </div>
        <Row className="justify-content-center">
          <Col md={8}>
            <Accordion>
              {alasanList.map((alasan, idx) => (
                <Accordion.Item
                  eventKey={idx.toString()}
                  key={idx}
                  className={`alasan-accordion-item${visible ? " visible" : ""}`}
                  style={{
                    animationDelay: visible ? `${0.25 + idx * 0.13}s` : "0s",
                  }}
                >
                  <Accordion.Header>
                    <span style={styles.accordionHeader}>
                      <FaCheckCircle className="fa-check-circle" style={styles.icon} />
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
};

export default Alasan;