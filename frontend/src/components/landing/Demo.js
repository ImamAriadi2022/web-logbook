import React from "react";
import { Card, ListGroup, Badge } from "react-bootstrap";

const Demo = () => {
  const sectionStyle = {
    marginBottom: "2.5rem",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    borderRadius: "12px",
    border: "none",
  };

  const cardHeaderStyle = {
    background: "var(--color-accent, #023E8A)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "1.25rem",
    borderTopLeftRadius: "12px",
    borderTopRightRadius: "12px",
  };

  const stepStyle = {
    background: "var(--color-primary, #0096C7)",
    color: "white",
    fontWeight: "bold",
  };

  return (
    <div style={{ maxWidth: 900, margin: "2rem auto", padding: "0 1rem" }}>
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h1 style={{ fontWeight: 700, color: "var(--color-accent, #023E8A)" }}>
          Panduan Penggunaan Aplikasi Web Logbook
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#555" }}>
          Berikut adalah langkah-langkah detail untuk menggunakan aplikasi ini secara efektif.
        </p>
      </div>

      {/* Section 1: Pendaftaran dan Login */}
      <Card style={sectionStyle}>
        <Card.Header style={cardHeaderStyle}>1. Pendaftaran & Login</Card.Header>
        <Card.Body>
          <Card.Text>
            Setiap petugas harus memiliki akun untuk dapat mengakses dan mengisi logbook.
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Pendaftaran:</strong> Buka halaman "Register", isi nama lengkap, email, dan password. Pastikan email yang digunakan valid.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Login:</strong> Setelah berhasil mendaftar, buka halaman "Login" dan masukkan email serta password Anda untuk masuk ke dashboard.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Section 2: Menambah Logbook Baru */}
      <Card style={sectionStyle}>
        <Card.Header style={cardHeaderStyle}>2. Mengisi Logbook Baru</Card.Header>
        <Card.Body>
          <Card.Text>
            Fitur utama aplikasi ini adalah untuk mencatat logbook harian. Form pengisian dibagi menjadi tiga bagian utama.
          </Card.Text>
          <ListGroup>
            <ListGroup.Item>
              <Badge pill style={stepStyle} className="me-2">Langkah 1</Badge>
              <strong>Isi Informasi Watch Room:</strong> Masukkan detail umum seperti hari, tanggal, jam, nama petugas jaga (bisa lebih dari satu), Koja, dan Regu Jaga.
            </ListGroup.Item>
            <ListGroup.Item>
              <Badge pill style={stepStyle} className="me-2">Langkah 2</Badge>
              <strong>Catat Pergerakan Pesawat (Aircraft Movement):</strong> Klik tombol "+ Tambah Aktivitas" untuk setiap pergerakan pesawat. Isi semua detail yang diperlukan seperti waktu, operator, tipe pesawat, dan lainnya.
            </ListGroup.Item>
            <ListGroup.Item>
              <Badge pill style={stepStyle} className="me-2">Langkah 3</Badge>
              <strong>Buat Laporan Kejadian (Report):</strong> Jika ada kejadian khusus, isi bagian laporan secara detail, mencakup informasi umum, informasi pesawat, dan fasilitas yang terdampak.
            </ListGroup.Item>
            <ListGroup.Item>
              <Badge pill style={stepStyle} className="me-2">Langkah 4</Badge>
              <strong>Simpan:</strong> Setelah semua data terisi lengkap, klik tombol "Simpan Logbook & Laporan" di bagian bawah halaman.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Section 3: Melihat dan Mencari Logbook */}
      <Card style={sectionStyle}>
        <Card.Header style={cardHeaderStyle}>3. Melihat & Mencari Logbook</Card.Header>
        <Card.Body>
          <Card.Text>
            Semua logbook yang telah Anda buat akan tersimpan dan dapat diakses kembali.
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Daftar Logbook:</strong> Di halaman utama setelah login, Anda akan melihat tabel berisi daftar semua logbook yang pernah Anda input.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Pencarian:</strong> Gunakan kolom pencarian di atas tabel untuk memfilter logbook berdasarkan hari, tanggal, nama petugas, atau isi kejadian.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Lihat Detail:</strong> Klik tombol "Lihat Detail" pada salah satu baris logbook untuk melihat rincian lengkapnya.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Section 4: Detail Logbook dan Download PDF */}
      <Card style={sectionStyle}>
        <Card.Header style={cardHeaderStyle}>4. Detail Logbook & Download PDF</Card.Header>
        <Card.Body>
          <Card.Text>
            Halaman detail menampilkan semua informasi logbook dalam format laporan yang rapi.
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Melihat Rincian:</strong> Semua data dari form pengisian akan ditampilkan di sini, termasuk data Watch Room, tabel pergerakan pesawat, dan laporan kejadian.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Download PDF:</strong> Klik tombol "Download PDF" di bagian atas halaman untuk mencetak atau menyimpan logbook sebagai file PDF untuk keperluan arsip.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>

      {/* Section 5: Mengelola Profil */}
      <Card style={sectionStyle}>
        <Card.Header style={cardHeaderStyle}>5. Mengelola Profil</Card.Header>
        <Card.Body>
          <Card.Text>
            Anda dapat memperbarui informasi pribadi Anda melalui halaman profil.
          </Card.Text>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <strong>Akses Halaman Profil:</strong> Klik pada nama Anda di navigasi untuk membuka halaman profil.
            </ListGroup.Item>
            <ListGroup.Item>
              <strong>Perbarui Data:</strong> Anda dapat mengubah nama lengkap dan password Anda. Kosongkan kolom password jika tidak ingin mengubahnya. Klik "Simpan Perubahan" jika sudah selesai.
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Demo;