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
    <div className="flex flex-col xl:w-[1138px] h-[80vh] overflow-y-auto items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center w-full h-full md:w-[838px] gap-[24px]">
        <div className="flex flex-col gap-[38px] pb-[40px] items-center justify-center">
          <h2 className="text-center text-[#1C63DB] text-[24px] md:text-[32px]/[56px] text-wrap font-semibold underline">
            Independent Contractor Agreement
          </h2>

          <div className="flex flex-col gap-[16px] w-full">
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[24px] font-bold text-black">
                Independent Role
              </h3>
              <p className="text-[#000] text-[24px] pl-5">
                • You are joining Tolu as an independent contractor, not an
                employee. <br /> You set your own schedule and are responsible
                for your own taxes.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[24px] font-bold text-black">How You Earn</h3>
              <p className="text-[#000] text-[24px] font-semibold">
                You can earn income through:
                <ul className="list-disc pl-5 text-[#000] text-[24px] font-[400]">
                  <li>• Educational content sales</li>
                  <li>• Product/service referrals</li>
                  <li>• Paid sessions or programs (if approved)</li>
                </ul>
              </p>
            </div>

            <div className="flex flex-col">
              <p className="text-[#000] text-[24px] font-bold">
                Earnings are paid monthly (minimum payout applies).
              </p>
              <h3 className="text-[24px] font-semibold text-black">
                Your Content
              </h3>
              <p className="text-[#000] text-[24px] pl-5">
                • You own your original content. By publishing on Tolu, you
                grant us permission to use and promote it.
              </p>
            </div>

            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[24px] font-bold text-black">
                Privacy & HIPAA
              </h3>
              <p className="text-[#000] text-[24px] pl-5">
                • You must protect user privacy and follow HIPAA rules. Report
                any data breach within 24 hours.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[24px] font-bold text-black">
                Communication Rules
              </h3>
              <p className="text-[24px] font-semibold text-black">
                To keep users safe:
              </p>
              <ul className="list-disc pl-5 text-[#000] text-[24px] font-[400]">
                <li>• All communication must stay on the Tolu platform</li>
                <li>• Do not share personal contact info</li>
                <li>• Off-platform services require written approval</li>
              </ul>
              <p className="text-[24px] font-[500] italic text-black">
                Violating this may lead to immediate removal and loss of
                earnings.
              </p>
            </div>

            <div className="flex flex-col">
              <h3 className="text-[24px] font-bold text-black">
                Community Standards
              </h3>
              <p className="text-[24px] font-semibold text-black">
                You agree to:
                <ul className="list-disc pl-5 text-[#000] text-[24px] font-[400]">
                  <li>• Share only evidence-based, ethical content</li>
                  <li>• Be respectful in all interactions</li>
                  <li>• Not offer competing services without permission</li>
                </ul>
              </p>
            </div>

            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[24px] font-bold text-black">Legal Basics</h3>
              <p className="text-[#000] text-[24px] pl-5">
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
            <p className="text-[#1D1D1F] text-[20px] font-[500]">
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
