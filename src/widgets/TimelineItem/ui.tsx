import { Upload } from "lucide-react";

interface TimelineItemProps {
    title: string;
    date: string;
    description: string;
    variant?: "success" | "warning" | "info";
    icon?: React.ReactNode;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
    title,
    date,
    description,
    variant,
    icon = <Upload className="text-[#1C63DB] w-6 h-6" />,
}) => {
  return (
    <div className="flex flex-col gap-6 items-start self-stretch">
      <div className="flex gap-4 items-center self-stretch">
        <div
          className="w-14 h-14 p-1 flex items-center justify-center rounded-[8px] bg-white"
          style={{ border: "1px solid rgba(28, 99, 219, 0.20)" }}
        >
          <button
            className="flex w-12 h-12 p-2 items-center justify-center shrink-0 rounded-[6px]"
            style={{ background: "rgba(28, 99, 219, 0.10)" }}
          >
            {icon}
          </button>
        </div>
        <div className="flex flex-col gap-1 items-start w-full">
          <div className="flex justify-between items-center self-stretch w-full">
            <h3 className="text-[#1D1D1F] font-[Nunito] text-[16px]/[22px] font-semibold">
              {title}
            </h3>
            <p className="font-[Nunito] text-[#5F5F65] text-[12px]/[18px] font-normal">
              {date}
            </p>
          </div>
          <p className="text-[14px]/[20px] font-normal text-[#1D1D1F] font-[Nunito]">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
