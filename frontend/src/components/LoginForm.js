import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { FaLock, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    background: "var(--color-secondary)",
    justifyContent: "center",
  },
  card: {
    background: "#fff",
    borderRadius: "1.2rem",
    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
    padding: "2.5rem 2rem",
    maxWidth: 400,
    width: "100%",
  },
  brand: {
    fontWeight: 800,
    fontSize: "2rem",
    color: "var(--color-accent)",
    textAlign: "center",
    marginBottom: "0.5rem",
    letterSpacing: "1px",
  },
  title: {
    textAlign: "center",
    fontWeight: 600,
    fontSize: "1.2rem",
    color: "var(--color-primary)",
    marginBottom: "2rem",
  },
  inputIcon: {
    marginRight: "0.5rem",
    color: "var(--color-accent)",
  },
  ctaButton: {
    width: "100%",
    backgroundColor: "var(--color-cta)",
    border: "none",
    fontWeight: 700,
    borderRadius: "2rem",
    padding: "0.7rem",
    marginTop: "0.5rem",
    fontSize: "1.08rem",
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.7rem",
    marginBottom: "1.2rem",
    fontSize: "0.98rem",
  },
  link: {
    color: "var(--color-accent)",
    textDecoration: "underline",
    fontWeight: 600,
    cursor: "pointer",
  },
  register: {
    textAlign: "center",
    marginTop: "1.5rem",
    fontSize: "1rem",
  },
};

const LoginForm = () => {
  const [form, setForm] = useState({ username: "", password: "", remember: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Logika statis: username = user, password = 123
      if (!form.username || !form.password) {
        setError("Email/Username dan Password wajib diisi.");
      } else if (form.username === "user" && form.password === "123") {
        navigate("/dashboard");
      } else if (form.password.length < 4) {
        setError("Password minimal 4 karakter.");
      } else {
        setError("Email/Username atau Password salah.");
      }
    }, 900);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.brand}>LogAOE</div>
        <div style={styles.title}>Masuk ke LogAOE</div>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit} autoComplete="off">
          <Form.Group className="mb-3" controlId="loginUsername">
            <Form.Label>
              <FaUser style={styles.inputIcon} />
              Email / Username
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="Masukkan email atau username"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoFocus
            />
          </Form.Group>
          <Form.Group className="mb-2" controlId="loginPassword">
            <Form.Label>
              <FaLock style={styles.inputIcon} />
              Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Masukkan password"
              name="password"
              value={form.password}
              onChange={handleChange}
            />
          </Form.Group>
          <div style={styles.options}>
            <Form.Check
              type="checkbox"
              label="Ingat saya"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              id="rememberMe"
            />
            <Link to="/forgot-password" style={styles.link}>
              Lupa password?
            </Link>
          </div>
          <Button
            type="submit"
            style={styles.ctaButton}
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </Button>
        </Form>
        <div style={styles.register}>
          Belum punya akun?{" "}
          <Link to="/signup" style={styles.link}>
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;