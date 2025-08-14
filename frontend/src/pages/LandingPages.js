import React from "react";
import AppNavbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import Fitur from "../components/landing/Fitur";
import Alasan from "../components/landing/Alasan";
import Testimoni from "../components/landing/Testimoni";
import Footer from "../components/landing/Footer";

const LandingPages = () => (
 // Aktifkan bagian ini untuk menampilkan pesan server habis
  <div style={styles.errorContainer}>
    <h1 style={styles.errorMessage}>
      Maaf server anda habis, silahkan hubungi penyedia server anda
    </h1>
  </div>

  // Komentar bagian ini jika ingin menampilkan pesan server habis
  // <>
  //   <AppNavbar />
  //   <HeroSection />
  //   <Fitur />
  //   <Alasan />
  //   <Testimoni />
  //   <Footer />
  // </>
);
const styles = {
  errorContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8d7da",
    color: "#721c24",
    textAlign: "center",
    padding: "0 20px",
  },
  errorMessage: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};


export default LandingPages;