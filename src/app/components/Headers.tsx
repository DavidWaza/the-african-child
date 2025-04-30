"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Equals, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { id: 1, route: "/about", label: "About Program" },
  { id: 2, route: "/our-work", label: "Our Work" },
  { id: 3, route: "/donate", label: "Donate" },
  { id: 4, route: "/transparency-dashboard", label: "Transparency Model" },
  { id: 5, route: "/get-involved", label: "Get Involved" },
  { id: 6, route: "/contact-us", label: "Contact Us" },
];

const activeLinkStyleBase = "font-bold";
const activeLinkStyleScrolled = "text-black";
const activeLinkStyleTop = "text-white";

const inactiveLinkStyleScrolled = "text-[#2e2e2e]";
const inactiveLinkStyleTop = "text-white";

const hoverEffectBase = "hover:text-gray-400";

const Headers = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const menuVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
      transition: { type: "tween", duration: 0.3, ease: "easeOut" },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeIn",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const navBgClass = isScrolled ? "bg-[#EAE8E1] shadow-md" : "bg-transparent";
  const logoColorClass = isScrolled ? "text-[#2e2e2e]" : "text-white";
  const mobileIconColorClass = isScrolled ? "text-[#2e2e2e]" : "text-white";

  return (
    <nav
      className={`fixed w-full top-0 z-50 py-5 px-6 sm:px-12 md:px-20 lg:px-32 flex justify-between items-center font-medium transition-colors duration-300 ease-in-out ${navBgClass}`}
    >
      <div>
        <Link
          href={"/"}
          className={`uppercase text-lg hidden lg:block font-semibold tracking-wide hover:opacity-80 transition-colors duration-300 ease-in-out ${logoColorClass}`}
        >
          The African Child
        </Link>
        <Link
          href={"/"}
          className={`uppercase text-lg block lg:hidden font-semibold tracking-wide hover:opacity-80 transition-colors duration-300 ease-in-out ${logoColorClass}`}
        >
          ACI
        </Link>
      </div>

      <div className="hidden lg:flex items-center gap-8">
        <ul className="flex gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.route;
            let linkColorClass = "";
            if (isActive) {
              linkColorClass = `${activeLinkStyleBase} ${
                isScrolled ? activeLinkStyleScrolled : activeLinkStyleTop
              }`;
            } else {
              linkColorClass = isScrolled
                ? inactiveLinkStyleScrolled
                : inactiveLinkStyleTop;
            }
            const underlineColorClass = isScrolled ? "bg-black" : "bg-white";

            return (
              <li key={item.id}>
                <Link
                  href={item.route}
                  className={`relative group ${hoverEffectBase} transition-colors duration-300 ease-in-out ${linkColorClass}`}
                >
                  {item.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 ${underlineColorClass} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out ${
                      isActive ? "scale-x-100" : ""
                    }`}
                  ></span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="flex gap-3">
          <button
            className={`border rounded-full py-2 px-5 shadow-sm hover:shadow-md transition-all ease-in duration-200 cursor-pointer text-sm ${
              isScrolled
                ? "border-[#c8c8c8] bg-white text-[#2e2e2e] hover:bg-gray-50"
                : "border-white bg-white/20 text-white hover:bg-white/40"
            }`}
          >
            Sign Up
          </button>
          <button
            className={`border border-transparent rounded-full py-2 px-5 shadow-sm hover:shadow-md transition-all ease-in duration-200 cursor-pointer text-sm ${
              isScrolled
                ? "text-[#d6cfe1] bg-[#2e2e2e] hover:bg-black"
                : "text-[#2e2e2e] bg-white hover:bg-gray-200"
            }`}
          >
            Login
          </button>
        </div>
      </div>
      <div className="lg:hidden">
        <button
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          className={`p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset transition-colors duration-300 ease-in-out ${
            isScrolled ? "focus:ring-[#2e2e2e]" : "focus:ring-white"
          } ${mobileIconColorClass}`}
        >
          {isMobileMenuOpen ? (
            <X size={28} weight="bold" />
          ) : (
            <Equals size={28} weight="bold" />
          )}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className={`lg:hidden absolute top-full left-0 w-full bg-[#EAE8E1] shadow-lg py-5 px-6 z-40`}
          >
            <ul className="flex flex-col gap-4 mb-6">
              {navItems.map((item) => {
                const isActive = pathname === item.route;
                const mobileLinkColor = isActive
                  ? "text-black font-bold"
                  : "text-gray-700";
                const mobileHoverColor = "hover:text-black";

                return (
                  <motion.li
                    key={item.id}
                    variants={itemVariants}
                    className="border-b border-gray-300 pb-2"
                  >
                    <Link
                      href={item.route}
                      onClick={toggleMobileMenu}
                      className={`block py-2 transition-colors duration-200 w-full ${mobileLinkColor} ${mobileHoverColor}`}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
            <motion.div
              variants={itemVariants}
              className="flex flex-col gap-3 items-center"
            >
              <button className="w-full border border-[#c8c8c8] rounded-full bg-white py-2 px-5 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all ease-in duration-200 cursor-pointer text-[#2e2e2e]">
                Sign Up
              </button>
              <button className="w-full border border-transparent text-[#d6cfe1] rounded-full bg-[#2e2e2e] py-2 px-5 shadow-sm hover:shadow-md transition-all ease-in duration-200 cursor-pointer hover:bg-black">
                Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Headers;
