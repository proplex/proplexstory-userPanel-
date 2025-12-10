import React from "react";
import clsx from "clsx";

export default function Banner({
  icon,
  bgColor,
  title,
  textColor,
  description,
}: {
  icon: React.ReactNode;
  bgColor?: string;
  title?: string;
  description?: string;
  textColor?: string;
}) {
  return (
    <div
      className={clsx(
        "p-4 rounded-2xl w-[360px] flex items-start gap-3"
      )}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full">
        {icon}
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-[15px] font-semibold leading-5">{title}</div>
        <div className="text-sm leading-5">{description}</div>
      </div>
    </div>
  );
}
