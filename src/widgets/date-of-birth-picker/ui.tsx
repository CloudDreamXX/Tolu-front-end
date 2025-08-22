import { RefObject, useState } from "react";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";
import CalendarIcon from "shared/assets/icons/calendar";

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
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          container={portalContainerRef?.current}
          className="w-auto p-0 overflow-hidden z-[10000]"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
          onCloseAutoFocus={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
