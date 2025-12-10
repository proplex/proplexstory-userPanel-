"use client";

import LottieAnimation from "@/components/animation/LottieAnimation";
import NOT_FOUND_ANIMATION from "@/assets/404-error.json";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { MoveLeft } from "lucide-react";
import { Suspense } from "react";

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}

function NotFoundContent() {
  const router = useRouter();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-50">
      <LottieAnimation animationData={NOT_FOUND_ANIMATION} style={{ height: 600, objectFit: "contain" }} />
      <Button onClick={() => router.push("/")} className="flex items-center gap-2 relative bottom-10 bg-fprimary text-white">
        <MoveLeft size={24} />
        Back to Home
      </Button>
    </main>
  );
}
