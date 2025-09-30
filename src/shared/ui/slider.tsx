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
  const percentage = ((value[0] - min) / (max - min)) * 100;

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
      {colors ? (
        <SliderPrimitive.Track className="relative h-4 w-full rounded-[4px] bg-[#ECEFF4] overflow-hidden">
          <div
            className="absolute h-full left-0 top-0"
            style={{
              width: `${percentage}%`,
              background: `linear-gradient(to right, ${colors.join(",")})`,
            }}
          />
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
