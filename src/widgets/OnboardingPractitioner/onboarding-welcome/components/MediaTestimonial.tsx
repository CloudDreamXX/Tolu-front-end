import { Checkbox } from "shared/ui";
import Like from "shared/assets/icons/like";

type Props = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  handleNext: () => void;
};

export const MediaTestimonial: React.FC<Props> = ({
  isChecked,
  setIsChecked,
  handleNext,
}) => {
  const includes = [
    "Written testimonials or reviews",
    "Headshots or photos",
    "Audio/video clips or interviews",
    "Public quotes, social media posts, or shared milestones",
  ];

  return (
    <div className="flex flex-col xl:w-[900px] items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center shrink-0 w-full md:w-[548px] md:h-[269px] lg:h-auto gap-[24px]">
        <Like />
        <div className="flex flex-col gap-[38px] items-center justify-center">
          <div className="flex md:w-[460px] flex-col items-center gap-[16px]">
            <h2 className="text-center text-black font-[Nunito] text-[24px] md:text-[40px]/[56px] text-wrap font-bold">
              Media & Testimonial Consent
            </h2>
            <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
              To support our community and celebrate your success, we may
              occasionally feature your:
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
            <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
              These may appear in Tolu's marketing, educational, or promotional
              materials, including on our website, social media, email, and
              printed content.
            </p>
          </div>
          <div className="flex flex-col gap-[16px]">
            <h3 className="text-center text-black font-[Nunito] text-[20px] md:text-[28px] text-wrap font-semibold">
              What You Need to Know:
            </h3>
            <ul className="list-disc pl-5">
              <li className="text-[#5F5F65] text-[16px]">
                - You keep ownership of anything you create
              </li>
              <li className="text-[#5F5F65] text-[16px]">
                - No payment is provided, unless agreed separately
              </li>
              <li className="text-[#5F5F65] text-[16px]">
                - You can opt out anytime by emailing support@tolu.health
              </li>
              <li className="text-[#5F5F65] text-[16px]">
                - Already-published materials won’t be removed but may be
                archived
              </li>
              <li className="text-[#5F5F65] text-[16px]">
                - This applies globally and forever unless you tell us otherwise
              </li>
            </ul>
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
