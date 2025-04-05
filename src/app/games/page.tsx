"use client";
import { useOkto } from "@okto_web3/react-sdk";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Header from "../../components/header";
import { useHandleLogout } from "../../utils/auth";
import "./games.scss";

const GAME_IMAGES = [
  "/CS1.svg",
  "/valorant.svg",
  "/standoff.svg",
  "/fortnite.svg",
];

const GameSelection = () => {
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const oktoClient = useOkto();
  const handleLogout = useHandleLogout();
  const [neverShowPopup, setNeverShowPopup] = useState(false);
  const [showPopup, setShowPopup] = useState(() => {
    return typeof window !== "undefined"
      ? !localStorage.getItem("hidePopup")
      : false;
  });
  const { data: session, status } = useSession();
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  const idToken = useMemo(
    () => (session?.id_token as string) ?? null,
    [session]
  );

  useEffect(() => {
    const popupPreference = localStorage.getItem("hidePopup");
    if (!popupPreference) {
      setShowPopup(true);
    }
    const loadImages = async () => {
      try {
        await Promise.all(
          GAME_IMAGES.map(
            (src) =>
              new Promise((resolve, reject) => {
                const img = document.createElement("img");
                img.src = src;
                img.onload = () => resolve(src);
                img.onerror = (err) => reject(err);
              })
          )
        );
        setImagesLoaded(true);
      } catch (error) {
        console.error("Image loading failed:", error);
        setAuthError("Failed to load game assets");
      }
    };

    loadImages();

    const userAgent = navigator.userAgent.toLowerCase();
    const mobileDevices =
      /android|webos|iphone|ipad|ipod|blackberry|windows phone/;
    setIsMobile(mobileDevices.test(userAgent));
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleNeverShowPopup = () => {
    localStorage.setItem("hidePopup", "true");
    setShowPopup(false);
    setNeverShowPopup(true);
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  async function handleAuthenticate() {
    try {
      if (!idToken) {
        const result = await signIn("google");
        if (result?.error) throw new Error(result.error);
        return;
      }

      const user = await oktoClient.loginUsingOAuth(
        {
          idToken,
          provider: "google",
        },
        async (session) => {
          if (!localStorage.getItem("okto_session_info")) {
            const response = await fetch("/api/update-oktoObject", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ oktoObject: session }),
            });

            if (!response.ok) {
              throw new Error("Failed to update session");
            }
          }
          localStorage.setItem("okto_session_info", JSON.stringify(session));
        }
      );

      console.log("Authenticated successfully", user);
      return user;
    } catch (error) {
      // handleLogout();
      // toast.error("Okto Authentication failed");
      setAuthError(
        error instanceof Error
          ? error.message
          : "Authentication failed. Please try again."
      );
      throw error;
    }
  }

  useEffect(() => {
    const checkReady = async () => {
      try {
        if (imagesLoaded && status !== "loading") {
          if (status === "unauthenticated") {
            await handleAuthenticate();
          }

          if (idToken) {
            await handleAuthenticate();
          }

          setLoading(false);
          setAuthError(null);
        }
      } catch (error) {
        setLoading(false);
      }
    };

    checkReady();
  }, [imagesLoaded, status, idToken]);

  return (
    <section className="max-w-screen min-h-screen overflow-x-hidden">
      <div
        className="relative min-h-screen max-w-screen bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative z-20">
          <Header />
        </div>

        {!isMobile && (
          <div>
            <button
              className="md:fixed md:top-20 top-24 right-4 bg-[#ee5d4b] text-black px-4 py-2 rounded-lg shadow-lg z-50 hover:bg-[#EE5D4B] transition-transform md:scale-100 scale-90"
              onClick={togglePopup}
            >
              Instructions
            </button>
            <div>
              {showPopup && (
                <div className=" md:flex fixed inset-0 items-center justify-center backdrop-blur-lg bg-black/30 z-50">
                  <div className="fixed flex flex-col top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-lg rounded-lg w-[600px] h-[400px] z-50">
                    <div className="flex flex-row">
                      <div className="w-1/2 bg-[#EE5D4B] rounded-l-lg">
                        <Image
                          src="/mascot.svg"
                          alt="mascot Image"
                          width={250}
                          height={150}
                          className=""
                        />
                      </div>
                      <div className="w-1/2 pt-6 p-4 bg-[#141110] rounded-r-lg">
                        <ul className="flex flex-col text-white list-inside font-sora space-y-4 text-base mb-6">
                          <h2 className="text-2xl text-center text-[#EE5D4B] font-chakra font-bold mb-2">
                            Instructions
                          </h2>
                          <li className="inline-flex items-center gap-4">
                            <span className="material-symbols-outlined filled bg-[#ee5d4b] rounded-lg p-1">
                              {"play_arrow"}
                            </span>
                            Press the &quot;Play&quot; button
                          </li>
                          <li className="inline-flex items-center gap-4">
                            <span className="material-symbols-outlined filled bg-[#ee5d4b] rounded-lg p-1">
                              {"mic"}
                            </span>
                            Allow Microphone permission
                          </li>
                          <li className="inline-flex items-center gap-4">
                            <span className="material-symbols-outlined bg-[#ee5d4b] rounded-lg p-1">
                              {"present_to_all"}
                            </span>
                            Press the &quot;Screen Share&quot; button and -
                            Share &quot;Entire Screen&quot;
                          </li>
                          <li className="ml-12">
                            Start CS2, and begin asking it questions
                          </li>
                        </ul>

                        <div className="flex justify-between">
                          <button
                            onClick={closePopup}
                            className="flex bg-[#282828] px-2.5 py-1 items-center text-lg font-chakra font-bold hover:opacity-90 text-[#ee5d4b] transition-opacity border-b-2 border-b-[#ED523F] border-r-2 border-r-[#ED523F]"
                          >
                            Close
                          </button>
                          <button
                            onClick={handleNeverShowPopup}
                            className="flex bg-[#282828] px-2.5 py-1 items-center text-lg font-chakra font-bold hover:opacity-90 text-[#ee5d4b] transition-opacity border-b-2 border-b-[#ED523F] border-r-2 border-r-[#ED523F]"
                          >
                            Never Show Popup
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
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
            {GAME_IMAGES.map((src, index) => (
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
          {/* 
          <div className="mt-12 md:mt-16">
            <Link
              href="/buy"
              className="inline-flex items-center justify-center gap-3 md:gap-4 px-2 py-2 md:px-2 md:py-2 border-1 border-black rounded-lg font-chakra font-bold text-sm md:text-base bg-gradient-to-r from-[#ee5d4b] to-[#ec4632] hover:opacity-90 transition-opacity"
            >
              <Image
                src="/bl.svg"
                alt="Left Icon"
                width={20}
                height={20}
                className="w-5 h-5 md:w-6 md:h-6 object-contain aspect-square"
              />
              <span className="whitespace-nowrap">BUY CREDITS</span>
              <Image
                src="/br.svg"
                alt="Right Icon"
                width={20}
                height={20}
                className="w-5 h-5 md:w-6 md:h-6 object-contain aspect-square"
              />
            </Link>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default GameSelection;
