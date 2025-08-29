import { useEffect, useRef, useState } from "react";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { Footer } from "../../Footer";
import { useNavigate } from "react-router-dom";
import { AuthPageWrapper, Input } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { CoachService } from "entities/coach";
import { toast } from "shared/lib";

export const InviteClients = () => {
  const nav = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [clientel, setClientel] = useState<string[]>([""]);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState<boolean>(
    window.innerWidth >= 768 && window.innerWidth < 1024
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    const handleTabletResize = () =>
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);

    window.addEventListener("resize", handleResize);
    window.addEventListener("resize", handleTabletResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("resize", handleTabletResize);
    };
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFile = (file: File) => {
    if (file) {
      setSelectedFile(file);
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file!);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleNextStep = async () => {
    if (selectedFile) {
      try {
        await CoachService.inviteClient(null, selectedFile);
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Failed to upload file",
          variant: "destructive",
        });
      }
    }
    nav("/onboarding-finish");
  };

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={4} />
      <main className="mx-auto flex flex-col gap-[32px] items-center justify-center lg:px-0 w-full lg:w-[859px] md:px-[24px]">
        {!isMobile && (
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-[32px] text-black font-inter font-semibold text-center">
              Invite Clients
            </h1>
            <p className="text-[#5F5F65] text-[20px] !font-[Inter] font-normal text-center">
              Invite your clients to join your coaching platform and start
              working together
            </p>
          </div>
        )}
        <div className="flex flex-col w-full lg:w-[700px] md:max-h-[700px] overflow-y-auto py-[24px] px-[16px] lg:py-[40px] lg:px-[40px] bg-white rounded-t-[20px] md:rounded-[20px] shadow-md gap-[24px]">
          {isMobile && (
            <div className="flex flex-col items-center gap-4">
              <h1 className="text-[24px] text-black font-inter font-semibold text-center">
                Invite Clients
              </h1>
              <p className="text-[#5F5F65] text-[16px] !font-[Inter] font-normal text-center">
                Invite your clients to join your coaching platform and start
                working together
              </p>
            </div>
          )}
          {/* File Preview */}
          {uploadedFileName ? (
            <div className="w-full max-w-[330px]">
              <p className="text-left font-[Nunito] text-black text-base font-medium mb-[8px]">
                Import PDF
              </p>
              <div className="w-full relative border border-[#1C63DB] rounded-[8px] px-[16px] py-[12px] flex items-center gap-3">
                <MaterialIcon iconName="docs" fill={1} />
                <div className="flex flex-col leading-[1.2]">
                  <p className="text-[14px] font-[Nunito] text-black font-semibold">
                    {uploadedFileName}
                  </p>
                  <p className="text-[12px] font-[Nunito] text-[#5F5F65]">
                    {uploadedFileSize}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setUploadedFileName(null);
                    setUploadedFileSize(null);
                  }}
                  className="absolute top-[6px] right-[6px]"
                >
                  <MaterialIcon iconName="close" size={16} />
                </button>
              </div>
            </div>
          ) : (
            // Drop Zone
            <div className="w-full">
              <p className="text-left font-[Nunito] text-black text-base font-medium mb-[8px]">
                Import CSV or PDF
              </p>
              <div
                className={`w-full border ${
                  dragOver
                    ? "border-[#0057C2]"
                    : "border-dashed border-[#1C63DB]"
                } rounded-[12px] h-[180px] flex flex-col items-center justify-center text-center cursor-pointer`}
                onClick={handleUploadClick}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="flex p-2 items-center justify-center bg-white border rounded-[8px] border-[#F3F6FB]">
                  <MaterialIcon
                    iconName="cloud_upload"
                    fill={1}
                    className="text-[#1C63DB] p-2 border rounded-xl"
                  />
                </div>
                <div className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
                  Click {isMobile || isTablet ? "" : "or drag"} to upload
                </div>
                <p className="text-[#5F5F65] font-[Nunito] text-[14px] mt-[4px]">
                  CSV or PDF file
                </p>
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Template Link */}
          <div className="flex gap-2 items-center mt-[4px]">
            <MaterialIcon iconName="download" />
            <a
              href="/template.pdf"
              className="text-[#1C63DB] font-[Nunito] text-base font-medium underline"
              download
            >
              Download a PDF template
            </a>
          </div>

          {/* Divider */}
          <div className="w-full flex items-center gap-[8px] text-[#C0C0C0] text-[14px]">
            <div className="flex-1 h-[1px] bg-[#8EBEFF]" />
            <span className="text-[#8EBEFF]">or</span>
            <div className="flex-1 h-[1px] bg-[#8EBEFF]" />
          </div>

          {/* Manual Invite */}
          <div className="flex flex-col w-full gap-2">
            <p className="text-left font-[Nunito] text-black text-base font-medium">
              Manual Invite
            </p>
            {clientel.map((value, index) => (
              <Input
                key={index}
                type="text"
                placeholder="Enter email or phone"
                value={value}
                onChange={(e) => {
                  const updated = [...clientel];
                  updated[index] = e.target.value;
                  setClientel(updated);
                }}
                className="h-[44px] w-full rounded-[8px] border border-[#DFDFDF] px-[16px] font-[Nunito] text-[14px] text-[#5F5F65]"
              />
            ))}
            <button
              onClick={() => setClientel([...clientel, ""])}
              type="button"
              style={{ background: "rgba(0, 143, 246, 0.10)" }}
              className="mt-4 h-11 md:h-7 w-44 rounded-full text-[#1C63DB] font-[Nunito] flex items-center justify-center text-[14px] font-semibold"
            >
              + Add another
            </button>
          </div>
          {isMobile && (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-[8px] bg-transparent w-full">
                <button
                  className="flex w-full p-[16px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
                  style={{ background: "rgba(0, 143, 246, 0.10)" }}
                  onClick={() => nav(-1)}
                >
                  <MaterialIcon iconName="keyboard_arrow_left" />
                  Back
                </button>
                <button
                  onClick={handleNextStep}
                  className={`flex w-full p-[16px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold bg-[#1C63DB] text-white`}
                >
                  Next
                </button>
              </div>
              <button
                className="flex items-center justify-center py-1 px-8 self-stretch rounded-full text-[#1C63DB] font-[Nunito] text-[16px] font-semibold"
                onClick={() => nav("/onboarding-finish")}
              >
                Skip this step
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        {!isMobile && (
          <div className="flex flex-col items-center gap-4 pb-10 md:pb-[140px]">
            <div className="flex items-center gap-[16px] bg-transparent">
              <button
                className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
                style={{ background: "rgba(0, 143, 246, 0.10)" }}
                onClick={() => nav(-1)}
              >
                <MaterialIcon iconName="keyboard_arrow_left" />
                Back
              </button>
              <button
                onClick={handleNextStep}
                className={`flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold bg-[#1C63DB] text-white`}
              >
                Next
              </button>
            </div>
            <button
              className="flex items-center justify-center py-1 px-8 self-stretch rounded-full text-[#1C63DB] font-[Nunito] text-[16px] font-semibold"
              onClick={() => nav("/onboarding-finish")}
            >
              Skip this step
            </button>
          </div>
        )}
      </main>
    </AuthPageWrapper>
  );
};
