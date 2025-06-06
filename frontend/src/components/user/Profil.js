import React, { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";

const initialUser = {
  nama: "Budi Santoso",
  email: "budi@logaoe.com",
};

const Profil = () => {
  const [user, setUser] = useState(initialUser);
  const [form, setForm] = useState({ nama: user.nama, password: "", confirm: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.nama) {
      setError("Nama tidak boleh kosong.");
      return;
    }
    if (form.password && form.password.length < 6) {
      setError("Password minimal 6 karakter.");
      return;
    }
    if (form.password && form.password !== form.confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }
    setUser((prev) => ({ ...prev, nama: form.nama }));
    setSuccess("Profil berhasil diperbarui.");
    setForm((prev) => ({ ...prev, password: "", confirm: "" }));
  };

  return (
    <div style={{ maxWidth: 420, margin: "2rem auto" }}>
      <Card>
        <Card.Body>
          <Card.Title style={{ fontWeight: 700, color: "var(--color-accent)" }}>
            Profil Pengguna
          </Card.Title>
          <div style={{ color: "#888", fontSize: "0.97rem", marginBottom: 12 }}>
            Email: <b>{user.email}</b>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Lengkap</Form.Label>
              <Form.Control
                type="text"
                name="nama"
                value={form.nama}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password Baru</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Kosongkan jika tidak ingin mengubah"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Konfirmasi Password Baru</Form.Label>
              <Form.Control
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                placeholder="Ulangi password baru"
              />
            </Form.Group>
            <Button type="submit" style={{ width: "100%", border: "none", fontWeight: 700 }}>
              Simpan Perubahan
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profil;