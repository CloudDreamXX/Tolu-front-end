import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "shared/lib/utils";

const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

type PopoverContentOwnProps = {
  container?: HTMLElement | null;
  arrow?: boolean;
};

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> &
    PopoverContentOwnProps
>(
  (
    {
      className,
      align = "center",
      side = "top",
      sideOffset = 4,
      arrow = true,
      children,
      container,
      ...props
    },
    ref
  ) => (
    <PopoverPrimitive.Portal container={container}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "z-[1000] border border-[#1C63DB] bg-white text-[#1D1D1F] rounded-[8px] shadow-lg p-[20px] text-sm w-[329px] leading-[1.5] relative overflow-visible",
          "data-[state=closed]:animate-fadeOut data-[state=open]:animate-fadeIn",
          side === "top" && "data-[side=top]:slide-in-from-bottom-2",
          className
        )}
        {...props}
      >
        {children}
        {arrow && (
          <PopoverPrimitive.Arrow
            className="fill-white stroke-[#1C63DB]"
            width={16}
            height={8}
          />
        )}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
);

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };
