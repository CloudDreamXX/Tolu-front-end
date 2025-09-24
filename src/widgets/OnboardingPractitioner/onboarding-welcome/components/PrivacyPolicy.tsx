import { Link } from "react-router-dom";
import Like from "shared/assets/icons/like";
import PapersLock from "shared/assets/icons/papers-lock";
import { Checkbox } from "shared/ui";
import Lock from "shared/assets/icons/lock";
import Handshake from "shared/assets/icons/handshake";
import Medkit from "shared/assets/icons/medkit";

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
  const icons = [<Lock />, <Medkit />, <PapersLock />, <Handshake />, <Like />];

  const includes = [
    "Your account is secure: We use encryption, 2FA, and role-based access to protect your data.",
    "HIPAA-compliant: We safeguard any client health information you access or manage on the platform. You are required to do the same. Report any data breach within 24 hours.",
    "Your content is yours: You control what you publish and share. Your storefront activity and commissions are private.",
    "No third-party sharing without consent: We never sell or share your data unless required by law.",
    "You’re in control: You can update or delete your information and request support anytime.",
  ];

  return (
    <div className="flex flex-col xl:w-[1138px] gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[36px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col gap-[39px] items-center justify-center">
        <div className="flex md:w-[838px] flex-col items-center gap-[25px]">
          <Link
            to="https://tolu.health/privacy-policy"
            className="text-[#1C63DB] text-[24px] italic underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
          <p className="text-[#000] text-[24px] italic">
            This is the highlight of the Tolu’s Privacy Policy terms.
          </p>
        </div>
        <div className="flex flex-col gap-[16px]">
          {includes && (
            <ul className="list-none pl-0 space-y-2">
              {includes.map((item, index) => {
                const colon = item.indexOf(":");
                const before = colon >= 0 ? item.slice(0, colon) : item;
                const after = colon >= 0 ? item.slice(colon + 1).trim() : "";

                return (
                  <li key={index} className="text-[#000] text-[18px]">
                    <div className="flex items-center gap-3">
                      <p>
                        <span className="italic">{before}</span>
                        <span className="font-medium">
                          {after ? `: ${after}` : ""}
                        </span>
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="flex gap-[16px] items-center justify-center w-full">
          <Checkbox
            checked={isChecked}
            onCheckedChange={() => setIsChecked(!isChecked)}
          />
          <p className="text-center text-[#1D1D1F] text-[20px] italic">
            I have read and agree to this agreement
          </p>
        </div>
        <button
          onClick={handleNext}
          className={`flex justify-center items-center rounded-full mt-[5px] bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] shrink-0 ${!isChecked ? "opacity-[50%]" : "cursor-pointer"}`}
          disabled={!isChecked}
        >
          Continue
        </button>
      </div>
    </div>
  );
};
