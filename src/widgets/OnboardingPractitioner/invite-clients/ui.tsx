import { useRef, useState } from "react";
import { Download, File } from "lucide-react";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { Footer } from "../../Footer";
import { useNavigate } from "react-router-dom";
import { AuthPageWrapper, Input } from "shared/ui";
// import File from "shared/assets/icons/file";

export const InviteClients = () => {
  const nav = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<string | null>(null);
  const [clientel, setClientel] = useState<string[]>([""]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / 1024).toFixed(0)} KB`);
    }
  };

  const isAllClientsFilled = clientel.every((value) => value.trim() !== "");

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={5} />
      <main className="flex flex-col items-center justify-center w-full gap-[40px] mt-[40px]">
        <h1 className="text-[32px] text-black font-inter font-semibold text-center">
          Invite Clients
        </h1>
        <p className="text-[#5F5F65] text-[16px] font-[Nunito] font-normal text-center">
          Invite your clients to join your coaching platform and start working together
        </p>

        <div className="bg-white rounded-[16px] py-[32px] px-[40px] w-[600px] flex flex-col gap-[24px] items-start shadow-md">

          {/* Import Section */}
          {uploadedFileName ? (
            <div className="w-full max-w-[330px]">
              <p className="text-left font-[Nunito] text-black text-base font-medium mb-[8px]">
                Import PDF
              </p>
              <div className="w-full border border-[#1C63DB] rounded-[8px] px-[16px] py-[12px] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <File stroke="#1C63DB"/>
                  <div className="flex flex-col leading-[1.2]">
                    <p className="text-[14px] font-[Nunito] text-black font-semibold">
                      {uploadedFileName}
                    </p>
                    <p className="text-[12px] font-[Nunito] text-[#5F5F65]">{uploadedFileSize}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUploadedFileName(null);
                    setUploadedFileSize(null);
                  }}
                  className="text-[#1C63DB] text-[20px] font-bold"
                >
                  ×
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full">
              <p className="text-left font-[Nunito] text-black text-base font-medium mb-[8px]">
                Import CSV or PDF
              </p>
              <div
                className="w-full border border-dashed border-[#1C63DB] rounded-[12px] h-[180px] flex flex-col items-center justify-center text-center cursor-pointer"
                onClick={handleUploadClick}
              >
                <div className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
                  Click to upload
                </div>
                <p className="text-[#5F5F65] font-[Nunito] text-[14px] mt-[4px]">
                  or drag and drop
                </p>
                <p className="text-[#5F5F65] font-[Nunito] text-[14px]">
                  CSV or PDF file
                </p>
              </div>
            </div>
          )}

          {/* Hidden File Input */}
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Download Template */}
          <div className="flex gap-2 items-center mt-[4px]">
            <Download size={16} color="#1C63DB" />
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
          <div className="w-full flex flex-col gap-2">
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
              className="mt-4 h-7 w-44 rounded-full text-[#1C63DB] font-[Nunito] flex items-center justify-center text-[14px] font-semibold"
            >
              + Add another
            </button>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-[16px] bg-transparent">
          <button
            className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
            onClick={() => nav(-1)}
          >
            Back
          </button>
          <button
            onClick={() => nav("/onboarding-finish")}
            disabled={!isAllClientsFilled}
            className={`flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold ${
              isAllClientsFilled
                ? "bg-[#1C63DB] text-white"
                : "bg-[#D5DAE2] text-[#5f5f65] cursor-not-allowed"
            }`}
          >
            Next
          </button>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
