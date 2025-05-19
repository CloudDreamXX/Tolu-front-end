import InfoIcon from "shared/assets/icons/info-icon";
import { Slider } from "./slider";

interface SliderCardProps {
    title: string;
}

export const SliderCard: React.FC<SliderCardProps> = ({
    title,
}) => {
  return (
    <div className="rounded-2xl bg-[#F3F7FD] p-6 gap-6 flex flex-col items-start flex-1">
        <div className="flex gap-1 items-center self-stretch">
            <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">{title}</h3>
            <InfoIcon />
        </div>
        <div className="flex gap-2 items-start self-stretch">
            <h3 className="font-[Nunito] text-[#1D1D1F] text-[14px]/[20px] font-medium">Moderate:</h3>
            <div className="flex gap-1 items-center">
                <div className="w-[6px] h-[6px] shrink-0 rounded-full bg-[#062]"></div>
                <p className="text-[#062] font-[Nunito] text-[14px]/[20px] font-semibold">Mild</p>
            </div>
        </div>
        <Slider step={20} className="h-4"/>
    </div>
  );
};
