"use client";

import { Bolt } from "lucide-react";

export default function UnderConstructionPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      {/* Big Screw Icon */}
      <Bolt className="w-32 h-32 text-gray-300 mb-8" strokeWidth={1.5} />

      {/* Title */}
      <h1 className="text-3xl font-semibold text-gray-700">
        This page is under construction
      </h1>

      {/* Subtext (optional) */}
      <p className="mt-3 text-gray-500 text-center max-w-md">
        We’re working on something exciting here. Please check back soon.
      </p>
    </div>
  );
}
