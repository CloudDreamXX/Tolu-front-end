import { format } from "date-fns";

import { useState } from "react";
import { cn } from "shared/lib";
import { Dialog, DialogContent, DialogTrigger } from "shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export interface ClientCardProps {
  title: string;
  indicator: string;
  trend: "up" | "down";
  modifiable?: boolean;
  onModify?: () => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({
  title,
  indicator,
  trend,
  modifiable = false,
  onModify,
}) => {
  const [date, setDate] = useState<Date>();
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col p-4 justify-between items-start flex-1 rounded-2xl bg-[#F3F7FD] relative w-[100%] xl:w-full 3xl:w-[238px] h-[116px] md:h-[155px] xl:h-[100%]">
      {modifiable && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <button className="absolute right-[12px] top-[12px] py-[6px] px-[8px] h-8 rounded-full bg-[#DDEBF6] flex items-center justify-center ">
              <MaterialIcon iconName="edit" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[742px] flex flex-col gap-6 p-6 items-start">
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-[24px]/[32px] font-semibold  text-[#1D1D1F]">
                Enter Your Glucose Level
              </h2>
              <p className=" text-[#5F5F65] text-[16px]/[22px] font-medium">
                Don’t have a CGM device? No problem — you can manually enter
                your blood glucose reading here.
              </p>
            </div>
            <div className="flex flex-col gap-[10px] items-start w-full">
              <label className=" text-[#1D1D1F] text-[16px]/[22px] font-medium">
                Glucose value, mg/dL or mmol/L
              </label>
              <Input
                placeholder="Enter value"
                className="w-full py-[11px] px-4"
              />
            </div>
            <div className="flex flex-col gap-[10px] items-start w-full">
              <label className=" text-[#1D1D1F] text-[16px]/[22px] font-medium">
                Measurement type
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fruits</SelectLabel>
                    <SelectItem value="Fasting">Fasting</SelectItem>
                    <SelectItem value="Post-meal (1 hr)">
                      Post-meal (1 hr)
                    </SelectItem>
                    <SelectItem value="Post-meal (2 hr)">
                      Post-meal (2 hr)
                    </SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-[10px] items-start w-full">
              <label className=" text-[#1D1D1F] text-[16px]/[22px] font-medium">
                Date & Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <MaterialIcon iconName="calendar_today" fill={1} />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex flex-col gap-[10px] items-start w-full">
              <label className=" text-[#1D1D1F] text-[16px]/[22px] font-medium">
                Notes{" "}
                <span className="font-normal text-[#B3BCC8]">(Optional)</span>
              </label>
              <Input
                placeholder="Leave short feedback about your wellness"
                className="w-full py-[11px] px-4"
              />
            </div>
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setOpen(false)}
                className="flex justify-center items-center rounded-full bg-[#DDEBF6] text-[16px]/[22px] font-semibold  text-[#1C63DB] p-4 w-32 h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex justify-center items-center rounded-full bg-[#1C63DB] text-[16px]/[22px] font-semibold  text-white p-4 w-32 h-[44px]"
                onClick={() => {
                  setOpen(false);
                  if (onModify) onModify();
                }}
              >
                Save
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex items-center self-stretch justify-between gap-1 xl:justify-start">
        <h3 className=" text-[12px] md:text-[16px] xl:text-[18px]/[24px] font-semibold text-[#1D1D1F]">
          {title}
        </h3>
        <span className="w-[16px] h-[16px] md:w-[20px] md:h-[20px]">
          <MaterialIcon
            iconName="help"
            size={16}
            fill={1}
            className="text-[#1C63DB]"
          />
        </span>
      </div>
      <div className="flex items-center justify-between w-full gap-3 xl:justify-start">
        <h2 className="text-[18px] md:text-[24px] xl:text-[32px]/[44px] font-bold  text-nowrap text-[#1C63DB]">
          {indicator}
        </h2>
        <div
          className={
            trend === "up"
              ? "flex p-1 items-center gap-1 justify-center rounded-2xl border border-[#BCE2C8] bg-[#F0FFF5]"
              : "flex p-1 items-center gap-1 justify-center rounded-2xl border border-[#FFB3AE] bg-[#FFF6F5]"
          }
        >
          <MaterialIcon
            iconName={trend === "up" ? "trending_up" : "trending_down"}
          />
        </div>
      </div>
    </div>
  );
};
