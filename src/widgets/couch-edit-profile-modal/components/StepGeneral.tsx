import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";
import { Dispatch, SetStateAction, useEffect } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { useFilePicker } from "shared/hooks/useFilePicker";
import { cn, phoneMask } from "shared/lib";
import { Input } from "shared/ui";
import { LanguagesMultiSelect } from "widgets/LanguagesMultiSelect/ui";
import { languages } from "widgets/OnboardingClient/DemographicStep";
import { SearchableSelect } from "widgets/OnboardingPractitioner/components/SearchableSelect";
import { timezoneOptions } from "widgets/OnboardingPractitioner/profile-setup";

interface StepGeneralProps {
  data: CoachOnboardingState;
  setDataState: React.Dispatch<React.SetStateAction<CoachOnboardingState>>;
  setProfilePhoto: Dispatch<SetStateAction<File | null>>;
}

export const StepGeneral = ({
  data,
  setDataState,
  setProfilePhoto,
}: StepGeneralProps) => {
  const { items, getDropzoneProps, getInputProps, dragOver } = useFilePicker();

  useEffect(() => {
    if (items[0]?.file) {
      setProfilePhoto(items[0].file);
    }
  }, [items, setProfilePhoto]);

  const handleInputChange = (key: keyof CoachOnboardingState, value: any) => {
    setDataState((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <label>Full name</label>
        <Input
          placeholder="John Doe"
          value={data.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Alternative name for your practice profile</label>
        <Input
          placeholder="Practice name"
          value={data.alternate_name || ""}
          onChange={(e) => handleInputChange("alternate_name", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Language</label>
        <LanguagesMultiSelect
          options={languages}
          value={data.languages || []}
          onChange={(next) => handleInputChange("languages", next)}
          name="languages"
          placeholder="Select languages"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Phone number</label>
        <Input
          placeholder="(123) 456-7890"
          // pattern={"^\\+?[1-9]\\d{1,14}$"}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={data.phone ? phoneMask(data.phone) : ""}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 11);
            handleInputChange("phone", digits);
          }}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2.5">
        <label>Email</label>
        <Input
          placeholder="john.doe@example.com"
          type="email"
          value={data.email || ""}
          onChange={(e) => handleInputChange("email", e.target.value)}
        />
      </div>

      {/* Age */}
      <div className="flex flex-col gap-2.5">
        <label>Age</label>
        <Input
          type="number"
          placeholder="25"
          value={data.age || ""}
          onChange={(e) => handleInputChange("age", e.target.value)}
          readOnly
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Gender</label>
        <div className="flex gap-5">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={data.gender === "male"}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            />
            <span>Male</span>
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={data.gender === "female"}
              onChange={(e) => handleInputChange("gender", e.target.value)}
            />
            <span>Female</span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-[8px]">
        <SearchableSelect
          placeholder="Search for Time Zone"
          options={timezoneOptions}
          value={data.timezone || ""}
          onChange={(value) => handleInputChange("timezone", value)}
          label={"Time zone "}
        />
      </div>

      <div className="flex flex-col gap-[8px]">
        <label>Change Profile Picture</label>

        {items[0] ? (
          <img
            src={items[0].previewUrl}
            alt="Profile preview"
            className="w-[150px] h-[150px] rounded-[12px] object-cover"
          />
        ) : (
          <div
            className={cn(
              "w-full md:w-[430px] border-[2px] border-dashed border-[#1C63DB] rounded-[12px] h-[180px] flex flex-col justify-center items-center text-center px-[20px] cursor-pointer transition-colors ",
              { "bg-blue-50 border-blue-400": dragOver }
            )}
            {...getDropzoneProps()}
          >
            <MaterialIcon
              iconName="cloud_upload"
              fill={1}
              className="text-[#1C63DB] p-2 border rounded-xl"
            />
            <p className="text-[#1C63DB] text-[14px]  font-semibold mt-[8px]">
              Click to upload
            </p>
            <p className="text-[#5F5F65] text-[14px] ">or drag and drop</p>
            <p className="text-[#5F5F65] text-[14px] ">JPG or PNG</p>

            <input className="hidden" {...getInputProps()} />
          </div>
        )}
      </div>
    </div>
  );
};
