"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/header';
const Homepage = () => {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full overflow-hidden">
      <div>
        <div
          className="relative h-screen w-screen bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.svg')" }}
        >
          <div>
            <Header />
          </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            {isLoading ? (
              <div className="space-y-6">
                <div className="bg-bg-gray-800 h-[70px] w-[600px] mx-auto rounded-lg animate-pulse"></div>
                <div className="bg-bg-gray-800 h-[20px] w-[400px] mx-auto rounded-lg animate-pulse"></div>
                <div className="flex justify-center items-center mt-8">
                  <div className="bg-bg-gray-800 h-[50px] w-[200px] rounded-lg animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-[65px] font-chakra leading-tight font-bold tracking-wider mb-4">
                  YOUR PERSONALISED GAMING AGENT
                </h1>
                <p className="text-[25px] font-sora mb-8">
                  Real Time AI Coach for CS2 <br />
                  Play Smarter, Not Harder
                </p>
                <div className="flex justify-center items-center h-full">
                <Link
                  href="/login"
                  className="flex bg-gradient-to-r from-[#ee5d4b] to-[#ec4632] px-1.5 py-2 border-2 border-black justify-start items-center gap-9 text-black font-chakra"
                >
                <Image src="/bl.svg" alt="Left Icon" width={5} height={5} />
                LOGIN/SIGNUP
                <Image src="/br.svg" alt="Right Icon" width={5} height={5} />
                </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Homepage;
