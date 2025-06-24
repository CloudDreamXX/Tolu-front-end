import { setFormField } from "entities/store/clientOnboardingSlice";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import Info from "shared/assets/icons/info";
import SmallTooltip from "shared/assets/icons/small-tooltip";
import { cn } from "shared/lib";
import {
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui/tooltip";
import { OnboardingClientLayout } from "../Layout";
import {
  countries,
  education,
  householdType,
  languages,
  occupation,
  raceEthnicity,
} from "./index";

export const DemographicStep = () => {
  const dispatch = useDispatch();
  const [age, setAge] = useState("");
  const [menopauseStatus, setMenopauseStatus] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [race, setRace] = useState("");
  const [household, setHousehold] = useState("");
  const [occupationVal, setOccupationVal] = useState("");
  const [educationVal, setEducationVal] = useState("");
  const [otherHousehold, setOtherHousehold] = useState("");
  const [otherOccupation, setOtherOccupation] = useState("");
  const [otherRace, setOtherRace] = useState("");
  const nav = useNavigate();
  const isFormComplete = () =>
    age.trim() &&
    menopauseStatus.trim() &&
    country.trim() &&
    zipCode.trim() &&
    selectedLanguages.length &&
    household.trim();

  const [isOpenSelectLanguage, setIsOpenSelectLanguage] = useState(false);

  const handleNext = () => {
    dispatch(setFormField({ field: "age", value: Number(age) }));
    dispatch(
      setFormField({ field: "menopauseStatus", value: menopauseStatus })
    );
    dispatch(setFormField({ field: "country", value: country }));
    dispatch(setFormField({ field: "ZIP", value: zipCode }));
    dispatch(setFormField({ field: "race", value: race }));
    dispatch(setFormField({ field: "household", value: household }));
    dispatch(setFormField({ field: "occupation", value: occupationVal }));
    dispatch(setFormField({ field: "education", value: educationVal }));
    dispatch(setFormField({ field: "language", value: selectedLanguages }));
    dispatch(
      setFormField({
        field: "race",
        value: race === "Other" ? otherRace : race,
      })
    );
    dispatch(
      setFormField({
        field: "household",
        value: household === "Other" ? otherHousehold : household,
      })
    );
    dispatch(
      setFormField({
        field: "occupation",
        value: occupationVal === "Other" ? otherOccupation : occupationVal,
      })
    );

    nav("/what-brings-you-here");
  };

  const handleZip = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 5) {
      setZipCode(value);
    }
  };

  const handleHouseholdChange = (val: string) => {
    setHousehold(val);
    if (val !== "Other") setOtherHousehold("");
  };

  const handleOccupationChange = (val: string) => {
    setOccupationVal(val);
    if (val !== "Other") setOtherOccupation("");
  };

  const handleRaceChange = (val: string) => {
    setRace(val);
    if (val !== "Other") setOtherRace("");
  };

  const handleLanguageChange = (value: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
    setIsOpenSelectLanguage(true);
  };

  const title = (
    <div className="flex flex-col gap-8 w-full max-w-[700px] items-start ">
      <div className="flex flex-col items-center self-stretch gap-4">
        <h1 className="text-[#1D1D1F] text-[24px] md:text-[32px] font-bold text-center font-[Nunito]">
          Tell us a bit about you
        </h1>
        <p className="text-center text-[#5F5F65] text-base font-[Nunito]">
          This helps us tailor your journey and ensure the right support —
          nothing is ever shared without
          <br /> your permission.
        </p>
      </div>
    </div>
  );

  const hintBlock = (
    <div className="flex gap-4 p-4 items-center rounded-2xl bg-[#DDEBF6]">
      <Info />
      <p className="text-[#1B2559] font-[Nunito] text-base font-normal">
        Your information is kept private and secure. It helps us provide
        smarter, more relevant
        <br /> support.
      </p>
    </div>
  );

  const buttonsBlock = (
    <div className="flex justify-between w-full max-w-[700px] items-center">
      <button className="flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]">
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

  const mainContent = (
    <>
      <div className="flex w-full flex-col items-start gap-[10px] ">
        <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
          Age *
        </label>
        <Input
          onChange={(e) => setAge(e.target.value)}
          className="w-full text-[14px] font-[Nunito] font-medium py-[11px] px-[16px]"
          max={120}
          min={0}
          type="number"
          placeholder="Enter your age"
        />
      </div>
      <div className="flex w-full flex-col items-start gap-[10px]">
        <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
          Period Status *
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
              <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Still menstruating
              </p>
              <SmallTooltip />
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
              <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Irregular cycles
              </p>
              <SmallTooltip />
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
              <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                No periods for 12+ months
              </p>
              <SmallTooltip />
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
              <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Postmenopausal
              </p>
              <SmallTooltip />
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
            <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
              Not sure
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    <SmallTooltip />
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    It's absolutely OK not to know
                    <br /> where you are. Tolu will help you to
                    <br /> figure our exactly where you are in
                    <br />
                    your journey.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full gap-6 md:flex-row md:items-center">
        <div className="flex flex-col items-start flex-1 w-full gap-2">
          <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
            Country *
          </label>
          <Select onValueChange={setCountry}>
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col items-start flex-1 w-full gap-2">
          <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
            ZIP/Postal Code *
          </label>
          <Input
            className="w-full text-[14px] font-[Nunito] font-medium py-[11px] px-[16px]"
            onChange={handleZip}
            value={zipCode}
            placeholder="Enter ZIP/Postal Code"
          />
        </div>
      </div>
      <div className="flex w-full flex-col items-start gap-[10px]">
        <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
          Language *
        </label>

        <Popover>
          <PopoverTrigger className="w-full">
            <button className="flex min-h-10 w-full items-center font-[Nunito]  rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 gap-2 flex-wrap">
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
              <ChevronDown className="w-4 h-4 ml-auto opacity-60" />
            </button>
          </PopoverTrigger>

          <PopoverContent className="p-1 w-[var(--radix-popover-trigger-width)] font-[Nunito]">
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
      <div className="flex w-full flex-col items-start gap-[10px]">
        <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
          Race / Etnicity
        </label>
        <Select onValueChange={setRace}>
          <SelectTrigger className="">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {raceEthnicity.map((race) => (
                <SelectItem key={race} value={race}>
                  {race}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {race === "Other (please specify)" && (
          <Input
            placeholder="Enter race or ethnicity"
            value={otherRace}
            onChange={(e) => setOtherRace(e.target.value)}
            className="mt-2"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[10px]">
        <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
          Household Type *
        </label>
        <Select onValueChange={handleHouseholdChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {householdType.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {household === "Other (please specify)" && (
          <Input
            placeholder="Enter household type"
            value={otherHousehold}
            onChange={(e) => setOtherHousehold(e.target.value)}
            className="mt-2"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[10px]">
        <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
          Occupation
        </label>
        <Select onValueChange={handleOccupationChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {occupation.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {occupationVal === "Other (please specify)" && (
          <Input
            placeholder="Enter occupation"
            value={otherOccupation}
            onChange={(e) => setOtherOccupation(e.target.value)}
            className="mt-2"
          />
        )}
      </div>
      <div className="flex w-full flex-col items-start gap-[10px]">
        <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
          Education Level
        </label>
        <Select onValueChange={handleRaceChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {education.map((race) => (
                <SelectItem key={race} value={race}>
                  {race}
                </SelectItem>
              ))}
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
