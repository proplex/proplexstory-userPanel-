"use client";
import NothingFound from "@/components/common/NothingFound";
import { Button } from "@/components/ui/button";
import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { IconRight } from "react-day-picker";

const NoOrdersError = () => {
  const router = useRouter();
  return (
    <div className="w-full flex flex-col items-center gap-5">
      <NothingFound text="No Orders Found" />
      <p className="text-center  text-gray-600">
        You have not placed any orders yet. Start exploring and make your first
        investment!
      </p>
      <Button onClick={() => router.push("/")}>
        Go to Home <IconRight />
      </Button>
    </div>
  );
};

export default NoOrdersError;
