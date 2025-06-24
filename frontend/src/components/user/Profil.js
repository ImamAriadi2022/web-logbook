import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";

const Profil = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ nama: "", password: "", confirm: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Ambil user_id dari localStorage
  const user_id = localStorage.getItem("user_id");

  // Fetch data pengguna dari backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://web-logbook-bvjl.vercel.app/users/${user_id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil data pengguna");
        }

        setUser(data.user);
        setForm({ nama: data.user.name, password: "", confirm: "" });
      } catch (error) {
        console.error("Error fetching user:", error.message);
        setError("Gagal mengambil data pengguna.");
      }
    };

    fetchUser();
  }, [user_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
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

    try {
      const response = await fetch(`https://web-logbook-bvjl.vercel.app/users/${user_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.nama,
          password: form.password || undefined, // Kirim password hanya jika diisi
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat memperbarui profil");
      }

      setUser((prev) => ({ ...prev, name: form.nama }));
      setSuccess("Profil berhasil diperbarui.");
      setForm((prev) => ({ ...prev, password: "", confirm: "" }));
    } catch (error) {
      console.error("Error updating profile:", error.message);
      setError("Gagal memperbarui profil.");
    }
  };

  if (!user) {
    return <div>Memuat data pengguna...</div>;
  }

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