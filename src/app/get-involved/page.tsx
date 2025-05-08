// pages/get-involved.js
"use client";
import { motion } from "framer-motion";
import {
  Users,
  Briefcase,
  PartyPopper,
  Building,
  ChevronRight,
} from "lucide-react";
import HeroLayout from "../HeroLayout"; // Assuming this path is correct

const involvementOpportunities = [
  {
    id: "volunteer",
    Icon: Users, // Changed to capital for component usage
    title: "Lend Your Hands & Heart",
    description:
      "Become a vital thread in our community. Your time, skills, and passion can directly uplift children's lives in Abuja, whether through mentoring, educational support, or local events.",
    ctaText: "Volunteer With Us",
    ctaLink: "/contact?subject=Volunteering",
    gradientFrom: "from-sky-500",
    gradientTo: "to-blue-600",
    hoverGradientFrom: "from-sky-600",
    hoverGradientTo: "to-blue-700",
    accentColor: "sky", // For ring, focus, etc.
    iconBgShape: "M0 100 Q50 0 100 100 Q50 200 0 100Z", // Organic shape 1
  },
  {
    id: "partner",
    Icon: Briefcase,
    title: "Weave a Stronger Future, Together",
    description:
      "Partnerships amplify impact. We seek collaborations with organizations, educational institutions, and community leaders who share our vision for empowering African children in Nigeria.",
    ctaText: "Partner With Our NGO",
    ctaLink: "/contact?subject=PartnershipInquiry",
    gradientFrom: "from-emerald-500",
    gradientTo: "to-teal-600",
    hoverGradientFrom: "from-emerald-600",
    hoverGradientTo: "to-teal-700",
    accentColor: "emerald",
    iconBgShape: "M50 0 L100 50 L50 100 L0 50 Z", // Diamond shape
  },
  {
    id: "fundraise",
    Icon: PartyPopper,
    title: "Ignite Change, Host Your Event",
    description:
      "Your initiative can spark a wave of support. Rally your community to host a fundraiser or awareness event. From local gatherings to global online campaigns, every effort counts significantly.",
    ctaText: "Launch Your Fundraiser",
    ctaLink: "/contact?subject=FundraisingEvent",
    gradientFrom: "from-pink-500",
    gradientTo: "to-rose-600",
    hoverGradientFrom: "from-pink-600",
    hoverGradientTo: "to-rose-700",
    accentColor: "pink",
    iconBgShape: "M100 50 A50 50 0 1 1 0 50 A50 50 0 0 1 100 50Z", // Circle
  },
  {
    id: "corporate",
    Icon: Building,
    title: "Invest in Tomorrow, Today",
    description:
      "Corporate support is pivotal. We invite businesses to join as strategic partners in fostering education, health, and well-being for children. Explore impactful CSR initiatives with us.",
    ctaText: "Corporate Support",
    ctaLink: "/contact?subject=CorporateGiving",
    gradientFrom: "from-indigo-500",
    gradientTo: "to-purple-600",
    hoverGradientFrom: "from-indigo-600",
    hoverGradientTo: "to-purple-700",
    accentColor: "indigo",
    iconBgShape: "M0 0 L100 0 L100 100 L0 100 Z", // Square (will be rounded by class)
  },
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeInOut" },
  },
};

const heroTitleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.1 },
  },
};

const heroSubtitleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99], delay: 0.3 },
  },
};

const gridVariants = {
  initial: { opacity:0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.25, delayChildren: 0.5 },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 60, scale: 0.95, filter: "blur(8px)" },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 100, damping: 20, mass: 1.2 },
  },
};

const iconWrapperVariants = {
  initial: { scale:0.5, opacity: 0, rotateY: -90 },
  animate: { scale:1, opacity: 1, rotateY: 0, transition: { type: "spring", stiffness:150, damping:15, delay:0.2 } },
  hover: { scale: 1.1, transition: { type: "spring", stiffness:300, damping:10 } }
};

const textContentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", delay: 0.4 } },
};

const pageTitleString = "Be a Part of the Change";


export default function GetInvolvedPage() {
  const pageSubtitle =
    "Every action, big or small, contributes to a brighter future for children in Abuja and beyond. Discover how you can make a meaningful impact with The African Child NGO.";

  return (
    <HeroLayout>
      <motion.div
        className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 text-slate-800 selection:bg-sky-200 selection:text-sky-700 overflow-x-hidden px-6 sm:px-12 md:px-20 lg:px-32"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        <header className="py-20 md:py-32 text-center relative">
           <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(var(--tw-color-slate-300) 0.5px, transparent 0.5px)', backgroundSize: '15px 15px'}}></div>
          <motion.h1
            variants={heroTitleVariants}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 mb-6 relative z-10 px-4"
          >
            {pageTitleString}
          </motion.h1>
          <motion.p
            variants={heroSubtitleVariants}
            className="text-lg md:text-xl lg:text-2xl text-slate-700 max-w-3xl mx-auto px-6 relative z-10"
          >
            {pageSubtitle}
          </motion.p>
        </header>

        <motion.main
          variants={gridVariants}
          className="pb-20 md:pb-32 px-4 md:px-8"
        >
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
            {involvementOpportunities.map((item) => (
              <motion.div
                key={item.id}
                variants={cardVariants}
                className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col group"
              >
                <motion.div 
                  className="relative h-64 md:h-72 w-full flex items-center justify-center p-8 overflow-hidden"
                  variants={iconWrapperVariants}
                  whileHover="hover"
                >
                  <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full opacity-10 ${item.gradientFrom} ${item.gradientTo}`}>
                    <motion.path 
                      d={item.iconBgShape}
                      className={`fill-current text-${item.accentColor}-500`}
                      initial={{ pathLength: 0, opacity:0 }}
                      animate={{ pathLength: 1, opacity:1, transition: { duration:1, delay: 0.5, ease:"circOut" } }}
                    />
                  </svg>
                   <div className={`absolute inset-0 bg-gradient-to-br ${item.gradientFrom} ${item.gradientTo} opacity-10 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
                  <item.Icon className={`relative z-10 w-20 h-20 md:w-24 md:h-24 text-${item.accentColor}-600 group-hover:text-${item.accentColor}-500 transition-colors duration-300`} strokeWidth={1.5} />
                </motion.div>

                <motion.div variants={textContentVariants} className="p-8 md:p-10 flex-grow flex flex-col">
                  <h2 className={`text-3xl md:text-4xl font-semibold mb-5 bg-clip-text text-transparent bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo}`}>
                    {item.title}
                  </h2>
                  <p className="text-slate-600 leading-relaxed mb-8 flex-grow text-base md:text-lg">
                    {item.description}
                  </p>
                  <motion.a
                    href={item.ctaLink}
                    className={`inline-flex items-center justify-center self-start px-8 py-3.5 font-medium text-lg text-white bg-gradient-to-r ${item.gradientFrom} ${item.gradientTo} hover:${item.hoverGradientFrom} hover:${item.hoverGradientTo} rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 ring-${item.accentColor}-500/30 transition-all duration-300 ease-in-out transform group`}
                    whileHover={{ scale: 1.05, y:-3, transition:{type:"spring", stiffness:250, damping:12} }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.ctaText}
                    <ChevronRight size={22} className="ml-2.5 transform transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.a>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.main>
        <footer className="text-center py-16 md:py-20 text-slate-500 text-base border-t border-slate-200/80">
          <p className="font-semibold mb-1">&copy; {new Date().getFullYear()} The African Child NGO.</p>
          <p>Rooted in Abuja, reaching for a brighter tomorrow.</p>
        </footer>
      </motion.div>
    </HeroLayout>
  );
}