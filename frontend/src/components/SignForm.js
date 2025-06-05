import React, { useState } from "react";
import { Form, Button, Alert, InputGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "var(--color-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 0",
  },
  container: {
    display: "flex",
    background: "#fff",
    borderRadius: "1.2rem",
    boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
    overflow: "hidden",
    width: "100%",
    maxWidth: 900,
    minHeight: 520,
    flexDirection: "row",
  },
  left: {
    flex: 1,
    background: "var(--color-secondary)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2.5rem 2rem",
    borderRight: "1px solid #e0e0e0",
  },
  logo: {
    width: 72,
    height: 72,
    marginBottom: "1.2rem",
    objectFit: "contain",
  },
  leftTitle: {
    color: "var(--color-accent)",
    fontWeight: 800,
    fontSize: "1.6rem",
    marginBottom: "0.7rem",
    textAlign: "center",
  },
  leftDesc: {
    color: "var(--color-text)",
    fontSize: "1.08rem",
    textAlign: "center",
    opacity: 0.9,
  },
  right: {
    flex: 1,
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formTitle: {
    color: "var(--color-accent)",
    fontWeight: 700,
    fontSize: "1.35rem",
    marginBottom: "1.2rem",
    textAlign: "center",
  },
  formSub: {
    color: "var(--color-primary)",
    fontSize: "1.05rem",
    textAlign: "center",
    marginBottom: "1.7rem",
    opacity: 0.85,
  },
  input: {
    borderRadius: "0.7rem",
    border: "1.5px solid #e0e0e0",
    marginBottom: "1.1rem",
    padding: "0.7rem 1rem",
    fontSize: "1rem",
    transition: "border-color 0.2s",
  },
  inputFocus: {
    borderColor: "var(--color-primary)",
    outline: "none",
    boxShadow: "0 0 0 2px #0077B633",
  },
  button: {
    width: "100%",
    backgroundColor: "var(--color-cta)",
    border: "none",
    fontWeight: 700,
    borderRadius: "2rem",
    padding: "0.8rem",
    fontSize: "1.08rem",
    marginTop: "0.5rem",
    marginBottom: "0.7rem",
    transition: "background 0.2s",
  },
  buttonHover: {
    backgroundColor: "#E74C3C",
  },
  loginLink: {
    textAlign: "center",
    fontSize: "1rem",
    marginTop: "0.7rem",
  },
  loginAnchor: {
    color: "var(--color-accent)",
    textDecoration: "underline",
    fontWeight: 600,
    marginLeft: "0.2rem",
  },
  privacy: {
    textAlign: "center",
    fontSize: "0.95rem",
    marginTop: "1.2rem",
    color: "#888",
  },
  eyeButton: {
    background: "none",
    border: "none",
    boxShadow: "none",
    color: "#888",
    fontSize: "1.1rem",
    padding: "0 0.8rem",
    display: "flex",
    alignItems: "center",
  },
  '@media (maxWidth: 768px)': {
    container: {
      flexDirection: "column",
      minHeight: "unset",
    },
    left: {
      borderRight: "none",
      borderBottom: "1px solid #e0e0e0",
      padding: "2rem 1.2rem",
    },
    right: {
      padding: "2rem 1.2rem",
    },
  },
};

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirm: "",
};

const SignForm = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFocus = (e) => {
    setFocus((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const handleBlur = (e) => {
    setFocus((prev) => ({ ...prev, [e.target.name]: false }));
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return "Semua field wajib diisi.";
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      return "Format email tidak valid.";
    }
    if (form.password.length < 6) {
      return "Password minimal 6 karakter.";
    }
    if (form.password !== form.confirm) {
      return "Konfirmasi password tidak cocok.";
    }
    return "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess("Pendaftaran berhasil! Silakan login.");
      setForm(initialForm);
    }, 1200);
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.left}>
          <img src="/logo-aoe.png" alt="Logo LogAOE" style={styles.logo} />
          <h1 style={styles.leftTitle}>Selamat Datang di LogAOE</h1>
          <p style={styles.leftDesc}>
            Digitalisasi logbookmu dengan lebih mudah dan aman.
          </p>
        </div>
        <div style={styles.right}>
          <div style={styles.formTitle}>Buat Akun Baru</div>
          <div style={styles.formSub}>
            Kelola logbook watchroom secara digital, cepat, dan aman.
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="off">
            <Form.Group>
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Nama lengkap"
                value={form.name}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  ...(focus.name ? styles.inputFocus : {}),
                }}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="nama@domain.com"
                value={form.email}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                style={{
                  ...styles.input,
                  ...(focus.email ? styles.inputFocus : {}),
                }}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{
                    ...styles.input,
                    ...(focus.password ? styles.inputFocus : {}),
                  }}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  style={styles.eyeButton}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Form.Group>
              <Form.Label>Konfirmasi Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showConfirm ? "text" : "password"}
                  name="confirm"
                  placeholder="Ulangi password"
                  value={form.confirm}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  style={{
                    ...styles.input,
                    ...(focus.confirm ? styles.inputFocus : {}),
                  }}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirm((v) => !v)}
                  tabIndex={-1}
                  style={styles.eyeButton}
                >
                  {showConfirm ? <FaEyeSlash /> : <FaEye />}
                </Button>
              </InputGroup>
            </Form.Group>
            <Button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseOver={e => e.currentTarget.style.background = "#E74C3C"}
              onMouseOut={e => e.currentTarget.style.background = "var(--color-cta)"}
            >
              {loading ? "Memproses..." : "Daftar Sekarang"}
            </Button>
          </Form>
          <div style={styles.loginLink}>
            Sudah punya akun?
            <Link to="/login" style={styles.loginAnchor}>
              Masuk di sini
            </Link>
          </div>
          <div style={styles.privacy}>
            Dengan mendaftar, Anda menyetujui{" "}
            <a href="/privacy" style={{ color: "var(--color-accent)" }}>
              Kebijakan Privasi
            </a>
            .
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignForm;