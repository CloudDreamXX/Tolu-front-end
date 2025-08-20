import { TrashIcon, UploadCloud } from "lucide-react";
import { useState } from "react";
import LightIcon from "shared/assets/icons/light";
import { cn } from "shared/lib";
import {
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import { useFilePicker } from "widgets/message-tabs/ui/messages-tab/useFilePicker";
import { PRACTICE_ANSWERS, SCHOOL_OPTIONS } from "../helpers";

export function StepPractice() {
  const { items, remove, getDropzoneProps, getInputProps, dragOver } =
    useFilePicker();
  const [school, setSchool] = useState("");
  const [labsUsed, setLabsUsed] = useState("No");
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <label>Which school or institute did you graduate from? *</label>
        <Select value={school} onValueChange={(v) => setSchool(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a school" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {SCHOOL_OPTIONS.map((q) => (
              <SelectItem key={q} value={q}>
                {q}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        <label>Upload a certificate or license *</label>

        <button
          className={cn(
            "flex py-[16px] w-full px-[24px] gap-[4px] flex-col items-center justify-center rounded-[12px] border-[1px] border-dashed",
            "bg-white cursor-pointer transition",
            dragOver ? "border-[#0057C2]" : "border-[#1C63DB]"
          )}
          {...getDropzoneProps()}
        >
          <input className="hidden" {...getInputProps()} />
          <div className="flex flex-col items-center gap-[8px]">
            <UploadCloud />
            <p className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
              Click to upload
            </p>
            <p className="text-[#5F5F65] font-[Nunito] text-[14px]">
              or drag and drop
            </p>
            <p className="text-[#5F5F65] font-[Nunito] text-[14px]">
              PDF, JPG or PNG
            </p>
          </div>
        </button>

        {/* File previews */}
        {items.length > 0 && (
          <div className="flex gap-[16px] flex-wrap justify-start w-full">
            {items.map((file, index) => {
              return (
                <div key={index} className="relative w-[150px] h-[150px]">
                  <img
                    src={file.isPdf ? "" : file.previewUrl}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => remove(file.id)}
                    className="absolute top-[4px] right-[4px] bg-white p-[4px] rounded-[8px] flex items-center justify-center text-sm"
                  >
                    <TrashIcon className="text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex w-full text-[#1C63DB] gap-2 items-center">
          <LightIcon />
          <p className="font-[Nunito] text-[16px] font-medium ">
            Data is securely saved with a HIPAA-compliant notice
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <label>
          Do you currently use labs or supplementation in your practice? *
        </label>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[60px]">
          <RadioGroup
            className="flex flex-wrap gap-10"
            value={labsUsed}
            onValueChange={setLabsUsed}
          >
            {PRACTICE_ANSWERS.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <RadioGroupItem value={option} />
                <span>{option}</span>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
