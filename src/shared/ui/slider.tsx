import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "shared/lib/utils";

interface CustomSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  colors?: string[];
  value?: number[];
  activeIndex?: number;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  CustomSliderProps
>(({ className, colors, value = [0], activeIndex, ...props }, ref) => {
  const isCustomColored = Array.isArray(colors);
  const active = activeIndex ?? Math.max(value[0] - 1, 0);

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      {isCustomColored ? (
        <SliderPrimitive.Track className="relative h-3 w-full rounded-[4px] bg-transparent flex overflow-hidden gap-[2px]">
          {colors.map((color, index) => {
            const filledSegments = Math.floor(value[0]);
            const decimalPart = value[0] - filledSegments;
            const segmentWidth = decimalPart * 100;

            return (
              <div
                key={index}
                className="w-1/6 h-full transition-colors duration-200"
                style={{
                  backgroundColor: index < active ? color : "#ECEFF4",
                }}
              >
                <div
                  className=" w-full h-full"
                  style={{
                    backgroundColor:
                      index <= filledSegments ? color : "#ECEFF4",
                    width:
                      index === filledSegments ? `${segmentWidth}%` : "auto",
                  }}
                />
              </div>
            );
          })}
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
