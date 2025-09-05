import { format } from "date-fns";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { cn } from "shared/lib";
import {
  Button,
  Calendar,
  Checkbox,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TooltipWrapper,
} from "shared/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import { OnboardingClientLayout } from "../Layout";
import { languages } from "./index";

export const DemographicStep = () => {
  const dispatch = useDispatch();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [localDate, setLocalDate] = useState<Date | null>(null);
  const [menopauseStatus, setMenopauseStatus] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [aiExperience, setAiExperience] = useState("");
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [displayMonth, setDisplayMonth] = useState<Date>(
    new Date(selectedYear, 0)
  );
  const nav = useNavigate();

  const computeAge = (dobStr: string) => {
    const dob = new Date(dobStr);
    if (Number.isNaN(dob.getTime())) return null;
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const beforeBirthday =
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());
    if (beforeBirthday) age--;
    return age;
  };

  const computedAge = computeAge(dateOfBirth);
  const isValidAge =
    computedAge !== null && computedAge >= 0 && computedAge <= 120;

  const isFormComplete = () =>
    !!dateOfBirth &&
    isValidAge &&
    menopauseStatus.trim() &&
    selectedLanguages.length &&
    aiExperience.trim();

  const handleNext = () => {
    dispatch(setFormField({ field: "date_of_birth", value: dateOfBirth }));
    dispatch(setFormField({ field: "age", value: Number(computedAge) }));
    dispatch(
      setFormField({ field: "menopauseStatus", value: menopauseStatus })
    );
    dispatch(setFormField({ field: "language", value: selectedLanguages }));
    dispatch(setFormField({ field: "ai_experience", value: aiExperience }));

    nav("/what-brings-you-here");
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const title = (
    <div className="flex flex-col gap-8 w-full max-w-[700px] items-start ">
      <div className="flex flex-col items-center self-stretch gap-4">
        <h1 className="text-[#1D1D1F] text-[24px] md:text-[32px] font-bold text-center ">
          Tell us a bit about you
        </h1>
        <p className="text-center text-[#5F5F65] text-base ">
          This helps us tailor your journey and ensure the right support —
          nothing is ever shared without
          <br /> your permission.
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
        smarter, more relevant
        <br /> support.
        <br /> Visit our website for the complete{" "}
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
        className={`flex p-4 rounded-full h-[44px] items-center justify-center w-32 text-center ${
          isFormComplete()
            ? "bg-[#1C63DB] text-white cursor-pointer"
            : "bg-[#D5DAE2] text-[#5F5F65] cursor-not-allowed"
        }`}
        disabled={!isFormComplete()}
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
            setDateOfBirth(format(selectedDate, "yyyy-MM-dd"));
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
        <div className="flex flex-col w-full gap-[10px] md:flex-row md:items-center md:gap-6">
          <div className="flex items-center flex-1 gap-4">
            <input
              value="still menstruating"
              onChange={(e) => setMenopauseStatus(e.target.value)}
              name="menopause"
              type="radio"
              className="w-4 h-4 p-1"
            />
            <div className="flex items-center gap-2">
              <p className="text-[#1D1D1F]  text-base font-medium">
                Still menstruating
              </p>
              <TooltipWrapper content="You’re having regular monthly periods without major changes in timing or flow.">
                <MaterialIcon
                  iconName="help"
                  size={16}
                  fill={1}
                  className="text-[#1C63DB]"
                />
              </TooltipWrapper>
            </div>
          </div>
          <div className="flex items-center flex-1 gap-4">
            <input
              value="irregular cycles"
              onChange={(e) => setMenopauseStatus(e.target.value)}
              name="menopause"
              type="radio"
              className="w-4 h-4 p-1"
            />
            <div className="flex items-center gap-2">
              <p className="text-[#1D1D1F]  text-base font-medium">
                Irregular cycles
              </p>
              <TooltipWrapper content="Your periods are becoming unpredictable — shorter, longer, lighter, or heavier than before. This often signals the transition toward menopause (perimenopause).">
                <MaterialIcon
                  iconName="help"
                  size={16}
                  fill={1}
                  className="text-[#1C63DB]"
                />
              </TooltipWrapper>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-[10px] md:flex-row md:items-center md:gap-6">
          <div className="flex items-center flex-1 gap-4">
            <input
              value="no periods for 12+ months"
              onChange={(e) => setMenopauseStatus(e.target.value)}
              name="menopause"
              type="radio"
              className="w-4 h-4 p-1"
            />
            <div className="flex items-center gap-2">
              <p className="text-[#1D1D1F]  text-base font-medium">
                No periods for 12+ months
              </p>
              <TooltipWrapper content="You haven’t had a menstrual period for at least a year. This usually marks the natural start of menopause.">
                <MaterialIcon
                  iconName="help"
                  size={16}
                  fill={1}
                  className="text-[#1C63DB]"
                />
              </TooltipWrapper>
            </div>
          </div>
          <div className="flex items-center flex-1 gap-4">
            <input
              value="postmenopausal"
              onChange={(e) => setMenopauseStatus(e.target.value)}
              name="menopause"
              type="radio"
              className="w-4 h-4 p-1"
            />
            <div className="flex items-center gap-2">
              <p className="text-[#1D1D1F]  text-base font-medium">
                Postmenopausal
              </p>
              <TooltipWrapper content="You reached menopause more than a year ago. Your cycle has stopped, and this is the stage after menopause.">
                <MaterialIcon
                  iconName="help"
                  size={16}
                  fill={1}
                  className="text-[#1C63DB]"
                />
              </TooltipWrapper>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <input
            value="not sure"
            name="menopause"
            type="radio"
            onChange={(e) => setMenopauseStatus(e.target.value)}
            className="w-4 h-4 p-1"
          />
          <div className="flex items-center gap-2">
            <p className="text-[#1D1D1F]  text-base font-medium">Not sure</p>
            <TooltipWrapper content="You’re uncertain where you are in the transition — and that’s completely normal. Tolu will help you track and understand your stage.">
              <MaterialIcon
                iconName="help"
                size={16}
                fill={1}
                className="text-[#1C63DB]"
              />
            </TooltipWrapper>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-[10px]">
        <label className="text-[#1D1D1F]  text-base font-medium">
          Language
        </label>
        <Popover>
          <PopoverTrigger className="w-full">
            <button className="flex min-h-10 w-full items-center   rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 gap-2 flex-wrap">
              {selectedLanguages.length === 0 ? (
                <span className="text-muted-foreground">Select languages</span>
              ) : (
                selectedLanguages.map((lang) => (
                  <button
                    key={lang}
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLanguageChange(lang);
                    }}
                    className="bg-gray-100 text-black px-2 py-0.5 rounded-md"
                  >
                    {lang} ×
                  </button>
                ))
              )}
              <MaterialIcon
                iconName="keyboard_arrow_down"
                className="w-4 h-4 ml-auto opacity-60"
              />
            </button>
          </PopoverTrigger>

          <PopoverContent className="p-1 w-[var(--radix-popover-trigger-width)] max-h-[300px] overflow-y-auto custom-small-scroll">
            {languages.map((lang) => (
              <label
                key={lang}
                className={cn(
                  "relative flex w-full items-center py-1.5 pl-8 pr-2 text-sm transition-colors rounded-md",
                  "hover:!text-blue-500 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                  selectedLanguages.includes(lang) &&
                    "bg-accent text-accent-foreground text-blue-500 "
                )}
              >
                <Checkbox
                  checked={selectedLanguages.includes(lang)}
                  onCheckedChange={() => handleLanguageChange(lang)}
                  className="absolute left-2 flex items-center justify-center w-4 h-4 -translate-y-1/2 rounded-sm top-1/2 hover:!border-blue-500 border-gray-200 border"
                />
                {lang}
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col items-start w-full gap-2">
        <label className="text-[#1D1D1F]  text-base font-medium">
          Do you use AI in your daily life?
        </label>
        <Select value={aiExperience} onValueChange={setAiExperience}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="yes">Yes</SelectItem>
              <SelectItem value="no">No</SelectItem>
              <SelectItem value="not_sure">Not sure</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
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
