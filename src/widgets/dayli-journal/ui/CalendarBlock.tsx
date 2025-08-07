import { Calendar } from "lucide-react";
import { useState } from "react";
import { cn } from "shared/lib";
import { Button } from "shared/ui";
import { SymptomCheckCalendarModal } from "widgets/MenopauseModals/SymptomCheckCalendarModal/ui";

type Props = {
  selectedDate: string;
  handleDateChange: (date: Date) => void;
};

export const CalendarBlock: React.FC<Props> = ({
  selectedDate,
  handleDateChange,
}) => {
  const today = new Date();
  const [openCalendarModal, setOpenCalendarModal] = useState(false);

  return (
    <>
      <div className="flex flex-col justify-center gap-4 p-4 md:p-6 border-b shadow-[-6px_6px_32px_0_rgba(29,29,31,0.08)] bg-white">
        <div className="flex items-center gap-4">
          <p className="text-lg font-bold text-[#1D1D1F] flex-1">
            {selectedDate
              ? new Date(selectedDate).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })
              : today.toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
          </p>
          {selectedDate === today.toISOString().split("T")[0] && (
            <p className="text-[#1C63DB] text-sm font-semibold">Today</p>
          )}
          <Button variant={"ghost"} onClick={() => setOpenCalendarModal(true)}>
            <Calendar className="text-[#5F5F65]" />
          </Button>
        </div>
        <div className="flex self-stretch w-full">
          {getCurrentWeekRange().map((day) => (
            <div
              key={day.getDay()}
              className="flex flex-col items-center w-full gap-1"
            >
              <p className="text-sm font-medium text-[#5F5F65] flex-1">
                {day.toLocaleDateString("en-US", { weekday: "short" })}
              </p>
              <p
                className={cn(
                  "font-medium text-[#1D1D1F] flex-1 min-h-[34px] flex justify-center items-center w-full rounded-full text-center cursor-pointer hover:bg-[#ECEFF4] hover:text-[#1D1D1F]",
                  {
                    "text-[#B3BCC8]": day.getDate() > today.getDate(),
                    "text-[#1D1D1F]": day.getDate() < today.getDate(),
                  },
                  {
                    "bg-[#1C63DB] text-white":
                      day.toISOString().split("T")[0] === selectedDate,
                  }
                )}
                onClick={() => handleDateChange(day)}
              >
                {day.getDate()}
              </p>
            </div>
          ))}
        </div>
      </div>

      <SymptomCheckCalendarModal
        handleDateChange={handleDateChange}
        isOpen={openCalendarModal}
        onClose={() => setOpenCalendarModal(false)}
      />
    </>
  );
};

const getCurrentWeekRange = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    weekDays.push(currentDay);
  }

  return weekDays;
};
