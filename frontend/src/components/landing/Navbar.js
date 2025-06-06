import React, { useEffect, useState, useRef } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa";

const styles = {
  navbar: {
    backgroundColor: "var(--color-primary)",
    opacity: 0,
    transform: "translateY(-60px)",
    animation: "navbarSlideDown 0.7s cubic-bezier(.4,2,.6,1) forwards",
    animationDelay: "0.1s",
  },
  navLink: {
    color: "#fff",
    marginRight: "1rem",
    fontWeight: 600,
    textShadow: "0 1px 4px rgba(0,0,0,0.18)",
    opacity: 0,
    transform: "scale(0.8)",
    animation: "navbarPopUp 0.5s forwards",
  },
  brand: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.5rem",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    textShadow: "0 1px 4px rgba(0,0,0,0.18)",
    opacity: 0,
    transform: "scale(0.8)",
    animation: "navbarPopUp 0.5s forwards",
    animationDelay: "0.3s",
  },
  logoImg: {
    height: "2.1rem",
    width: "2.1rem",
    objectFit: "contain",
    marginRight: "0.5rem",
    filter: "drop-shadow(0 1px 4px rgba(0,0,0,0.13))",
    background: "#fff",
    borderRadius: "50%",
    padding: "2px",
    color: "#fff",
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
    opacity: 0,
    transform: "scale(0.8)",
    animation: "navbarPopUp 0.5s forwards",
    animationDelay: "0.45s",
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
    opacity: 0,
    transform: "scale(0.8)",
    animation: "navbarPopUp 0.5s forwards",
    animationDelay: "0.6s",
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
  const [animated, setAnimated] = useState(false);
  const navRef = useRef();

  useEffect(() => {
    // Inject keyframes for navbar animation
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = `
      @keyframes navbarSlideDown {
        from { opacity: 0; transform: translateY(-60px);}
        to { opacity: 1; transform: translateY(0);}
      }
      @keyframes navbarPopUp {
        from { opacity: 0; transform: scale(0.8);}
        to { opacity: 1; transform: scale(1);}
      }
    `;
    document.head.appendChild(styleSheet);
    setTimeout(() => setAnimated(true), 100); // trigger animation after mount
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
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
    <Navbar
      expand="lg"
      style={{
        ...styles.navbar,
        animationPlayState: animated ? "running" : "paused",
      }}
      variant="dark"
      ref={navRef}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            ...styles.brand,
            animationPlayState: animated ? "running" : "paused",
          }}
        >
          <img src="img/logo.png" alt="Logo" style={styles.logoImg} />
          Web Logbook
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link as={Link} to="/" style={styles.navLink}>
              Home
            </Nav.Link> */}
          </Nav>
          <Button
            as={Link}
            to="/login"
            style={{
              ...styles.ctaButton,
              animationPlayState: animated ? "running" : "paused",
            }}
          >
            Login
          </Button>
          <Button
            as={Link}
            to="/signup"
            style={{
              ...styles.signupButton,
              animationPlayState: animated ? "running" : "paused",
            }}
          >
            Daftar
          </Button>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;