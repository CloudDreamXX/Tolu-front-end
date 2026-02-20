import { useEffect, useMemo, useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import { Button } from "shared/ui";
import { SymptomCheckCalendarModal } from "widgets/MenopauseModals/SymptomCheckCalendarModal/ui";

type Props = {
  selectedDate: string;
  handleDateChange: (date: Date) => void;
  datesWithData?: string[];
  onWeekDatesChange?: (weekDates: string[]) => void;
};

export const CalendarBlock: React.FC<Props> = ({
  selectedDate,
  handleDateChange,
  datesWithData = [],
  onWeekDatesChange,
}) => {
  const today = new Date();
  const [openCalendarModal, setOpenCalendarModal] = useState(false);
  const [weekAnchorDate, setWeekAnchorDate] = useState<Date>(() =>
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const weekDays = useMemo(
    () => getWeekRangeByDate(weekAnchorDate),
    [weekAnchorDate]
  );
  const daysWithData = useMemo(() => new Set(datesWithData), [datesWithData]);

  useEffect(() => {
    if (selectedDate) {
      setWeekAnchorDate(new Date(selectedDate));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!onWeekDatesChange) return;
    onWeekDatesChange(weekDays.map((day) => toDateKey(day)));
  }, [onWeekDatesChange, weekDays]);

  useEffect(() => {
    if (openCalendarModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openCalendarModal]);

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
            <MaterialIcon iconName="calendar_today" fill={1} />
          </Button>
        </div>
        <div className="flex self-stretch w-full items-center">
          <button
            type="button"
            className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[#ECEFF4]"
            onClick={() =>
              setWeekAnchorDate((prev) => {
                const next = new Date(prev);
                next.setDate(prev.getDate() - 7);
                return next;
              })
            }
            aria-label="Previous week"
          >
            <MaterialIcon iconName="keyboard_arrow_left" />
          </button>

          {weekDays.map((day) =>
            (() => {
              const dayKey = toDateKey(day);
              const isSelected = dayKey === selectedDate;
              const hasData = daysWithData.has(dayKey);
              return (
                <div
                  key={dayKey}
                  className="flex flex-col items-center w-full gap-1"
                >
                  <p className="text-sm font-medium text-[#5F5F65] flex-1">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </p>
                  <div
                    className={cn(
                      "relative font-medium text-[#1D1D1F] flex-1 min-h-[34px] flex justify-center items-center w-full rounded-full text-center cursor-pointer hover:bg-[#ECEFF4] hover:text-[#1D1D1F]",
                      {
                        "text-[#B3BCC8]": day > today,
                        "text-[#1D1D1F]": day < today,
                      },
                      {
                        "bg-[#1C63DB] text-white": isSelected,
                      }
                    )}
                    onClick={() => {
                      handleDateChange(day);
                      setOpenCalendarModal(false);
                    }}
                  >
                    <div className="flex items-start gap-[4px]">
                      {day.getDate()}
                      {hasData && (
                        <span
                          className={cn(
                            "h-[6px] w-[6px] rounded-full",
                            isSelected ? "bg-white" : "bg-[#1C63DB]"
                          )}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })()
          )}

          <button
            type="button"
            className="ml-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-[#ECEFF4]"
            onClick={() =>
              setWeekAnchorDate((prev) => {
                const next = new Date(prev);
                next.setDate(prev.getDate() + 7);
                return next;
              })
            }
            aria-label="Next week"
          >
            <MaterialIcon iconName="keyboard_arrow_right" />
          </button>
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

const toDateKey = (date: Date) => {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().split("T")[0];
};

const getWeekRangeByDate = (date: Date) => {
  const dayOfWeek = date.getDay();
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - dayOfWeek);

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = new Date(startOfWeek);
    currentDay.setDate(startOfWeek.getDate() + i);
    weekDays.push(currentDay);
  }

  return weekDays;
};
