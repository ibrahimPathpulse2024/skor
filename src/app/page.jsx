"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from "../components/header"
const WelcomeScreen = () => {
  const router = useRouter(); 
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLink(true);
      router.push('/homepage'); 
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

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
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            <h1 className="text-[70px] font-chakra leading-tight font-bold tracking-wider mb-4">
              WELCOME TO  <br /> SKOR AI AGENTS!
            </h1>
            <p className="text-lg font-sora mb-8">
              Give us a few minutes, we're loading your resources
            </p>
            <div className="flex justify-center">
              <Image
                src="/Loader.svg"
                alt="Loading"
                className="animate-shrinkInOut"
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
