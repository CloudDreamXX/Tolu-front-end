import {
  Clock4,
  Coffee,
  Mic,
  Paperclip,
  Plus,
  Salad,
  Utensils,
} from "lucide-react";
import { useState } from "react";
import { cn } from "shared/lib";
import {
  Button,
  Checkbox,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import { MoodSelector } from "widgets/MoodScore";
import {
  CalendarBlock,
  FELL_BACK_OPTIONS,
  MEAL_EXAMPLES,
  MealState,
  MOOD_COLORS,
  SLEEP_RANGES,
  SleepState,
  Snapshot,
  snapshots,
  SUSPECTED_TRIGGERS,
  SYMPTOMS,
} from ".";

interface DayliJournalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDone: () => void;
}

export const DailyJournal: React.FC<DayliJournalProps> = ({
  isOpen,
  onCancel,
  onDone,
}) => {
  const [moodValue, setMoodValue] = useState(30);
  const [sleep, setSleep] = useState<SleepState>({
    hours: 7,
    minutes: 40,
    wokeUpTimes: 3,
    fellBack: "Easy",
  });

  const [meal, setMeal] = useState<MealState>({
    notes: "",
    breakfast: { food: "", time: "" },
    lunch: { food: "", time: "" },
    dinner: { food: "", time: "" },
  });

  const handleSleepSelectChange = (name: keyof SleepState, value: string) => {
    setSleep((prev) => ({
      ...prev,
      [name]: name === "fellBack" ? value : Number(value),
    }));
  };

  const handleMealChange = (
    mealType: "breakfast" | "lunch" | "dinner",
    field: keyof MealState["breakfast"],
    value: string
  ) => {
    setMeal((prev) => ({
      ...prev,
      [mealType]: {
        ...prev[mealType],
        [field]: value,
      },
    }));
  };

  const isButtonDisabled = !(
    sleep.hours &&
    sleep.minutes &&
    sleep.wokeUpTimes &&
    sleep.fellBack
  );

  if (!isOpen) return null;

  return (
    <div className="md:fixed md:top-0 bottom-0 right-0 lg:top-6 lg:bottom-6 lg:right-6 overflow-hidden left-auto  inset-0 z-10 flex max-w-[766px] w-full flex-col border lg:rounded-2xl shadow-[-6px_6px_32px_0_rgba(29,29,31,0.08)]">
      <CalendarBlock />

      <div className="flex flex-col bg-[#F2F4F6] px-4 md:px-6 py-8 gap-6 overflow-y-auto lg:max-h-[calc(100vh-288px)] md:max-h-[calc(100vh-235px)]">
        <h1 className="text-2xl font-semibold text-[#1D1D1F]">
          Log your journal
        </h1>

        <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">
            Feel off today? Talk to me 👀
          </h2>
          <Input
            placeholder="Leave feedback about your wellness"
            className="font-semibold h-[44px] text-base"
          />
          <div className="flex gap-4 font-semibold ">
            <Paperclip className="stroke-[1.5]" />
            <Mic className="stroke-[1.5]" />
          </div>
        </BlockWrapper>

        <BlockWrapper>
          <div>
            <h2 className="text-lg font-semibold text-[#1D1D1F]">
              Most Noticeable Symptom Today
            </h2>
            <p className="text-sm text-[#5F5F65]">
              What's been bothering you most today?
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map((symptom) => (
              <Button
                variant="ghost"
                key={symptom}
                className="flex items-center justify-center p-4 bg-[#F3F7FD] rounded-md text-base"
              >
                {symptom}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 ">
            <Input
              placeholder="Type other symptoms here..."
              className="font-semibold h-[44px] text-base"
            />
            <Button variant="ghost" className="h-[44px] w-[44px]">
              <Plus className="stroke-[1.5] text-[#5F5F65]" />
            </Button>
          </div>
        </BlockWrapper>

        <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">Duration</h2>

          <div className="flex flex-wrap gap-2">
            {SLEEP_RANGES.map((range) => (
              <Button
                variant="ghost"
                key={range.text}
                className="flex items-center justify-center p-4 bg-[#F3F7FD] rounded-md gap-2 text-base"
                font-normal
              >
                {range.icon}
                {range.text}
              </Button>
            ))}
          </div>
        </BlockWrapper>

        <BlockWrapper>
          <div>
            <h2 className="text-lg font-semibold text-[#1D1D1F]">
              Suspected Triggers
            </h2>
            <p className="text-sm text-[#5F5F65]">
              You are the expert, think back and try to identify the trigger.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {SUSPECTED_TRIGGERS.map((trigger) => (
              <Button
                variant="ghost"
                key={trigger}
                className="flex items-center justify-center p-4 bg-[#F3F7FD] rounded-md text-base"
              >
                {trigger}
              </Button>
            ))}
          </div>

          <div className="flex gap-2 ">
            <Input
              placeholder="Type other symptoms here..."
              className="font-semibold h-[44px] text-base"
            />
            <Button variant="ghost" className="h-[44px] w-[44px]">
              <Plus className="stroke-[1.5] text-[#5F5F65]" />
            </Button>
          </div>
        </BlockWrapper>

        <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">
            Sleep Quality{" "}
            <span className="text-[#B3BCC8]">(Synced or Manual)</span>
          </h2>

          <div className="flex gap-2 text-[#1D1D1F] font-semibold">
            <Checkbox /> <span>Auto-sync from Oura / Apple Watch / Garmin</span>
          </div>

          <MoodSelector
            value={moodValue}
            onChange={setMoodValue}
            colors={MOOD_COLORS}
          />

          <div className="flex flex-wrap gap-6">
            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Total sleep:</label>
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) =>
                      handleSleepSelectChange("hours", value)
                    }
                    value={String(sleep.hours)}
                  >
                    <SelectTrigger className="w-20 h-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 24 }, (_, i) => i + 1).map(
                          (hour) => (
                            <SelectItem key={hour} value={String(hour)}>
                              {hour}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>

                  <span className="text-gray-500">Hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    onValueChange={(value) =>
                      handleSleepSelectChange("minutes", value)
                    }
                    value={String(sleep.minutes)}
                  >
                    <SelectTrigger className="w-20 h-10">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {Array.from({ length: 6 }, (_, i) => (i + 1) * 10).map(
                          (minute) => (
                            <SelectItem key={minute} value={String(minute)}>
                              {minute}
                            </SelectItem>
                          )
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <span className="text-gray-500">Minutes</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">Woke up:</label>
              <div className="flex items-center space-x-2">
                <Select
                  onValueChange={(value) =>
                    handleSleepSelectChange("wokeUpTimes", value)
                  }
                  value={String(sleep.wokeUpTimes)}
                >
                  <SelectTrigger className="w-20 h-10">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {Array.from({ length: 3 }, (_, i) => i + 1).map(
                        (wakeupAttempt) => (
                          <SelectItem
                            key={wakeupAttempt}
                            value={String(wakeupAttempt)}
                          >
                            {wakeupAttempt}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <span className="text-gray-500">Times</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-medium text-gray-700">
                Fell back sleep:
              </label>
              <Select
                onValueChange={(value) =>
                  handleSleepSelectChange("fellBack", value)
                }
                value={String(sleep.fellBack)}
              >
                <SelectTrigger className="w-40 h-10">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {FELL_BACK_OPTIONS.map((mood) => (
                      <SelectItem key={mood} value={String(mood)}>
                        {mood}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </BlockWrapper>

        <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">
            Meals & Timing
          </h2>

          <div className="flex flex-col gap-2 text-[#1D1D1F]">
            <label className="font-medium">Examples:</label>
            <div className="flex flex-wrap gap-2">
              {MEAL_EXAMPLES.map((mealExample) => (
                <Button
                  variant="ghost"
                  key={mealExample}
                  className="flex items-center justify-center p-4 bg-[#F3F7FD] rounded-md text-base"
                >
                  {mealExample}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 text-[#1D1D1F]">
            <label className="font-medium">Notes:</label>
            <div className="flex gap-2 ">
              <Input
                placeholder="Type some notes here..."
                className="font-semibold h-[44px] text-base"
              />
              <Button variant="ghost" className="h-[44px] w-[44px]">
                <Plus className="stroke-[1.5] text-[#5F5F65]" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-[#1D1D1F]">
            <div className="flex items-center gap-2 font-medium">
              <Coffee className="stroke-[1.5]" />
              <span>Breakfast</span>
            </div>
            <div className="flex flex-wrap gap-6 md:flex-nowrap">
              <div className="flex flex-col w-full gap-2 font-medium">
                <label>What did you eat?</label>
                <Input
                  placeholder="Type what you ate here..."
                  className="font-semibold h-[44px] text-base"
                  value={meal.breakfast.food}
                  onChange={(e) =>
                    handleMealChange("breakfast", "food", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-2 font-medium">
                <label>At what time?</label>
                <Input
                  placeholder="00:00 AM/PM"
                  className="font-semibold h-[44px] text-base"
                  iconRight={
                    <Clock4 className="stroke-[1.5]" width={16} height={16} />
                  }
                  value={meal.breakfast.time}
                  onChange={(e) =>
                    handleMealChange("breakfast", "time", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-[#1D1D1F]">
            <div className="flex items-center gap-2 font-medium">
              <Salad className="stroke-[1.5]" />
              <span>Lunch</span>
            </div>
            <div className="flex flex-wrap gap-6 md:flex-nowrap">
              <div className="flex flex-col w-full gap-2 font-medium">
                <label>What did you eat?</label>
                <Input
                  placeholder="Type what you ate here..."
                  className="font-semibold h-[44px] text-base"
                  value={meal.lunch.food}
                  onChange={(e) =>
                    handleMealChange("lunch", "food", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-2 font-medium">
                <label>At what time?</label>
                <Input
                  placeholder="00:00 AM/PM"
                  className="font-semibold h-[44px] text-base"
                  iconRight={
                    <Clock4 className="stroke-[1.5]" width={16} height={16} />
                  }
                  value={meal.lunch.time}
                  onChange={(e) =>
                    handleMealChange("lunch", "time", e.target.value)
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 text-[#1D1D1F]">
            <div className="flex items-center gap-2 font-medium">
              <Utensils className="stroke-[1.5]" />
              <span>Dinner</span>
            </div>
            <div className="flex flex-wrap gap-6 md:flex-nowrap">
              <div className="flex flex-col w-full gap-2 font-medium">
                <label>What did you eat?</label>
                <Input
                  placeholder="Type what you ate here..."
                  className="font-semibold h-[44px] text-base"
                  value={meal.dinner.food}
                  onChange={(e) =>
                    handleMealChange("dinner", "food", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col w-full gap-2 font-medium">
                <label>At what time?</label>
                <Input
                  placeholder="00:00 AM/PM"
                  className="font-semibold h-[44px] text-base"
                  iconRight={
                    <Clock4 className="stroke-[1.5]" width={16} height={16} />
                  }
                  value={meal.dinner.time}
                  onChange={(e) =>
                    handleMealChange("dinner", "time", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        </BlockWrapper>

        <BlockWrapper>
          <h2 className="text-lg font-semibold text-[#1D1D1F]">
            Wearable Data Summary
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {snapshots.map((snapshot, index) => (
              <Snapshot
                key={snapshot.title}
                {...snapshot}
                className={
                  snapshots.length % 2 !== 0 && index === snapshots.length - 1
                    ? "col-span-2"
                    : ""
                }
              />
            ))}
          </div>
        </BlockWrapper>
      </div>

      <BlockWrapper className="flex flex-row items-center justify-between rounded-none md:rounded-t-none">
        <Button variant="blue2" onClick={onCancel} className="w-[128px]">
          Cancel
        </Button>
        <Button
          variant="brightblue"
          onClick={onDone}
          className={cn("w-[128px] ", {
            "bg-[#D5DAE2] text-[#5F5F65] hover:bg-[#C4C8D4] hover:text-[#5F5F65] hover:cursor-not-allowed":
              isButtonDisabled,
          })}
        >
          Done
        </Button>
      </BlockWrapper>
    </div>
  );
};

const BlockWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex flex-col gap-6 p-4 md:p-6 bg-white rounded-3xl",
      className
    )}
  >
    {children}
  </div>
);
