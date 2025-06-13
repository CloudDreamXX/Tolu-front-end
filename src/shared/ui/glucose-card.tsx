import React, { useState, useEffect } from "react";
import InfoIcon from "shared/assets/icons/info-icon";
import TrendUp from "shared/assets/icons/trend-up";
import TrendDown from "shared/assets/icons/trend-down";
import Pencil from "shared/assets/icons/pencil";
import { Dialog, DialogContent, DialogTrigger } from "shared/ui/dialog";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./calendar";
import { cn } from "shared/lib";

import { useSelector, useDispatch } from "react-redux";
import {
  setGlucoseValue,
  setMeasurementType,
  setDate as setReduxDate,
  setNotes,
} from "entities/store/clientGlucoseSlice";
import { RootState } from "entities/store";
import ArrowBack from "shared/assets/icons/arrowBack";

export interface GlucoseCardProps {
  indicator: string;
  trend: "up" | "down";
  width?: string;
  height?: string;
  modifiable?: boolean;
}

export const GlucoseCard: React.FC<GlucoseCardProps> = ({
  indicator,
  trend,
  width,
  height,
  modifiable = false,
}) => {
  const dispatch = useDispatch();

  // Redux state
  const glucoseValueFromStore = useSelector(
    (state: RootState) => state.clientGlucose.glucoseValue
  );
  const measurementTypeFromStore = useSelector(
    (state: RootState) => state.clientGlucose.measurementType
  );
  const dateStringFromStore = useSelector(
    (state: RootState) => state.clientGlucose.date
  );
  const notesFromStore = useSelector(
    (state: RootState) => state.clientGlucose.notes
  );

  // Dialog & Calendar state
  const [dialogOpen, setDialogOpen] = useState(false);

  // Local state for inputs
  const [localGlucoseValue, setLocalGlucoseValue] = useState("");
  const [localMeasurementType, setLocalMeasurementType] = useState("");
  const [localDate, setLocalDate] = useState<Date | null>(null);
  const [localNotes, setLocalNotes] = useState("");

  // Populate local state on dialog open
  useEffect(() => {
    if (dialogOpen) {
      setLocalGlucoseValue(glucoseValueFromStore);
      setLocalMeasurementType(measurementTypeFromStore);
      setLocalDate(dateStringFromStore ? new Date(dateStringFromStore) : null);
      setLocalNotes(notesFromStore);
    }
  }, [
    dialogOpen,
    glucoseValueFromStore,
    measurementTypeFromStore,
    dateStringFromStore,
    notesFromStore,
  ]);

  const isEmpty = glucoseValueFromStore.trim() === "";

  const handleSave = () => {
    dispatch(setGlucoseValue(localGlucoseValue));
    dispatch(setMeasurementType(localMeasurementType));
    dispatch(setReduxDate(localDate ? localDate.toISOString() : ""));
    dispatch(setNotes(localNotes));
    setDialogOpen(false);
  };

  return (
    <div className="flex flex-col p-4 justify-between items-start flex-1 rounded-2xl bg-[#F3F7FD] relative h-full">
      {modifiable && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="absolute right-[12px] top-[12px] py-[6px] px-[6px] h-[24px] w-[24px] md:w-8 md:h-8 rounded-full bg-[#DDEBF6] flex items-center justify-center">
              <Pencil />
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[768px] md:max-w-[742px] flex flex-col gap-6 p-6 items-start">
            <div className="flex flex-col gap-2 items-start">
              <h2 className="text-[24px]/[32px] font-semibold font-[Nunito] text-[#1D1D1F]">
                Enter Your Glucose Level
              </h2>
              <p className="font-[Nunito] text-[#5F5F65] text-[16px]/[22px] font-medium">
                Don’t have a CGM device? No problem — you can manually enter
                your blood glucose reading here.
              </p>
            </div>

            <div className="flex flex-col gap-[10px] items-start w-full">
              <label className="font-[Nunito] text-[#1D1D1F] text-[16px]/[22px] font-medium">
                Glucose value, mg/dL or mmol/L
              </label>
              <Input
                placeholder="Enter value"
                className="w-full py-[11px] px-4"
                value={localGlucoseValue}
                onChange={(e) => setLocalGlucoseValue(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-[10px] items-start w-full">
              <label className="font-[Nunito] text-[#1D1D1F] text-[16px]/[22px] font-medium">
                Measurement type
              </label>
              <Select
                value={localMeasurementType}
                onValueChange={(val) => setLocalMeasurementType(val)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
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
              <label className="font-[Nunito] text-[#1D1D1F] text-[16px]/[22px] font-medium">
                Date & Time
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !localDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {localDate ? format(localDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 pointer-events-auto"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={localDate ?? undefined}
                    onSelect={(selectedDate) => {
                      if (selectedDate) {
                        setLocalDate(selectedDate);
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex flex-col gap-[10px] items-start w-full">
              <label className="font-[Nunito] text-[#1D1D1F] text-[16px]/[22px] font-medium">
                Notes{" "}
                <span className="font-normal text-[#B3BCC8]">(Optional)</span>
              </label>
              <Input
                placeholder="Leave short feedback about your wellness"
                className="w-full py-[11px] px-4"
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
              />
            </div>

            <div className="flex justify-between items-center w-full">
              <button
                onClick={() => setDialogOpen(false)}
                className="flex justify-center items-center rounded-full bg-[#DDEBF6] text-[16px]/[22px] font-semibold font-[Nunito] text-[#1C63DB] p-4 w-32 h-[44px]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="flex justify-center items-center rounded-full bg-[#1C63DB] text-[16px]/[22px] font-semibold font-[Nunito] text-white p-4 w-32 h-[44px]"
              >
                Save
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex items-center gap-1 self-stretch">
        <h3 className="font-[Nunito] text-[12px] md:text-[18px]/[24px] font-semibold text-[#1D1D1F]">
          Glucose
        </h3>
        <span className="w-[20px] h-[20px]">
          <InfoIcon />
        </span>
      </div>

      <div className="flex items-center gap-3">
        <h2 className="text-[32px]/[44px] font-bold font-[Nunito] whitespace-nowrap text-[#1C63DB]">
          {isEmpty ? "" : indicator}
        </h2>

        {!isEmpty && (
          <div
            className={
              trend === "up"
                ? "flex p-1 items-center gap-1 justify-center rounded-2xl border border-[#BCE2C8] bg-[#F0FFF5]"
                : "flex p-1 items-center gap-1 justify-center rounded-2xl border border-[#FFB3AE] bg-[#FFF6F5]"
            }
          >
            {trend === "up" ? <TrendUp /> : <TrendDown />}
          </div>
        )}
      </div>

      {isEmpty && (
        <p className="mt-auto flex items-start w-full text-center font-[Nunito] font-bold text-[18px] md:text-[20px] leading-[28px] text-red-600">
          Need to enter
        </p>
      )}
    </div>
  );
};
