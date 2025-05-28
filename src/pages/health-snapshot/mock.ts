import { ClientCardProps } from "shared/ui";

type SmallCard = ClientCardProps & {
  id: number;
};

export const smallCards: SmallCard[] = [
  {
    id: 0,
    title: "Sleep quality",
    indicator: "+45 min",
    trend: "up",
  },
  {
    id: 1,
    title: "HRV",
    indicator: "5%",
    trend: "down",
  },
  {
    id: 2,
    title: "Cravings",
    indicator: "2 days",
    trend: "up",
    increased: true,
  },
  {
    id: 3,
    title: "Fatigue",
    indicator: "improved",
    trend: "down",
  },
];

export const timelines = [
  {
    title: "Vitamin D result updated",
    date: "May 4, 4:02 am",
    description: "You added a new lab value: 38 ng/mL ",
    icon: "arrowClockwise",
  },
  {
    title: "Trend detected",
    date: "May 4, 4:02 am",
    description: "Glucose levels increased by 10% since last test",
    icon: "trendUp",
  },
  {
    title: "New status alert",
    date: "May 4, 4:02 am",
    description: "hsCRP marked as “Borderline” based on recent input ",
    icon: "warningCircle",
  },
  {
    title: "Lab report uploaded",
    date: "May 4, 4:02 am",
    description: "File: Annual-Checkup-2025.pdf",
    icon: "uploadSimple",
  },
  {
    title: "Manual entry added",
    date: "May 4, 4:02 am",
    description: "You manually entered Estradiol level: 72 pg/mL",
    icon: "pencilSimple",
  },
  {
    title: "Test results synced",
    date: "May 4, 4:02 am",
    description: "Test results synced ",
    icon: "arrowCounterClockwise",
  },
] as const;
