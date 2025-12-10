import Image from "next/image";
import React from "react";
import dynamic from "next/dynamic";
import  empty from "../../../public/lottie-animations/empty-card.json";

const LottieAnimation = dynamic(() => import("@/components/animation/LottieAnimation"), { ssr: false });

const NothingFound = ({ text }: { text?: string }) => {
  return (
    <div className=" max-w-sm rounded-3xl mx-auto p-3 flex items-center justify-center min-h-[200px]">
      <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-72 h-72">

        <LottieAnimation animationData={empty} style={{ height: 300, objectFit: "cover" }} />
          </div>

        <p className="text-muted-foreground text-center text-lg font-medium">
          {text}
        </p>
      </div>
    </div>
  );
};

export default NothingFound;
