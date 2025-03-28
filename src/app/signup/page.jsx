"use client";

import { useOkto } from "@okto_web3/react-sdk";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/header";

const LoginPage = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const oktoClient = useOkto();
  const [userSWA, setUserSWA] = useState("not signed in");

  const idToken = useMemo(() => (session ? session.id_token : null), [session]);

  async function handleAuthenticate() {
    if (!idToken) {
      return { result: false, error: "No google login" };
    }
    const user = await oktoClient.loginUsingOAuth(
      {
        idToken: idToken,
        provider: "google",
      },
      async (session) => {

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

    console.log("authenticated", user);
    return JSON.stringify(user);
  }

  useEffect(() => {
    if (idToken) {
      console.log("==-=-=-=-=-=-=-=-=-=-=-=-=-=--=-=-=-=-=-=");
      console.log("idToken", idToken);
      handleAuthenticate();
      console.log("userSWA", userSWA);
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); // Simulate a 3-second loading time
    return () => clearTimeout(timer);
  }, [idToken]);

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
          <div className="flex items-center justify-center mt-16">
            {loading ? (
              // Skeleton Loader
              <div className="flex flex-col items-center w-1/2 bg-[#1e1a18]/30 rounded-lg py-[60px] shadow-lg px-6">
                <div className="w-[300px] h-12 bg-gray-700 rounded-md animate-pulse mb-4"></div>
                <div className="w-[400px] h-6 bg-gray-700 rounded-md animate-pulse mb-6"></div>
                <div className="w-[400px] h-[48px] bg-gray-700 rounded-md animate-pulse mb-6"></div>
                <div className="w-[400px] h-[48px] bg-gray-700 rounded-md animate-pulse mb-6"></div>
                <div className="w-[150px] h-10 bg-gray-700 rounded-md animate-pulse"></div>
              </div>
            ) : (
              // Actual Form
              <div className="flex flex-col items-center w-1/2 bg-[#1e1a18]/30 rounded-lg py-[60px] shadow-lg px-6">
                <h1 className="text-white text-[60px] font-chakra font-bold mb-4">
                  WELCOME BACK
                </h1>
                <p className="text-gray-300 text-[18px] font-sora text-center mb-6">
                  Enter your email and password to access your account.
                </p>
                <div className="relative mb-6">
                  <label
                    htmlFor="email"
                    className="text-gray-400 text-center font-sora text-sm mb-2 block"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    className="w-[400px] p-3 text-white text-center bg-[#999999]/10 shadow-[inset_0px_0.9439490437507629px_0px_0px_rgba(255,255,255,0.10)] border border-[#e0e0e0]/10"
                  />
                </div>
                <Link
                  href="/games"
                  className="flex bg-gradient-to-r from-[#ee5d4b] to-[#ec4632] px-3 py-1.5 border-2 border-black justify-start items-center gap-9 text-black font-sora text-[18px]"
                >
                  Continue
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
