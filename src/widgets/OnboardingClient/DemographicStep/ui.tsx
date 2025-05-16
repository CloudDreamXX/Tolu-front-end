import { AuthPageWrapper, Input } from "shared/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import { Footer } from "widgets/Footer";
import { useState } from "react";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import {
  countries,
  education,
  householdType,
  languages,
  occupation,
  raceEthnicity,
} from "./index";
import { FaQuestionCircle } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { setFormField } from "entities/store/clientOnboardingSlice";

export const DemographicStep = () => {
  const dispatch = useDispatch();
  const [age, setAge] = useState("");
  const [menopauseStatus, setMenopauseStatus] = useState("");
  const [country, setCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [language, setLanguage] = useState("");
  const [race, setRace] = useState("");
  const [household, setHousehold] = useState("");
  const [occupationVal, setOccupationVal] = useState("");
  const [educationVal, setEducationVal] = useState("");
  const nav = useNavigate();
  const isFormComplete = () =>
    age.trim() &&
    menopauseStatus.trim() &&
    country.trim() &&
    zipCode.trim() &&
    language.trim();

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
    dispatch(setFormField({ field: "language", value: language }));
    nav("/what-brings-you-here");
  };

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={0} steps={8} />
      <main className="flex flex-col items-center gap-8 justify-center self-stretch">
        <div className="flex flex-col gap-8 w-full max-w-[700px] items-start">
          <div className="flex flex-col gap-4 items-center self-stretch">
            <h1 className="text-[#1D1D1F] text-h1 text-center font-[Nunito]">
              Tell us a bit about you
            </h1>
            <p className="text-center text-[#5F5F65] text-base font-[Nunito]">
              This helps us tailor your journey and ensure the right support —
              nothing is ever shared without
              <br /> your permission.
            </p>
          </div>
        </div>
        <div className="flex flex-col self-stretch justify-center items-center gap-4">
          <div className="w-full max-w-[700px] flex p-10 gap-6 flex-col items-start justify-center rounded-3xl bg-white">
            <div className="flex w-full flex-col items-start gap-[10px] ">
              <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Age *
              </label>
              <Input
                onChange={(e) => setAge(e.target.value)}
                className="w-full self-stretch"
                max={120}
                min={0}
                type="number"
                placeholder="Enter your age"
              />
            </div>
            <div className="flex w-full flex-col items-start gap-[10px]">
              <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Menopause Status *
              </label>
              <div className="gap-6 flex w-full items-center">
                <div className="flex gap-4 flex-1 items-center">
                  <input
                    value="still menstruating"
                    onChange={(e) => setMenopauseStatus(e.target.value)}
                    name="menopause"
                    type="radio"
                    className="w-4 h-4 p-1"
                  />
                  <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                    Still menstruating
                  </p>
                </div>
                <div className="flex gap-4 flex-1 items-center">
                  <input
                    value="irregular pause"
                    onChange={(e) => setMenopauseStatus(e.target.value)}
                    name="menopause"
                    type="radio"
                    className="w-4 h-4 p-1"
                  />
                  <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                    Irregular pause
                  </p>
                </div>
              </div>
              <div className="gap-6 flex w-full items-center">
                <div className="flex gap-4 flex-1 items-center">
                  <input
                    value="no period for 12+ months"
                    onChange={(e) => setMenopauseStatus(e.target.value)}
                    name="menopause"
                    type="radio"
                    className="w-4 h-4 p-1"
                  />
                  <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                    No period for 12+ months
                  </p>
                </div>
                <div className="flex gap-4 flex-1 items-center">
                  <input
                    value="postmenopausal"
                    onChange={(e) => setMenopauseStatus(e.target.value)}
                    name="menopause"
                    type="radio"
                    className="w-4 h-4 p-1"
                  />
                  <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                    Postmenopausal
                  </p>
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
                <p className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                  Not sure
                </p>
              </div>
            </div>
            <div className="flex w-full items-start gap-6 self-stretch">
              <div className="flex flex-col w-full flex-1 items-start gap-2">
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
              <div className="flex flex-col w-full flex-1 items-start gap-2">
                <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                  ZIP/Postal Code *
                </label>
                <Input
                  onChange={(e) => {
                    if (zipCode.length >= 5) return;
                    setZipCode(e.target.value);
                  }}
                  value={zipCode}
                  placeholder="Enter ZIP/Postal Code"
                />
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-[10px]">
              <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Language *
              </label>
              <Select onValueChange={setLanguage}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {languages.map((language) => (
                      <SelectItem key={language} value={language}>
                        {language}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
            </div>
            <div className="flex w-full flex-col items-start gap-[10px]">
              <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Household Type
              </label>
              <Select onValueChange={setHousehold}>
                <SelectTrigger className="">
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
            </div>
            <div className="flex w-full flex-col items-start gap-[10px]">
              <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Occupation
              </label>
              <Select onValueChange={setOccupationVal}>
                <SelectTrigger className="">
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
            </div>
            <div className="flex w-full flex-col items-start gap-[10px]">
              <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Education Level
              </label>
              <Select onValueChange={setEducationVal}>
                <SelectTrigger className="">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {education.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex gap-4 p-4 items-center rounded-2xl bg-[#DDEBF6]">
            <FaQuestionCircle />
            <p className="text-[#1B2559] font-[Nunito] text-base font-normal">
              Your information is kept private and secure. It helps us provide
              smarter, more relevant
              <br /> support.
            </p>
          </div>
        </div>
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
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
