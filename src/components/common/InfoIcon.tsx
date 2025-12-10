import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
type InfoIconProps = {
  tooltip: string;
  dialogTitle?: string;
  dialogContent?: React.ReactNode;
  className?: string;
  size? : number
};

export function InfoIcon({ tooltip, dialogTitle, dialogContent, className , size }: InfoIconProps) {
  const hasDialog = !!dialogContent;

  const icon = (
    <TooltipProvider delayDuration={0}>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn("cursor-pointer text-muted-foreground  hover:text-primary", className)}>
            <Info  size={size} />
          </span>
        </TooltipTrigger>
        <TooltipContent side="top"className="bg-black text-white border border-gray-200">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
    );

  if (!hasDialog) return icon;

  return (
    <Dialog>
      <DialogTrigger asChild>{icon}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
