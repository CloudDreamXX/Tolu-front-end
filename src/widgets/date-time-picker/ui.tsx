import * as React from "react";
import { useState } from "react";
import { format, parse } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "shared/ui/popover";
import { Button } from "shared/ui/button";
import { Calendar } from "shared/ui/calendar";
import { Input } from "shared/ui/input";

export function DateTimePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [inputValue, setInputValue] = useState<string>(
    date ? format(date, "MMM dd, yyyy h:mm a") : ""
  );
  const [open, setOpen] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    // Try to parse input; fallback to undefined if invalid
    const parsed = parse(val, "MMM dd, yyyy h:mm a", new Date());
    if (!isNaN(parsed.getTime())) {
      setDate(parsed);
    }
  };

  const handleDateChange = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      setInputValue(format(selectedDate, "MMM dd, yyyy h:mm a"));
    }
    setOpen(false);
  };

  return (
    <div className="w-[300px]">
      <label className="block mb-1 text-sm font-medium text-gray-700">
        Date & Time
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Input
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Apr 25, 2025 9:00 am"
            className="pl-10"
            spellCheck={false}
          />
        </PopoverTrigger>
        <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
          {/* For time selection, you could add custom time dropdown or input here */}
        </PopoverContent>
      </Popover>
    </div>
  );
}
