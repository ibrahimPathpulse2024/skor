"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "../components/header";

const WelcomeScreen = () => {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkLoaded = () => {
      if (document.readyState === "complete" && mounted) {
        router.push("/homepage");
      }
    };

    checkLoaded();

    // Fallback check
    const fallback = setTimeout(() => {
      if (mounted) router.push("/homepage");
    }, 1000);

    // Listen for load completion
    window.addEventListener("load", checkLoaded);

    return () => {
      mounted = false;
      clearTimeout(fallback);
      window.removeEventListener("load", checkLoaded);
    };
  }, [router]);

  return (
    <section className="w-full overflow-hidden">
      <div
        className="relative h-screen w-screen bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <Header />

          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white px-4">
            <h1 className="text-[42px] xs:text-[40px] md:text-[75px] font-chakra leading-tight font-bold tracking-tighter md:tracking-wider mb-2 md:mb-4">
              WELCOME TO{" "}
              <span className="whitespace-nowrap">SKOR AI AGENTS!</span>
            </h1>

            <p className="text-base md:text-lg font-sora mb-6 md:mb-8 max-w-[280px] md:max-w-none mx-auto">
              Give us a few minutes, we&apos;re loading your resources
            </p>

            <div className="flex justify-center">
              <Image
                src="/Loader.svg"
                alt="Loading"
                className="animate-shrinkInOut w-[50px] md:w-[70px] h-[50px] md:h-[70px]"
                width={70}
                height={70}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeScreen;
