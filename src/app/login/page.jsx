"use client";

import { useOkto } from "@okto_web3/react-sdk";
import Cookies from "js-cookie";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header";

const Login = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const oktoClient = useOkto();
  const [userSWA, setUserSWA] = useState("not signed in");

  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const idToken = useMemo(() => (session ? session.id_token : null), [session]);

  async function handleAuthenticate() {
    if (!idToken) {
      return { result: false, error: "No google login" };
    }
    setIsAuthenticating(true);
    try {
      const user = await oktoClient.loginUsingOAuth(
        {
          idToken: idToken,
          provider: "google",
        },
        async (session) => {
          // Store the session info securely

          localStorage.setItem("okto_session_info", JSON.stringify(session));
          setUserSWA(session.userSWA);
          console.log("user userSWA", session.userSWA);

          await fetch("/api/update-swa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userSWA: session.userSWA }),
          });

          await fetch("/api/update-oktoObject", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ oktoObject: session }),
          });

          console.log("session", session);
          console.log(
            "=-=-=-=-=-=-=-=-=-0=-=-=-00=-=0=-0=-=0=-=0=0=0=0=0=-=-=00689832843898su=--====-=-="
          );
        }
      );
    } catch (error) {
      console.error("Authentication error:", error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }

    console.log("authenticated", user);
    return JSON.stringify(user);
  }

  const handleLogout = async () => {
    Cookies.remove("next-auth.session-token");
    Cookies.remove("accessToken");
    oktoClient.sessionClear();
    await signOut();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="w-screen overflow-hidden">
      <div>
        <div
          className="relative h-screen w-screen bg-no-repeat bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.svg')" }}
        >
          {/* Header */}
          <div>
            <Header />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

          {/* Main Content */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white">
            {loading ? (
              <div className="space-y-6">
                <div className="bg-gray-800 h-[70px] w-[600px] mx-auto rounded-lg animate-pulse"></div>
                <div className="bg-gray-800 h-[20px] w-[400px] mx-auto rounded-lg animate-pulse"></div>
                <div className="flex flex-col space-y-4 justify-center items-center mt-8">
                  <div className="bg-gray-800 h-[50px] w-[200px] rounded-lg animate-pulse"></div>
                  <div className="bg-gray-800 h-[50px] w-[200px] rounded-lg animate-pulse"></div>
                </div>
              </div>
            ) : session ? (
              <div>
                <h1 className="text-[40px] font-bold">
                  Welcome, {session.user?.name}!
                </h1>
                <p className="text-[20px]">You are signed in with Google.</p>
                {/* Continue Button */}
                <Link href="/games">
                  <button
                    className="mt-6 py-2.5 px-10 bg-[#201a18] border-t border-b border-[#ee5d4b] items-center gap-4 w-full justify-center"
                    onClick={async () => {
                      try {
                        await handleAuthenticate();
                        router.push("/games");
                      } catch (error) {
                        console.log("Error okto authenticating:", error);
                      }
                    }}
                    disabled={isAuthenticating}
                  >
                    <span className="font-satoshi text-white text-sm capitalize">
                      {isAuthenticating ? "Processing..." : "Continue"}
                    </span>
                  </button>
                </Link>
                {/* Logout Button */}
                <button
                  onClick={() => handleLogout()}
                  className="mt-4 py-2.5 px-10 bg-[#ee5d4b] border-t border-b border-[#201a18]  items-center gap-4 w-full justify-center"
                >
                  <span className="font-satoshi text-white text-sm capitalize">
                    Logout
                  </span>
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-[65px] font-chakra leading-tight font-bold tracking-wider mb-4">
                  SIGN UP FOR <br /> EARLY ACCESS
                </h1>
                <p className="text-[25px] font-sora mb-8">
                  World’s First Real Time AI Coach <br />
                  Play Smarter, Not Harder
                </p>
                <div className="flex flex-col space-y-4 justify-center items-center h-full">
                  <button
                    onClick={() => signIn("google")}
                    className="flex py-2.5 px-10 bg-[#201a18] border-t border-b border-[#ee5d4b] items-center gap-4 w-[600px] justify-center"
                  >
                    <img src="/Search.svg" alt="Google Icon" />
                    <span className="font-satoshi text-white text-sm capitalize">
                      Continue with Google
                    </span>
                  </button>
                  {/* <p className="text-white text-sm font-bold font-satoshi">
                    Or
                  </p>
                  <Link
                    href="/signup"
                    className="flex py-2.5 px-10 bg-[#201a18] border-t border-b border-[#ee5d4b] justify-start items-center gap-4 w-full justify-center"
                  >
                    <img src="/email.svg" alt="Email Icon" />
                    <span className="font-satoshi text-white text-sm capitalize">
                      Continue with email
                    </span>
                  </Link> */}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
