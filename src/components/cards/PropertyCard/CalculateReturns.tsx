import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LucideInfo, Percent, TrendingUp } from "lucide-react";


export const CalculateReturns = ({
  name,
  icon,
  value,
  iconColor,
  color,
  tooltip,
  percent,
}: {
  name: string;
  icon: React.ReactNode;
  value: string;
  iconColor?: boolean;
  color?: string;
  tooltip?: string;
  percent?: boolean;
}) => {
  return (
    <div className="bg-[#F5F5F5] border border-[#EBEFF5] rounded-xl py-2 px-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-gray-600 text-sm font-medium flex items-center gap-1">
          {name}
          {tooltip && (
            <TooltipProvider>
              <Tooltip delayDuration={0}>
              <TooltipTrigger asChild>
                <LucideInfo  className="w-3 h-3  cursor-pointer text-gray-600" />
              </TooltipTrigger>
              <TooltipContent
                side="top"
                className="bg-white shadow-lg rounded-lg"
              >
                <p className="text-sm text-gray-600">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
            </TooltipProvider>
          )}
          {percent && <Percent size={12} />}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-semibold text-[16px]" style={{ color }}>
          {value}
        </span>
        {iconColor && (
          <div className="flex items-center gap-2 bg-green-200 rounded-md p-1">
            <TrendingUp size={16} className="text-green-700" />
          </div>
        )}
      </div>
    </div>
  );
};
