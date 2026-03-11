// In Landing.jsx
import React from "react";
import Hero from "../layout/Hero";
import Feature from "../layout/Feature";
import Contact from "../layout/Contact";
import Footer from "../layout/Footer";

const Landing = () => {
  return (
    <div>
      <div id="hero">
        <Hero />
      </div>
      <div id="feature">
        <Feature />
      </div>
      <div id="contact">
        <Contact />
      </div>
      <Footer />
    </div>
  );
};

export default Landing;
