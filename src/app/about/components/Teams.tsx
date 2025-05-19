
"use client";
import React from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { LinkedinLogo, TwitterLogo, User } from "@phosphor-icons/react"; // Added User for placeholder

const teamMembers = [
  {
    id: 2,
    name: "Idemeto Emediong",
    role: "Co-Founder & Director of Programs",
    image: "/assets/waza.jpg",
    bio: "Mr Idemeto expertly leads our impactful programs, ensuring they reach those most in need.",
    socials: {
      linkedin: "https://linkedin.com/",
    },
  },
  {
    id: 3,
    name: "Queen Benedict Akpan",
    role: "Community Outreach Lead & Project Manager",
    image: "/assets/queen.jpg",
    bio: "Mrs Queen connects us with communities, building bridges and fostering trust.",
    socials: {
      linkedin: "https://linkedin.com/",
      twitter: "https://twitter.com/",
    },
  },

];

const OurTeam = () => {
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

  const sectionVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, duration: 0.8 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.85, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.5,
      },
    },
  };

  const socialIconHover = {
    y: -3,
    scale: 1.1,
    color: "#FACC15",
    transition: { type: "spring", stiffness: 300 },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="bg-[#171D2C] py-20 md:py-24 lg:py-32 px-2 lg:px-px-3 2xl:px-32"
      initial="hidden"
      animate={sectionControls}
      variants={sectionVariants}
    >
      <div className="container mx-auto px-6 lg:px-8 2xl:px-20">
        <motion.h2
          variants={titleVariants}
          className="text-2xl lg:text-5xl font-bold text-yellow-400 text-center mb-6 tracking-tight"
        >
          Meet Our Dedicated Team
        </motion.h2>
        <motion.p
          variants={titleVariants}
          className="text-md lg:text-xl text-gray-300 text-center max-w-3xl mx-auto text-balance"
        >
          Passionate individuals committed to making a difference. We are a
          collective of thinkers, doers, and dreamers, united by a shared vision
          for a brighter future for every African child.
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-8 md:gap-10">
          {teamMembers.map((member) => (
            <motion.div
              key={member.id}
              className="bg-[#F9F5F2] rounded-xl shadow-lg overflow-hidden group relative flex flex-col items-center text-center p-6 pt-10"
              variants={cardVariants}
              whileHover={{
                y: -8,
                boxShadow:
                  "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
              }}
            >
              <motion.div
                className="relative w-32 h-32 md:w-36 md:h-36 mb-4 rounded-full overflow-hidden border-4 border-[#407666] shadow-md group-hover:border-yellow-400 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
              >
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    sizes="100vw"
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <User size={64} className="text-gray-400" />
                  </div>
                )}
              </motion.div>

              <motion.h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                {member.name}
              </motion.h3>
              <motion.p className="text-[#407666] text-sm md:text-base font-medium mb-3">
                {member.role}
              </motion.p>
              <motion.p className="text-gray-600 text-xs md:text-sm mb-4 px-2 h-16 overflow-hidden">
                {member.bio}
              </motion.p>

              {/* Social Icons - appear on hover or always visible */}
              <motion.div className="flex space-x-4 mt-auto pt-4 border-t border-gray-200 w-full justify-center">
                {member.socials?.linkedin && (
                  <motion.a
                    href={member.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-yellow-500"
                    whileHover={socialIconHover}
                    aria-label={`${member.name} LinkedIn Profile`}
                  >
                    <LinkedinLogo size={28} weight="fill" />
                  </motion.a>
                )}
                {member.socials?.twitter && (
                  <motion.a
                    href={member.socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-yellow-500"
                    whileHover={socialIconHover}
                    aria-label={`${member.name} Twitter Profile`}
                  >
                    <TwitterLogo size={28} weight="fill" />
                  </motion.a>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default OurTeam;
