import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";
import { UploadCloud } from "lucide-react";
import { cn } from "shared/lib";
import { Input, RadioGroup, RadioGroupItem } from "shared/ui";
import { SearchableSelect } from "widgets/OnboardingPractitioner/components/SearchableSelect";
import { timezoneOptions } from "widgets/OnboardingPractitioner/profile-setup";
import { useFilePicker } from "widgets/message-tabs/ui/messages-tab/useFilePicker";

interface StepGeneralProps {
  data: CoachOnboardingState;
  setDataState: React.Dispatch<React.SetStateAction<CoachOnboardingState>>;
}

export const StepGeneral = ({ data, setDataState }: StepGeneralProps) => {
  const { items, getDropzoneProps, getInputProps, dragOver } = useFilePicker();

  const handleInputChange = (key: keyof CoachOnboardingState, value: any) => {
    setDataState((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <label>Full name</label>
        <Input
          placeholder="John Doe"
          value={data.first_name}
          onChange={(e) => handleInputChange("first_name", e.target.value)}
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
        <label>Phone number</label>
        <Input
          placeholder="(123) 456-7890"
          pattern={"^\\+?[1-9]\\d{1,14}$"}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          // value={data..phone || ''}
          // onChange={(e) => {
          //   const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
          //   handleInputChange("phone", digits);
          // }}
        />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-2.5">
        <label>Email</label>
        <Input
          placeholder="john.doe@example.com"
          type="email"
          // value={data..email || ''}
          // onChange={(e) => handleInputChange("email", e.target.value)}
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
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Gender</label>
        <RadioGroup className="flex gap-5">
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="male"
              checked={data.gender === "male"}
              onChange={() => handleInputChange("gender", "male")}
            />
            <label>Male</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="female"
              checked={data.gender === "female"}
              onChange={() => handleInputChange("gender", "female")}
            />
            <label>Female</label>
          </div>
        </RadioGroup>
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
            <UploadCloud color="#1C63DB" size={32} />
            <p className="text-[#1C63DB] text-[14px] font-[Nunito] font-semibold mt-[8px]">
              Click to upload
            </p>
            <p className="text-[#5F5F65] text-[14px] font-[Nunito]">
              or drag and drop
            </p>
            <p className="text-[#5F5F65] text-[14px] font-[Nunito]">
              JPG or PNG
            </p>
          </div>
        )}
        <input className="hidden" {...getInputProps()} />
      </div>
    </div>
  );
};
