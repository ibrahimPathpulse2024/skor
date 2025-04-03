"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const MobileRestriction = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileDevices =
      /android|webos|iphone|ipad|ipod|blackberry|windows phone/;
    setIsMobile(mobileDevices.test(userAgent));
  }, []);

  const handleClose = () => {
    router.back();
  };

  if (isMobile) {
    return (
      <div className="fixed inset-0 bg-[#1e1a18] z-50 flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center text-white max-w-md">
          <h1 className="text-3xl font-bold font-chakra mb-4">
            Desktop Experience Required
          </h1>

          <p className="font-sora text-gray-300 mb-6">
            For the best experience, please access this page from a desktop
            computer.
          </p>

          <div className="animate-pulse text-[#ee5d4b]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileRestriction;
