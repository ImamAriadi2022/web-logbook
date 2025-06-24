import React, { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Form } from "react-bootstrap";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";

const Manajemen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", role: "" });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://web-logbook-bvjl.vercel.app/users/users");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil data pengguna");
        }

        setUsers(data.users);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleShowModal = (user = null) => {
    setEditUser(user);
    setForm(user ? { ...user } : { name: "", email: "", role: "user" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editUser ? "PUT" : "POST";
      const endpoint = editUser
        ? `https://web-logbook-bvjl.vercel.app/users/users/${editUser.id}`
        : "https://web-logbook-bvjl.vercel.app/users/register";

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat menyimpan data pengguna");
      }

      if (editUser) {
        setUsers(users.map((u) => (u.id === editUser.id ? { ...form, id: editUser.id } : u)));
      } else {
        setUsers([...users, { ...form, id: data.user.id }]);
      }

      handleCloseModal();
    } catch (error) {
      console.error("Error saving user:", error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      try {
        const response = await fetch(`https://web-logbook-bvjl.vercel.app/users/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Terjadi kesalahan saat menghapus pengguna");
        }

        setUsers(users.filter((u) => u.id !== id));
      } catch (error) {
        console.error("Error deleting user:", error.message);
      }
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
        <FaUser style={{ fontSize: 28 }} /> Manajemen Pengguna
      </h2>
      <Card>
        <Card.Header style={{ fontWeight: 600, background: "var(--color-accent)", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          Kelola Akun Personel PKP-PK
          <Button variant="success" size="sm" onClick={() => handleShowModal()}>Tambah Pengguna</Button>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <Table striped bordered hover responsive style={{ margin: 0 }}>
            <thead>
              <tr>
                <th>#</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Role</th>
                <th style={{ width: 120 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>Memuat data...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleShowModal(u)} style={{ marginRight: 8 }}>
                        <FaEdit />
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>Belum ada pengguna.</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editUser ? "Edit Pengguna" : "Tambah Pengguna"}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nama</Form.Label>
              <Form.Control
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Nama lengkap"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                name="role"
                as="select"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Batal
            </Button>
            <Button variant="primary" type="submit">
              Simpan
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default Manajemen;