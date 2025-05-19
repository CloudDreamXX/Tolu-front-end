import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "shared/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-[#D9D9D9]">
      <SliderPrimitive.Range className="absolute h-2 rounded-full bg-[#1C63DB]" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block focus-visible:outline-none h-6 w-6 rounded-full border-2 border-[#1C63DB] bg-white shadow" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
