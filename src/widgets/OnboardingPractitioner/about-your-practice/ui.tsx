import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import LightIcon from "shared/assets/icons/light";
import UploadCloud from "shared/assets/icons/upload-cloud";
import { AuthPageWrapper, Input } from "shared/ui";
import { Footer } from "../../Footer";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { SearchableSelect } from "../components/SearchableSelect";
import { cn } from "shared/lib";

export const AboutYourPractice = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const [school, setSchool] = useState("");
  const [recentClients, setRecentClients] = useState("");
  const [targetClients, setTargetClients] = useState("");
  const [labsUsed, setLabsUsed] = useState("");
  const nav = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [schoolDropdownOpen, setSchoolDropdownOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allFilled = () => {
    return (
      selectedSchools.length > 0 &&
      recentClients.length > 0 &&
      targetClients.length > 0 &&
      labsUsed.length > 0 &&
      selectedFiles.length > 0
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = Array.from(files).filter(isValidFile);
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files) {
      const validFiles = Array.from(files).filter(isValidFile);
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const isValidFile = (file: File) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFieldChange = (field: string, value: string) => {
    switch (field) {
      case "school":
        setSchool(value);
        dispatch(updateCoachField({ key: "school", value }));
        break;
      case "recent":
        setRecentClients(value);
        dispatch(updateCoachField({ key: "recent_client_count", value }));
        break;
      case "target":
        setTargetClients(value);
        dispatch(updateCoachField({ key: "target_client_count", value }));
        break;
      case "labs":
        setLabsUsed(value);
        dispatch(updateCoachField({ key: "uses_labs_supplements", value }));
        break;
    }
  };

  const removeFile = (file: File) => {
    setSelectedFiles((prev) => prev.filter((f) => f !== file));
  };

  const schoolOptions = [
    "Functional Medicine Coaching Academy (FMCA)",
    "Functional Nutrition Alliance (FxNA)",
    "Nutritional Therapy Association (NTA)",
    "Nutrition Therapy Institute (NTI)",
    "Health Coach Institute (HCI)",
  ];

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={2} />
      <main className="flex flex-col items-center self-stretch justify-center flex-1 w-full gap-6 mx-auto max-w-[700px]">
        {!isMobile && (
          <h1 className="flex text-center font-inter text-[32px] font-medium text-black">
            About your practice
          </h1>
        )}
        <div className="flex flex-col items-start w-full gap-6 p-4 bg-white shadow-md rounded-3xl sm:p-10">
          {isMobile && (
            <h1 className="flex text-center font-inter text-[24px] font-medium text-black">
              About your practice
            </h1>
          )}
          {/* School */}
          <div className="flex flex-col items-start self-stretch w-full md:w-[620px] relative">
            <label className="peer-focus:text-[#1D1D1F] ${labelStyle} font-[Nunito] text-[16px] font-medium text-[#1D1D1F] mb-2 block">
              Which school did you graduate from? *
            </label>

            <div
              className="peer w-full py-[11px] px-[16px] pr-[40px] rounded-[8px] border border-[#DFDFDF] bg-white outline-none placeholder-[#5F5F65] focus:border-[#1C63DB]"
              onClick={() => setSchoolDropdownOpen((prev) => !prev)}
            >
              <div className="flex flex-wrap gap-[8px]">
                {selectedSchools.length === 0 && (
                  <span className="text-[#9D9D9D]">
                    Select one or more schools
                  </span>
                )}
                {selectedSchools.map((school, idx) => (
                  <span
                    key={idx}
                    className="border border-[#CBCFD8] px-[16px] py-[6px] rounded-[6px] flex items-center gap-2"
                  >
                    {school}
                    <button
                      type="button"
                      className="ml-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSchools(
                          selectedSchools.filter((s) => s !== school)
                        );
                      }}
                    >
                      &times;
                    </button>
                  </span>
                ))}
                <div
                  className={`pointer-events-none absolute right-4 top-[48px] transition-transform duration-300 ${schoolDropdownOpen ? "rotate-180" : ""}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="17"
                    viewBox="0 0 16 17"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M11.7667 6.33422C11.4542 6.0218 10.9477 6.0218 10.6353 6.33422L8.00098 8.96853L5.36666 6.33422C5.05424 6.0218 4.54771 6.0218 4.23529 6.33422C3.92287 6.64664 3.92287 7.15317 4.23529 7.46559L7.43529 10.6656C7.74771 10.978 8.25424 10.978 8.56666 10.6656L11.7667 7.46559C12.0791 7.15317 12.0791 6.64664 11.7667 6.33422Z"
                      fill="#1D1D1F"
                    />
                  </svg>
                </div>
              </div>

              {schoolDropdownOpen && (
                <div className="absolute top-full mt-1 left-0 z-10 w-full max-h-[160px] overflow-y-auto scrollbar-hide border border-[#1C63DB] bg-white rounded-md shadow-md p-[16px] flex flex-col gap-[8px]">
                  {schoolOptions.map((option) => (
                    <div
                      key={option}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!selectedSchools.includes(option)) {
                          const updated = [...selectedSchools, option];
                          setSelectedSchools(updated);
                          dispatch(
                            updateCoachField({ key: "school", value: updated })
                          );
                        }
                      }}
                      className="cursor-pointer hover:bg-[#F3F6FB]"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* File Upload */}
          <div className="flex flex-col items-start w-full gap-2">
            <p className="font-[Nunito] text-[16px] font-medium text-black ">
              Upload a certificate or license *
            </p>
            <div
              className={cn(
                "flex py-[16px] w-full md:w-[620px] px-[24px] gap-[4px] flex-col items-center justify-center rounded-[12px] border-[1px] border-dashed",
                "bg-white cursor-pointer transition",
                dragOver ? "border-[#0057C2]" : "border-[#1C63DB]"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFileSelect}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex gap-[12px] items-center flex-col">
                <div className="flex p-[8px] items-center gap-[10px] rounded-[8px] border-[1px] border-[#F3F6FB] bg-white">
                  <UploadCloud />
                </div>

                <div className="flex flex-col items-center gap-[4px]">
                  <p className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
                    Click to upload
                  </p>
                  <p className="text-[#5F5F65] font-[Nunito] text-[14px] font-normal">
                    or drag and drop
                  </p>
                  <p className="text-[#5F5F65] font-[Nunito] text-[14px] font-normal">
                    PDF, JPG or PNG
                  </p>
                </div>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="flex flex-wrap w-full h-auto gap-4">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="object-cover rounded-lg w-[114px] h-[114px] lg:w-[150px] lg:h-[150px]"
                    />
                    <Trash2
                      className="absolute w-8 h-8 p-1 bg-white rounded-md cursor-pointer top-1 right-1 stroke-error"
                      onClick={() => removeFile(file)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center text-[#1C63DB] gap-2 w-full">
            <LightIcon />
            <p className="font-[Nunito] text-[16px] font-medium">
              Data is securely saved with a HIPAA-compliant notice
            </p>
          </div>
          {/* Recent clients */}
          <div className="flex flex-col items-start self-stretch gap-[16px] ">
            <SearchableSelect
              width="w-full"
              label="How many clients have you helped within the past 3 months? *"
              options={["0-5", "6-15", "16-30", "31-50", "50+"]}
              value={school}
              onChange={(value) => handleFieldChange("recent", value)}
            />
          </div>

          {/* Target clients */}
          <div className="flex flex-col items-start self-stretch gap-[16px]">
            <SearchableSelect
              width="w-full"
              label="How many new clients do you hope to acquire over the next 3
              months? *"
              options={["0-5", "6-15", "16-30", "31-50", "50+"]}
              value={school}
              onChange={(value) => handleFieldChange("target", value)}
            />
          </div>

          {/* Radio - uses labs/supplements */}
          <div className="flex flex-col  items-start self-stretch md:mb-[40px] gap-[16px]">
            <p className="font-[Nunito] text-[16px] font-medium text-black">
              Do you currently use labs or supplementation in your practice? *
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-[60px]">
              {["Yes", "No", "Planning to"].map((option) => (
                <label
                  key={option}
                  className="flex gap-[16px] items-center whitespace-nowrap"
                >
                  <Input
                    type="radio"
                    name="labs"
                    value={option}
                    checked={labsUsed === option}
                    onChange={(e) => handleFieldChange("labs", e.target.value)}
                    className="w-[24px] h-[24px] md:w-[20px] md:h-[20px]"
                  />
                  <span className="font-[Nunito] text-[16px] font-medium text-black">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          className={`flex items-center gap-[8px] md:gap-[16px] w-full md:w-fit pb-10 md:pb-[140px] px-4`}
        >
          <button
            onClick={() => nav(-1)}
            className="flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link
            to={allFilled() ? "/subscription-plan" : ""}
            className={`flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold ${
              allFilled()
                ? "bg-[#1C63DB] text-white"
                : "bg-[#D5DAE2] text-[#5F5F65]"
            }`}
          >
            Next
          </Link>
        </div>
      </main>
    </AuthPageWrapper>
  );
};
