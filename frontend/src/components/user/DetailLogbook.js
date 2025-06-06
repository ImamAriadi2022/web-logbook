import React, { useState, useRef } from "react";
import { Table, Button, InputGroup, Form } from "react-bootstrap";

// Dummy data logbook (bisa diganti dengan props/ambil dari backend)
export const initialLogs = [
  {
    id: 1,
    tanggal: "2025-01-04",
    hari: "Kamis",
    jam: "10:29 AM s.d 22:00 PM",
    petugas: ["Siti", "Budi"],
    koja: "Maizar",
    regu: "Alpha",
    flights: [
      {
        time: "10:22",
        operator: "Lion Air",
        type: "B-737",
        flight: "JT-988",
        from: "PKW",
        to: "BTH",
        rw: "22",
      },
      {
        time: "10:30",
        operator: "Lion Air",
        type: "B-737",
        flight: "JT-988",
        from: "CGK",
        to: "BTH",
        rw: "22",
      },
    ],
    report: {
      tanggalKejadian: "Sabtu, 04 Januari 2025",
      waktuKejadian: "10:29AM",
      cuaca: "Cerah",
      kejadian: "Wildlife hazard di Runway 04",
      noPnb: "-",
      tipePesawat: "-",
      fasePenerbangan: "-",
      kerusakanPesawat: "-",
      jenisFasilitas: "-",
      kerusakanFasilitas: "-",
      rincianKejadian:
        "Pada pukul sekitar 10:35 WIB tower menginformasikan ke commando kalau terdapat segerombolan burung Elang di Runway 04. Kemudian pukul 10.40 Commando dan personil menuju lokasi untuk mengusir burung. Ditemukan 1 ekor burung dan berhasil diamankan. Pukul 10.45 commando kembali ke firestation.",
    },
  },
  {
    id: 2,
    tanggal: "2025-01-05",
    hari: "Jumat",
    jam: "08:00 AM s.d 20:00 PM",
    petugas: ["Andi", "Rina"],
    koja: "Dewi",
    regu: "Bravo",
    flights: [
      {
        time: "08:10",
        operator: "Garuda",
        type: "A-320",
        flight: "GA-123",
        from: "CGK",
        to: "BTH",
        rw: "04",
      },
    ],
    report: {
      tanggalKejadian: "Jumat, 05 Januari 2025",
      waktuKejadian: "08:15AM",
      cuaca: "Hujan",
      kejadian: "Pengecekan alat pemadam",
      noPnb: "-",
      tipePesawat: "-",
      fasePenerbangan: "-",
      kerusakanPesawat: "-",
      jenisFasilitas: "-",
      kerusakanFasilitas: "-",
      rincianKejadian: "Pengecekan alat pemadam di area apron, semua alat dalam kondisi baik.",
    },
  },
];


const tableStyle = {
  width: "100%",
  fontSize: "12px",
  borderCollapse: "collapse",
  border: "1px solid black",
};

const tableStyle1 = {
  width: "100%",
  fontSize: "12px",
  borderCollapse: "collapse",
  border: "none",
};

const tdStyle = {
  border: "1px solid black",
  padding: "4px",
};
const tdStyle1 = {
  border: "none",
  padding: "4px",
};

const centeredHeader = {
  textAlign: "center",
  margin: "20px 0 5px",
  fontSize: "14px",
  fontWeight: "bold",
};

const sectionTitle = {
  margin: "20px 0 5px",
  fontSize: "13px",
  fontWeight: "bold",
};

const DetailLogbook = () => {
  const [logs] = useState(initialLogs);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState("");
  const detailRef = useRef();

  const filteredLogs = logs.filter(
    (log) =>
      log.hari.toLowerCase().includes(filter.toLowerCase()) ||
      log.tanggal.toLowerCase().includes(filter.toLowerCase()) ||
      log.petugas.some((p) => p.toLowerCase().includes(filter.toLowerCase())) ||
      log.report.kejadian.toLowerCase().includes(filter.toLowerCase())
  );

  // Print hanya bagian detail logbook
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
                        {log.petugas.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{log.report.kejadian}</td>
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
                  <td style={tdStyle1}>{selectedLog.report.tanggalKejadian}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Waktu Kejadian</td>
                  <td style={tdStyle1}>{selectedLog.report.waktuKejadian}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Cuaca</td>
                  <td style={tdStyle1}>{selectedLog.report.cuaca}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Kejadian</td>
                  <td style={tdStyle1}>{selectedLog.report.kejadian}</td>
                </tr>
              </tbody>
            </table>

            <h5 style={sectionTitle}>Informasi Pesawat Udara</h5>
            <table style={tableStyle1}>
              <tbody>
                <tr>
                  <td style={tdStyle1}>No.PNB</td>
                  <td style={tdStyle1}>{selectedLog.report.noPnb}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Tipe Pesawat</td>
                  <td style={tdStyle1}>{selectedLog.report.tipePesawat}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Fase Penerbangan</td>
                  <td style={tdStyle1}>{selectedLog.report.fasePenerbangan}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Kerusakan Pesawat Udara</td>
                  <td style={tdStyle1}>{selectedLog.report.kerusakanPesawat}</td>
                </tr>
              </tbody>
            </table>

            <h5 style={sectionTitle}>Informasi Fasilitas yang Terdampak</h5>
            <table style={tableStyle1}>
              <tbody>
                <tr>
                  <td style={tdStyle1}>Jenis Fasilitas</td>
                  <td style={tdStyle1}>{selectedLog.report.jenisFasilitas}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Kerusakan Fasilitas</td>
                  <td style={tdStyle1}>{selectedLog.report.kerusakanFasilitas}</td>
                </tr>
                <tr>
                  <td style={tdStyle1}>Rincian Kejadian</td>
                  <td style={tdStyle1}>{selectedLog.report.rincianKejadian}</td>
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