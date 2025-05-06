'use client'
import React from 'react';
import { Target, Eye } from '@phosphor-icons/react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';



const MissionVision = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, 
    threshold: 0.1,
  });

  React.useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: (i = 1) => ({ 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        delay: i * 0.2, 
        when: "beforeChildren",
        staggerChildren: 0.15, 
      },
    }),
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: {
      scale: 1,
      rotate: 0,
      transition: { type: "spring", stiffness: 260, damping: 20, delay: 0.1 },
    },
    hover: {
      scale: 1.1,
      rotate: [0, 10, -10, 0],
      transition: { duration: 0.4, yoyo: Infinity }
    }
  };

  const ctaSectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.5, duration: 0.7, ease: "easeOut", staggerChildren: 0.2 },
    },
  };

  const ctaItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };


  return (
    <motion.section
      ref={ref}
      className="bg-[#F9F5F2] md:py-24 lg:py-32 px-1 py-20  2xl:px-32 overflow-hidden"
      initial="hidden"
      animate={controls} 
    >
      <div className="container mx-auto px-6 lg:px-8 2xl:px-20"> 
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-start"
        >
          {/* Mission Section */}
          <motion.div
            className="bg-white p-8 lg:p-10 rounded-2xl shadow-xl relative overflow-hidden group"
            variants={cardVariants}
            custom={0}
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.div
              className="absolute top-0 left-0 w-16 h-16 bg-[#407666] opacity-10 rounded-full -translate-x-1/3 -translate-y-1/3 group-hover:scale-150 transition-transform duration-500 ease-out"
              variants={itemVariants}
            />
            <motion.div className="relative z-10" variants={itemVariants}>
              <div className="flex items-center mb-6">
                <motion.div variants={iconVariants} whileHover="hover">
                  <Target weight="duotone" className="text-5xl lg:text-6xl text-[#407666] mr-4 group-hover:text-yellow-500 transition-colors duration-300" />
                </motion.div>
                <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-bold text-gray-800 tracking-tight">
                  Our Mission
                </motion.h2>
              </div>
            </motion.div>
            <motion.p variants={itemVariants} className="text-gray-600 text-lg leading-relaxed">
              To ignite curiosity, nurture potential, and champion the well-being of every African child by providing access to quality education, healthcare, and safe environments, empowering them to become leaders and innovators of a prosperous Africa.
            </motion.p>
          </motion.div>

          {/* Vision Section */}
          <motion.div
            className="bg-[#407666] pattern-bg-vision text-white p-8 lg:p-10 rounded-2xl shadow-xl relative overflow-hidden group"
            variants={cardVariants}
            custom={1} 
            whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.3)" }}
            transition={{ type: "spring", stiffness: 300 }}
          >
             <motion.div
              className="absolute bottom-0 right-0 w-20 h-20 bg-yellow-400 opacity-15 rounded-full translate-x-1/3 translate-y-1/3 group-hover:scale-150 transition-transform duration-500 ease-out"
              variants={itemVariants}
            />
            <motion.div className="relative z-10" variants={itemVariants}>
              <div className="flex items-center mb-6">
                <motion.div variants={iconVariants} whileHover="hover">
                  <Eye weight="duotone" className="text-5xl lg:text-6xl text-white mr-4 group-hover:text-yellow-400 transition-colors duration-300" />
                </motion.div>
                <motion.h2 variants={itemVariants} className="text-3xl lg:text-4xl font-bold tracking-tight">
                  Our Vision
                </motion.h2>
              </div>
            </motion.div>
            <motion.p variants={itemVariants} className="text-gray-100 text-lg leading-relaxed">
              An Africa where every child is equipped with the knowledge, skills, and confidence to realize their fullest potential, shaping a future of boundless opportunity, dignity, and sustainable development for the continent.
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Call to Action Section */}
        <motion.div
          className="text-center mt-20 lg:mt-28"
          variants={ctaSectionVariants}
        >
          <motion.h3 variants={ctaItemVariants} className="text-2xl lg:text-3xl font-semibold text-gray-700 mb-4">
            Join Us in Building a Brighter Future
          </motion.h3>
          <motion.p variants={ctaItemVariants} className="text-gray-500 lg:text-lg max-w-2xl mx-auto mb-8">
            Together, we can make a tangible difference in the lives of children across Africa. Your support can help turn this vision into reality.
          </motion.p>
          <motion.a
            href="/donate"
            className="inline-block bg-yellow-400 text-gray-900 font-semibold text-lg px-10 py-4 rounded-lg shadow-lg hover:bg-yellow-300 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-[#F9F5F2]"
            variants={ctaItemVariants}
            whileHover={{ scale: 1.05, y: -2, boxShadow: "0px 10px 20px rgba(251, 191, 36, 0.4)"}}
            whileTap={{ scale: 0.95 }}
          >
            Support a Child
          </motion.a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default MissionVision;