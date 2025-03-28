"use client";

import React, { useState, useEffect, useRef } from "react";
import Header from "../../components/header";
import Image from "next/image";
import Link from "next/link";
const GameSelection = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-screen h-full overflow-hidden">
      <div className="relative h-screen w-screen bg-no-repeat bg-cover bg-center" style={{ backgroundImage: "url('/bg.svg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <div className="relative z-20">
          <Header />
        </div>

        <div className="flex flex-col justify-center items-center text-center relative z-10">
          <h1 className="text-7xl font-chakra text-white font-bold tracking-wider mt-20">
            {loading ? <div className="h-10 w-[300px] bg-gray-800 rounded-md animate-pulse"></div> : "SELECT YOUR GAME"}
          </h1>

          <p className="text-[25px] text-white font-sora mb-8">
            {loading ? <span className="h-6 w-[250px] bg-gray-800 rounded-md animate-pulse inline-block"></span> : "Let’s get started with one game"}
          </p>

          <div className="grid grid-cols-4 gap-6 w-screen px-20">
            {["/CS1.svg", "/valorant.svg", "/standoff.svg", "/fortnite.svg"].map((src, index) => (
              <div key={index} className="relative w-[300px] rounded-lg overflow-hidden flex flex-col items-center">
                {loading ? (
                  <>
                    <div className="w-full h-[400px] bg-gray-800 animate-pulse rounded-lg"></div>
                    <div className="mt-5 w-[150px] h-10 bg-gray-800 animate-pulse rounded-md"></div>
                  </>
                ) : (
                  <>
                    <div className={`relative w-full h-[400px] ${index !== 0 ? "filter blur-sm" : ""}`}>
                      <Image src={src} alt={`Game ${index + 1}`} layout="fill" objectFit="cover" />
                    </div>
                    <Link href="/sharescreen">
                    <button
                      className={`absolute left-7 bottom-4 text-center text-[#070604] w-[250px] text-sm font-semibold px-[70px] py-3.5 uppercase ${
                        index === 0 ? "bg-[#ee5d4b]" : "bg-gray-500 opacity-70 cursor-not-allowed"
                      }`}
                    >
                      {index === 0 ? "Play" : "Coming Soon"}
                    </button>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default GameSelection;
