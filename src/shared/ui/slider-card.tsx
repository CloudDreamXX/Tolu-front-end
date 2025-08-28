import { useState } from "react";

import { Slider } from "./slider";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

interface SliderCardProps {
  title: string;
  colors: string[];
}

export const SliderCard: React.FC<SliderCardProps> = ({ title, colors }) => {
  const [value, setValue] = useState(0);
  const max = 6;

  return (
    <div className="rounded-2xl bg-[#F3F7FD] p-6 gap-6 flex flex-col items-start flex-1 w-full">
      <div className="flex items-center self-stretch justify-between gap-1 xl:justify-start">
        <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">
          {title}
        </h3>
        <span className="w-[20px] h-[20px]">
          <MaterialIcon iconName="help" size={20} />
        </span>
      </div>

      <div className="flex items-start self-stretch gap-2">
        <h3 className="font-[Nunito] text-[#1D1D1F] text-[14px]/[20px] font-medium">
          Moderate:
        </h3>
        <div className="flex items-center gap-1">
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
        className="h-4"
      />
    </div>
  );
};
