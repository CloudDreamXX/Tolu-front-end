import { differenceInYears, format, isAfter, parseISO } from "date-fns";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  TooltipWrapper,
} from "shared/ui";
import { OnboardingClientLayout } from "../Layout";
import { CYCLE_HELTH, MAP_CYCLE_HEALTH_TO_TOOLTIP } from "./index";
import { RootState } from "entities/store";
import { UserService } from "entities/user";

export const DemographicStep = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const dateOfBirth = clientOnboarding.date_of_birth;
  const menopauseStatus = clientOnboarding.menopause_status;

  const initialDOB = dateOfBirth ? parseISO(dateOfBirth) : null;

  const [localDate, setLocalDate] = useState<Date | null>(initialDOB);
  const [selectedYear, setSelectedYear] = useState<number>(
    initialDOB ? initialDOB.getFullYear() : new Date().getFullYear()
  );
  const [displayMonth, setDisplayMonth] = useState<Date>(
    initialDOB
      ? new Date(initialDOB.getFullYear(), initialDOB.getMonth())
      : new Date(selectedYear, 0)
  );

  useEffect(() => {
    if (!dateOfBirth) return;
    const d = parseISO(dateOfBirth);
    if (Number.isNaN(d.getTime())) return;

    setLocalDate(d);
    setSelectedYear(d.getFullYear());
    setDisplayMonth(new Date(d.getFullYear(), d.getMonth()));

    dispatch(setFormField({ field: "age", value: computeAge(d) }));
  }, [dateOfBirth, dispatch]);

  const computeAge = (
    dob: string | Date | null | undefined
  ): number | undefined => {
    if (!dob) return undefined;
    const d = typeof dob === "string" ? parseISO(dob) : dob;
    if (Number.isNaN(d.getTime())) return undefined;

    const today = new Date();
    if (isAfter(d, today)) return undefined;

    const age = differenceInYears(today, d);
    return age >= 0 && age <= 120 ? age : undefined;
  };

  const computedAge = computeAge(dateOfBirth);

  const handleNext = async () => {
    const updated = {
      ...clientOnboarding,
      date_of_birth: dateOfBirth,
      age: computedAge,
      menopause_status: menopauseStatus,
    };

    await UserService.onboardClient(updated, token);
    nav("/what-brings-you-here");
  };

  const title = (
    <div className="flex flex-col gap-8 w-full max-w-[700px] items-start ">
      <div className="flex flex-col items-center self-stretch gap-4">
        <h1 className="text-[#1D1D1F] text-[24px] md:text-[32px] font-bold text-center ">
          Tell us a bit about you
        </h1>
        <p className="text-center text-[#5F5F65] text-base ">
          This helps us tailor your journey and ensure the right support —
          nothing is ever shared without your permission.
        </p>
      </div>
    </div>
  );

  const hintBlock = (
    <div className="flex gap-4 p-4 items-center rounded-2xl bg-[#DDEBF6] w-full lg:w-fit">
      <MaterialIcon
        iconName="info"
        size={32}
        className="text-[#1C63DB]"
        fill={1}
      />
      <p className="text-[#1B2559]  text-base font-normal">
        Your information is kept private and secure. It helps me provide
        smarter, more relevant support. Visit our website for the complete{" "}
        <a
          className="text-[#1C63DB] underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.tolu.health/privacy-policy"
        >
          Data Privacy Policy
        </a>
      </p>
    </div>
  );

  const buttonsBlock = (
    <div className="flex justify-between w-full lg:max-w-[700px] items-center">
      <button
        className="flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
        onClick={() => handleNext()}
      >
        Skip this for now
      </button>
      <button
        className={`flex p-4 rounded-full h-[44px] items-center justify-center w-32 text-center bg-[#1C63DB] text-white cursor-pointer`}
        onClick={handleNext}
      >
        Continue
      </button>
    </div>
  );

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setDisplayMonth((prev) => new Date(year, prev.getMonth()));
    if (localDate) {
      const d = new Date(localDate);
      d.setFullYear(year);
      setLocalDate(d);
    }
  };

  const calendarContent = (
    <>
      <div className="flex gap-[8px] items-center m-4 mb-1">
        Choose a year:
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className="px-2 py-1 border rounded-md outline-0"
        >
          {Array.from(
            { length: 100 },
            (_, index) => new Date().getFullYear() - index
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <Calendar
        mode="single"
        selected={localDate ?? undefined}
        onSelect={(selectedDate) => {
          if (selectedDate) {
            setLocalDate(selectedDate);
            dispatch(
              setFormField({
                field: "date_of_birth",
                value: format(selectedDate, "yyyy-MM-dd"),
              })
            );

            dispatch(
              setFormField({
                field: "age",
                value: computeAge(selectedDate),
              })
            );
            const y = selectedDate.getFullYear();
            if (y !== selectedYear) setSelectedYear(y);
            setDisplayMonth(
              new Date(selectedDate.getFullYear(), selectedDate.getMonth())
            );
          }
        }}
        initialFocus
        month={displayMonth}
        onMonthChange={(m) => {
          setDisplayMonth(m);
          const y = m.getFullYear();
          if (y !== selectedYear) setSelectedYear(y);
        }}
      />
    </>
  );

  const mainContent = (
    <>
      <div className="flex flex-col gap-[10px] items-start w-full">
        <label className=" text-[#1D1D1F] text-[16px]/[22px] font-medium">
          Birth Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start items-start text-left font-normal border-[#DFDFDF] hover:bg-white",
                !localDate && "text-muted-foreground"
              )}
            >
              <MaterialIcon iconName="calendar_today" fill={1} size={20} />
              {localDate ? format(localDate, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 pointer-events-auto"
            align="start"
            avoidCollisions={false}
            sticky="always"
            side="bottom"
          >
            {calendarContent}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex w-full flex-col items-start gap-[10px]">
        <label className="text-[#1D1D1F]  text-base font-medium">
          Cycle health
        </label>
        <RadioGroup
          className="grid w-full grid-cols-1 md:grid-cols-2"
          value={menopauseStatus}
          onValueChange={(val) =>
            dispatch(setFormField({ field: "menopause_status", value: val }))
          }
        >
          {CYCLE_HELTH.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option}
                className="w-4 h-4"
                iconSize={14}
              />
              <span>{option}</span>
              {option in MAP_CYCLE_HEALTH_TO_TOOLTIP && (
                <TooltipWrapper content={MAP_CYCLE_HEALTH_TO_TOOLTIP[option]}>
                  <MaterialIcon
                    iconName="help"
                    size={16}
                    fill={1}
                    className="text-[#1C63DB]"
                  />
                </TooltipWrapper>
              )}
            </div>
          ))}
        </RadioGroup>
      </div>
    </>
  );

  return (
    <OnboardingClientLayout
      currentStep={0}
      numberOfSteps={8}
      children={mainContent}
      title={title}
      buttons={
        <>
          {hintBlock}
          {buttonsBlock}
        </>
      }
    />
  );
};
