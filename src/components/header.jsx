"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

function Header() {
//  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="relative">
      <div className="w-screen h-full pl-[23px] pr-[22px] py-[13px] bg-[#1e1a18]/60 border-b border-white/20 backdrop-blur-md justify-center items-center inline-flex">
        <div className="flex justify-between items-center w-full">
          <div>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={46}
              height={28}
              className="w-[46.16px] h-7"
            />
          </div>
          <div className="ml-4">
            <button 
            // onClick={toggleMenu} 
            aria-label="Toggle Menu">
              <Image
                src="/menu.svg"
                alt="Menu Icon"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </div>

      {/* <div
        className={`fixed top-0 right-0 h-screen w-[300px] bg-[#1e1a18]/90 border-b border-white/20 backdrop-blur-md text-white shadow-lg transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 flex flex-col h-full">
          <button
            onClick={toggleMenu}
            className="self-end mb-6 text-gray-400 hover:text-white"
          >
            ✕
          </button>

          <div className="space-y-4">
            <div>
              <p className="text-[#ee5d4b] text-base font-normal font-sora">
                Name
              </p>
              <p className="font-medium text-[24px] font-chakra">
                Tanmay Gore
              </p>
            </div>
            <div>
              <p className="text-base text-[#ee5d4b] font-sora">Gamer ID:</p>
              <p className="font-medium text-[24px] font-chakra">#89742390</p>
            </div>
            <div>
              <p className="text-base text-[#ee5d4b] font-sora">Email:</p>
              <p className="font-medium text-[24px] font-chakra">
                name@email.com
              </p>
            </div>
            <div>
              <p className="text-base text-[#ee5d4b] font-sora">Agent Time:</p>
              <p className="font-medium text-[24px] font-chakra">00:17:15</p>
            </div>
            <div className="flex flex-col justify-between items-start">
              <p className="text-sm text-gray-400">Tokens Remaining:</p>
              <div className="flex items-center space-x-20">
                <div className="flex items-center space-x-3">
                  <Image
                    src="/coins.svg"
                    alt="Token Icon"
                    width={24}
                    height={24}
                  />
                  <p className="font-chakra">43</p>
                </div>
                <div>
                  <Link href="/buy">
                    <span className="text-red-400 hover:underline flex items-center">
                      Buy Now
                      <Image
                        src="/buynow.svg"
                        alt="Buy Now Icon"
                        width={24}
                        height={24}
                      />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-auto">
            <Link href="/login">
            <button 
            className="text-gray-400 font-chakra hover:text-white text-[24px] flex items-center space-x-4">
              <Image
                src="/logout.svg"
                alt="Logout Icon"
                width={24}
                height={24}
              />
              <span>Logout</span>
            </button>
            </Link>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Header;
