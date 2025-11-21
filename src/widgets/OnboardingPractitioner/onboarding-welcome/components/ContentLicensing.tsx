import { Button, Checkbox } from "shared/ui";

type Props = {
  isChecked: boolean;
  setIsChecked: (value: boolean) => void;
  handleNext: () => void;
};

export const ContentLicensing: React.FC<Props> = ({
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
              Content Licensing Agreement
            </h2>
            <p className="text-[#000] text-[24px] italic">
              This is the highlight of the Tolu’s Content Licensing Agreement.
            </p>
          </div>

          <div className="flex flex-col gap-[16px] w-full">
            <p className="text-[#000] text-[18px] italic w-full">
              Grant of License
            </p>
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[18px] font-bold text-black">
                By contributing content, you give Tolu a non-exclusive,
                royalty-free, worldwide license to:
              </h3>
              <p className="text-[#000] text-[18px] pl-5">
                <li>• Display, promote, and distribute your content.</li>
                <li>• Include it in client-facing tools and AI learning.</li>
                <li>• Sell or bundle it within Tolu products.</li>
                <li>• Use it for educational and personalization purposes.</li>
              </p>
            </div>

            <p className="text-[18px] font-medium text-black">
              *You always keep ownership of your original work.
            </p>

            <p className="text-[#000] text-[18px] italic w-full">
              Your Right and Responsibilities
            </p>
            <p className="text-[#000] text-[18px] pl-5">
              <li>• You own your content.</li>
              <li>
                • You may share the content you created inside Tolu elsewhere as
                long as it’s shared directly via the platform.
              </li>
              <li>
                • You confirm you have full rights and that it doesn’t infringe
                on anyone else’s IP..{" "}
              </li>
            </p>

            <p className="text-[#000] text-[18px] italic w-full">
              How Tolu May Use Your Content
            </p>
            <div className="flex flex-col gap-[8px]">
              <h3 className="text-[18px] font-bold text-black">
                We may feature your content along with your credits in:
              </h3>
              <p className="text-[#000] text-[18px] pl-5">
                <li>• Your Educator/Coach storefront.</li>
                <li>• Newsletters, discovery feeds, or social media.</li>
                <li>• Educational resources within Tolu’s learning tools.</li>
                <li>• AI model training (anonymized where applicable).</li>
              </p>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">
              Edits and Updates
            </p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[18px] font-semibold text-black">We may:</p>
              <ul className="list-disc pl-5 text-[#000] text-[18px] font-[400]">
                <li>• Format your content for clarity or accessibility.</li>
                <li>• Suggest changes for platform standards.</li>
                <li>• Unpublish content if outdated or policy-violating.</li>
              </ul>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">
              Compensation and Revenue
            </p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[18px] font-semibold text-black">
                You may earn:
                <ul className="list-disc pl-5 text-[#000] text-[18px] font-[400]">
                  <li>• Sales of your individual content.</li>
                  <li>• Bundled packages.</li>
                  <li>• Affiliate partnerships (if applicable).</li>
                  <li>
                    • Details and percentages will be outlined in the near
                    future when we have more interactions with Tolu.
                  </li>
                </ul>
              </p>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">
              Ending the License
            </p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[18px] font-semibold text-black">
                You or Tolu may end the licensing at any time by written notice.
                If that happens:
                <ul className="list-disc pl-5 text-[#000] text-[18px] font-[400]">
                  <li>• We’ll remove the content within 30 days.</li>
                  <li>
                    • Archived copies may be retained for archival purposes.
                  </li>
                  <li>• Past earnings will still be paid.</li>
                </ul>
              </p>
            </div>

            <p className="text-[#000] text-[18px] italic w-full">Legal Stuff</p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[18px] font-semibold text-black">
                You confirm:
                <ul className="list-disc pl-5 text-[#000] text-[18px] font-[400]">
                  <li>
                    • The content is original or appropriately licensed,
                    credited, or permitted to use by the original creator.
                  </li>
                  <li>• It doesn’t make false claims or unsafe suggestions.</li>
                  <li>• It follows legal and professional standards.</li>
                </ul>
              </p>
            </div>

            <p className="text-[18px] font-medium text-black">
              *The laws of the State of Florida, USA, govern this agreement.
            </p>

            <p className="text-[#000] text-[18px] italic w-full">
              Final Acknowledgement
            </p>
            <div className="flex flex-col gap-[8px]">
              <p className="text-[18px] font-semibold text-black">
                This agreement works together with the Independent Contractor
                Agreement. Updates to the terms will always be communicated in
                writing.
              </p>
            </div>
          </div>

          <div className="flex gap-[16px] items-center">
            <Checkbox
              checked={isChecked}
              onCheckedChange={() => setIsChecked(!isChecked)}
            />
            <p className="text-[#1D1D1F] text-[20px] italic">
              I Agree to the Content Licensing Terms.
            </p>
          </div>
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={handleNext}
            className={`flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] ${!isChecked ? "opacity-[50%]" : "cursor-pointer"}`}
            disabled={!isChecked}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
