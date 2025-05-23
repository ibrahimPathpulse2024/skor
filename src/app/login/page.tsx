"use client";

import { useOkto } from "@okto_web3/react-sdk";
import Cookies from "js-cookie";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header";

interface ExtendedSessionUser {
  name?: string;
  email?: string;
  image?: string;
  oktoObject?: any;
}

const Login = () => {
  const { data: session } = useSession() as {
    data: { user?: ExtendedSessionUser };
  };
  const [loading, setLoading] = useState(true);
  const oktoClient = useOkto();
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  //@ts-ignore
  const idToken = useMemo(() => (session ? session.id_token : null), [session]);

  async function handleAuthenticate() {
    if (!idToken) {
      await signIn("google");
    }
    setIsAuthenticating(true);
    try {
      await oktoClient.loginUsingOAuth(
        {
          idToken: idToken,
          provider: "google",
        },
        async (session) => {
          localStorage.setItem("okto_session_info", JSON.stringify(session));
          await fetch("/api/update-oktoObject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oktoObject: session }),
          });
        }
      );
      router.push("/games");
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }

  const handleLogout = async () => {
    Cookies.remove("next-auth.session-token");
    Cookies.remove("accessToken");
    oktoClient.sessionClear();
    await signOut();
  };

  useEffect(() => {
    if (idToken) {
      handleAuthenticate();
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-full h-screen overflow-hidden relative flex flex-col">
      {/* Background */}
      <div
        className="absolute inset-0 bg-no-repeat bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/bg.svg')" }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Header */}
      <Header />
      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl text-center text-white">
          {loading ? (
            <div className="space-y-6 md:space-y-8 animate-pulse">
              <div className="h-16 bg-gray-800/50 rounded-lg mx-auto max-w-[80%]" />
              <div className="h-5 bg-gray-800/50 rounded-lg mx-auto max-w-[60%]" />
              <div className="flex flex-col space-y-4 items-center mt-8">
                <div className="h-12 bg-gray-800/50 rounded-lg w-48" />
                <div className="h-12 bg-gray-800/50 rounded-lg w-48" />
              </div>
            </div>
          ) : session ? (
            <div className="space-y-6 md:space-y-8">
              <h1 className="text-3xl md:text-4xl font-bold">
                Welcome, {session.user?.name}!
              </h1>
              <p className="text-lg md:text-xl text-gray-300">
                You are signed in with Google
              </p>

              <div className="flex flex-col gap-4 max-w-xs mx-auto">
                <Link href="/games">
                  <button
                    id="continue-button"
                    className="w-full py-3 bg-[#201a18] border border-[#ee5d4b] rounded-lg
                    hover:bg-[#ee5d4b]/10 transition-all duration-300"
                    onClick={handleAuthenticate}
                    disabled={isAuthenticating}
                  >
                    <span className="font-medium text-sm md:text-base">
                      {isAuthenticating ? "Processing..." : "Continue"}
                    </span>
                  </button>
                </Link>

                <button
                  id="logout-button"
                  onClick={handleLogout}
                  className="w-full py-3 bg-[#ee5d4b] rounded-lg
                  hover:bg-[#ee5d4b]/90 transition-all duration-300"
                >
                  <span className="font-medium text-sm md:text-base">
                    Logout
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-8" id="login-button">
              {/* Text Content */}
              <div className="space-y-4 -mt-8 md:mt-0">
                <h1 className="text-3xl md:text-7xl font-bold font-chakra tracking-tight px-4 leading-tight">
                  SIGN UP FOR
                  <br className="hidden md:block" />
                  <span className="md:hidden"> </span>EARLY ACCESS
                </h1>
                <p className="text-sm md:text-2xl font-sora text-gray-300 px-4">
                  World&apos;s First Real Time AI Coach
                  <br />
                  Play Smarter, Not Harder
                </p>
              </div>

              {/* Button Container */}
              <div className="w-full max-w-[400px] md:max-w-[600px] mx-auto px-4 mt-8">
                <button
                  id="google-login-button"
                  onClick={handleAuthenticate}
                  disabled={isAuthenticating}
                  className="w-full flex py-2.5 px-6 md:py-3 md:px-8 bg-[#201a18] border-t border-b border-[#ee5d4b] items-center gap-3 justify-center"
                >
                  <Image
                    src="/Search.svg"
                    alt="Google Icon"
                    width={24}
                    height={24}
                    className="w-5 h-5 md:w-6 md:h-6"
                  />
                  <span className="font-medium text-sm md:text-base">
                    {isAuthenticating
                      ? "Processing..."
                      : "Continue with Google"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </section>
  );
};

export default Login;
