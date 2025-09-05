import { Link } from "react-router-dom";
import { Checkbox } from "shared/ui";

type Props = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  handleNext: () => void;
};

export const PrivacyPolicy: React.FC<Props> = ({
  isChecked,
  setIsChecked,
  handleNext,
}) => {
  const includes = [
    "Your account is secure: We use encryption and role-based access to protect your data.",
    "HIPAA-compliant: We safeguard any client health information you access or manage on the platform.",
    "Your content is yours: You control what you publish and share. Your storefront activity and commissions are private.",
    "No third-party sharing without consent: We never sell or share your data unless required by law.",
    "You’re in control: You can update or delete your information and request support anytime.",
  ];

  return (
    <div className="flex flex-col xl:w-[900px] items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center shrink-0 w-full md:w-[548px] md:h-[269px] lg:h-auto gap-[24px]">
        <div className="flex flex-col gap-[38px] items-center justify-center">
          <div className="flex md:w-[460px] flex-col items-center gap-[16px]">
            <h2 className="text-center text-black  text-[24px] md:text-[40px]/[56px] text-wrap font-bold">
              Privacy policy
            </h2>
            <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
              Welcome to Tolu! As an Educator, your privacy and that of your
              clients are our top priority. Here’s how we protect your
              information:
            </p>
          </div>
          <div className="flex flex-col gap-[16px]">
            {includes && (
              <ul className="list-disc pl-5">
                {includes.map((item, index) => (
                  <li key={index} className="text-[#5F5F65] text-[16px]">
                    - {item}
                  </li>
                ))}
              </ul>
            )}
            <div className="flex flex-col items-center gap-[16px]">
              <p className="text-[#5F5F65] text-[14px]">
                Need support or have questions? Contact us anytime at{" "}
                <a href="mailto:support@tolu.health" className="text-[#1C63DB]">
                  support@tolu.health
                </a>
              </p>
            </div>
            <Link
              to="https://tolu.health/privacy-policy"
              className="text-[#1C63DB] text-[16px] font-[500] underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Privacy Policy
            </Link>
            <div className="flex gap-[16px] items-center">
              <Checkbox
                checked={isChecked}
                onCheckedChange={() => setIsChecked(!isChecked)}
              />
              <p className="text-[#1D1D1F] text-[20px] font-[500]">
                I have read and agree to this agreement
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        onClick={handleNext}
        className={`flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] shrink-0 ${!isChecked ? "opacity-[50%]" : "cursor-pointer"}`}
        disabled={!isChecked}
      >
        Continue
      </button>
    </div>
  );
};
