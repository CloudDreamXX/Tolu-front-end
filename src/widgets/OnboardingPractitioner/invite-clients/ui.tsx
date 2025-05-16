import { useRef, useState } from "react";
import { Download } from "lucide-react";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { Footer } from "../../Footer";
import { useNavigate } from "react-router-dom";
import { AuthPageWrapper, Input } from "shared/ui";

export const InviteClients = () => {
  const nav = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [clientel, setClientel] = useState<number[]>([1]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  return (
    <AuthPageWrapper>
      <HeaderOnboarding currentStep={5} />
      <main className="flex flex-col items-center justify-center w-full gap-[40px] mt-[40px]">
        <h1 className="text-[32px] text-black font-inter font-semibold text-center">
          Invite Clients
        </h1>
        <p className="text-[#5F5F65] text-[16px] font-[Nunito] font-normal text-center">
          Invite your clients to join your coaching platform and start working
          together
        </p>

        <div className="bg-white rounded-[16px] py-[32px] px-[40px] w-[600px] flex flex-col gap-[24px] items-center shadow-md">
          <p className="text-left font-[Nunito] text-black text-base font-medium">
            Import CSV or PDF
          </p>

          {/* Upload Box */}
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
            {uploadedFileName && (
              <p className="text-[#1C63DB] font-[Nunito] text-[14px] mt-2">
                Uploaded: {uploadedFileName}
              </p>
            )}
          </div>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".csv,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Download Template */}
          <div className="flex gap-2 items-center">
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
            <div className="flex-1 h-[1px] bg-[#DBDEE1]" />
            or
            <div className="flex-1 h-[1px] bg-[#DBDEE1]" />
          </div>

          {/* Manual input */}
          <div className="w-full flex flex-col gap-2">
            <p className="text-left font-[Nunito] text-black text-base font-medium">
              Manual Invite
            </p>
            {clientel.map((client) => (
              <Input
                key={client}
                type="text"
                placeholder="Enter email or phone"
                className="h-[44px] w-full rounded-[8px] border border-[#DFDFDF] px-[16px] font-[Nunito] text-[14px] text-[#5F5F65]"
              />
            ))}
            <button
              onClick={() => setClientel([...clientel, clientel.length + 1])}
              type="button"
              style={{ background: "rgba(0, 143, 246, 0.10)" }}
              className="mt-4 h-7 w-44 rounded-full text-[#1C63DB] font-[Nunito] flex items-center justify-center text-[14px] font-semibold"
            >
              + Add another
            </button>
          </div>
        </div>

        {/* Navigation */}
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
            className="bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white"
          >
            Next
          </button>
        </div>
      </main>
      <Footer />
    </AuthPageWrapper>
  );
};
