import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "shared/lib/utils";

interface CustomSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  colors?: string[]; 
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  CustomSliderProps
>(({ className, colors, ...props }, ref) => {
  const isCustomColored = Array.isArray(colors) && colors.length === 6;

  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn("relative flex w-full touch-none select-none items-center", className)}
      {...props}
    >
      {isCustomColored ? (
        <SliderPrimitive.Track className="relative h-3 w-full rounded-[4px] bg-transparent flex overflow-hidden gap-[2px]">
          {colors!.map((color, index) => (
            <div key={index} className="w-1/6 h-full" style={{ backgroundColor: color }} />
          ))}
        </SliderPrimitive.Track>
      ) : (
        <SliderPrimitive.Track className="relative h-2 w-full rounded-full bg-[#D9D9D9]">
          <SliderPrimitive.Range className="absolute h-2 rounded-full bg-[#1C63DB]" />
        </SliderPrimitive.Track>
      )}

      <SliderPrimitive.Thumb className="block focus-visible:outline-none h-6 w-6 rounded-full border-2 border-[#1C63DB] bg-white shadow" />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
