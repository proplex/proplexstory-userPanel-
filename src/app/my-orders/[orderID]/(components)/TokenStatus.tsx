import { getStatusClasses } from "@/constants/helper";
import { CheckCircle2, CircleAlert, CircleX } from "lucide-react";
import React from "react";



const TokenStatus = ({ status }: any) => {
  const statusConfig = getStatusClasses(status);

  function formatString(str: any) {
    if (typeof str !== "string") return "";
    let cleaned = str.replace(/-/g, " ");
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  const statusText =
    statusConfig.text ||
    (status
      ? formatString(status)
      : "Pending"
    );

  let IconComp = CircleAlert;
  let iconColor = "text-yellow-600";
  if (status === "success" || status === "Booked" || status === "fully-paid") {
    IconComp = CheckCircle2;
    iconColor = "text-green-600";
  } else if (status === "failed" || status === "Cancelled") {
    IconComp = CircleX;
    iconColor = "text-red-600";
  }

  let message = "Your investment is pending, be patient...";
  if (status === "success" || status === "Booked" || status === "fully-paid") {
    message = "Your investment is completed, happy investing...";
  } else if (status === "failed" || status === "Cancelled") {
    message = "Your investment has failed, please retry...";
  }

  // Shape
  const rounded = statusConfig.rounded || "rounded-lg";
  const textClass = statusConfig.textClass || "text-gray-800";
  const bgClass = statusConfig.bgClass || "bg-gray-100";

  return (
    <div className={`w-full border ${rounded} py-5 flex flex-col items-center gap-2 rounded-md`}>
      <div className={`${bgClass} p-4 ${rounded}`}>
        <IconComp size={40} className={iconColor} />
      </div>
      <h1 className={`font-semibold text-2xl ${textClass}`}>
        {statusText || "Status"}
      </h1>
      <p className="text-sm text-muted-foreground tracking-wide text-center">
        {message}
      </p>
    </div>
  );
};

export default TokenStatus;
