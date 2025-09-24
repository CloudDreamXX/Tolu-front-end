import { Checkbox } from "shared/ui";

type Props = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  handleNext: () => void;
};

export const IndependentContractorAgreement: React.FC<Props> = ({
  isChecked,
  setIsChecked,
  handleNext,
}) => {
  return (
    <div className="flex flex-col xl:w-[1138px] items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center w-full h-full lg:w-[838px] gap-[24px]">
        <div className="flex flex-col gap-[38px] pb-[40px] items-center justify-center">
          <div className="flex flex-col items-center justify-center gap-[25px]">
            <h2 className="text-center text-[#1C63DB] text-[24px] italic underline text-wrap">
              Independent Contractor Agreement
            </h2>
            <p className="text-[#000] text-[24px] italic">
              This is the highlight of the Tolu’s Independent Contractor
              Agreement.
            </p>
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            <p className="text-[#000] text-[18px] italic w-full">Who you are</p>
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[18px] font-bold text-black">
                Independent Role
              </h3>
              <p className="text-[#000] text-[18px] pl-5">
                <li>
                  • You are joining Tolu as an independent contractor, not an
                  employee.
                </li>
                <li>
                  • You have a verified certification or medical license by an
                  accredited program or institute and willing to share that
                  information with Tolu for compliance.
                </li>
                <li>
                  • You set your own schedule and are responsible for your own
                  taxes.
                </li>
              </p>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">
              What you do on Tolu Health
            </p>
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[18px] font-bold text-black">
                Maximizing Your Benefits
              </h3>
              <p className="text-[#000] text-[18px] pl-5">
                <li>
                  • You play a key role in growing Tolu’s client base. The
                  quality and accuracy of your content can make or break the
                  deal.
                </li>
                <li>
                  • Use Tolu’s enhanced AI assistant to shine like a start with
                  your biggest asset; your wealth of knowledge.
                </li>
                <li>
                  • Create content that people need by filling the knowledge
                  gaps you witness everyday around you.
                </li>
              </p>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">
              How You Earn
            </p>
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[18px] font-bold text-black">
                You can earn income through:
              </h3>
              <p className="text-[#000] text-[18px] pl-5">
                <li>
                  • The sales of your educational content that are verified for
                  quality, accuracy of information and medical integrity by you
                  or by Tolu’s health professionals.
                </li>
                <li>• Product/service referrals.</li>
                <li>• More to come.</li>
              </p>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">
              Communication Rules
            </p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[18px] font-semibold text-black">
                To keep users safe:
              </p>
              <ul className="list-disc pl-5 text-[#000] text-[18px] font-[400]">
                <li>• All communication must stay on the Tolu platform.</li>
                <li>• Do not share personal contact info.</li>
                <li>• Off-platform services require written approval.</li>
                <li>
                  • Violating this may lead to immediate removal and loss of
                  earnings.
                </li>
              </ul>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">
              Community Standards
            </p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[18px] font-semibold text-black">
                You agree to:
                <ul className="list-disc pl-5 text-[#000] text-[18px] font-[400]">
                  <li>
                    • Share only evidence-based, ethical content. If your
                    content is flagged for lack of safety or integrity we will
                    remove the content immediately and your account will be
                    flagged for misuse. Get flagged three times and your content
                    creation privileges will be removed and your account will be
                    suspended.
                  </li>
                  <li>• Be respectful in all interactions.</li>
                  <li>• Don’t offer competing services without permission.</li>
                </ul>
              </p>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">
              Legal Basics
            </p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[#000] text-[18px] pl-5">
                • This agreement follows Florida law. We may update terms and
                will notify you when we do.
              </p>
            </div>
          </div>

          <div className="flex gap-[16px] items-center">
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => setIsChecked(!isChecked)}
            />
            <p className="text-[#1D1D1F] text-[20px] italic">
              I have read and agree to this agreement.
            </p>
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
