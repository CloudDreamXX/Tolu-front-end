import { Calendar, Clock2, Clock3, Clock4, Pencil } from "lucide-react";
import { Button } from "shared/ui";

export const SYMPTOMS = [
  "Fatigue",
  "Brain fog",
  "Hot flashes",
  "Headache",
  "Joint stiffness",
  "Insomnia",
];

export const MOOD_COLORS = [
  "#173B64",
  "#1F4B8A",
  "#2F65B3",
  "#4085D8",
  "#80D19A",
  "#51C776",
];

export const SLEEP_RANGES = [
  { text: "Less than 4 hours", icon: <Clock2 className="stroke-[1.5]" /> },
  { text: "1–3 hours", icon: <Clock3 className="stroke-[1.5]" /> },
  { text: "3 -6 hours", icon: <Clock4 className="stroke-[1.5]" /> },
  { text: "All day", icon: <Calendar className="stroke-[1.5]" /> },
];

export const SUSPECTED_TRIGGERS = [
  "Skipping breakfast",
  "Intense workout",
  "Skipped meal",
  "Poor sleep",
  "Gluten",
  "Alcohol",
  "Emotional stress",
];

export type FellBackOption = "Easy" | "Medium" | "Hard";

export const FELL_BACK_OPTIONS: FellBackOption[] = ["Easy", "Medium", "Hard"];

export interface SleepState {
  hours: number;
  minutes: number;
  wokeUpTimes: number;
  fellBack: FellBackOption;
}

type MealTime = {
  food_items: string;
  time: string;
};

export interface MealState {
  notes: string;
  breakfast: MealTime;
  lunch: MealTime;
  dinner: MealTime;
}

export const MEAL_EXAMPLES = [
  "Ate within 1 hour of waking",
  "Skipped lunch",
  "Heavy dinner",
  "High sugar intake",
  "Tried new food",
  "Intermittent fasting",
];

export const snapshots = [
  { title: "HRV", active: false },
  {
    title: "Menstrual phase",
    content: "Luteal Phase",
    topRightButton: (
      <Button
        variant="blue2"
        className="flex items-center justify-center w-8 h-8 bg-[#DDEBF6] rounded-full"
      >
        <Pencil className="stroke-[#1C63DB]" width={16} height={16} />
      </Button>
    ),
    tooltipContent:
      "The luteal phase is the second half of the menstrual cycle, occurring after ovulation and before menstruation. It typically lasts about 14 days.",
  },
  {
    title: "Steps",
    content: "6421",
  },
  {
    title: "Resting heart rate",
    content: "58 bpm",
  },
  {
    title: "Body Temp Variance",
    content: "+/- 1.8°C",
  },
];
