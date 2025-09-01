import { useState, useEffect, Dispatch, SetStateAction } from "react";
import {
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "shared/ui";
import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";
import { PRACTICE_ANSWERS, SCHOOL_OPTIONS } from "../helpers";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

type StepPracticeProps = {
  data: CoachOnboardingState;
  setDataState: React.Dispatch<React.SetStateAction<CoachOnboardingState>>;
  setLicenseFiles: Dispatch<SetStateAction<File[] | null>>;
};

type PreviewItem = { url: string; isPdf: boolean };

export function StepPractice({
  data,
  setDataState,
  setLicenseFiles,
}: StepPracticeProps) {
  const [school, setSchool] = useState(data.school || "");
  const [labsUsed, setLabsUsed] = useState(data.uses_labs_supplements || "No");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);

  useEffect(() => {
    setDataState((prevState) => ({
      ...prevState,
      school,
      uses_labs_supplements: labsUsed,
    }));
  }, [school, labsUsed, setDataState]);

  useEffect(() => {
    const next: PreviewItem[] = selectedFiles.map((file) => {
      const isPdf =
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf");
      const url = isPdf ? "" : URL.createObjectURL(file);
      return { url, isPdf };
    });

    setPreviews(next);

    return () => {
      next.forEach((p) => {
        if (p.url) URL.revokeObjectURL(p.url);
      });
    };
  }, [selectedFiles]);

  useEffect(() => {
    setLicenseFiles(selectedFiles.length ? selectedFiles : null);
  }, [selectedFiles, setLicenseFiles]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeFile = (idx: number) => {
    setSelectedFiles((prev) => {
      const next = prev.filter((_, i) => i !== idx);
      return next;
    });
  };

  const handleInputChange = (key: keyof CoachOnboardingState, value: any) => {
    setDataState((prevState) => ({ ...prevState, [key]: value }));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <label>Which school or institute did you graduate from? *</label>
        <Select value={school} onValueChange={setSchool}>
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

      <div className="flex flex-col gap-2.5">
        <label>Bio</label>
        <Textarea
          placeholder="Bio"
          value={data.bio || ""}
          className="text-base md:text-base xl:text-base"
          containerClassName="rounded-md py-[8px] px-[16px]"
          onChange={(e) => handleInputChange("bio", e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-4">
        <label>Upload a certificate or license *</label>

        {/* File input trigger */}
        <label
          className="flex py-[16px] w-full px-[24px] gap-[4px] flex-col items-center justify-center rounded-[12px] border-[1px] border-dashed border-[#1C63DB] cursor-pointer"
          htmlFor="license-files-input"
        >
          <input
            id="license-files-input"
            className="hidden"
            type="file"
            multiple
            accept="application/pdf,image/png,image/jpeg"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center gap-[8px]">
            <MaterialIcon
              iconName="cloud_upload"
              fill={1}
              className="text-[#1C63DB] p-2 border rounded-xl"
            />
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
        </label>

        {selectedFiles.length > 0 && (
          <div className="flex gap-[16px] flex-wrap justify-start w-full">
            {selectedFiles.map((file, index) => {
              const preview = previews[index];
              return (
                <div
                  key={`${file.name}-${index}`}
                  className="relative w-[150px] h-[150px]"
                >
                  {preview?.isPdf ? (
                    <div className="w-full h-full rounded-md bg-[#F3F4F6] flex items-center justify-center text-sm text-[#374151]">
                      PDF: {file.name}
                    </div>
                  ) : (
                    <img
                      src={preview?.url || ""}
                      alt={`preview-${index}`}
                      className="object-cover w-[150px] h-[150px] rounded-md"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute top-[4px] right-[4px] bg-white p-[4px] rounded-[8px] flex items-center justify-center text-sm"
                  >
                    <MaterialIcon iconName="delete" className="text-red-500" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
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
