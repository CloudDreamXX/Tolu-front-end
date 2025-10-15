import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "shared/lib/utils";

interface CustomSliderProps
  extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  colors?: string[];
  value?: number[];
  withSeparator?: boolean;
  gapColor?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  CustomSliderProps
>(
  (
    {
      className,
      colors,
      value = [0],
      withSeparator = true,
      gapColor = "#ffffff",
      step = 10,
      ...props
    },
    ref
  ) => {
    const { min = 0, max = 100 } = props;
    const percentage = ((value[0] - min) / (max - min)) * 100;

    const steps = [];
    for (let i = min; i <= max; i += step) {
      steps.push(i);
    }

    return (
      <SliderPrimitive.Root
        ref={ref}
        value={value}
        step={step}
        className={cn(
          "relative flex w-full h-4 touch-none select-none items-center",
          className
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-4 w-full rounded-[4px] bg-[#ECEFF4] overflow-hidden">
          <div className="absolute inset-0 bg-[#ECEFF4]" />

          {/* Step divisions (gaps) */}
          {withSeparator &&
            steps.map((s, i) => {
              if (i === 0) return null;
              const left = (s / max) * 100;
              return (
                <div
                  key={s}
                  className="absolute top-0 h-full w-[2px]"
                  style={{
                    left: `calc(${left}% - 1px)`,
                    backgroundColor: gapColor,
                    zIndex: 2,
                  }}
                />
              );
            })}

          {/* Filled range */}
          <div
            className="absolute h-full left-0 top-0 "
            style={{
              width: `${percentage}%`,
              background: colors
                ? `linear-gradient(to right, ${colors.join(",")})`
                : "#1C63DB",
            }}
          />
        </SliderPrimitive.Track>

        <SliderPrimitive.Thumb className="absolute h-6 w-6 rounded-full border-2 border-[#1C63DB] bg-white shadow transform top-1/2 -left-[12px] -translate-y-1/2 z-[999]" />
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
