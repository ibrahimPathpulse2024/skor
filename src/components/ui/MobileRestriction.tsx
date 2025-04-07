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
      <div
        className="fixed inset-0 bg-[#1e1a18] z-50 flex items-center justify-center p-4"
        style={{
          backgroundImage: "url('/desktopOnly.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
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
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileRestriction;
