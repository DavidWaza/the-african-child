"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

const images = [
  "/assets/school-kids-banner.jpg",
  "/assets/smiling-kids.jpg",
  "/assets/student.jpg",
];

const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); 
      setTimeout(() => {
        setCurrent((prev) => (prev + 1) % images.length);
        setFade(true); 
      }, 500); 
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const hero = document.querySelector(".hero-bg") as HTMLElement | null;
      if (hero) {
        const scrollPosition = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={clsx(
        "relative min-h-screen flex items-center justify-center overflow-hidden hero-bg bg-fixed bg-center bg-cover transition-opacity duration-1000",
        fade ? "opacity-100" : "opacity-0"
      )}
      style={{ backgroundImage: `url(${images[current]})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 to-purple-900/60 mix-blend-multiply"></div>

      {/* SVG Waves */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-[200%] h-40 animate-wave-slow"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffffff0d"
            d="M0,224L48,213.3C96,203,192,181,288,165.3C384,149,480,139,576,149.3C672,160,768,192,864,181.3C960,171,1056,117,1152,106.7C1248,96,1344,128,1392,144L1440,160V320H0Z"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight animate-slide-up">
          Every <span className="text-yellow-400">Child</span> Deserves a Chance to Learn
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-200 mb-8 animate-fade-in-up delay-200">
          Join us in giving every child the chance to learn, grow, and dream big.
        </p>
        <div className="mt-12 animate-fade-in delay-700">
          <a
            href="#donate"
            className="inline-block bg-yellow-400 text-black font-bold text-xl px-10 py-5 rounded-full shadow-lg hover:bg-yellow-300 hover:scale-110 transition-all duration-300 ease-in-out transform animate-cta-pulse"
          >
            Ignite a Future: Support a Child
          </a>
        </div>
      </div>
      {/* Floating Elements */}
      <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-400/30 rounded-full animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full animate-float-fast" />
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
    </section>
  );
};


export default HeroBanner;
