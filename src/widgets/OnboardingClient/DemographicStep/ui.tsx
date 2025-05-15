import { AuthPageWrapper, Input } from "shared/ui";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "shared/ui/select";
import { Footer } from "widgets/Footer";
import { HeaderOnboarding } from "widgets/HeaderOnboarding";
import {
  countries,
  education,
  householdType,
  languages,
  occupation,
  raceEthnicity,
} from "./index";

export const DemographicStep = () => {
  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={0} />
      <main className="flex flex-col items-center  justify-center self-stretch">
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
          <div className="w-full max-w-[700px] flex p-[40px] gap-6 flex-col items-start py-[11px] px-[16px] justify-center rounded-3xl bg-white">
            <div className="flex w-full flex-col items-start gap-[10px]">
              <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Age *
              </label>
              <Input
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

            </div>
            <div className="flex w-full items-start gap-6 self-stretch">
              <div className="flex flex-col w-full flex-1 items-start gap-2">
                <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                  Country *
                </label>
                <Select>
                  <SelectTrigger className="">
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
                <Input placeholder="Enter ZIP/Postal Code" />
              </div>
            </div>
            <div className="flex w-full flex-col items-start gap-[10px]">
              <label className="text-[#1D1D1F] font-[Nunito] text-base font-medium">
                Language *
              </label>
              <Select>
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
              <Select>
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
              <Select>
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
              <Select>
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
              <Select>
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
          <div></div>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
