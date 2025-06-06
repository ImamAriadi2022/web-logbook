import React, { useEffect, useRef, useState } from "react";
import { Container } from "react-bootstrap";

const styles = {
  footer: {
    background: "var(--color-accent)",
    color: "#fff",
    padding: "1.2rem 0",
    textAlign: "center",
    fontWeight: 500,
    fontSize: "1rem",
    marginTop: 0,
    boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
    opacity: 0,
    transform: "translateY(60px)",
    animation: "footerSlideUp 0.7s cubic-bezier(.4,2,.6,1) forwards",
    animationPlayState: "paused",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.6rem",
  },
  logo: {
    width: "2.2rem",
    height: "2.2rem",
    objectFit: "contain",
    borderRadius: "50%",
    background: "#fff",
    boxShadow: "0 1px 6px rgba(0,0,0,0.10)",
    marginBottom: "0.2rem",
  },
  text: {
    color: "#fff",
    fontWeight: 500,
    fontSize: "1rem",
    margin: 0,
  },
};

const Footer = () => {
  const [visible, setVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    // Inject keyframes for footer animation
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes footerSlideUp {
        from { opacity: 0; transform: translateY(60px);}
        to { opacity: 1; transform: translateY(0);}
      }
    `;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!footerRef.current || visible) return;
      const rect = footerRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight - 60) {
        setVisible(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visible]);

  return (
    <footer
      ref={footerRef}
      style={{
        ...styles.footer,
        animationPlayState: visible ? "running" : "paused",
      }}
    >
      <img src="img/logo.png" alt="Logo" style={styles.logo} />
      <p style={styles.text}>
        &copy; {new Date().getFullYear()} LogAOE &mdash; E-Logbook PKP-PK Bandara
      </p>
    </footer>
  );
};

export default Footer;