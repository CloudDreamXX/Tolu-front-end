import { statusColors } from "./mock";

export const getStatusColorClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    Optimal: "text-[#19995D]",
    Borderline: "text-[#E8A530]",
    "Needs Attention": "text-[#DB1C1C]",
  };

  return statusMap[status] || "text-[#1D1D1F]";
};

export const getColorStatus = (status: string): string => {
  if (status === "Optimal") {
    return statusColors[0];
  }
  if (status === "Borderline") {
    return statusColors[1];
  }
  return statusColors[2];
}