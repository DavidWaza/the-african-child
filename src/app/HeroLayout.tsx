"use client";
import React from "react";
import { usePathname } from "next/navigation";

interface HeroLayoutProps {
  children: React.ReactNode;
}
const HeroLayout: React.FC<HeroLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const HeroBackground = () => {
    switch (pathname) {
      case "/":
        return "bg-hero-pattern";
      case "/about":
        return "about-hero";
      case "/our-work":
        return "our-work-hero";
      case "/donate":
        return "donate-hero";
      case "/transparency-dashboard":
        return "bg-transparency-pattern";
      case "/get-involved":
        return "volunteer-hero";
      case "/contact-us":
        return "bg-contact-us-pattern";
      default:
        return "bg-default-pattern";
    }
  };

  const Herotext = () => {
    switch (pathname) {
      case "/":
        return "Home";
      case "/about":
        return "About Us";
      case "/our-work":
        return "Our Work";
      case "/donate":
        return "Donate to Our Cause";
      case "/transparency-dashboard":
        return "bg-transparency-pattern";
      case "/get-involved":
        return "Become a Volunteer";
      case "/contact-us":
        return "bg-contact-us-pattern";
      default:
        return "bg-default-pattern";
    }
  };
  return (
    <div>
      <div
        className={`relative ${HeroBackground()} hero-common flex items-center justify-center bg-cover bg-center`}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl lg:text-7xl font-bold mb-4">{Herotext()}</h1>
        </div>
      </div>
      {children}
    </div>
  );
};

export default HeroLayout;
