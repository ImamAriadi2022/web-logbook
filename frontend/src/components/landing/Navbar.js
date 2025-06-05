import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";

const styles = {
  navbar: {
    backgroundColor: "var(--color-primary)",
  },
  navLink: {
    color: "#fff", // Lebih kontras
    marginRight: "1rem",
    fontWeight: 600,
    textShadow: "0 1px 4px rgba(0,0,0,0.18)",
  },
  brand: {
    color: "var(--color-accent)",
    fontWeight: 700,
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    textShadow: "0 1px 4px rgba(0,0,0,0.18)",
  },
  ctaButton: {
    backgroundColor: "var(--color-cta)",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    marginLeft: "0.5rem",
    borderRadius: "2rem",
    padding: "0.5rem 1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  },
  signupButton: {
    backgroundColor: "var(--color-accent)",
    border: "none",
    color: "#fff",
    fontWeight: 600,
    marginLeft: "0.5rem",
    borderRadius: "2rem",
    padding: "0.5rem 1.5rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
  },
};

const getEnv = (key, fallback) => {
  if (typeof import.meta !== "undefined" && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

const AppNavbar = () => {
  React.useEffect(() => {
    document.documentElement.style.setProperty(
      "--color-primary",
      getEnv("VITE_COLOR_PRIMARY", "#0077B6")
    );
    document.documentElement.style.setProperty(
      "--color-secondary",
      getEnv("VITE_COLOR_SECONDARY", "#CAF0F8")
    );
    document.documentElement.style.setProperty(
      "--color-accent",
      getEnv("VITE_COLOR_ACCENT", "#023E8A")
    );
    document.documentElement.style.setProperty(
      "--color-cta",
      getEnv("VITE_COLOR_CTA", "#FF6B6B")
    );
    document.documentElement.style.setProperty(
      "--color-text",
      getEnv("VITE_COLOR_TEXT", "#1A1A1A")
    );
  }, []);

  return (
    <Navbar expand="lg" style={styles.navbar} variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/" style={styles.brand}>
          <FaBook />
          Web Logbook
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" style={styles.navLink}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/about" style={styles.navLink}>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" style={styles.navLink}>
              Contact
            </Nav.Link>
          </Nav>
          <Button as={Link} to="/login" style={styles.ctaButton}>
            Login
          </Button>
          <Button as={Link} to="/signup" style={styles.signupButton}>
            Daftar
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;