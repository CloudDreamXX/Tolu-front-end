import { statusColors } from ".";

export const getColorStatus = (status: string): string => {
  if (status === "Optimal") {
    return statusColors[0];
  }
  if (status === "Borderline") {
    return statusColors[1];
  }
  return statusColors[2];
}