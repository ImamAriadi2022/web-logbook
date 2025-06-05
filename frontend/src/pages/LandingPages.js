import React from "react";
import AppNavbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import Fitur from "../components/landing/Fitur";
import Alasan from "../components/landing/Alasan";
import Testimoni from "../components/landing/Testimoni";
import Footer from "../components/landing/Footer";

const LandingPages = () => (
  <>
    <AppNavbar />
    <HeroSection />
    <Fitur />
    <Alasan />
    <Testimoni />
    <Footer />
  </>
);

export default LandingPages;