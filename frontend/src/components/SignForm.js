import React, { useState } from "react";
import { Form, Button, Alert, InputGroup, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "var(--color-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem 0", // lebih kecil
  },
  container: {
    display: "flex",
    background: "#fff",
    borderRadius: "0.8rem", // lebih kecil
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)", // lebih ringan
    overflow: "hidden",
    width: "100%",
    maxWidth: 700, // lebih kecil
    minHeight: 380, // lebih kecil
    flexDirection: "row",
  },
  left: {
    flex: 1,
    backgroundImage: "url('https://images.unsplash.com/photo-1715234635719-65936785adc2?q=80&w=900&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "1.2rem 1rem", // lebih kecil
    borderRight: "1px solid #e0e0e0",
  },
  logo: {
    width: 48, // lebih kecil
    height: 48,
    marginBottom: "0.7rem",
    objectFit: "contain",
    borderRadius: "15%",
  },
  leftTitle: {
    color: "var(--color-accent)",
    fontWeight: 800,
    fontSize: "1.1rem", // lebih kecil
    marginBottom: "0.4rem",
    textAlign: "center",
    textShadow: "-1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff",
  },
  leftDesc: {
    color: "#fff",
    fontSize: "0.9rem", // lebih kecil
    textAlign: "center",
    opacity: 0.9,
  },
  right: {
    flex: 1,
    padding: "1.2rem 1rem", // lebih kecil
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  formTitle: {
    color: "var(--color-accent)",
    fontWeight: 700,
    fontSize: "1.05rem", // lebih kecil
    marginBottom: "0.7rem",
    textAlign: "center",
  },
  formSub: {
    color: "var(--color-primary)",
    fontSize: "0.92rem", // lebih kecil
    textAlign: "center",
    marginBottom: "1.1rem",
    opacity: 0.85,
  },
  input: {
    borderRadius: "0.5rem",
    border: "1.2px solid #e0e0e0",
    marginBottom: "0.7rem",
    padding: "0.5rem 0.8rem",
    fontSize: "0.95rem",
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
    padding: "0.6rem",
    fontSize: "1rem",
    marginTop: "0.3rem",
    marginBottom: "0.5rem",
    transition: "background 0.2s",
  },
  buttonHover: {
    backgroundColor: "#E74C3C",
  },
  loginLink: {
    textAlign: "center",
    fontSize: "0.95rem",
    marginTop: "0.5rem",
  },
  loginAnchor: {
    color: "var(--color-accent)",
    textDecoration: "underline",
    fontWeight: 600,
    marginLeft: "0.2rem",
  },
  privacy: {
    textAlign: "center",
    fontSize: "0.85rem",
    marginTop: "0.7rem",
    color: "#888",
  },
  eyeButton: {
    background: "none",
    border: "none",
    boxShadow: "none",
    color: "#888",
    fontSize: "1rem",
    padding: "0 0.6rem",
    display: "flex",
    alignItems: "center",
  },
  '@media (maxWidth: 768px)': {
    container: {
      flexDirection: "column",
      minHeight: "unset",
      maxWidth: 98 + "vw",
    },
    left: {
      borderRight: "none",
      borderBottom: "1px solid #e0e0e0",
      padding: "1rem 0.7rem",
    },
    right: {
      padding: "1rem 0.7rem",
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
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

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
      setShowModal(true);
      setForm(initialForm);
    }, 1200);
  };

  const handleGoToLogin = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <section style={styles.wrapper}>
      <div style={styles.container}>
        <div style={styles.left}>
          <img src="img/logo.png" alt="Logo LogAOE" style={styles.logo} />
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
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Pendaftaran Berhasil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Anda berhasil mendaftar! Silakan login di halaman login.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleGoToLogin}>
            Ke Halaman Login
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default SignForm;