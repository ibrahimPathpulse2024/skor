"use client";

import React from "react";
import Link from "next/link";
import Header from "../../components/header";
import Image from "next/image";

const LoginPage = () => {
  return (
    <section className="w-full overflow-hidden">
      <div>
        <div
          className="relative h-screen w-screen bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.svg')" }}
        >
          <div className="z-10">
            <Header />
          </div>
          <div className="flex item-center justify-center mt-16 z-20">
            <div className="flex flex-col items-center w-1/2 bg-[#1e1a18]/30 rounded-lg py-[60px] shadow-lg px-6">
              <Image
                src="/mail.svg"
                alt="Loading"
                width={100}
                height={100}
                className="mb-4"
              />
              <h1 className="text-white text-[30px] font-chakra font-bold mb-4">
                VERIFY YOUR EMAIL TO PROCEED
              </h1>
              <p className="text-gray-300 text-[18px] font-sora text-center mb-6">
                We just sent an email to your address. Please check your email & click on the link provided to verify your address.
              </p>

              <div className="flex space-x-4">
                <button
                  href="/games"
                  className="flex px-3 py-1.5 border-2 border-[#ee5d4b] justify-start items-center gap-9 text-[#ee5d4b] font-sora text-[18px]"
                >
                  Resend Mail
                </button>
                <Link
                  href="/games"
                  className="flex bg-gradient-to-r from-[#ee5d4b] to-[#ec4632] px-3 py-1.5 border-2 border-black justify-start items-center gap-9 text-black font-sora text-[18px]"
                >
                  Go to mail box
                </Link>
              </div>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
