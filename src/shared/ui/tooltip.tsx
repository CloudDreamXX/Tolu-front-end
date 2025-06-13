import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "shared/lib/utils";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 8, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    side="top"
    align="end"
    className={cn(
      "ml-[40px] z-50 border border-[#1C63DB] bg-white text-[#1D1D1F] rounded-[8px] shadow-lg p-[20px] text-sm w-[329px] leading-[1.5] relative overflow-visible", // ensure Arrow is visible
      "data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn",
      "data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  >
    {props.children}

    <TooltipPrimitive.Arrow
      className="fill-white stroke-[#1C63DB] ml-auto mr-[40px]"
      width={16}
      height={8}
    />
  </TooltipPrimitive.Content>
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
