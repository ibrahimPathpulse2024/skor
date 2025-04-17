"use client";
import Image from "next/image";
import React from "react";
import Header from "../../components/header";
import StakingCard from "../../components/staking";

const StakingPage = () => {
  return (
    <div className="bg-[#141110] flex flex-col items-center justify-between min-h-screen">
      <div className="w-full">
        <Header />
      </div>
      <div className="text-[#EE5D4B] text-5xl sm:text-7xl font-chakra font-bold pt-10 flex justify-center items-center">
        Coming Soon
      </div>
      <div className="mt-10 px-4 sm:px-6 md:px-10 w-full justify-center flex flex-col items-center">
        <StakingCard />
      </div>

      <div className="flex items-center justify-center w-full px-4 pb-20 mt-28">
        <div className="w-full max-w-7xl bg-zinc-800/0 rounded-[10px] shadow-[rgba(28,25,24,0.70)_-25px_-29px_80px_0px] outline outline-1 outline-offset-[-1px] outline-red-300/20 overflow-hidden p-6">
          <div className="text-center text-white text-2xl sm:text-3xl md:text-4xl font-bold font-chakra uppercase leading-tight pt-10">
            Stake your tokens
          </div>
          <div className="flex justify-center items-center text-[#FB553F] font-sora mt-2 text-sm sm:text-base">
            Enter the number of tokens to stake.
          </div>
          <div className="flex flex-col lg:flex-row justify-between gap-10 mt-6">
            {/* Tiers */}
            <div className="w-full lg:w-1/2 bg-zinc-800/30 rounded-[20px] border border-zinc-800/60 backdrop-blur p-6 space-y-6">
              <div className="text-center text-white text-xl sm:text-2xl font-bold font-chakra uppercase">
                Tiers based on amount staked
              </div>
              {[
                {
                  title: "Bronze",
                  range: "3000-39999",
                  bg: "from-amber-600/20",
                },
                {
                  title: "Silver",
                  range: "40000-99999",
                  bg: "from-stone-300/30",
                },
                { title: "Gold", range: "100,000+", bg: "from-yellow-400/90" },
              ].map(({ title, range, bg }, index) => (
                <div
                  key={index}
                  className={`w-full h-12 bg-gradient-to-r ${bg} to-stone-950/0 rounded-[10px] border border-stone-400 backdrop-blur-[30px]`}
                >
                  <div className="flex justify-between items-center h-full px-4 sm:px-6">
                    <div className="text-white text-lg sm:text-xl font-bold font-chakra uppercase">
                      {title}
                    </div>
                    <div className="text-white/90 text-lg sm:text-xl font-bold font-chakra uppercase">
                      {range}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-center items-center sm:justify-between bg-zinc-800/30 rounded-[20px] border border-zinc-800/60 backdrop-blur p-5">
                <div className="flex flex-col gap-y-3 text-white text-base font-semibold mb-0">
                  <span>Total Staked</span>
                  <div className="flex items-center gap-3">
                    <div className="relative w-[45px] h-[45px]">
                      <Image
                        src="/Token.svg"
                        alt="token"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="p-2.5 bg-zinc-800 rounded-full outline outline-1 outline-offset-[-1px] outline-red-500 text-gray-50 text-lg font-semibold">
                      ----
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-y-3 text-white text-base font-semibold">
                  <span>Staked by You</span>
                  <div className="flex items-center gap-3">
                    <div className="relative w-[45px] h-[45px]">
                      <Image
                        src="/Tokenicon.svg"
                        alt="token"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="p-2.5 bg-zinc-800 rounded-full outline outline-1 outline-offset-[-1px] outline-red-500 text-gray-50 text-lg font-semibold">
                      ----
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 mt-6 bg-zinc-800/50 rounded-[20px] border border-zinc-800/60 backdrop-blur">
                <div className="text-white text-lg font-semibold tracking-wider mb-3">
                  Staking Rules
                </div>
                {[
                  "No early withdrawals allowed",
                  "Flat rewards paid at the end of lock period",
                  "No Modifications Allowed After Locking",
                  "Minimum Staking Amount Applies to All Tiers",
                ].map((rule, index) => (
                  <div key={index} className="flex items-center gap-2 mb-1">
                    <Image
                      src="/sparkle.svg"
                      alt="sparkle"
                      width={16}
                      height={16}
                    />
                    <span className="text-white text-base font-semibold leading-normal">
                      {rule}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* <div className="w-40 h-40 relative blur-[112.35px]">
              <div className="w-40 h-40 bg-red-500 absolute   " />
          </div>*/}
        </div>
      </div>
    </div>
  );
};

export default StakingPage;
