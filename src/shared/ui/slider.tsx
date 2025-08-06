import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "shared/lib/utils";

interface CustomSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  colors?: string[];
  value?: number[];
  withSeparator?: boolean;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  CustomSliderProps
>(({ className, colors, value = [0], ...props }, ref) => {
  const { min = 0, max = 100 } = props;
  const isCustomColored = Array.isArray(colors);
  const segmentsCount = colors?.length ?? 1;
  const range = max - min + 1;
  const segmentSize = range / segmentsCount;

  return (
    <SliderPrimitive.Root
      ref={ref}
      value={value}
      className={cn(
        "relative flex w-full h-4 touch-none select-none items-center",
        className
      )}
      {...props}
    >
      {isCustomColored ? (
        <SliderPrimitive.Track className="relative h-4 w-full rounded-[4px] bg-transparent flex overflow-hidden gap-[2px]">
          {colors.map((color, index) => {
            const filledSegments = Math.floor(value[0] / segmentSize);
            const isLastSegment = index === value.length - 1;

            return (
              <div
                key={color}
                className={`h-full bg-[#ECEFF4] transition-colors duration-200 ${isLastSegment ? "rounded-r-[4px]" : ""}`}
                style={{
                  width: `${100 / segmentsCount}%`,
                  backgroundColor: index < filledSegments ? color : "#ECEFF4",
                }}
              >
                <div
                  className="h-full"
                  style={{
                    backgroundColor:
                      index <= filledSegments ? color : "#ECEFF4",
                  }}
                />
              </div>
            );
          })}
        </SliderPrimitive.Track>
      ) : (
        <SliderPrimitive.Track className="relative h-4 w-full rounded-full bg-[#D9D9D9] overflow-hidden">
          <SliderPrimitive.Range className="absolute h-4 bg-[#1C63DB]" />
        </SliderPrimitive.Track>
      )}

      <SliderPrimitive.Thumb className="absolute h-6 w-6 rounded-full border-2 border-[#1C63DB] bg-white shadow transform top-1/2 -translate-y-1/2" />
    </SliderPrimitive.Root>
  );
});

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
