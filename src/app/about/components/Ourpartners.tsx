"use client";
import React from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const partnersData = [
  {
    id: 1,
    name: "Innovate Corp",
    logoUrl: "/assets/aci-logo-3.png",
    link: "https://example.com/innovate-corp",
  },
  {
    id: 2,
    name: "Future Solutions",
    logoUrl: "/assets/aci-logo-3.png",
    link: "https://example.com/future-solutions",
  },
  {
    id: 3,
    name: "EduGrowth Hub",
    logoUrl: "/assets/aci-logo-3.png",
    link: "https://example.com/edugrowth-hub",
  },
  {
    id: 4,
    name: "Africa Tech Now",
    logoUrl: "/assets/aci-logo-3.png",
    link: "https://example.com/africa-tech-now",
  },
  {
    id: 5,
    name: "Community Builders",
    logoUrl: "/assets/aci-logo-3.png",
    link: "https://example.com/community-builders",
  },
  {
    id: 6,
    name: "Global Reach",
    logoUrl: "/assets/aci-logo-3.png",
    link: "https://example.com/global-reach",
  },
  {
    id: 7,
    name: "Sunrise Ventures",
    logoUrl: "/assets/aci-logo-3.png",
    link: "https://example.com/sunrise-ventures",
  },
  {
    id: 8,
    name: "NextGen Leaders",
    logoUrl: "/assets/aci-logo-3.png",
    link: "https://example.com/nextgen-leaders",
  },
];

const OurPartners = () => {
  const sectionControls = useAnimation();
  const [sectionRef, sectionInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (sectionInView) {
      sectionControls.start("visible");
    }
  }, [sectionControls, sectionInView]);

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, duration: 0.8 },
    },
  };

  // To make the scroll truly seamless, we duplicate the partners list.
  const duplicatedPartners = [...partnersData, ...partnersData];

  return (
    <motion.section
      ref={sectionRef}
      className="bg-[#F9F5F2] py-16 md:py-24 lg:py-28 px-6 lg:px-px-3 2xl:px-32"
      initial="hidden"
      animate={sectionControls}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <motion.h2
          variants={titleVariants}
          className="text-3xl lg:text-4xl font-bold text-[#407666] text-center mb-12 md:mb-16 tracking-tight"
        >
          We&apos;re Proud to Partner With
        </motion.h2>

        <div
          className="w-full inline-flex flex-nowrap overflow-hidden py-4"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 10%, black 90%, transparent 100%)", // For Safari
          }}
        >
          <ul className="flex items-center justify-center md:justify-start animate-infinite-scroll group">
            {duplicatedPartners.map((partner, index) => (
              <li
                key={`partner-${partner.id}-${index}`}
                className="mx-6 md:mx-8 lg:mx-10 flex-shrink-0"
              >
                <a
                  href={partner.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Visit ${partner.name}`}
                  className="block filter grayscale hover:grayscale-0 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-[#F9F5F2] rounded-md"
                >
                  <Image
                    src={partner.logoUrl}
                    alt={partner.name}
                    width={160}
                    height={60}
                    className="object-contain h-10 md:h-12 lg:h-32 w-auto"
                  />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.section>
  );
};

export default OurPartners;
