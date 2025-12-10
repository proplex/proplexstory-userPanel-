"use client";
import React from "react";

export default function PropertyHeaderSKeleton() {
  return (
    <div className="flex justify-center items-center gap-10 mt-10 w-full bg-white/40 animate-pulse">
      {/* Left Section */}
      <div className="w-[37%] flex flex-col justify-start">
        {/* Title Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-gray-300 rounded" />{" "}
          <div className="h-5 w-48 bg-gray-300 rounded" />
        </div>

       
        <div className="flex flex-wrap gap-2 mt-3 ml-3">
          <div className="h-6 w-32 bg-gray-300 rounded-full" />
          <div className="h-6 w-28 bg-gray-300 rounded-full" />
          <div className="h-6 w-28 bg-gray-300 rounded-full" />
        </div>
      </div>

      {/* Right Section (Asset Manager card) */}
      <div className="flex justify-between items-center px-3 py-3 bg-white rounded-xl lg:w-[400px] shadow">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-300" /> {/* avatar */}
          <div className="space-y-2">
            <div className="h-4 w-28 bg-gray-300 rounded" /> {/* name */}
            <div className="h-3 w-20 bg-gray-300 rounded" /> {/* role */}
          </div>
        </div>

        {/* Buttons Skeleton */}
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-gray-300 rounded-lg" />
          <div className="h-10 w-10 bg-gray-300 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
