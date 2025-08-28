import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { formatDateToSlash } from "shared/lib";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "shared/ui";

interface DateSelectorProps {
  choosedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  choosedDate,
  onDateChange,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex flex-row gap-1.5 items-center justify-end md:justify-start text-sm">
        {formatDateToSlash(choosedDate)}{" "}
        <MaterialIcon iconName="keyboard_arrow_down" size={16} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <div className="flex flex-col gap-2 p-4">
          <h2 className="text-sm font-semibold">Select date</h2>
          <input
            type="date"
            value={choosedDate.toISOString().split("T")[0]}
            onChange={(e) => onDateChange(new Date(e.target.value))}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
