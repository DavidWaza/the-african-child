import React from "react";
import HeroLayout from "../HeroLayout";
import AboutUsContent from "./components/AboutUsContent";
import Statement from "./components/Statement";
import OurTeam from "./components/Teams";
import OurPartners from "./components/Ourpartners";

const AboutUs = () => {
  return (
    <HeroLayout>
      <AboutUsContent />
      <Statement />
      <OurTeam />
      <OurPartners />
    </HeroLayout>
  );
};

export default AboutUs;
