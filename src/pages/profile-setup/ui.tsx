import { HeaderOnboarding } from "pages/onboarding-main/components";
import { Footer } from "pages/onboarding-welcome/components";
import { UploadCloud } from "lucide-react";
import { useState } from "react";

export const ProfileSetup = () => {
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="w-full h-full min-h-screen pb-10"
      style={{
        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.10) 100%), radial-gradient(107.14% 107.09% at 50.55% 99.73%, rgba(248, 251, 255, 0.81) 0%, rgba(222, 236, 255, 0.90) 68.27%, rgba(247, 230, 255, 0.90) 100%), #FFF`,
      }}
    >
      <HeaderOnboarding />

      <main className="mx-auto flex flex-col gap-[32px] items-center justify-center w-[859px]">
        <h1 className="text-black text-[32px] font-[Inter] font-medium text-center">
          Profile Setup
        </h1>

        <form className="flex flex-col w-[700px] max-h-[700px] overflow-y-auto py-[40px] px-[40px] bg-white rounded-[20px] shadow-md gap-[24px]">
          {/* First and Last Name */}
          <div className="flex gap-[20px]">
            <div className="flex flex-col flex-1 gap-[8px]">
              <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">First name</label>
              <input className="border rounded-[8px] h-[44px] px-[12px] text-[16px]" type="text" placeholder="Sophia" />
            </div>
            <div className="flex flex-col flex-1 gap-[8px]">
              <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">Last name</label>
              <input className="border rounded-[8px] h-[44px] px-[12px] text-[16px]" type="text" placeholder="Turner" />
            </div>
          </div>

          {/* Age */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">Age</label>
            <input className="border rounded-[8px] h-[44px] px-[12px] text-[16px]" type="number" placeholder="Enter Age" />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">Gender:</label>
            <div className="flex gap-[40px]">
              <label className="flex items-center gap-[8px] text-[16px] text-black font-[Nunito]">
                <input type="radio" name="gender" className="w-[20px] h-[20px]" />
                Men
              </label>
              <label className="flex items-center gap-[8px] text-[16px] text-black font-[Nunito]">
                <input type="radio" name="gender" className="w-[20px] h-[20px]" defaultChecked />
                Women
              </label>
            </div>
          </div>

          {/* Time zone */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">Time zone</label>
            <select className="border rounded-[8px] h-[44px] px-[12px] text-[16px] text-[#5F5F65]">
              <option>(GMT-08:00) Pacific Time (US & Canada)</option>
              <option>(GMT+00:00) UTC</option>
            </select>
          </div>

          {/* Upload Profile Picture */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">Change Profile Picture</label>
            {filePreview ? (
              <img src={filePreview} className="w-[150px] h-[150px] rounded-[12px] object-cover" />
            ) : (
              <div
                className="w-full border-[2px] border-dashed border-[#1C63DB] rounded-[12px] h-[180px] flex flex-col justify-center items-center text-center px-[20px] cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <UploadCloud color="#1C63DB" size={32} />
                <p className="text-[#1C63DB] text-[14px] font-[Nunito] font-semibold mt-[8px]">
                  Click to upload
                </p>
                <p className="text-[#5F5F65] text-[14px] font-[Nunito]">or drag and drop</p>
                <p className="text-[#5F5F65] text-[14px] font-[Nunito]">PDF, JPG or PNG</p>
              </div>
            )}
            <input id="file-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">Two-factor authentication</label>
            <label className="flex items-center gap-[8px] text-[16px] font-[Nunito] text-black">
              <input type="checkbox" />
              Enable two-factor authentication
            </label>
          </div>

          {/* Choose Method */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">Choose method:</label>
            <div className="flex gap-[24px]">
              <label className="flex items-center gap-[8px]">
                <input type="radio" name="2fa" className="w-[16px] h-[16px]" />
                SMS
              </label>
              <label className="flex items-center gap-[8px]">
                <input type="radio" name="2fa" className="w-[16px] h-[16px]" />
                Authenticator App
              </label>
              <label className="flex items-center gap-[8px]">
                <input type="radio" name="2fa" className="w-[16px] h-[16px]" />
                Email
              </label>
            </div>
          </div>

          {/* Recovery Question */}
          <div className="flex gap-[12px]">
            <select className="flex-1 border rounded-[8px] h-[44px] px-[12px] text-[16px] text-[#5F5F65]">
              <option>Select recovery question</option>
              <option>What is your favorite book?</option>
              <option>Mother's maiden name?</option>
            </select>
            <input
              type="text"
              className="flex-1 border rounded-[8px] h-[44px] px-[12px] text-[16px]"
              placeholder="Enter your answer"
            />
          </div>
        </form>

        {/* Navigation buttons */}
        <div className="flex items-center gap-[16px] bg-transparent">
          <button
            className="flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </button>
          <button className="bg-[#1C63DB] flex w-[250px] h-[44px] py-[4px] px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-white">
            Next
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};
