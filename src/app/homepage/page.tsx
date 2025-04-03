"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Header from "../../components/header";

const Homepage = () => {
  const [isLoading, setLoading] = useState(false);

  return (
    <section className="w-full overflow-hidden">
      <div>
        <div
          className="relative h-screen w-screen bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.svg')" }}
        >
          <Header />
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white w-full px-4">
            {isLoading ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-gray-800 h-[70px] w-full max-w-[600px] mx-auto rounded-lg animate-pulse" />
                <div className="bg-gray-800 h-[20px] w-full max-w-[400px] mx-auto rounded-lg animate-pulse" />
                <div className="flex justify-center items-center mt-8">
                  <div className="bg-gray-800 h-[50px] w-[200px] rounded-lg animate-pulse" />
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[65px] font-chakra leading-tight font-bold tracking-wider mb-4 px-2 max-w-4xl mx-auto">
                  <span className="block">YOUR PERSONALIZED</span>
                  <span className="block">GAMING AGENT</span>
                </h1>
                <p className="text-lg sm:text-xl md:text-2xl lg:text-[25px] font-sora mb-8">
                  Real Time AI Coach for CS2 <br className="hidden sm:block" />
                  Play Smarter, Not Harder
                </p>
                <div className="flex justify-center items-center h-full">
                  <Link
                    href="/login"
                    className="flex bg-gradient-to-r from-[#ee5d4b] to-[#ec4632] px-1.1 py-2.5 border-2 border-black justify-start items-center gap-9 text-black font-chakra text-sm sm:text-base hover:scale-105 transition-transform duration-200"
                    prefetch // Preload login page for faster navigation
                  >
                    <Image
                      src="/bl.svg"
                      alt="Left Icon"
                      width={20} // Increased from 5 for better CLS
                      height={20}
                      className="w-5 h-5" // Size via CSS instead
                    />
                    LOGIN/SIGNUP
                    <Image
                      src="/br.svg"
                      alt="Right Icon"
                      width={20}
                      height={20}
                      className="w-5 h-5"
                    />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
