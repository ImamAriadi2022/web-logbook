import { useEffect, useState } from "react";
import { Alert, Button, Card, Col, Form, InputGroup, Modal, Row, Table } from "react-bootstrap";
import { FaClipboardList, FaEdit, FaEye, FaFilePdf, FaTrash } from "react-icons/fa";

const Data = () => {
  const [logbook, setLogbook] = useState([]);
  const [filter, setFilter] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [editData, setEditData] = useState(null);
  const [detailData, setDetailData] = useState(null);

  // State untuk form edit
  const [formData, setFormData] = useState({
    hari: "",
    tanggal: "",
    jam: "",
    petugas: [],
    koja: "",
    regu: "",
    flights: [],
    // Report fields
    hariKejadian: "",
    tanggalKejadian: "",
    waktuKejadian: "",
    cuaca: "",
    kejadian: "",
    noPnb: "",
    tipePesawat: "",
    fasePenerbangan: "",
    kerusakanPesawat: "",
    jenisFasilitas: "",
    kerusakanFasilitas: "",
    rincianKejadian: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Helper function untuk format tanggal ke format Indonesia
  const formatDateForDisplay = (dateString) => {
    if (!dateString || dateString === "Tidak tersedia") return "Tidak tersedia";
    
    try {
      let date;
      
      // Handle different date formats
      if (dateString.includes('T')) {
        // ISO format: "2025-06-28T17:00:00.000Z"
        date = new Date(dateString);
      } else if (dateString.includes('-')) {
        // Format: "2025-06-28" atau "28-06-2025"
        const parts = dateString.split('-');
        if (parts[0].length === 4) {
          // Format: "2025-06-28"
          date = new Date(dateString);
        } else {
          // Format: "28-06-2025"
          date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        }
      } else {
        // Try to parse as is
        date = new Date(dateString);
      }

      // Validasi apakah date valid
      if (isNaN(date.getTime())) {
        return dateString; // Return original if can't parse
      }

      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      const day = date.getDate().toString().padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (error) {
      return dateString; // Return original string if error
    }
  };

  // Helper function untuk format waktu tanpa detik
  const formatTimeForDisplay = (timeString) => {
    if (!timeString || timeString === "Tidak tersedia") return "Tidak tersedia";
    
    try {
      // Handle various time formats
      if (timeString.includes('T')) {
        // ISO format dengan waktu
        const date = new Date(timeString);
        if (isNaN(date.getTime())) return timeString;
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      } else if (timeString.includes(':')) {
        // Format HH:MM atau HH:MM:SS
        const timeParts = timeString.split(':');
        if (timeParts.length >= 2) {
          return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
        }
      }
      
      return timeString;
    } catch (error) {
      return timeString;
    }
  };

  // Fetch data logbook dari backend
  useEffect(() => {
    const fetchLogbooks = async () => {
      try {
        const response = await fetch("https://web-logbook-bvjl.vercel.app/api/logbooks");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil data logbook");
        }

        // Parse JSON fields dan format data
        const formattedLogs = data.logbooks.map((log) => {
          // Helper function untuk parse data yang mungkin berupa JSON string
          const parseIfNeeded = (value) => {
            if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
              try {
                return JSON.parse(value);
              } catch (e) {
                return value;
              }
            }
            return value;
          };

          return {
            ...log,
            petugas: Array.isArray(log.petugas) ? log.petugas : JSON.parse(log.petugas || "[]"),
            flights: Array.isArray(log.flights) ? log.flights : JSON.parse(log.flights || "[]"),
            koja: parseIfNeeded(log.koja) || "Tidak tersedia",
            regu: parseIfNeeded(log.regu) || "Tidak tersedia",
          };
        });

        setLogbook(formattedLogs);
      } catch (error) {
        console.error("Error fetching logbooks:", error.message);
        setError("Terjadi kesalahan saat mengambil data logbook");
      }
    };

    fetchLogbooks();
  }, []);

  // Prefill form saat edit
  useEffect(() => {
    if (editData) {
      // Helper function untuk format tanggal ke format input (YYYY-MM-DD)
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
          // Handle ISO format dates (with T and Z)
          if (dateString.includes('T')) {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            return date.toISOString().split('T')[0];
          }
          // Handle regular date format
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          return date.toISOString().split('T')[0];
        } catch (error) {
          return "";
        }
      };

      // Helper function untuk format waktu ke format input (HH:MM)
      const formatTimeForInput = (timeString) => {
        if (!timeString) return "";
        try {
          if (timeString.includes('T')) {
            const date = new Date(timeString);
            if (isNaN(date.getTime())) return "";
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
          } else if (timeString.includes(':')) {
            const timeParts = timeString.split(':');
            if (timeParts.length >= 2) {
              return `${timeParts[0].padStart(2, '0')}:${timeParts[1].padStart(2, '0')}`;
            }
          }
          return timeString;
        } catch (error) {
          return "";
        }
      };

      setFormData({
        hari: editData.hari || "",
        tanggal: formatDateForInput(editData.tanggal),
        jam: formatTimeForInput(editData.jam),
        petugas: editData.petugas || [],
        koja: editData.koja || "",
        regu: editData.regu || "",
        flights: editData.flights || [],
        // Report fields
        hariKejadian: editData.hariKejadian || "",
        tanggalKejadian: formatDateForInput(editData.tanggalKejadian),
        waktuKejadian: formatTimeForInput(editData.waktuKejadian),
        cuaca: editData.cuaca || "",
        kejadian: editData.kejadian || "",
        noPnb: editData.noPnb || "",
        tipePesawat: editData.tipePesawat || "",
        fasePenerbangan: editData.fasePenerbangan || "",
        kerusakanPesawat: editData.kerusakanPesawat || "",
        jenisFasilitas: editData.jenisFasilitas || "",
        kerusakanFasilitas: editData.kerusakanFasilitas || "",
        rincianKejadian: editData.rincianKejadian || "",
      });
      setError("");
      setSuccess("");
    }
  }, [editData]);

  const filteredLogbook = logbook.filter(
    (log) => {
      const formattedTanggal = formatDateForDisplay(log.tanggal);
      const petugasString = Array.isArray(log.petugas) ? log.petugas.join(", ") : (log.petugas || "");
      
      return (
        log.hari?.toLowerCase().includes(filter.toLowerCase()) ||
        log.tanggal?.toLowerCase().includes(filter.toLowerCase()) ||
        formattedTanggal?.toLowerCase().includes(filter.toLowerCase()) ||
        petugasString?.toLowerCase().includes(filter.toLowerCase()) ||
        log.kejadian?.toLowerCase().includes(filter.toLowerCase())
      );
    }
  );

  const handleDelete = async (id) => {
    if (window.confirm("Yakin ingin menghapus logbook ini?")) {
      try {
        const response = await fetch(`https://web-logbook-bvjl.vercel.app/api/logbooks/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Terjadi kesalahan saat menghapus logbook");
        }

        setLogbook(logbook.filter((l) => l.id !== id));
        setSuccess("Logbook berhasil dihapus!");
        setTimeout(() => setSuccess(""), 3000);
      } catch (error) {
        console.error("Error deleting logbook:", error.message);
        setError("Terjadi kesalahan saat menghapus logbook");
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleEdit = (log) => {
    setEditData(log);
    setShowEdit(true);
  };

  const handleDetail = (log) => {
    setDetailData(log);
    setShowDetail(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setEditData(null);
    setError("");
    setSuccess("");
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setDetailData(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Helper function untuk format tanggal ke YYYY-MM-DD
      const formatDateForInput = (dateString) => {
        if (!dateString) return "";
        try {
          // Handle ISO format dates (with T and Z)
          if (dateString.includes('T')) {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "";
            return date.toISOString().split('T')[0];
          }
          // Handle regular date format
          const date = new Date(dateString);
          if (isNaN(date.getTime())) return "";
          return date.toISOString().split('T')[0];
        } catch (error) {
          return "";
        }
      };

      // Format data sesuai yang diharapkan backend (watchroom dan report)
      const requestData = {
        watchroom: {
          hari: formData.hari || editData.hari || "",
          tanggal: formatDateForInput(formData.tanggal || editData.tanggal),
          jam: formData.jam || editData.jam || "",
          petugas: formData.petugas && formData.petugas.length > 0 ? formData.petugas : editData.petugas || [],
          koja: formData.koja || editData.koja || "",
          regu: formData.regu || editData.regu || "",
          flights: formData.flights && formData.flights.length > 0 ? formData.flights : editData.flights || []
        },
        report: {
          hariKejadian: formData.hariKejadian || editData.hariKejadian || "",
          tanggalKejadian: formatDateForInput(formData.tanggalKejadian || editData.tanggalKejadian),
          waktuKejadian: formData.waktuKejadian || editData.waktuKejadian || "",
          cuaca: formData.cuaca || editData.cuaca || "",
          kejadian: formData.kejadian || editData.kejadian || "",
          noPnb: formData.noPnb || editData.noPnb || "",
          tipePesawat: formData.tipePesawat || editData.tipePesawat || "",
          fasePenerbangan: formData.fasePenerbangan || editData.fasePenerbangan || "",
          kerusakanPesawat: formData.kerusakanPesawat || editData.kerusakanPesawat || "",
          jenisFasilitas: formData.jenisFasilitas || editData.jenisFasilitas || "",
          kerusakanFasilitas: formData.kerusakanFasilitas || editData.kerusakanFasilitas || "",
          rincianKejadian: formData.rincianKejadian || editData.rincianKejadian || "",
        }
      };

      console.log("Data yang akan dikirim:", requestData);

      const response = await fetch(`https://web-logbook-bvjl.vercel.app/api/logbooks/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Terjadi kesalahan saat menyimpan perubahan logbook");
      }

      // Update local state dengan data yang sudah diformat
      setLogbook((prev) =>
        prev.map((log) =>
          log.id === editData.id ? { ...log, ...formData } : log
        )
      );
      
      setSuccess("Logbook berhasil diperbarui!");
      setTimeout(() => {
        handleCloseEdit();
      }, 1500);
    } catch (error) {
      console.error("Error saving logbook:", error.message);
      setError("Terjadi kesalahan saat menyimpan perubahan logbook: " + error.message);
    }
  };

  // Fungsi untuk export PDF
  const handleExportPDF = (log) => {
    // Buat HTML content untuk PDF
    const printContent = `
      <div style="font-family: Arial, sans-serif; font-size: 11px; color: #000; padding: 15px;">
        <style>
          @media print {
            @page {
              size: A4;
              margin: 0.5in 0.4in;
            }
            body {
              font-size: 9px !important;
              line-height: 1.2 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            table {
              margin-bottom: 8px !important;
              font-size: 9px !important;
              width: 100%;
              border-collapse: collapse;
              border: 1px solid #ddd;
            }
            td, th {
              padding: 3px !important;
              font-size: 9px !important;
              line-height: 1.1 !important;
              border: 1px solid #ddd;
              text-align: left;
              vertical-align: top;
            }
            h3 {
              font-size: 12px !important;
              margin: 5px 0 !important;
              text-align: center;
            }
            h4 {
              font-size: 11px !important;
              margin: 8px 0 3px 0 !important;
              text-align: center;
            }
            h5, h6 {
              font-size: 10px !important;
              margin: 6px 0 3px 0 !important;
              font-weight: bold;
            }
            ul {
              margin: 0 !important;
              padding: 0 !important;
              list-style: none;
            }
            li {
              margin-bottom: 1px !important;
            }
            .header-cell {
              background-color: #f8f9fa !important;
              font-weight: bold !important;
            }
          }
        </style>
        
        <h3>Logbook Watch Room ARFF Bandara Internasional Batam</h3>
        
        <!-- TABEL ATAS -->
        <table>
          <tbody>
            <tr>
              <td class="header-cell" style="width: 12.5%;">Hari</td>
              <td style="width: 12.5%;">${log.hari}</td>
              <td class="header-cell" style="width: 25%;">Petugas Watch room</td>
              <td style="width: 50%;">
                ${Array.isArray(log.petugas) ? log.petugas.map((p, i) => `${i + 1}. ${p}`).join('<br>') : log.petugas}
              </td>
            </tr>
            <tr>
              <td class="header-cell">Tanggal</td>
              <td>${formatDateForDisplay(log.tanggal)}</td>
              <td class="header-cell">Koja</td>
              <td>${log.koja}</td>
            </tr>
            <tr>
              <td class="header-cell">Jam</td>
              <td>${formatTimeForDisplay(log.jam)}</td>
              <td class="header-cell">Regu Jaga</td>
              <td>${log.regu}</td>
            </tr>
          </tbody>
        </table>

        ${log.flights && log.flights.length > 0 ? `
        <!-- TABEL PERGERAKAN PESAWAT -->
        <h5 style="text-align: center; margin: 8px 0;">Pergerakan Pesawat / Aircraft Movement</h5>
        <table>
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="text-align: center;">No</th>
              <th style="text-align: center;">Time</th>
              <th style="text-align: center;">Operator</th>
              <th style="text-align: center;">Type</th>
              <th style="text-align: center;">Flight</th>
              <th style="text-align: center;">From</th>
              <th style="text-align: center;">To</th>
              <th style="text-align: center;">RW</th>
              <th style="text-align: center;">Remarks</th>
            </tr>
          </thead>
          <tbody>
            ${log.flights.map((f, i) => `
              <tr>
                <td style="text-align: center;">${i + 1}</td>
                <td style="text-align: center;">${formatTimeForDisplay(f.time)}</td>
                <td style="text-align: center;">${f.operator || ''}</td>
                <td style="text-align: center;">${f.aircraftType || ''}</td>
                <td style="text-align: center;">${f.flightNumber || ''}</td>
                <td style="text-align: center;">${f.depArrFrom || ''}</td>
                <td style="text-align: center;">${f.to || ''}</td>
                <td style="text-align: center;">${f.rwUse || ''}</td>
                <td style="text-align: center;">${f.remarks || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : ''}

        <h4 style="margin: 12px 0 3px;">LAPORAN/REPORT</h4>
        
        <!-- TABEL INFORMASI UMUM -->
        <h6>Informasi Umum / General Information</h6>
        <table>
          <tbody>
            <tr>
              <td class="header-cell" style="width: 30%;">Hari Kejadian</td>
              <td style="width: 70%;">${log.hariKejadian || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Tanggal Kejadian</td>
              <td>${formatDateForDisplay(log.tanggalKejadian) || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Waktu Kejadian</td>
              <td>${formatTimeForDisplay(log.waktuKejadian) || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Cuaca</td>
              <td>${log.cuaca || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Kejadian</td>
              <td>${log.kejadian || "Tidak tersedia"}</td>
            </tr>
          </tbody>
        </table>

        <h6>Informasi Pesawat Udara</h6>
        <table>
          <tbody>
            <tr>
              <td class="header-cell" style="width: 30%;">No.PNB</td>
              <td style="width: 70%;">${log.noPnb || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Tipe Pesawat</td>
              <td>${log.tipePesawat || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Fase Penerbangan</td>
              <td>${log.fasePenerbangan || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Kerusakan Pesawat Udara</td>
              <td>${log.kerusakanPesawat || "Tidak tersedia"}</td>
            </tr>
          </tbody>
        </table>

        <h6>Informasi Fasilitas yang Terdampak</h6>
        <table>
          <tbody>
            <tr>
              <td class="header-cell" style="width: 30%;">Jenis Fasilitas</td>
              <td style="width: 70%;">${log.jenisFasilitas || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Kerusakan Fasilitas</td>
              <td>${log.kerusakanFasilitas || "Tidak tersedia"}</td>
            </tr>
            <tr>
              <td class="header-cell">Rincian Kejadian</td>
              <td>${log.rincianKejadian || "Tidak tersedia"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    // Buat window baru untuk print
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Logbook ${log.id} - ${formatDateForDisplay(log.tanggal)}</title>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    
    // Tunggu content dimuat lalu print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Alert Messages */}
      {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
      {success && <Alert variant="success" className="mb-3">{success}</Alert>}
      
      <h2 style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12 }}>
        <FaClipboardList style={{ fontSize: 28 }} /> Data Logbook
      </h2>
      <Card>
        <Card.Header style={{ fontWeight: 600, background: "var(--color-accent)", color: "#fff" }}>
          Kelola semua logbook yang dicatat user
        </Card.Header>
        <Card.Body>
          <InputGroup className="mb-3" style={{ maxWidth: 350 }}>
            <Form.Control
              placeholder="Filter hari, tanggal, petugas, kejadian"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </InputGroup>
          <Table striped bordered hover responsive>
            <thead style={{ background: "#023E8A", color: "#fff" }}>
              <tr>
                <th>#</th>
                <th>Tanggal</th>
                <th>Hari</th>
                <th>Petugas</th>
                <th>Kejadian</th>
                <th style={{ width: 220 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogbook.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", color: "#888" }}>
                    Tidak ada data logbook.
                  </td>
                </tr>
              ) : (
                filteredLogbook.map((log, i) => (
                  <tr key={log.id}>
                    <td>{i + 1}</td>
                    <td>{formatDateForDisplay(log.tanggal)}</td>
                    <td>{log.hari}</td>
                    <td>
                      {Array.isArray(log.petugas) ? (
                        <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                          {log.petugas.slice(0, 2).map((p, idx) => (
                            <li key={idx} style={{ fontSize: "0.9em" }}>{p}</li>
                          ))}
                          {log.petugas.length > 2 && (
                            <li style={{ fontSize: "0.8em", color: "#666" }}>
                              +{log.petugas.length - 2} lainnya
                            </li>
                          )}
                        </ul>
                      ) : (
                        log.petugas || "Tidak ada"
                      )}
                    </td>
                    <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {log.kejadian?.length > 50 ? `${log.kejadian.substring(0, 50)}...` : (log.kejadian || "Tidak ada kejadian")}
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        style={{ marginRight: 4, marginBottom: 4 }}
                        onClick={() => handleDetail(log)}
                        title="Lihat Detail"
                      >
                        <FaEye />
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        style={{ marginRight: 4, marginBottom: 4 }}
                        onClick={() => handleEdit(log)}
                        title="Edit"
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        style={{ marginRight: 4, marginBottom: 4 }}
                        onClick={() => handleExportPDF(log)}
                        title="Export PDF"
                      >
                        <FaFilePdf />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        style={{ marginBottom: 4 }}
                        onClick={() => handleDelete(log.id)}
                        title="Hapus"
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal untuk Detail Logbook */}
      <Modal show={showDetail} onHide={handleCloseDetail} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Detail Logbook - {detailData?.tanggal && formatDateForDisplay(detailData.tanggal)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {detailData && (
            <div style={{ fontSize: "12px" }}>
              {/* Informasi Dasar */}
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Hari:</strong> {detailData.hari}<br />
                  <strong>Tanggal:</strong> {formatDateForDisplay(detailData.tanggal)}<br />
                  <strong>Jam:</strong> {formatTimeForDisplay(detailData.jam)}
                </Col>
                <Col md={6}>
                  <strong>Koja:</strong> {detailData.koja}<br />
                  <strong>Regu:</strong> {detailData.regu}
                </Col>
              </Row>

              {/* Petugas */}
              <Row className="mb-3">
                <Col>
                  <strong>Petugas Watch Room:</strong>
                  <ul className="mt-1">
                    {detailData.petugas?.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </Col>
              </Row>

              {/* Pergerakan Pesawat */}
              {detailData.flights?.length > 0 && (
                <Row className="mb-3">
                  <Col>
                    <strong>Pergerakan Pesawat:</strong>
                    <Table size="sm" bordered className="mt-2">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Operator</th>
                          <th>Type</th>
                          <th>Flight</th>
                          <th>From</th>
                          <th>To</th>
                          <th>RW</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {detailData.flights.map((f, i) => (
                          <tr key={i}>
                            <td>{formatTimeForDisplay(f.time)}</td>
                            <td>{f.operator}</td>
                            <td>{f.aircraftType}</td>
                            <td>{f.flightNumber}</td>
                            <td>{f.depArrFrom}</td>
                            <td>{f.to}</td>
                            <td>{f.rwUse}</td>
                            <td>{f.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              )}

              {/* Laporan Kejadian */}
              <hr />
              <h6><strong>LAPORAN KEJADIAN</strong></h6>
              
              <Row className="mb-2">
                <Col md={6}>
                  <strong>Hari Kejadian:</strong> {detailData.hariKejadian || "Tidak tersedia"}
                </Col>
                <Col md={6}>
                  <strong>Tanggal Kejadian:</strong> {formatDateForDisplay(detailData.tanggalKejadian) || "Tidak tersedia"}
                </Col>
              </Row>
              
              <Row className="mb-2">
                <Col md={6}>
                  <strong>Waktu Kejadian:</strong> {formatTimeForDisplay(detailData.waktuKejadian) || "Tidak tersedia"}
                </Col>
                <Col md={6}>
                  <strong>Cuaca:</strong> {detailData.cuaca || "Tidak tersedia"}
                </Col>
              </Row>
              
              <Row className="mb-3">
                <Col>
                  <strong>Kejadian:</strong><br />
                  {detailData.kejadian || "Tidak tersedia"}
                </Col>
              </Row>

              {/* Informasi Pesawat */}
              <h6><strong>INFORMASI PESAWAT UDARA</strong></h6>
              <Row className="mb-2">
                <Col md={6}>
                  <strong>No. PNB:</strong> {detailData.noPnb || "Tidak tersedia"}
                </Col>
                <Col md={6}>
                  <strong>Tipe Pesawat:</strong> {detailData.tipePesawat || "Tidak tersedia"}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col md={6}>
                  <strong>Fase Penerbangan:</strong> {detailData.fasePenerbangan || "Tidak tersedia"}
                </Col>
                <Col md={6}>
                  <strong>Kerusakan Pesawat:</strong> {detailData.kerusakanPesawat || "Tidak tersedia"}
                </Col>
              </Row>

              {/* Informasi Fasilitas */}
              <h6><strong>INFORMASI FASILITAS TERDAMPAK</strong></h6>
              <Row className="mb-2">
                <Col md={6}>
                  <strong>Jenis Fasilitas:</strong> {detailData.jenisFasilitas || "Tidak tersedia"}
                </Col>
                <Col md={6}>
                  <strong>Kerusakan Fasilitas:</strong> {detailData.kerusakanFasilitas || "Tidak tersedia"}
                </Col>
              </Row>
              <Row>
                <Col>
                  <strong>Rincian Kejadian:</strong><br />
                  {detailData.rincianKejadian || "Tidak tersedia"}
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetail}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal untuk Edit Logbook */}
      <Modal show={showEdit} onHide={handleCloseEdit} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Logbook</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          
          <Form onSubmit={handleSaveEdit}>
            {/* Informasi Dasar */}
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Hari</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.hari}
                    onChange={(e) => setFormData({...formData, hari: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.tanggal}
                    onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Jam</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.jam}
                    onChange={(e) => setFormData({...formData, jam: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Koja</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.koja}
                    onChange={(e) => setFormData({...formData, koja: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Regu</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.regu}
                    onChange={(e) => setFormData({...formData, regu: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Laporan Kejadian */}
            <hr />
            <h6>Laporan Kejadian</h6>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Hari Kejadian</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.hariKejadian}
                    onChange={(e) => setFormData({...formData, hariKejadian: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tanggal Kejadian</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.tanggalKejadian}
                    onChange={(e) => setFormData({...formData, tanggalKejadian: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Waktu Kejadian</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.waktuKejadian}
                    onChange={(e) => setFormData({...formData, waktuKejadian: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Cuaca</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.cuaca}
                    onChange={(e) => setFormData({...formData, cuaca: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kejadian</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={formData.kejadian}
                    onChange={(e) => setFormData({...formData, kejadian: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Informasi Pesawat */}
            <hr />
            <h6>Informasi Pesawat Udara</h6>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>No. PNB</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.noPnb}
                    onChange={(e) => setFormData({...formData, noPnb: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipe Pesawat</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.tipePesawat}
                    onChange={(e) => setFormData({...formData, tipePesawat: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Fase Penerbangan</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.fasePenerbangan}
                    onChange={(e) => setFormData({...formData, fasePenerbangan: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kerusakan Pesawat</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.kerusakanPesawat}
                    onChange={(e) => setFormData({...formData, kerusakanPesawat: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Informasi Fasilitas */}
            <hr />
            <h6>Informasi Fasilitas Terdampak</h6>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jenis Fasilitas</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.jenisFasilitas}
                    onChange={(e) => setFormData({...formData, jenisFasilitas: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kerusakan Fasilitas</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.kerusakanFasilitas}
                    onChange={(e) => setFormData({...formData, kerusakanFasilitas: e.target.value})}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Rincian Kejadian</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.rincianKejadian}
                onChange={(e) => setFormData({...formData, rincianKejadian: e.target.value})}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button variant="secondary" onClick={handleCloseEdit}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Simpan Perubahan
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Data;