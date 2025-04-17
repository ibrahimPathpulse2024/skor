"use client";

import Header from "../../components/header";

export default function NFTSPage() {
  return (
    <div className="min-h-screen bg-[#1b1410] text-white flex flex-col">
      <Header />
      <div className="flex-grow bg-[#1b1410] text-white">
        <header className="pt-8 pb-10 px-6 md:px-12 lg:px-24 flex flex-col items-center mt-5 md:mt-8 lg:mt-8">
          <h1 className="text-4xl md:text-6xl lg:text-6xl font-chakra font-extrabold tracking-wide text-center text-[#ee5d4b]">
            Genesis Creator
          </h1>
          <h1 className="text-3xl md:text-[2.7rem] lg:text-[2.7rem] font-chakra font-semibold tracking-wide text-center text-[#ee5d4b] mt-1">
            Agent NFTs
          </h1>

          <video
            src="/assets/NFT_Rotation.mp4"
            autoPlay
            loop
            muted
            className="w-full max-w-3xl mt-6 md:mt-10 lg:mt-10 rounded-lg shadow-lg"
            style={{
              display: "block",
              maxWidth: "100%",
              maxHeight: "550px",
              height: "auto",
            }}
          ></video>
          <style jsx>{`
            @media (max-width: 640px) {
              video {
                max-height: 800px; /* Increased height for small devices */
              }
            }
            @media (min-width: 1024px) {
              video {
                max-height: 500px; /* Reduced height for large devices */
              }
            }
          `}</style>

          <h2
            className="text-4xl md:text-6xl lg:text-8xl font-bold font-chakra mt-5 md:mt-8 lg:mt-10 text-[#ee5d4b] text-center"
            style={{
              letterSpacing: "0.15rem",
            }}
          >
            COMING SOON
          </h2>
        </header>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
