"use client";
import { CurrencyNgn, Student } from "@phosphor-icons/react";
import React from "react";

const SupportedCountries = () => {
  return (
    <section className="relative py-32 bg-[#134B4A] pattern-bg  overflow-hidden lg:min-w-28 mx-auto px-6 sm:px-12 md:px-20 lg:px-32">
      <div className="absolute inset-0 map opacity-15 z-0"></div>
      <div className="relative z-10 flex flex-col gap-4 items-center justify-center text-white">
        <div className="opacity-100 flex-col justify-center space-y-2">
          <p className="text-5xl lg:text-7xl font-bold text-center">
            <span className="text-yellow-400">1</span> Country
          </p>
          <p className="text-balance text-xl text-center">
            We fight life-threatening challenges in 37 States across Nigeria,
            <br />
            and other parts of Africa.
          </p>

          <div className="grid lg:grid-cols-2 my-10 gap-10">
            <div className="lg:px-20">
              <div className="flex items-center gap-2">
                <CurrencyNgn className="text-yellow-400 text-3xl lg:text-7xl" />
                <h1 className=" text-3xl lg:text-7xl text-yellow-400 font-semibold">
                  23.5M
                </h1>
              </div>
              <p className="py-5">
                We have been able to raise up to 23.5M in naira to sponsor
                children into secondary school sectors
              </p>
            </div>
            <div className="lg:px-20">
              <div className="flex items-center gap-2">
                <Student className="text-yellow-400 text-3xl lg:text-7xl" />
                <h1 className=" text-3xl lg:text-7xl text-yellow-400 font-semibold">
                  200 kids
                </h1>
              </div>
              <p className="py-5">
                We have been able to raise up to 23.5M in naira to sponsor
                children into secondary school sectors
              </p>
            </div>
          </div>
          <div className="flex justify-center">
            <a
              href="#donate"
              className="inline-block bg-yellow-400 text-black font-semibold text-lg px-8 py-4 rounded-full shadow-xl hover:bg-yellow-300 hover:scale-105 transition-all duration-300 animate-fade-in-up delay-400"
            >
              Support a Child Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportedCountries;
