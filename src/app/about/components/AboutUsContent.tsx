"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const AboutUsContent = () => {
  const imageContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"],
  });

  const rotate = useTransform(scrollYProgress, [0, 1], [12, 0]);

  return (
    <div className="bg-[#407666] pattern-bg">
      <div className="px-6 py-20 md:py-32 lg:px-px-3 2xl:px-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 md:gap-20">
          <motion.div
            ref={imageContainerRef}
            className="w-full"
            style={{ rotate }}
          >
            <Image
              src={"/assets/group-classroom.jpg"}
              width={0}
              height={0}
              sizes="100vw"
              alt="Group in a classroom"
              className="w-full h-auto rounded-4xl border-4 border-white"
            />
          </motion.div>
          <motion.div
            className="text-left my-6 md:my-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <p className="text-2xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white drop-shadow-md">
              45 Million{" "}
              <span className="text-yellow-300  underline-offset-4">
                Children
              </span>{" "}
              Across 37 states are at Risk of{" "}
              <span className="text-yellow-300 underline-offset-4">
                Illiteracy
              </span>
            </p>
            <p className="md:w-1/2 py-5 md:pt-10 mx-auto md:ml-auto mr-0">
              Accoding to{" "}
              <span className="italic text-yellow-400">Ajazeera News</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsContent;
