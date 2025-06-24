import React, { useState, useEffect, useRef } from "react";
import { Table, Button, InputGroup, Form } from "react-bootstrap";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const centeredHeader = {
  textAlign: "center",
  fontWeight: "bold",
  marginBottom: "10px",
};

const sectionTitle = {
  fontWeight: "bold",
  marginTop: "20px",
  marginBottom: "10px",
};

const tableStyle1 = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "20px",
};

const tdStyle1 = {
  border: "1px solid #ddd",
  padding: "8px",
  textAlign: "left",
};

const DetailLogbook = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState("");
  const detailRef = useRef();

  // Ambil user_id dari localStorage
  const user_id = localStorage.getItem("user_id");

  // Fetch data logbook dari backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`https://web-logbook-bvjl.vercel.app/logbooks/user/${user_id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil logbook");
        }

        setLogs(data.logbooks);
      } catch (error) {
        console.error("Error fetching logbooks:", error.message);
      }
    };

    fetchLogs();
  }, [user_id]);

  const filteredLogs = logs.filter(
    (log) =>
      log.hari?.toLowerCase().includes(filter.toLowerCase()) ||
      log.tanggal?.toLowerCase().includes(filter.toLowerCase()) ||
      log.petugas?.some((p) => p?.toLowerCase().includes(filter.toLowerCase())) ||
      (log.report && log.report.kejadian?.toLowerCase().includes(filter.toLowerCase()))
  );
  const handlePrint = () => {
    const printContents = detailRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "12px", color: "#000", padding: "20px" }}>
      {!selectedLog ? (
        <>
          <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Daftar Logbook Watch Room</h3>
          <div style={{ maxWidth: 300, margin: "0 auto 20px" }}>
            <InputGroup>
              <Form.Control
                placeholder="Cari hari, tanggal, petugas, kejadian"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </InputGroup>
          </div>
          <Table bordered hover responsive>
            <thead style={{ background: "#023E8A", color: "#fff" }}>
              <tr>
                <th>Tanggal</th>
                <th>Hari</th>
                <th>Petugas</th>
                <th>Kejadian</th>
                <th style={{ width: 110 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>
                    Tidak ada data logbook.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.tanggal}</td>
                    <td>{log.hari}</td>
                    <td>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {log.petugas?.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{log.report?.kejadian || "Tidak ada kejadian"}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => setSelectedLog(log)}
                      >
                        Lihat Detail
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </>
      ) : (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <Button variant="secondary" size="sm" onClick={() => setSelectedLog(null)}>
              &larr; Kembali ke daftar
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={handlePrint}
            >
              Download PDF
            </Button>
          </div>
          <div ref={detailRef}>
            <h3 style={{ textAlign: "center", marginBottom: "10px" }}>Logbook Watch Room ARFF Bandara Internasional Batam</h3>
            {/* TABEL ATAS */}
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={tdStyle}>Hari</td>
                  <td style={tdStyle}>{selectedLog.hari}</td>
                  <td style={tdStyle}>Petugas Watch room</td>
                  <td style={tdStyle}>
                    <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                      {selectedLog.petugas.map((p, i) => (
                        <li key={i} style={{ marginBottom: "4px" }}>
                          {i + 1}. {p}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr>
                  <td style={tdStyle}>Tanggal</td>
                  <td style={tdStyle}>{selectedLog.tanggal}</td>
                  <td style={tdStyle}>Koja</td>
                  <td style={tdStyle}>{selectedLog.koja}</td>
                </tr>
                <tr>
                  <td style={tdStyle}>Jam</td>
                  <td style={tdStyle}>{selectedLog.jam}</td>
                  <td style={tdStyle}>Regu Jaga</td>
                  <td style={tdStyle}>{selectedLog.regu}</td>
                </tr>
              </tbody>
            </table>

            {/* TABEL PERGERAKAN PESAWAT */}
            <h5 style={centeredHeader}>Pergerakan Pesawat / Aircraft Movement</h5>
            <table style={{ ...tableStyle, textAlign: "center" }}>
              <thead>
                <tr style={{ fontWeight: "bold" }}>
                  <td style={tdStyle}>No</td>
                  <td style={tdStyle}>Time</td>
                  <td style={tdStyle}>Operator</td>
                  <td style={tdStyle}>Type</td>
                  <td style={tdStyle}>Flight</td>
                  <td style={tdStyle}>From</td>
                  <td style={tdStyle}>To</td>
                  <td style={tdStyle}>RW</td>
                </tr>
              </thead>
              <tbody>
                {selectedLog.flights.map((f, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{i + 1}</td>
                    <td style={tdStyle}>{f.time}</td>
                    <td style={tdStyle}>{f.operator}</td>
                    <td style={tdStyle}>{f.type}</td>
                    <td style={tdStyle}>{f.flight}</td>
                    <td style={tdStyle}>{f.from}</td>
                    <td style={tdStyle}>{f.to}</td>
                    <td style={tdStyle}>{f.rw}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ textAlign: "center", margin: "20px 0 5px" }}>LAPORAN/REPORT</h4>
            
            {/* TABEL INFORMASI UMUM */}
            <h5 style={sectionTitle}>Informasi Umum / General Information</h5>
            <table style={tableStyle1}>
              <tbody>
                <tr>
                  <td style={tdStyle1}>Tanggal Kejadian</td>
                  <td style={tdStyle1}>{selectedLog.report?.tanggalKejadian || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Waktu Kejadian</td>
                  <td style={tdStyle1}>{selectedLog.report?.waktuKejadian || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Cuaca</td>
                  <td style={tdStyle1}>{selectedLog.report?.cuaca || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Kejadian</td>
                  <td style={tdStyle1}>{selectedLog.report?.kejadian || "Tidak tersedia"}</td>
                </tr>
              </tbody>
            </table>

            <h5 style={sectionTitle}>Informasi Pesawat Udara</h5>
            <table style={tableStyle1}>
              <tbody>
                <tr>
                  <td style={tdStyle1}>No.PNB</td>
                  <td style={tdStyle1}>{selectedLog.report?.noPnb || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Tipe Pesawat</td>
                  <td style={tdStyle1}>{selectedLog.report?.tipePesawat || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Fase Penerbangan</td>
                  <td style={tdStyle1}>{selectedLog.report?.fasePenerbangan || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Kerusakan Pesawat Udara</td>
                  <td style={tdStyle1}>{selectedLog.report?.kerusakanPesawat || "Tidak tersedia"}</td>
                </tr>
              </tbody>
            </table>

            <h5 style={sectionTitle}>Informasi Fasilitas yang Terdampak</h5>
            <table style={tableStyle1}>
              <tbody>
                <tr>
                  <td style={tdStyle1}>Jenis Fasilitas</td>
                  <td style={tdStyle1}>{selectedLog.report?.jenisFasilitas || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Kerusakan Fasilitas</td>
                  <td style={tdStyle1}>{selectedLog.report?.kerusakanFasilitas || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Rincian Kejadian</td>
                  <td style={tdStyle1}>{selectedLog.report?.rincianKejadian || "Tidak tersedia"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default DetailLogbook;