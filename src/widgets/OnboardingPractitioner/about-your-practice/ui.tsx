import { HeaderOnboarding } from "../../HeaderOnboarding";
import { Footer } from "../../Footer";
import { useRef, useState } from "react";
import UploadCloud from "shared/assets/icons/upload-cloud";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { AuthPageWrapper, Input } from "shared/ui";
import LightIcon from "shared/assets/icons/light";
import { SearchableSelect } from "../components/SearchableSelect";

export const AboutYourPractice = () => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [school, setSchool] = useState("");
  const [recentClients, setRecentClients] = useState("");
  const [targetClients, setTargetClients] = useState("");
  const [labsUsed, setLabsUsed] = useState("");
  const nav = useNavigate();

  const allFilled = () => {
    return (
      school.length > 0 &&
      recentClients.length > 0 &&
      targetClients.length > 0 &&
      labsUsed.length > 0 &&
      selectedFile !== null
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
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

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={2} />
      <main className="flex flex-col items-center flex-1 justify-center w-full gap-[32px] self-stretch">
        <h2 className="font-inter text-[32px] text-center font-medium text-black w-[700px]">
          About your practice
        </h2>
        <div className="w-[700px] bg-white shadow-mdp-[40px] flex flex-col items-start gap-[24px] rounded-[20px]">
          {/* School */}
          <div className="flex flex-col items-start self-stretch gap-[16px] mt-[40px] ml-[32px]">
            <SearchableSelect
              label="Which school did you graduate from? *"
              options={[
                "Functional Medicine Coaching Academy (FMCA)",
                "Functional Nutrition Alliance (FxNA)",
                "Nutritional Therapy Association (NTA)",
                "Nutrition Therapy Institute (NTI)",
                "Health Coach Institute (HCI)",
              ]}
              value={school}
              onChange={(value) => handleFieldChange("school", value)}
            />
            <p className="font-[Nunito] text-[16px] font-medium text-black ml-[40px]">
              Upload a certificate or license *
            </p>
          </div>

          {/* File Upload */}
          <div
            className={`flex py-[16px] ml-[32px] w-[620px] px-[24px] gap-[4px] flex-col items-center justify-center rounded-[12px] border-[1px] border-dashed ${
              dragOver ? "border-[#0057C2]" : "border-[#1C63DB]"
            } bg-white cursor-pointer transition`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
          >
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="flex gap-[12px] items-center flex-col">
              <div className="flex p-[8px] items-center gap-[10px] rounded-[8px] border-[1px] border-[#F3F6FB] bg-white">
                <UploadCloud />
              </div>
              <div className="flex flex-col items-center gap-[4px]">
                <p className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
                  {selectedFile ? selectedFile.name : "Click to upload"}
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
          <div className="flex ml-[40px]">
            <LightIcon />
            <p className="font-[Nunito] text-[16px] font-medium ml-[8px] text-[#1C63DB]">
              Data is securely saved with a HIPAA-compliant notice
            </p>
          </div>
          {/* Recent clients */}
          <div className="flex flex-col items-start self-stretch gap-[16px] ml-[32px]">
            <SearchableSelect
              label="How many clients have you helped within the past 3 months? *"
              options={["0-5", "6-15", "16-30", "31-50", "50+"]}
              value={school}
              onChange={(value) => handleFieldChange("recent", value)}
            />
          </div>

          {/* Target clients */}
          <div className="flex flex-col items-start self-stretch gap-[16px] ml-[32px]">
            <SearchableSelect
              label="How many new clients do you hope to acquire over the next 3
              months? *"
              options={["0-5", "6-15", "16-30", "31-50", "50+"]}
              value={school}
              onChange={(value) => handleFieldChange("target", value)}
            />
          </div>

          {/* Radio - uses labs/supplements */}
          <div className="flex flex-col ml-[32px] items-start self-stretch mb-[16px] gap-[16px]">
            <p className="font-[Nunito] text-[16px] font-medium text-black">
              Do you currently use labs or supplementation in your practice? *
            </p>
            <div className="flex items-center gap-[60px]">
              {["yes", "no", "planning to"].map((option) => (
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
                    className="w-[20px] h-[20px]"
                  />
                  <span className="font-[Nunito] text-[16px] font-medium text-black capitalize">
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-[16px] bg-transparent">
          <button
            onClick={() => nav(-1)}
            className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link
            to={allFilled() === true ? "/subscription-plan" : ""}
            className={
              allFilled() === true
                ? "bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
                : "flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px] font-[Nunito] font-semibold text-[#5F5F65]"
            }
          >
            Next
          </Link>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
