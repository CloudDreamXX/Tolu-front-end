import { UploadCloud } from "lucide-react";
import { cn, phoneMask } from "shared/lib";
import { Input, RadioGroup, RadioGroupItem } from "shared/ui";
import { SearchableSelect } from "widgets/OnboardingPractitioner/components/SearchableSelect";
import { timezoneOptions } from "widgets/OnboardingPractitioner/profile-setup";
import { useFilePicker } from "widgets/message-tabs/ui/messages-tab/useFilePicker";
import { ProfileData } from "../helpers";

interface StepGeneralProps {
  data: ProfileData;
  setData: (p: Partial<ProfileData>) => void;
}

export const StepGeneral = ({ data, setData }: StepGeneralProps) => {
  const { items, getDropzoneProps, getInputProps, dragOver } = useFilePicker();
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2.5">
        <label>Full name</label>
        <Input
          placeholder="John Doe"
          value={data.fullName}
          onChange={(e) => setData({ fullName: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label> Alternative name for your practice profile</label>
        <Input
          placeholder="Practice name"
          value={data.practiceName}
          onChange={(e) => setData({ practiceName: e.target.value })}
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
          value={phoneMask(data.phone)}
          onChange={(e) => {
            const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
            setData({ phone: digits });
          }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Email</label>
        <Input
          placeholder="john.doe@example.com"
          type="email"
          value={data.email}
          onChange={(e) => setData({ email: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Age</label>
        <Input
          type="number"
          placeholder="25"
          value={data.age}
          onChange={(e) => setData({ age: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label>Gender</label>
        <RadioGroup className="flex gap-5">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" />
            <label>Male</label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" />
            <label>Female</label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-[8px]">
        <SearchableSelect
          placeholder="Search for Time Zone"
          options={timezoneOptions}
          value={data.timeZone}
          onChange={(value) => setData({ timeZone: value })}
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
