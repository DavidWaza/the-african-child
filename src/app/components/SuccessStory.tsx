"use client";

import React from "react";
import Image from 'next/image';
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import "swiper/css/autoplay"; 

import { Navigation, Pagination, A11y, EffectCoverflow, Autoplay } from "swiper/modules";

import { motion } from "framer-motion";
import {
  Quotes,
  GraduationCap,
  Sparkle,
  CaretLeft,
  CaretRight,
} from "@phosphor-icons/react";

const textContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
      ease: "easeOut",
    },
  },
};

const textItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};


const CreativeSuccessStories = () => {
  type StoryColor = "yellow" | "teal" | "rose" | "sky";

  const stories = [
    {
      id: 1,
      icon: GraduationCap,
      title: "Amina's Renewed Dream",
      text: "Top of her primary class, Amina feared her education would end due to costs. Support covered her fees and supplies, allowing her to thrive...",
      color: "yellow" as StoryColor,
      imageUrl: "/assets/amina.jpg",
      altText: "Photo of Amina",
    },
    {
      id: 2,
      icon: Sparkle,
      title: "David's Opportunity",
      text: "Living rurally, David faced barriers accessing quality secondary education. Funding for boarding school opened doors to better teachers...",
      color: "teal" as StoryColor,
      imageUrl: "/assets/student-2.png",
      altText: "Photo of David",
    },
    {
      id: 3,
      icon: GraduationCap,
      title: "Chidinma Finds Her Path",
      text: "After a year out of school helping her family, Chidinma received a scholarship. Now back and more determined, she excels academically...",
      color: "rose" as StoryColor,
      imageUrl: "/assets/amina.jpg",
      altText: "Photo of Chidinma",
    },
    {
      id: 4,
      icon: Sparkle,
      title: "Samuel's Focus",
      text: "Distracted by financial worries, Samuel struggled initially. Consistent support allowed him to focus purely on his studies...",
      color: "sky" as StoryColor,
      imageUrl: "/assets/student-3.png",
      altText: "Photo of Samuel",
    },
  ];

  const borderColors = {
    yellow: "border-yellow-400",
    teal: "border-teal-400",
    rose: "border-rose-400",
    sky: "border-sky-400",
  };
  const textColors = {
    yellow: "text-yellow-400",
    teal: "text-teal-400",
    rose: "text-rose-400",
    sky: "text-sky-400",
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-[#0f3433] mx-auto pattern-bg">
      <div className="absolute inset-0 bg-gradient-to-br from-[#134B4A]/30 via-transparent to-[#2A746E]/20 opacity-50"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 bg-gradient-to-r bg-clip-text text-transparent from-yellow-300 to-yellow-500 tracking-tight leading-tight">
            Journeys of Transformation
          </h2>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Swipe through the stories of bright minds empowered by generosity.
          </p>
        </div>

        <div className="relative px-8">
          <Swiper
            modules={[Navigation, Pagination, A11y, EffectCoverflow, Autoplay]} // Added Autoplay module
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            effect={"slide"}
            autoplay={{
              delay: 3000, 
              disableOnInteraction: true, 
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              el: ".custom-swiper-pagination",
            }}
            navigation={{
              nextEl: ".swiper-button-next-custom",
              prevEl: ".swiper-button-prev-custom",
            }}
            grabCursor={true}
            centeredSlides={true}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
                centeredSlides: false,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
                centeredSlides: true,
              },
            }}
            className="mySwiper"
          >
            {stories.map((story) => (
              <SwiperSlide key={story.id} className="h-auto pb-10">
                {({ isActive }) => (
                  <div
                    className={`h-full flex flex-col bg-gradient-to-br from-[#1a5f5c]/60 to-[#144544]/80 backdrop-blur-md rounded-xl shadow-lg pt-6 md:pt-8 border-l-4 transition-all duration-500 ease-out overflow-hidden ${
                      isActive
                        ? borderColors[story.color] + " scale-105 shadow-2xl"
                        : "border-transparent scale-100 shadow-xl"
                    }`}
                  >
                    <div className="px-6 md:px-8 mb-4 flex justify-center items-center">
                      <Image
                        src={story.imageUrl}
                        alt={story.altText}
                        width={96}
                        height={96}
                        className="rounded-full object-cover border-2 border-white/10 shadow-md transition-opacity duration-300"
                      />
                    </div>

                    <motion.div
                      className="flex flex-col flex-grow p-6 md:p-8 pt-0"
                      variants={textContainerVariants}
                      initial="hidden"
                      animate={isActive ? "visible" : "hidden"}
                    >
                      <motion.div variants={textItemVariants}>
                        <Quotes
                          className={`mb-3 ${textColors[story.color]} opacity-40`}
                          size={40}
                          weight="fill"
                        />
                      </motion.div>

                      <motion.h3
                        className={`text-2xl lg:text-3xl font-bold mb-3 tracking-tight ${
                          textColors[story.color]
                        }`}
                        variants={textItemVariants}
                      >
                        {story.title}
                      </motion.h3>

                      <motion.p
                        className="text-gray-300 text-base lg:text-lg leading-relaxed flex-grow mb-4"
                        variants={textItemVariants}
                      >
                        {story.text}
                      </motion.p>

                      <motion.div
                        className="self-end mt-auto"
                        variants={textItemVariants}
                      >
                        <story.icon
                          className={`${textColors[story.color]}`}
                          size={32}
                          weight="light"
                        />
                      </motion.div>
                    </motion.div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="swiper-button-prev-custom absolute top-1/2 left-0 transform -translate-y-1/2 z-20 cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
            <CaretLeft size={28} className="text-yellow-300" />
          </div>
          <div className="swiper-button-next-custom absolute top-1/2 right-0 transform -translate-y-1/2 z-20 cursor-pointer p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200">
            <CaretRight size={28} className="text-yellow-300" />
          </div>

          <div className="custom-swiper-pagination text-center mt-8 relative z-10"></div>
        </div>
      </div>

      <style jsx global>{`
        .custom-swiper-pagination .swiper-pagination-bullet {
          background-color: rgba(252, 211, 77, 0.5);
          width: 10px;
          height: 10px;
          opacity: 0.6;
          transition: opacity 0.3s, background-color 0.3s, transform 0.3s;
        }
        .custom-swiper-pagination .swiper-pagination-bullet-active {
          background-color: #fcd34d;
          opacity: 1;
          transform: scale(1.2);
        }
        .swiper-slide {
           height: auto !important;
           display: flex;
        }
        .swiper-wrapper {
           align-items: stretch !important;
           /* Add transition timing function for smoother autoplay */
           transition-timing-function: ease-in-out;
        }
        .swiper-button-prev-custom,
        .swiper-button-next-custom {
           z-index: 20;
        }
        .swiper-slide:not(.swiper-slide-active) {
           opacity: 0.7;
           transition: opacity 0.4s ease-out;
        }
        .swiper-slide.swiper-slide-active {
           opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default CreativeSuccessStories;