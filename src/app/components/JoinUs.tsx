import { Input } from "@/components/ui/input";
import React from "react";

const JoinUs = () => {
  return (
    <div className="bg-[#E8EAF3] min-h-screen flex justify-center items-center pattern-bg">
      <div className="mt-60">
        <h1 className="text-4xl lg:text-6xl font-bold text-center mb-4 text-[#333356] text-balance">
          Join Us Right Now!
        </h1>
        <p className="text-lg text-center mb-8 text-black/70">
          Become a part of our mission to support children&apos;s education.
        </p>
        <div className="flex items-center gap-5">
          <Input placeholder="Email" />
          <div>
            <div className="animate-fade-in delay-700">
              <a
                href="#donate"
                className="inline-block bg-yellow-400 text-black font-semibold text-xl px-10 py-4 rounded-full shadow-lg whitespace-nowrap hover:bg-yellow-300 hover:scale-110 transition-all duration-300 ease-in-out transform animate-cta-pulse"
              >
                Join Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinUs;
