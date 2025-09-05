import { Checkbox } from "shared/ui";
import Handshake from "shared/assets/icons/handshake";

type Props = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  handleNext: () => void;
};

export const DataProtection: React.FC<Props> = ({
  isChecked,
  setIsChecked,
  handleNext,
}) => {
  const includes = [
    "Access data only inside the Tolu platform.",
    "Don’t save or share user data elsewhere.",
    "No texting, emailing, or calling clients outside the app.",
    "Use secure devices and internet connections.",
    "Report any suspected breach within 24 hours.",
  ];

  return (
    <div className="flex flex-col xl:w-[900px] h-[80vh] overflow-y-auto items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center w-full h-full md:w-[548px] gap-[24px]">
        <div>
          <Handshake />
        </div>
        <div className="flex flex-col gap-[38px] pb-[40px] items-center justify-center">
          <div className="flex md:w-[460px] flex-col items-center gap-[16px]">
            <h2 className="text-center text-black  text-[24px] md:text-[40px]/[56px] text-wrap font-bold">
              Data Protection Overview
            </h2>
            <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
              Protecting Client Privacy Matters
            </p>
            <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
              As a Health Educator Admin, you may access sensitive health
              information. To protect Tolu users—and yourself—you must follow
              strict privacy rules and handle data responsibly, just like any
              licensed healthcare provider would.
            </p>
          </div>
          <div className="flex flex-col gap-[16px]">
            <h3 className="text-[#5F5F65] text-[18px] font-bold">
              Key Data Protection Rules:
            </h3>
            {includes && (
              <ul className="list-disc pl-5">
                {includes.map((item, index) => (
                  <li key={index} className="text-[#5F5F65] text-[16px]">
                    - {item}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex gap-[16px] items-center">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => setIsChecked(!isChecked)}
              />
              <p className="text-[#1D1D1F] text-[20px] font-[500]">
                I have read and agree to the Confidentiality & Data Protection
                Addendum.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-[16px]">
            <p className="text-[#5F5F65] text-[14px]">
              Need support or have questions? Contact us anytime at{" "}
              <a href="mailto:support@tolu.health" className="text-[#1C63DB]">
                support@tolu.health
              </a>
            </p>
          </div>
          <button
            onClick={handleNext}
            className={`flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] ${!isChecked ? "opacity-[50%]" : "cursor-pointer"}`}
            disabled={!isChecked}
          >
            Agree & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
