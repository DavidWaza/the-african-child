"use client";
import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  EnvelopeSimple,
  Heart,
} from "@phosphor-icons/react";
import { MetaLogo, XLogo, InstagramLogo } from "@phosphor-icons/react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#333356] text-white pt-12 pb-8 pattern-bg">
      {" "}
      <div className="container mx-auto px-6 lg:px-8">
        <div className="w-24 mx-auto footer-decoration"></div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center md:text-left">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold text-yellow-600 mb-2">
              The African Child
            </h2>
            <p className="text-sm">
              Planting seeds of knowledge, growing brighter futures
            </p>
           
          </div>

          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-3 uppercase tracking-wider text-yellow-600">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/mission"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  Our Mission
                </Link>
              </li>
              <li>
                <Link
                  href="/programs"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  Programs
                </Link>
              </li>
              <li>
                <Link
                  href="/get-involved"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  Get Involved
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-blue-600 transition-colors duration-300"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-3 uppercase tracking-wider text-yellow-600">
              Contact Us
            </h3>
            <address className="not-italic space-y-2 text-sm">
              <p className="flex items-center justify-center md:justify-start">
                <MapPin className="mr-2 text-blue-500 flex-shrink-0" /> 123
                Education Way, Knowledge City, NG 10001
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <Phone className="mr-2 text-blue-500 flex-shrink-0" />
                {/* Use standard <a> for tel: links */}
                <a href="tel:+2348001234567" className="hover:text-blue-600">
                  +234 800 123 4567
                </a>
              </p>
              <p className="flex items-center justify-center md:justify-start">
                <EnvelopeSimple className="mr-2 text-blue-500 flex-shrink-0" />
                {/* Use standard <a> for mailto: links */}
                <a
                  href="mailto:info@edufuture.org"
                  className="hover:text-blue-600"
                >
                  info@edufuture.org
                </a>
              </p>
            </address>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 uppercase tracking-wider text-yellow-600">
              Follow Us
            </h3>
            <div className="flex justify-center md:justify-start space-x-4 mb-6">
              <a
                href="#"
                aria-label="Facebook"
                className="social-icon social-icon-facebook"
              >
                <MetaLogo />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="social-icon social-icon-twitter"
              >
                <XLogo />
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="social-icon social-icon-instagram"
              >
                <InstagramLogo />
              </a>
            </div>
            <Link
              href="/donate"
              className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded-full transition-colors duration-300 shadow-md"
            >
              Donate Now
            </Link>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 pt-6 border-t border-gray-300 text-center text-sm">
          <p>&copy; {currentYear} The African Child. All Rights Reserved.</p>
          <p className="mt-1 inline-flex items-center">
            {" "}
            Designed with <Heart className="text-red-500 mx-1" /> for a brighter
            tomorrow.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
