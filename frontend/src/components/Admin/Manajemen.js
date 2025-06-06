import React, { useState } from "react";
import { Card, Table, Button, Modal, Form } from "react-bootstrap";
import { FaUser, FaEdit, FaTrash } from "react-icons/fa";

// Dummy data pengguna, ganti dengan data asli dari backend jika ada
const dummyUsers = [
  { id: 1, nama: "Siti", email: "siti@pkppk.com" },
  { id: 2, nama: "Andi", email: "andi@pkppk.com" },
  { id: 3, nama: "Budi", email: "budi@pkppk.com" },
];

const Manajemen = () => {
  const [users, setUsers] = useState(dummyUsers);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ nama: "", email: "" });

  const handleShowModal = (user = null) => {
    setEditUser(user);
    setForm(user ? { ...user } : { nama: "", email: "" });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditUser(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editUser) {
      setUsers(users.map(u => u.id === editUser.id ? { ...form, id: editUser.id } : u));
    } else {
      setUsers([...users, { ...form, id: Date.now() }]);
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus user ini?")) {
      setUsers(users.filter(u => u.id !== id));
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
                <th style={{ width: 120 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.id}>
                  <td>{i + 1}</td>
                  <td>{u.nama}</td>
                  <td>{u.email}</td>
                  <td>
                    <Button variant="warning" size="sm" onClick={() => handleShowModal(u)} style={{ marginRight: 8 }}>
                      <FaEdit />
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", color: "#888" }}>Belum ada pengguna.</td>
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
                name="nama"
                value={form.nama}
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