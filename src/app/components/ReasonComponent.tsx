'use client'
import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Buildings, PiggyBank, Users, BookOpen, GraduationCap } from '@phosphor-icons/react';

const paragraphVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const gridContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

interface InfoBlockProps {
  icon?: React.ComponentType<{ className?: string }>;
  color?: "yellow" | "orange";
  children: React.ReactNode;
  className?: string;
}

const InfoBlock: React.FC<InfoBlockProps> = ({ icon: Icon, color = "yellow", children, className = "" }) => {
  const borderColorClass = color === "yellow" ? "border-yellow-300" : "border-orange-400"; 
  const iconColorClass = color === "yellow" ? "text-yellow-300" : "text-orange-400";

  return (
    <motion.div
      className={`text-balance text-base leading-relaxed border-l-4 ${borderColorClass} pl-4 bg-gradient-to-r from-black/20 to-black/10 p-5 rounded-r-lg shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 ease-out flex gap-4 items-start ${className}`}
      variants={paragraphVariants}
    >
      {Icon && <Icon className={`w-6 h-6 ${iconColorClass} flex-shrink-0 mt-1`} aria-hidden="true" />}
      <div className="flex-grow">{children}</div>
    </motion.div>
  );
};


const Reason = () => {
  const sectionRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const yImage1 = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const xImage1 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const rotateImage1 = useTransform(scrollYProgress, [0, 1], [8, 20]);

  const yImage2 = useTransform(scrollYProgress, [0, 1], [-120, 120]);
  const xImage2 = useTransform(scrollYProgress, [0, 1], [-60, 60]);
  const rotateImage2 = useTransform(scrollYProgress, [0, 1], [-8, -20]);

  return (
    <section className="py-24 bg-gray-50 pattern-header overflow-hidden" ref={sectionRef}> 
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative"> 
        <div className="rounded-xl bg-[#337463] lg:w-[65rem] mx-auto py-12 px-6 md:px-16 lg:p-24 pattern-bg relative shadow-2xl text-gray-100"> 
          <motion.div
            style={{ y: yImage1, x: xImage1, rotate: rotateImage1 }}
            className="absolute top-[-70px] left-[-50px] md:top-[-100px] md:left-[-30px] z-10" 
          >
            <Image
              src={"/assets/student.jpg"}
              alt="Student learning with focus"
              width={240}
              height={240}
              sizes="(max-width: 768px) 130px, 210px"
              className="rounded-lg h-auto w-36 md:w-52 object-cover shadow-xl border-4 border-white transform group-hover:scale-105 transition-transform duration-300" // Added hover effect 
              onError={(e) => e.currentTarget.src = 'https://placehold.co/240x240/cccccc/ffffff?text=Student'}
            />
          </motion.div>

          <motion.div
            style={{ y: yImage2, x: xImage2, rotate: rotateImage2 }}
            className="absolute bottom-[-50px] right-[-40px] md:bottom-[-80px] md:right-[-20px] z-10" // Adjusted positioning slightly
          >
            <Image
              src={"/assets/smiling-kids.jpg"}
              alt="Group of happy, smiling children"
              width={240} // Slightly larger
              height={240}
              sizes="(max-width: 768px) 160px, 240px"
              className="rounded-lg h-auto w-44 md:w-60 object-cover shadow-xl border-4 border-white transform group-hover:scale-105 transition-transform duration-300" // Added hover effect 
              onError={(e) => e.currentTarget.src = 'https://placehold.co/240x240/cccccc/ffffff?text=Kids'}
            />
          </motion.div>

          <motion.div
            className="flex justify-center mb-8" 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="uppercase text-balance bg-[#FF9800] text-black text-base py-2 px-5 rounded-full font-bold shadow-lg tracking-wide">
              Why we do this?
            </h1>
          </motion.div>

          {/* Main Heading */}
          <motion.div
            className="text-center my-6 md:my-8" 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow-md"> {/* Bolder, larger, drop shadow */}
              45 Million <span className="text-yellow-300 underline decoration-wavy decoration-orange-400/70 underline-offset-4">Children</span>{" "}
              Across 37 states are at Risk of{" "}
              <span className="text-yellow-300 underline decoration-wavy decoration-orange-400/70 underline-offset-4">Uneducation</span>
            </p>
          </motion.div>

          <InfoBlock
             icon={BookOpen} 
             color="yellow"
             className="py-6 md:py-8 mb-10 md:mb-12" 
           
          >
              <p>
                Education is a fundamental right of every child. It&apos;s the
                foundation for a brighter future and a powerful tool for breaking
                the cycle of poverty. However, millions worldwide are still denied
                this basic right. Understanding why children aren&apos;t in school is
                the first step—and as an NGO committed to change, we play a crucial
                role in ensuring every child accesses quality education.
              </p>
          </InfoBlock>


          {/* Grid for subsequent paragraphs with stagger animation */}
          <motion.div
            className="grid md:grid-cols-2 gap-8 md:gap-10" // Increased gap
            variants={gridContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Grid Column 1 */}
            <div className="flex flex-col gap-8 md:gap-10">
              <InfoBlock icon={PiggyBank} color="orange">
                <h3 className="font-semibold text-lg mb-2 text-orange-300">The Barrier of Poverty</h3>
                <p>
                  One significant hurdle is poverty. Many families can&apos;t afford schooling costs like fees, uniforms, books, or transport. When survival is the daily focus, children often work or help at home, leaving no room for education. Poverty creates environments where immediate needs overshadow learning.
                </p>
              </InfoBlock>

              {/* Paragraph 2: Access */}
              <InfoBlock icon={GraduationCap} color="orange">
                 <h3 className="font-semibold text-lg mb-2 text-orange-300">Challenges in Access</h3>
                 <p>
                   In rural areas, reaching schools is tough. Children might live miles away, facing long or dangerous journeys, especially girls. Existing schools are often underfunded, crowded, and lack basic facilities or trained teachers. Unsafe learning environments discourage attendance.
                 </p>
              </InfoBlock>
            </div>

            {/* Grid Column 2 */}
            <div className="flex flex-col gap-8 md:gap-10"> {/* Matched gap */}
              <InfoBlock icon={Buildings} color="orange">
                 <h3 className="font-semibold text-lg mb-2 text-orange-300">Our Role in Solutions</h3>
                 <p>
                   Despite challenges, we make education accessible. We provide scholarships and supplies, easing financial burdens. We build or renovate schools in remote areas, ensuring safe learning spaces. Our efforts remove barriers preventing regular attendance.
                 </p>
              </InfoBlock>

              <InfoBlock icon={Users} color="orange">
                 <h3 className="font-semibold text-lg mb-2 text-orange-300">Community & Inclusion</h3>
                 <p>
                   We engage communities, raising awareness about education&apos;s value for all, including girls and those with disabilities. We challenge harmful practices and advocate for equality. In crisis zones, we offer mobile classrooms or digital learning. We train teachers for inclusive classrooms accessible to diverse needs.
                 </p>
              </InfoBlock>
            </div>
          </motion.div>

        </div> 
      </div> 
    </section> 
  );
};

export default Reason;
