import { Lightbulb } from "lucide-react";
import { HeaderOnboarding } from "pages/onboarding-main/components";
import { Footer } from "pages/onboarding-welcome/components";
import { useRef, useState } from "react";
import UploadCloud from "shared/assets/icons/upload-cloud";
import { Link } from "react-router-dom";

export const AboutYourPractice = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

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
  return (
    <div
      className="w-full h-full m-0 p-0 pb-10"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <HeaderOnboarding />
      <main className="flex flex-col items-center flex-1 justify-center w-full gap-[32px] self-stretch">
        <h2 className="font-[Inter] text-[32px] text-center font-medium text-black w-[700px]">
          About your practice
        </h2>
        <div className="w-[700px] bg-white shadow-mdp-[40px] flex flex-col items-start gap-[24px] rounded-[20px]">
          <div className="flex flex-col items-start self-stretch gap-[16px]">
            <p className="font-[Nunito] text-[16px] font-medium mt-[16px] ml-[32px] text-black">
              Which school did you graduate from? *
            </p>
            <select className=" ml-[32px] py-[11px] px-[16px] w-[620px] rounded-[8px] border-[1px] border-[#DFDFDF] flex flex-col self-stretch gap-[10px]">
              <option value="1">Select your practice</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
          <div
            className={`flex py-[16px] ml-[32px] w-[620px] px-[24px] gap-[4px] flex-col items-center justify-center rounded-[12px] border-[1px] border-dashed ${
              dragOver ? "border-[#0057C2]" : "border-[#1C63DB]"
            } bg-white cursor-pointer transition`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
          >
            <input
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
          <div className="flex flex-col items-start self-stretch gap-[16px]">
            <p className="font-[Nunito] text-[16px] font-medium ml-[32px] text-black">
              How many clients have you helped within the past 3 months? *
            </p>
            <select className=" ml-[32px] py-[11px] px-[16px] w-[620px] rounded-[8px] border-[1px] border-[#DFDFDF] flex flex-col self-stretch gap-[10px]">
              <option value="1">Select your practice</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
          <div className="flex flex-col items-start self-stretch gap-[16px]">
            <p className="font-[Nunito] text-[16px] font-medium ml-[32px] text-black">
              How many new clients do you hope to acquire over the next 3
              months? *
            </p>
            <select className=" ml-[32px] py-[11px] px-[16px] w-[620px] rounded-[8px] border-[1px] border-[#DFDFDF] flex flex-col self-stretch gap-[10px]">
              <option value="1">Select your practice</option>
              <option value="2">Option 2</option>
              <option value="3">Option 3</option>
            </select>
          </div>
          <div className="flex flex-col ml-[32px] items-start self-stretch mb-[16px] gap-[16px]">
            <p className="font-[Nunito] text-[16px] font-medium text-black">
              How many new clients do you hope to acquire over the next 3
              months? *
            </p>
            <div className="flex items-center gap-[60px]">
              <div className="flex gap-[16px] items-center">
                <input
                  type="radio"
                  name="radio"
                  id="radio1"
                  className="w-[20px] h-[20px]"
                />
                <label
                  htmlFor="radio1"
                  className="font-[Nunito] text-[16px] font-medium text-black"
                >
                  Yes
                </label>
              </div>
              <div className="flex gap-[16px] items-center">
                <input
                  type="radio"
                  name="radio"
                  id="radio1"
                  className="w-[20px] h-[20px]"
                />
                <label
                  htmlFor="radio1"
                  className="font-[Nunito] text-[16px] font-medium text-black"
                >
                  No
                </label>
              </div>
              <div className="flex gap-[16px] items-center">
                <input
                  type="radio"
                  name="radio"
                  id="radio1"
                  className="w-[20px] h-[20px]"
                />
                <label
                  htmlFor="radio1"
                  className="font-[Nunito] text-[16px] font-medium text-black"
                >
                  Planning to
                </label>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[16px] bg-transparent">
          <button
            className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <Link to="/subscription-plan" className="bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white">
            Next
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};
