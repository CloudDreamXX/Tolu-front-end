import { Download } from "lucide-react";
import { HeaderOnboarding } from "pages/onboarding-main/components";
import { Footer } from "pages/onboarding-welcome/components";
import { useNavigate } from "react-router-dom";

export const InviteClients = () => {
    const nav = useNavigate();
  return (
    <div
      className="w-full h-full min-h-screen pb-10"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <HeaderOnboarding />
      <main className="flex flex-col items-center justify-center w-full gap-[40px] mt-[40px]">
        <h1 className="text-[32px] text-black font-[Inter] font-semibold text-center">
          Invite Clients
        </h1>
        <p className="text-[#5F5F65] text-[16px] font-[Nunito] font-normal text-center">
          Invite your clients to join your coaching platform and start working
          together
        </p>

        <div className="bg-white rounded-[16px] py-[32px] px-[40px] w-[600px] flex flex-col gap-[24px] items-center shadow-md">
          {/* Upload Box */}
          <p className="text-left font-[Nunito] text-black text-base font-medium">Import CSV</p>
          <div className="w-full border border-dashed border-[#1C63DB] rounded-[12px] h-[180px] flex flex-col items-center justify-center text-center cursor-pointer">
            <div className="text-[#1C63DB] font-[Nunito] text-[14px] font-semibold">
              Click to upload
            </div>
            <p className="text-[#5F5F65] font-[Nunito] text-[14px] mt-[4px]">
              or drag and drop
            </p>
            <p className="text-[#5F5F65] font-[Nunito] text-[14px]">PDF file</p>
          </div>

          {/* Download link */}
          <div className="flex gap-2 items-center">
            <Download size={16} color="#1C63DB"/>
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
          <div className="w-full flex flex-col gap-1">
            <p className="text-left font-[Nunito] text-black text-base font-medium">Manual Invite</p>
            <input
              type="text"
              placeholder="Enter email or phone"
              className="h-[44px] w-full rounded-[8px] border border-[#DFDFDF] px-[16px] font-[Nunito] text-[14px] text-[#5F5F65]"
            />
            <button style={{background: "rgba(0, 143, 246, 0.10)"}} className="mt-4 h-7 w-44 rounded-full text-[#1C63DB] font-[Nunito] flex items-center justify-center text-[14px] font-semibold">
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
          <button onClick={() => nav('/invite-clients')} className="bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white">
            Next
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
