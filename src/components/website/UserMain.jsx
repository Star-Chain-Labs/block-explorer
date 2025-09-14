import React from "react";
import Header from "../Header";
import Navbar from "../Navbar";
import HeroSection from "./HeroSection";
import About from "./About";
import Services from "./Services";
import Faq from "./Faq";
import Contact from "./Contact";
import Footer from "../Footer";
import HowItWorks from "./HowItWorks";
import HeaderStats from "./HeaderStats";
import ImpactfulFacts from "./ImpactfulFacts";
import AboutRobomine from "./AboutRobomine";
import CryptoSection from "./CryptoSection";

const UserMain = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100">
      <Header />
      <Navbar />
      <HeroSection />
      <About />
      <Services />
      <HeaderStats />
      {/* <HowItWorks /> */}
      <ImpactfulFacts />
      {/* <AboutRobomine /> */}
      <CryptoSection />
      <Faq />
      <Contact />
      {/* <Footer /> */}
    </div>
  );
};

export default UserMain;
