import { RootState } from "entities/store";
import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { UploadCloud } from "lucide-react";
import { DragEvent, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper, Input } from "shared/ui";
import { Switch } from "shared/ui/switch";
import { Footer } from "../../Footer";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { SearchableSelect } from "../components/SearchableSelect";
import { timezoneOptions } from "./mock";

export const ProfileSetup = () => {
  const dispatch = useDispatch();
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const nav = useNavigate();
  const ref = useRef<HTMLInputElement>(null);
  const state = useSelector((state: RootState) => state.coachOnboarding);
  const { isMobile } = usePageWidth();

  const handleFile = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    ref.current?.click();
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const isFormValid =
    !!state.first_name?.trim() &&
    !!state.last_name?.trim() &&
    !!state.age &&
    !!state.gender &&
    !!state.timezone &&
    !!state.security_questions &&
    !!state.security_answers?.trim();

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={4} />
      <main className="mx-auto flex flex-col gap-[32px] items-center justify-center lg:px-0 w-full lg:w-[859px] md:px-[24px]">
        {!isMobile && (
          <h1 className="flex text-center font-inter text-[32px] font-medium text-black">
            Profile Setup
          </h1>
        )}
        <form className="flex flex-col w-full lg:w-[700px] md:max-h-[700px] overflow-y-auto py-[24px] px-[16px] md:py-[40px] md:px-[40px] bg-white rounded-t-[20px] md:rounded-[20px] shadow-md gap-[24px]">
          {isMobile && (
            <h1 className="flex text-center items-center justify-center font-inter text-[24px] font-medium text-black">
              Profile Setup
            </h1>
          )}
          {/* First and Last Name */}
          <div className="flex flex-col flex-1 gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">
              First name
            </label>
            <Input
              type="text"
              placeholder="Enter First Name"
              onChange={(e) =>
                dispatch(
                  updateCoachField({ key: "first_name", value: e.target.value })
                )
              }
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>
          <div className="flex flex-col flex-1 gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">
              Alternative name for your practice profile
            </label>
            <Input
              type="text"
              placeholder="Enter Alternative Name"
              onChange={(e) =>
                dispatch(
                  updateCoachField({ key: "last_name", value: e.target.value })
                )
              }
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>

          {/* Age */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">
              Age
            </label>
            <Input
              min={0}
              max={120}
              type="number"
              placeholder="Enter Age"
              onChange={(e) =>
                dispatch(
                  updateCoachField({ key: "age", value: e.target.value })
                )
              }
              className="border rounded-[8px] h-[44px] px-[12px] text-[16px]"
            />
          </div>
          {/* Gender */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">
              Gender
            </label>
            <div className="flex gap-[40px]">
              {["men", "women"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center gap-[8px] text-[16px] text-black font-[Nunito]"
                >
                  <input
                    type="radio"
                    name="gender"
                    onChange={() =>
                      dispatch(
                        updateCoachField({ key: "gender", value: gender })
                      )
                    }
                    className="w-[20px] h-[20px]"
                  />
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <SearchableSelect
              label="Time zone"
              labelStyle="text-[#5F5F65]"
              placeholder="Search for Time Zone"
              options={timezoneOptions}
              value={state.timezone}
              onChange={(value) =>
                dispatch(updateCoachField({ key: "timezone", value: value }))
              }
            />
          </div>

          {/* Upload Profile Picture */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">
              Change Profile Picture
            </label>
            {filePreview ? (
              <img
                src={filePreview}
                className="w-[150px] h-[150px] rounded-[12px] object-cover"
              />
            ) : (
              <div
                className={`w-full md:w-[430px] border-[2px] border-dashed border-[#1C63DB] rounded-[12px] h-[180px] flex flex-col justify-center items-center text-center px-[20px] cursor-pointer transition-colors ${
                  dragActive ? "bg-blue-50 border-blue-400" : ""
                }`}
                onClick={handleClick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <UploadCloud color="#1C63DB" size={32} />
                <p className="text-[#1C63DB] text-[14px] font-[Nunito] font-semibold mt-[8px]">
                  Click to upload
                </p>
                <p className="text-[#5F5F65] text-[14px] font-[Nunito]">
                  or drag and drop
                </p>
                <p className="text-[#5F5F65] text-[14px] font-[Nunito]">
                  JPG or PNG
                </p>
              </div>
            )}
            <input
              ref={ref}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Two-Factor Auth */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">
              Two-factor authentication
            </label>
            <label className="flex items-center gap-[8px] text-[16px] font-[Nunito] text-black">
              <Switch
                className="data-[state=checked]:bg-[#1C63DB]"
                checked={state.two_factor_enabled}
                onCheckedChange={(value: boolean) =>
                  dispatch(
                    updateCoachField({
                      key: "two_factor_enabled",
                      value: value,
                    })
                  )
                }
              />
              Enable two-factor authentication
            </label>
          </div>

          {/* Choose Method */}
          <div className="flex flex-col gap-[8px]">
            <label className="text-[#5F5F65] text-[16px] font-[Nunito] font-medium">
              Choose method:
            </label>
            <div className="flex flex-col md:flex-row gap-[24px]">
              {["SMS", "Authenticator App", "Email"].map((method) => (
                <label key={method} className="flex items-center gap-[8px]">
                  <input
                    type="radio"
                    name="2fa"
                    className="w-[16px] h-[16px]"
                    onChange={() =>
                      dispatch(
                        updateCoachField({
                          key: "two_factor_method",
                          value: method,
                        })
                      )
                    }
                  />
                  {method}
                </label>
              ))}
            </div>
          </div>

          {/* Recovery Question */}
          <div className="flex flex-col md:flex-row items-center gap-[12px]">
            <SearchableSelect
              label="Set recovery question"
              labelStyle="text-[#5F5F65]"
              placeholder="Select recovery question"
              options={[
                "What was the name of your first pet?",
                "What is your mother's maiden name?",
                "What is your favorite book?",
                "In what city were you born?",
              ]}
              value={state.security_questions}
              onChange={(value) =>
                dispatch(
                  updateCoachField({
                    key: "security_questions",
                    value: value,
                  })
                )
              }
              position={!isMobile ? "top" : "bottom"}
              dropdownStyle="text-nowrap"
            />
            <div className="flex flex-col gap-[8px] w-[100%]">
              <label className="fontcl text-[#5F5F65] text-[16px] font-[Nunito] font-medium">
                Answer the questions for recovery
              </label>
              <Input
                type="text"
                className="flex-1 border rounded-[8px] min-h-[48px] px-[12px] py-[16px] text-[16px]"
                placeholder="Enter your answer"
                onChange={(e) =>
                  dispatch(
                    updateCoachField({
                      key: "security_answers",
                      value: e.target.value,
                    })
                  )
                }
              />
            </div>
          </div>
          {isMobile && (
            <div className="flex items-center gap-[16px] w-full md:w-fit">
              <button
                type="button"
                onClick={() => nav(-1)}
                className="flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
                style={{ background: "rgba(0, 143, 246, 0.10)" }}
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => nav("/invite-clients")}
                disabled={!isFormValid}
                className={`flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold ${
                  isFormValid
                    ? "bg-[#1C63DB] text-white"
                    : "bg-[#D5DAE2] text-[#5f5f65] cursor-not-allowed"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </form>

        {/* Navigation buttons */}
        {!isMobile && (
          <div className="flex items-center gap-[16px] pb-10 md:pb-[100px] w-full md:w-fit">
            <button
              onClick={() => nav(-1)}
              className="flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold text-[#1C63DB]"
              style={{ background: "rgba(0, 143, 246, 0.10)" }}
            >
              Back
            </button>
            <button
              onClick={() => nav("/invite-clients")}
              disabled={!isFormValid}
              className={`flex w-full md:w-[250px] md:h-[44px] p-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px] font-[Nunito] font-semibold ${
                isFormValid
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#D5DAE2] text-[#5f5f65] cursor-not-allowed"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </AuthPageWrapper>
  );
};
