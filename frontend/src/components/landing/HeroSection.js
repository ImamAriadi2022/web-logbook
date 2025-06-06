import React, { useEffect } from "react";
import { Container, Button } from "react-bootstrap";

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
    width: "1358px",
    position: "relative",
    left: "50%",
    right: "50%",
    marginLeft: "-50vw",
    marginRight: "-50vw",
    overflow: "hidden",
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
    fontSize: "4rem",
    marginBottom: "1.5rem",
    background: "#fff",
    borderRadius: "50%",
    padding: "0.2rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    display: "inline-block",
    opacity: 0,
    transform: "scale(0.7)",
    animation: "heroFadeInIcon 0.7s 0.1s cubic-bezier(.4,2,.6,1) forwards",
  },
  logoImg: {
    width: "5rem",
    height: "5rem",
    // objectFit: "contain",
    display: "block",
    // margin: "0 auto",
    borderRadius: "50%",
    background: "#fff",
    // boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
    // padding: "0.4rem",
  },
  title: {
    fontWeight: 900,
    fontSize: "2.7rem",
    color: "#fff",
    marginBottom: "1.2rem",
    textShadow: "0 2px 16px rgba(0,0,0,0.18)",
    lineHeight: 1.2,
    opacity: 0,
    transform: "translateY(30px)",
    animation: "heroFadeInTitle 0.7s 0.3s cubic-bezier(.4,2,.6,1) forwards",
  },
  subtitle: {
    color: "#f1f1f1",
    fontSize: "1.25rem",
    marginBottom: "2.5rem",
    maxWidth: "600px",
    marginLeft: "auto",
    marginRight: "auto",
    textShadow: "0 1px 8px rgba(0,0,0,0.12)",
    opacity: 0,
    transform: "translateY(30px)",
    animation: "heroFadeInSubtitle 0.7s 0.5s cubic-bezier(.4,2,.6,1) forwards",
  },
  ctaGroup: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "2rem",
    opacity: 0,
    transform: "translateY(30px)",
    animation: "heroFadeInCta 0.7s 0.7s cubic-bezier(.4,2,.6,1) forwards",
  },
  ctaButton: {
    backgroundColor: "var(--color-cta)",
    border: "none",
    fontWeight: 700,
    padding: "0.85rem 2.5rem",
    fontSize: "1.1rem",
    borderRadius: "2rem",
    boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
    transition: "background 0.2s, transform 0.2s",
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
    transition: "background 0.2s, transform 0.2s",
  },
};

const HeroSection = () => {
  useEffect(() => {
    // Inject keyframes for hero animation
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes heroFadeInIcon {
        from { opacity: 0; transform: scale(0.7);}
        to { opacity: 1; transform: scale(1);}
      }
      @keyframes heroFadeInTitle {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
      }
      @keyframes heroFadeInSubtitle {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
      }
      @keyframes heroFadeInCta {
        from { opacity: 0; transform: translateY(30px);}
        to { opacity: 1; transform: translateY(0);}
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <section style={styles.section}>
      <Container>
        <div style={styles.content}>
          <div style={styles.icon}>
            <img src="img/logo.png" alt="Logo" style={styles.logoImg} />
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
};

export default HeroSection;