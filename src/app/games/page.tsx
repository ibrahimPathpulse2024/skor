"use client";
import { useOkto } from "@okto_web3/react-sdk";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header";

const GameSelection = () => {
  const [loading, setLoading] = useState(true);
  const oktoClient = useOkto();
  const { data: session } = useSession();

  //@ts-ignore
  const idToken = useMemo(() => (session ? session.id_token : null), [session]);

  async function handleAuthenticate() {
    console.log("This is handleAuthenticate from games");
    if (!idToken) {
      await signIn("google");
    }
    let finalUser = {};
    try {
      const user = await oktoClient.loginUsingOAuth(
        {
          idToken: idToken,
          provider: "google",
        },
        async (session) => {
          if (!localStorage.getItem("okto_session_info")) {
            await fetch("/api/update-oktoObject", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ oktoObject: session }),
            });
          }

          localStorage.setItem("okto_session_info", JSON.stringify(session));
        }
      );
      console.log("authenticated", user);
      finalUser = user;
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    }
    return JSON.stringify(finalUser);
  }

  useEffect(() => {
    if (idToken) {
      handleAuthenticate();
    }
  }, [idToken]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-screen min-h-screen overflow-y-auto">
      <div
        className="relative min-h-screen w-screen bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-20">
          <Header />
        </div>
        <div className="flex flex-col justify-center items-center text-center pt-6 md:pt-24 pb-16 relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-chakra text-white font-bold tracking-wide mb-4">
            {loading ? (
              <div className="h-10 w-[300px] bg-gray-800 rounded-md animate-pulse mx-auto"></div>
            ) : (
              "SELECT YOUR GAME"
            )}
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white font-sora mb-8">
            {loading ? (
              <span className="h-6 w-[250px] bg-gray-800 rounded-md animate-pulse inline-block"></span>
            ) : (
              "Let’s get started with one game"
            )}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-7xl px-4">
            {[
              "/CS1.svg",
              "/valorant.svg",
              "/standoff.svg",
              "/fortnite.svg",
            ].map((src, index) => (
              <div
                key={index}
                className="relative w-full aspect-[353/475] rounded-lg overflow-hidden flex flex-col items-center mx-auto group"
              >
                {loading ? (
                  <div className="w-full h-full bg-gray-800 animate-pulse rounded-lg"></div>
                ) : (
                  <>
                    <div
                      className={`relative w-full h-full ${
                        index !== 0 ? "filter blur-sm" : ""
                      }`}
                    >
                      <Image
                        src={src}
                        alt={`Game ${index + 1}`}
                        width={353}
                        height={475}
                        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <Link
                      href="/sharescreen"
                      className="absolute bottom-0 w-full h-[20%] flex items-center justify-center"
                    >
                      <button
                        className={`w-[90%] text-center text-[#070604] text-sm md:text-base font-semibold py-2.5 uppercase ${
                          index === 0
                            ? "bg-[#ee5d4b] hover:bg-[#ec4632]"
                            : "bg-gray-500 opacity-70 cursor-not-allowed"
                        } transition-all duration-300 rounded-md`}
                      >
                        {index === 0 ? "SHARE SCREEN" : "Coming Soon"}
                      </button>
                    </Link>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* <div className="mt-12 md:mt-16">
            <Link
              href="/buy"
              className="flex bg-gradient-to-r from-[#ee5d4b] to-[#ec4632] px-5 py-2 md:px-8 md:py-4 border-2 border-black items-center gap-4 md:gap-6 text-base md:text-lg font-chakra font-bold hover:opacity-90 rounded-lg transition-opacity"
            >
              <Image
                src="/bl.svg"
                alt="Left Icon"
                width={24}
                height={24}
                className="w-6 h-6 md:w-7 md:h-7"
              />
              BUY CREDITS
              <Image
                src="/br.svg"
                alt="Right Icon"
                width={24}
                height={24}
                className="w-6 h-6 md:w-7 md:h-7"
              />
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default GameSelection;
