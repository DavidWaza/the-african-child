"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const DonateComp = () => {
  const placeholderImg = () => `/assets/amina.jpg`;

  return (
    <div className="flex items-center justify-center from-gray-800 to-gray-900 relative">
      <motion.div
        className="w-full max-w-7xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden absolute -top-20"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="relative h-64 md:h-auto">
            <Image
              src={placeholderImg()}
              alt="Children smiling and learning"
              layout="fill"
              objectFit="cover"
              className="rounded-l-3xl md:rounded-l-3xl md:rounded-r-none"
            />
          </div>

          <div className="relative p-8 md:p-10 flex flex-col justify-center overflow-hidden pattern-bg">
            <motion.div
              className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-yellow-400 rounded-full opacity-20 dark:opacity-15"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-teal-400 rounded-full opacity-15 dark:opacity-10"
              animate={{
                scale: [1, 1.05, 1],
                x: [0, 5, 0],
                y: [0, -5, 0],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            <div className="relative z-10 text-center md:text-left">
              <motion.div
                className="flex justify-center md:justify-start mb-4"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
              ></motion.div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3 leading-tight">
                Join us in empowering children for the future through quality
                education and eradicating illiteracy.
              </h2>

              <div className="mt-12 animate-fade-in delay-700">
                <a
                  href="#donate"
                  className="inline-block bg-yellow-400 text-black font-bold text-xl px-10 py-5 rounded-full shadow-lg hover:bg-yellow-300 hover:scale-110 transition-all duration-300 ease-in-out transform animate-cta-pulse"
                >
                  Support a Child
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      <style jsx>{`
        @keyframes ctaPulse {
          0% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(252, 211, 77, 0.7);
          }
          70% {
            transform: scale(1.05);
            box-shadow: 0 0 0 15px rgba(252, 211, 77, 0);
          }
          100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(252, 211, 77, 0);
          }
        }
        .animate-cta-pulse {
          animation: ctaPulse 2s infinite;
        }

        /* Add animation delays using utility classes if needed, or inline style */
        .delay-100 {
          animation-delay: 0.1s;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
        .delay-700 {
          animation-delay: 0.7s;
        }
      `}</style>
    </div>
  );
};

export default DonateComp;
