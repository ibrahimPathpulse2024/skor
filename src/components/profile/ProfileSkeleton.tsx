"use client";
import Header from "../header";

export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-[#1a1512] text-white flex flex-col">
      <Header />
      <main className="flex-1 flex justify-center items-start p-4 md:p-6 lg:p-8">
        <div className="w-full max-w-5xl border border-[#2a2520] p-8 md:p-16 lg:mt-10 md:mt-10 animate-pulse">
          {/* Header Skeleton */}
          <div className="mb-7">
            <div className="h-12 bg-[#2a2520] rounded w-1/3 mb-4" />
          </div>

          {/* Profile Image Skeleton */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-[#2a2520]" />
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-[#2a2520] rounded w-1/4" />
              <div className="h-8 bg-[#2a2520] rounded w-1/2" />
              <div className="h-3 bg-[#2a2520] rounded w-3/4" />
            </div>
          </div>

          {/* Form Fields Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-[#2a2520] rounded w-1/4" />
                <div className="h-10 bg-[#2a2520] rounded" />
              </div>
            ))}
          </div>

          {/* Button Skeleton */}
          <div className="mt-8 h-10 bg-[#2a2520] rounded-lg w-1/4" />
        </div>
      </main>
    </div>
  );
}
