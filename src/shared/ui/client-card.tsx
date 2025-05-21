import InfoIcon from "shared/assets/icons/info-icon";
import TrendUp from "shared/assets/icons/trend-up";
import TrendDown from "shared/assets/icons/trend-down";

export interface ClientCardProps {
  title: string;
  indicator: string;
  trend: "up" | "down";
  increased?: boolean;
  width?: string;
  height?: string;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  title,
  indicator,
  trend,
  increased = false,
  width,
  height,
}) => {
  return (
    <div
      className="flex flex-col p-4 justify-between items-start flex-1 rounded-2xl bg-[#F3F7FD]"
      style={{
        width: width ?? "238px",
        height: height ?? "160px",
      }}
    >
      <div className="flex items-center gap-1 self-stretch">
        <h3 className="font-[Nunito] text-[18px]/[24px] font-semibold text-[#1D1D1F]">{title}</h3>
        <InfoIcon />
      </div>
      <div className="flex items-center gap-3">
        <h2 className="text-[32px]/[44px] font-bold font-[Nunito] text-nowrap text-[#1C63DB]">
          {indicator}
        </h2>
        <div
          className={
            trend === "up"
              ? "flex p-1 items-center gap-1 justify-center rounded-2xl border border-[#BCE2C8] bg-[#F0FFF5]"
              : "flex p-1 items-center gap-1 justify-center rounded-2xl border border-[#FFB3AE] bg-[#FFF6F5]"
          }
        >
          {trend === "up" ? <TrendUp /> : <TrendDown />}
        </div>
      </div>
    </div>
  );
};

