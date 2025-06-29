import { useEffect, useRef, useState } from "react";
import { Button, Form, InputGroup, Table } from "react-bootstrap";

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "15px",
  border: "1px solid #ddd",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "6px",
  textAlign: "left",
  verticalAlign: "top",
  fontSize: "11px",
};

const centeredHeader = {
  textAlign: "center",
  fontWeight: "bold",
  marginBottom: "8px",
  fontSize: "12px",
};

const sectionTitle = {
  fontWeight: "bold",
  marginTop: "15px",
  marginBottom: "8px",
  fontSize: "11px",
};

const tableStyle1 = {
  width: "100%",
  borderCollapse: "collapse",
  marginBottom: "12px",
  border: "1px solid #ddd",
};

const tdStyle1 = {
  border: "1px solid #ddd",
  padding: "5px",
  textAlign: "left",
  verticalAlign: "top",
  fontSize: "10px",
};

const DetailLogbook = () => {
  const [logs, setLogs] = useState([]);
  const [selectedLog, setSelectedLog] = useState(null);
  const [filter, setFilter] = useState("");
  const detailRef = useRef();

  // Ambil user_id dari localStorage
  const user_id = localStorage.getItem("user_id");

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
        console.warn("Invalid date:", dateString);
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
      console.warn("Error formatting date:", dateString, error);
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
      console.warn("Error formatting time:", timeString, error);
      return timeString;
    }
  };

  // Fetch data logbook dari backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`https://web-logbook-bvjl.vercel.app/api/logbooks/user/${user_id}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Terjadi kesalahan saat mengambil logbook");
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

        setLogs(formattedLogs);
      } catch (error) {
        console.error("Error fetching logbooks:", error.message);
      }
    };

    fetchLogs();
  }, [user_id]);

  const filteredLogs = logs.filter(
    (log) => {
      const formattedTanggal = formatDateForDisplay(log.tanggal);
      
      return (
        log.hari?.toLowerCase().includes(filter.toLowerCase()) ||
        log.tanggal?.toLowerCase().includes(filter.toLowerCase()) ||
        formattedTanggal?.toLowerCase().includes(filter.toLowerCase()) ||
        log.petugas?.some((p) => p?.toLowerCase().includes(filter.toLowerCase())) ||
        log.kejadian?.toLowerCase().includes(filter.toLowerCase())
      );
    }
  );
  const handlePrint = () => {
    // Tambahkan CSS khusus untuk print
    const printStyles = `
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
          }
          td, th {
            padding: 3px !important;
            font-size: 9px !important;
            line-height: 1.1 !important;
          }
          h3 {
            font-size: 12px !important;
            margin: 5px 0 !important;
          }
          h4 {
            font-size: 11px !important;
            margin: 8px 0 3px 0 !important;
          }
          h5 {
            font-size: 10px !important;
            margin: 6px 0 3px 0 !important;
          }
          ul {
            margin: 0 !important;
            padding: 0 !important;
          }
          li {
            margin-bottom: 1px !important;
          }
        }
      </style>
    `;
    
    const printContents = printStyles + detailRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div style={{ fontFamily: "Arial, sans-serif", fontSize: "11px", color: "#000", padding: "15px" }}>
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
                    <td>{formatDateForDisplay(log.tanggal)}</td>
                    <td>{log.hari}</td>
                    <td>
                      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                        {log.petugas?.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </td>
                    <td>{log.kejadian || "Tidak ada kejadian"}</td>
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
            <h3 style={{ textAlign: "center", marginBottom: "8px", fontSize: "13px" }}>Logbook Watch Room ARFF Bandara Internasional Batam</h3>
            {/* TABEL ATAS */}
            <table style={tableStyle}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "12.5%" }}>Hari</td>
                  <td style={{ ...tdStyle, width: "12.5%" }}>{selectedLog.hari}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "25%" }}>Petugas Watch room</td>
                  <td style={{ ...tdStyle, width: "50%" }}>
                    {selectedLog.petugas.length === 1 ? (
                      // Jika hanya 1 petugas, tampilkan langsung tanpa list
                      <span>1. {selectedLog.petugas[0]}</span>
                    ) : (
                      // Jika lebih dari 1 petugas, gunakan list dengan spacing minimal
                      <ul style={{ listStyleType: "none", padding: 0, margin: 0 }}>
                        {selectedLog.petugas.map((p, i) => (
                          <li key={i} style={{ marginBottom: "2px" }}>
                            {i + 1}. {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "12.5%" }}>Tanggal</td>
                  <td style={{ ...tdStyle, width: "12.5%" }}>{formatDateForDisplay(selectedLog.tanggal)}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "25%" }}>Koja</td>
                  <td style={{ ...tdStyle, width: "50%" }}>{selectedLog.koja}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "12.5%" }}>Jam</td>
                  <td style={{ ...tdStyle, width: "12.5%" }}>{formatTimeForDisplay(selectedLog.jam)}</td>
                  <td style={{ ...tdStyle, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "25%" }}>Regu Jaga</td>
                  <td style={{ ...tdStyle, width: "50%" }}>{selectedLog.regu}</td>
                </tr>
              </tbody>
            </table>

            {/* TABEL PERGERAKAN PESAWAT */}
            <h5 style={centeredHeader}>Pergerakan Pesawat / Aircraft Movement</h5>
            <table style={{ ...tableStyle, textAlign: "center" }}>
              <thead>
                <tr style={{ fontWeight: "bold", backgroundColor: "#f8f9fa" }}>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>No</th>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>Time</th>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>Operator</th>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>Type</th>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>Flight</th>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>From</th>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>To</th>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>RW</th>
                  <th style={{ ...tdStyle, textAlign: "center", fontWeight: "bold" }}>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {selectedLog.flights.map((f, i) => (
                  <tr key={i}>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{formatTimeForDisplay(f.time)}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{f.operator}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{f.aircraftType}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{f.flightNumber}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{f.depArrFrom}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{f.to}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{f.rwUse}</td>
                    <td style={{ ...tdStyle, textAlign: "center" }}>{f.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h4 style={{ textAlign: "center", margin: "12px 0 3px", fontSize: "12px" }}>LAPORAN/REPORT</h4>
            
            {/* TABEL INFORMASI UMUM */}
            <h5 style={sectionTitle}>Informasi Umum / General Information</h5>
            <table style={tableStyle1}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Hari Kejadian</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.hariKejadian || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Tanggal Kejadian</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{formatDateForDisplay(selectedLog.tanggalKejadian) || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Waktu Kejadian</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{formatTimeForDisplay(selectedLog.waktuKejadian) || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Cuaca</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.cuaca || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Kejadian</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.kejadian || "Tidak tersedia"}</td>
                </tr>
              </tbody>
            </table>

            <h5 style={sectionTitle}>Informasi Pesawat Udara</h5>
            <table style={tableStyle1}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>No.PNB</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.noPnb || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Tipe Pesawat</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.tipePesawat || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Fase Penerbangan</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.fasePenerbangan || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Kerusakan Pesawat Udara</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.kerusakanPesawat || "Tidak tersedia"}</td>
                </tr>
              </tbody>
            </table>

            <h5 style={sectionTitle}>Informasi Fasilitas yang Terdampak</h5>
            <table style={tableStyle1}>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Jenis Fasilitas</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.jenisFasilitas || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Kerusakan Fasilitas</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.kerusakanFasilitas || "Tidak tersedia"}</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle1, backgroundColor: "#f8f9fa", fontWeight: "bold", width: "30%" }}>Rincian Kejadian</td>
                  <td style={{ ...tdStyle1, width: "70%" }}>{selectedLog.rincianKejadian || "Tidak tersedia"}</td>
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