"use client";
import { CurrencyNgn, Student } from "@phosphor-icons/react";
import React from "react";

const SupportedCountries = () => {
  return (
    <section className="relative overflow-hidden py-32 bg-gradient-to-br from-[#134B4A] to-[#2A746E] pattern-bg mx-auto px-6 sm:px-12 md:px-20 lg:px-32">
      {/* Creative Background Layers */}
      {/* Increased opacity for the map pattern */}
      <div className="absolute inset-0 bg-[url('/map-pattern.svg')] opacity-30 z-0 animate-pulse-more"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#134B4A]/80 to-transparent z-5"></div>{" "}
      {/* Subtle bottom fade */}
      <div className="relative z-10 flex flex-col gap-6 items-center justify-center text-white">
        {/* Animated Header */}
        <div className="space-y-4 text-center animate-fade-in-up">
          <h2 className="text-5xl lg:text-7xl font-extrabold  bg-gradient-to-r bg-clip-text from-yellow-300 to-yellow-500 tracking-wide leading-tight">
            <span className="block text-5xl lg:text-8xl font-extrabold">
              One Nation
            </span>
            
          </h2>
          <p className="text-balance text-lg md:text-xl text-gray-200 animate-fade-in delay-500">
            Touching lives across 37 vibrant states in Nigeria and extending
            hope to other parts of Africa.
          </p>
        </div>

        {/* Animated Stat Cards Grid */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mt-16 w-full max-w-4xl">
          {/* Stat Card 1 */}
          <div className="flex flex-col items-center lg:items-start gap-4 p-8 rounded-2xl bg-black/30 backdrop-blur-sm shadow-2xl border border-transparent hover:border-yellow-400 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-yellow-500/30 animate-slide-in-left">
            <div className="flex items-center gap-4">
              <CurrencyNgn className="text-yellow-400 text-5xl lg:text-7xl animate-icon-bounce" />
              <h3 className="text-5xl lg:text-7xl text-yellow-400 font-bold tracking-tight">
                23.5<span className="text-xl ml-2">Million</span>
              </h3>
            </div>
            <p className="text-lg text-gray-300 text-center lg:text-left leading-relaxed">
              Championing futures by raising over ₦23.5 Million dedicated to
              supporting children&apos;s secondary education dreams.
            </p>
          </div>

          {/* Stat Card 2 */}
          <div className="flex flex-col items-center lg:items-start gap-4 p-8 rounded-2xl bg-black/30 backdrop-blur-sm shadow-2xl border border-transparent hover:border-yellow-400 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-yellow-500/30 animate-slide-in-right">
            <div className="flex items-center gap-4">
              <Student className="text-yellow-400 text-5xl lg:text-7xl animate-icon-bounce delay-200" />
              <h3 className="text-5xl lg:text-7xl text-yellow-400 font-bold tracking-tight">
                200+<span className="text-xl ml-2">Kids</span>
              </h3>
            </div>
            <p className="text-lg text-gray-300 text-center lg:text-left leading-relaxed">
              Opening doors of opportunity for over 200 bright children to
              access quality secondary school education.
            </p>
          </div>
        </div>

        {/* Animated Call to Action */}
        <div className="mt-12 animate-fade-in delay-700">
          <a
            href="#donate"
            className="inline-block bg-yellow-400 text-black font-bold text-xl px-10 py-5 rounded-full shadow-lg hover:bg-yellow-300 hover:scale-110 transition-all duration-300 ease-in-out transform animate-cta-pulse whitespace-nowrap"
          >
            Ignite a Future: Support a Child
          </a>
        </div>
      </div>
      <style jsx>{`
        @keyframes pulse-more {
          0%,
          100% {
            opacity: 0.3; /* Increased base opacity */
          }
          50% {
            opacity: 0.2; /* Pulse slightly lower than base */
          }
        }
        .animate-pulse-more {
          animation: pulse-more 6s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
          opacity: 0; /* Initial state */
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: slideInUp 1s ease-out forwards;
          opacity: 0; /* Initial state */
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          70% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-pop-in {
          animation: popIn 0.8s ease-out forwards;
          opacity: 0; /* Initial state */
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out forwards;
          opacity: 0; /* Initial state */
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out forwards;
          opacity: 0; /* Initial state */
        }

        @keyframes iconBounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-icon-bounce {
          animation: iconBounce 1.5s ease-in-out infinite;
        }

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
    </section>
  );
};

export default SupportedCountries;