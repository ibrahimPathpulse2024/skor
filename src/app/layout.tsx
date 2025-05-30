"use client";

import { OktoProvider } from "@okto_web3/react-sdk";
import { SessionProvider } from "next-auth/react";
import { Chakra_Petch, Sora } from "next/font/google";
import React, { createContext, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const defaultConfig = {
  environment: "sandbox",
  clientPrivateKey: "",
  clientSWA: "",
};

interface Config {
  environment: string;
  clientPrivateKey: string;
  clientSWA: string;
}

interface ConfigContextType {
  config: Config;
  setConfig: React.Dispatch<React.SetStateAction<Config>>;
}

const ConfigContext = createContext<ConfigContextType>({
  config: defaultConfig,
  setConfig: () => { },
});

const STORAGE_KEY = "okto_config";

const chakraPetch = Chakra_Petch({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-chakra",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
});

const metadata = {
  title: "Skor",
  description: "Skor",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["skor", "Ai Agent"],
  themeColor: [{ media: "(prefer-color-scheme: dark)", color: "#0000" }],
};

export default function RootLayout({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      // Check if we're in the browser environment
      if (typeof window !== "undefined") {
        const savedConfig = localStorage.getItem(STORAGE_KEY);
        if (savedConfig) {
          const parsed = JSON.parse(savedConfig);
          return {
            environment: parsed.environment || defaultConfig.environment,
            clientPrivateKey:
              parsed.clientPrivateKey || defaultConfig.clientPrivateKey,
            clientSWA: parsed.clientSWA || defaultConfig.clientSWA,
          };
        }
      }
    } catch (error) {
      console.error("Error loading config from localStorage:", error);
    }
    return {
      environment:
        process.env.NEXT_PUBLIC_ENVIRONMENT || defaultConfig.environment,
      clientPrivateKey:
        process.env.NEXT_PUBLIC_OKTO_CLIENT_PRIVATE_KEY ||
        defaultConfig.clientPrivateKey,
      clientSWA:
        process.env.NEXT_PUBLIC_OKTO_CLIENT_SWA || defaultConfig.clientSWA,
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (error) {
      console.error("Error saving config to localStorage:", error);
    }
  }, [config]);

  return (
    <SessionProvider>
      <ConfigContext.Provider value={{ config, setConfig }}>
        <OktoProvider config={config}>
          <html lang="en">
            <head>
              <link rel="manifest" href="/manifest.json" />
              <link
                href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
                rel="stylesheet"
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-P6Z2CMZJ');
            `,
                }}
              />
              <script async src="https://www.googletagmanager.com/gtag/js?id=G-00EJ1M09K1"></script>
              <script
                dangerouslySetInnerHTML={{
                  __html: `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-00EJ1M09K1');
    `,
                }}
              />
            </head>
            <body className={`${chakraPetch.variable} ${sora.variable}`}>
              <noscript>
                <iframe
                  src="https://www.googletagmanager.com/ns.html?id=GTM-P6Z2CMZJ"
                  height="0"
                  width="0"
                  style={{ display: 'none', visibility: 'hidden' }}
                />
              </noscript>
              <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={true}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
              />
              {children}
            </body>
          </html>
        </OktoProvider>
      </ConfigContext.Provider>
    </SessionProvider>
  );
}
