import React from "react";
import AppNavbar from "../components/landing/Navbar";
import Demo from "../components/landing/Demo";
import Footer from "../components/landing/Footer";

const DemoPage = () => {
  return (
    <>
      <AppNavbar />
      <main style={{ paddingTop: "2rem", paddingBottom: "2rem", background: "#f9fafb" }}>
        <Demo />
      </main>
      <Footer />
    </>
  );
};

export default DemoPage;