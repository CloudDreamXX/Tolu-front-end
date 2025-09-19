import { Checkbox } from "shared/ui";
import PapersLock from "shared/assets/icons/papers-lock";

type Props = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  handleNext: () => void;
};

export const AffiliatePromoter: React.FC<Props> = ({
  isChecked,
  setIsChecked,
  handleNext,
}) => {
  const includes = [
    "You are a certified health coach, functional nutrition counselor, dietitian, nutritionist, or a licensed health professional with an active license or certificate in good standing.",
    "You agree to provide proof of your credentials before accessing the Tolu Platform.",
  ];

  const roles = [
    "You’ll share Tolu-approved products and tools through your Tolu Profile only.",
    "You agree to promote ethically, honestly, and in alignment with our brand values.",
  ];

  const whatsNotAllowed = [
    "Making false or unverified health claims.",
    "Promoting competing products without permission.",
    "Using spammy or deceptive marketing.",
    "Sharing your affiliate link on ad platforms or coupon sites without approval.",
    "Failing to show your credentials if asked.",
  ];

  const importantTerms = [
    "This is not an employment contract—you’re an independent promoter.",
    "We may change commission terms or end this agreement at any time with notice.",
    "Florida law governs this agreement.",
  ];

  return (
    <div className="flex flex-col xl:w-[900px] h-[80vh] overflow-y-auto items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center w-full h-full md:w-[548px] gap-[24px]">
        <PapersLock />
        <div className="flex flex-col gap-[38px] pb-[40px] items-center justify-center">
          <div className="flex md:w-[460px] flex-col items-center gap-[16px]">
            <h2 className="text-center text-black  text-[24px] md:text-[32px]/[56px] text-wrap font-bold">
              Affiliate & Product Promoter Agreement
            </h2>
            <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
              Welcome to the Tolu Affiliate & Product Promoter Program! By
              clicking “I Agree”, you confirm the following:
            </p>
          </div>
          <div className="flex flex-col gap-[16px]">
            <h3 className="font-bold text-[#1D1D1F] text-[20px]">
              Eligibility
            </h3>
            <ul className="list-disc pl-5">
              {includes.map((item, index) => (
                <li key={index} className="text-[#5F5F65] text-[16px]">
                  - {item}
                </li>
              ))}
            </ul>
            <h3 className="font-bold text-[#1D1D1F] text-[20px]">Your role:</h3>
            <ul className="list-disc pl-5">
              {roles.map((item, index) => (
                <li key={index} className="text-[#5F5F65] text-[16px]">
                  - {item}
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-[#1D1D1F] text-[20px]">
              What’s Not Allowed
            </h3>
            <ul className="list-disc pl-5">
              {whatsNotAllowed.map((item, index) => (
                <li key={index} className="text-[#5F5F65] text-[16px]">
                  - {item}
                </li>
              ))}
            </ul>

            <h3 className="font-bold text-[#1D1D1F] text-[20px]">
              Important Terms
            </h3>
            <ul className="list-disc pl-5">
              {importantTerms.map((item, index) => (
                <li key={index} className="text-[#5F5F65] text-[16px]">
                  - {item}
                </li>
              ))}
            </ul>
            <div className="flex gap-[16px] items-center">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => setIsChecked(!isChecked)}
              />
              <p className="text-[#1D1D1F] text-[20px] font-[500]">
                By clicking “I Agree”, you accept all the terms of the full
                Affiliate & Product Promoter Agreement and confirm that you meet
                the eligibility requirements.
              </p>
            </div>
            <div className="flex flex-col items-center gap-[16px]">
              <p className="text-[#5F5F65] text-[14px]">
                Need support or have questions? Contact us anytime at{" "}
                <a href="mailto:support@tolu.health" className="text-[#1C63DB]">
                  support@tolu.health
                </a>
              </p>
            </div>
          </div>
          <button
            onClick={handleNext}
            className={`flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] ${!isChecked ? "opacity-[50%]" : "cursor-pointer"}`}
            disabled={!isChecked}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};
