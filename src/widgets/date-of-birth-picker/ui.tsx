import { RefObject, useState, useRef } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";

interface DateOfBirthPickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  portalContainerRef?: RefObject<HTMLElement>;
}

export const DateOfBirthPicker = ({
  date,
  setDate,
  portalContainerRef,
}: DateOfBirthPickerProps) => {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(
    date?.getFullYear() ?? new Date().getFullYear()
  );
  const [displayMonth, setDisplayMonth] = useState<Date>(
    new Date(selectedYear, date?.getMonth() ?? 0)
  );
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    const newMonth = new Date(year, displayMonth.getMonth());
    setDisplayMonth(newMonth);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (!popoverRef.current?.contains(event.relatedTarget as Node)) {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-3 z-[10000] relative">
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-between w-full font-normal border-gray-200"
          >
            {date ? date.toLocaleDateString("en-US") : "Select date"}
            <MaterialIcon iconName="calendar_today" fill={1} />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          ref={popoverRef}
          onBlur={handleBlur}
          container={portalContainerRef?.current}
          className="w-auto p-0 overflow-hidden z-[10000]"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <div className="flex flex-col">
            <div className="flex gap-2 items-center px-4 pt-3">
              <span className="text-sm text-gray-700">Choose a year:</span>
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="px-2 py-1 border rounded-md outline-none text-sm"
              >
                {Array.from(
                  { length: 100 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <Calendar
              mode="single"
              selected={date}
              month={displayMonth}
              onMonthChange={(m) => {
                setDisplayMonth(m);
                const y = m.getFullYear();
                if (y !== selectedYear) setSelectedYear(y);
              }}
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                if (selectedDate) {
                  const y = selectedDate.getFullYear();
                  if (y !== selectedYear) setSelectedYear(y);
                  setDisplayMonth(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth()
                    )
                  );
                }
                setOpen(false);
              }}
              initialFocus
              captionLayout="dropdown"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
