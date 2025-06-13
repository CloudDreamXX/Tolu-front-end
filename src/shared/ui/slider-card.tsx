import { useState } from "react";
import InfoIcon from "shared/assets/icons/info-icon";
import { Slider } from "./slider";

interface SliderCardProps {
  title: string;
  colors: string[];
}

export const SliderCard: React.FC<SliderCardProps> = ({ title, colors }) => {
  const [value, setValue] = useState(0);

  const max = 6;
  const stepCount = colors.length;
  const stepSize = max / stepCount;
  const activeIndex = value === 0 ? -1 : Math.floor(value / stepSize) - 1;

  return (
    <div className="rounded-2xl bg-[#F3F7FD] p-6 gap-6 flex flex-col items-start flex-1">
      <div className="flex gap-1 items-center self-stretch">
        <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
          {title}
        </h3>
        <InfoIcon />
      </div>

      <div className="flex gap-2 items-start self-stretch">
        <h3 className="font-[Nunito] text-[#1D1D1F] text-[14px]/[20px] font-medium">
          Moderate:
        </h3>
        <div className="flex gap-1 items-center">
          <div className="w-[6px] h-[6px] shrink-0 rounded-full bg-[#062]" />
          <p className="text-[#062] font-[Nunito] text-[14px]/[20px] font-semibold">
            Mild
          </p>
        </div>
      </div>

      <Slider
        min={0}
        max={max}
        step={0.01}
        value={[value]}
        onValueChange={([val]) => setValue(val)}
        colors={colors}
        activeIndex={activeIndex}
        className="h-4"
      />
    </div>
  );
};
