import React from "react";
import { Container } from "react-bootstrap";

const styles = {
  footer: {
    background: "var(--color-accent)",
    color: "#fff",
    padding: "1.7rem 0",
    textAlign: "center",
    fontWeight: 600,
    letterSpacing: "0.5px",
    fontSize: "1.08rem",
    marginTop: 0,
    boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
  },
  link: {
    color: "var(--color-cta)",
    textDecoration: "underline",
    marginLeft: "0.5rem",
    fontWeight: 700,
  },
};

const Footer = () => (
  <footer style={styles.footer}>
    <Container>
      &copy; {new Date().getFullYear()} <b>LogAOE</b> &mdash; E-Logbook PKP-PK Bandara.
      <span>
        {" "}Dibuat dengan <span style={{color: "var(--color-cta)"}}>❤️</span> oleh
        <a href="https://github.com/yourusername" style={styles.link} target="_blank" rel="noopener noreferrer">
          Tim LogAOE
        </a>
      </span>
    </Container>
  </footer>
);

export default Footer;