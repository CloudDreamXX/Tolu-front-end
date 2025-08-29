import { Checkbox } from "shared/ui";
import Medkit from "shared/assets/icons/medkit";
import { useState } from "react";

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
  const [currentPage, setCurrentPage] = useState<number>(0);

  const contentPages = [
    {
      title: "Content Licensing",
      subtitle:
        "Before publishing content to the Tolu platform, please review and accept our Content Licensing Agreement. It ensures clarity, fairness, and alignment for both you and Tolu.",
    },
    {
      title: "Grant of License",
      content: (
        <>
          <p>
            By contributing content, you give Tolu a non-exclusive,
            royalty-free, worldwide license to:
          </p>
          <br />
          <ul className="text-left list-disc text-[#5F5F65] text-[16px]">
            <li>- Display, promote, and distribute your content.</li>
            <li>- Include it in client-facing tools and AI learning.</li>
            <li>- Sell or bundle it within Tolu products.</li>
            <li>- Use it for educational and personalization purposes.</li>
          </ul>
          <br />
          <p className="text-left text-[#5F5F65] text-[16px]">
            You always keep ownership of your original work.
          </p>
        </>
      ),
    },
    {
      title: "Your Rights and Responsibilities",
      content: (
        <ul className="text-left list-disc text-[#5F5F65] text-[16px]">
          <li>- You own your content.</li>
          <li>
            - You may republish it elsewhere (unless otherwise agreed), but you
            must mention that the content was created inside Tolu.
          </li>
          <li>
            - You confirm you have full rights and that it doesn’t infringe on
            anyone else’s IP.
          </li>
        </ul>
      ),
    },
    {
      title: "How Tolu May Use Your Content",
      content: (
        <>
          <p>We may feature your content along with your credits in:</p>
          <br />
          <ul className="text-left list-disc text-[#5F5F65] text-[16px]">
            <li>- Your Educator storefront.</li>
            <li>- Newsletters, discovery feeds, or social media.</li>
            <li>- Educational resources within Tolu’s learning tools.</li>
            <li>- AI model training (anonymized where applicable).</li>
          </ul>
        </>
      ),
    },
    {
      title: "Edits and Updates",
      content: (
        <>
          <ul className="text-left list-disc text-[#5F5F65] text-[16px]">
            <li>- We may format for clarity or accessibility.</li>
            <li>- Suggest changes for platform standards.</li>
            <li>- Unpublish content if outdated or policy-violating.</li>
          </ul>
          <br />
          <p className="text-left text-[#5F5F65] text-[16px]">
            Major edits need your approval.
          </p>
        </>
      ),
    },
    {
      title: "Compensation and Revenue",
      content: (
        <>
          <p>You may earn from:</p>
          <br />
          <ul className="text-left list-disc text-[#5F5F65] text-[16px]">
            <li>- Sales of your individual content.</li>
            <li>- Bundled packages.</li>
            <li>- Affiliate partnerships (if applicable).</li>
          </ul>
          <br />
          <p className="text-left text-[#5F5F65] text-[16px]">
            Details and percentages are outlined in the Educator Admin
            Agreement.
          </p>
        </>
      ),
    },
    {
      title: "Ending the License",
      content: (
        <>
          <p>
            You or Tolu may end the license at any time by written notice. If
            that happens:
          </p>
          <br />
          <ul className="text-left list-disc text-[#5F5F65] text-[16px]">
            <li>- We’ll remove the content within 30 days.</li>
            <li>- Archived copies may be retained for archival purposes.</li>
            <li>- Past earnings will still be paid.</li>
          </ul>
        </>
      ),
    },
    {
      title: "Legal Stuff",
      content: (
        <>
          <ul className="text-left list-disc text-[#5F5F65] text-[16px]">
            <li>
              - The content is original or appropriately licensed, credited, or
              permitted to use by the original creator.
            </li>
            <li>- It doesn’t make false claims or unsafe suggestions.</li>
            <li>- It follows legal and professional standards.</li>
          </ul>
          <br />
          <p className="text-left text-[#5F5F65] text-[16px]">
            The laws of the State of Florida, USA, govern this agreement.
          </p>
        </>
      ),
    },
    {
      title: "Final Acknowledgement",
      content: (
        <p className="text-left text-[#5F5F65] text-[16px]">
          This agreement works together with the Health Educator Admin
          Agreement. Updates to the terms will always be communicated in
          writing.
        </p>
      ),
    },
    {
      title: "Accept & Publish",
      content: (
        <div className="flex items-center gap-[16px]">
          <Checkbox
            checked={isChecked}
            onCheckedChange={() => setIsChecked(!isChecked)}
          />
          <p className="text-[#1D1D1F] text-[20px] font-[500]">
            I have read and agree to this agreement
          </p>
        </div>
      ),
    },
  ];

  const currentContent = contentPages[currentPage];

  const handlePageNavigation = (direction: string) => {
    if (direction === "next") {
      if (currentPage < contentPages.length - 1) {
        setCurrentPage(currentPage + 1);
      }
    } else if (direction === "back") {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="flex flex-col xl:w-[900px] items-center justify-center gap-[88px] md:gap-[58px] xl:gap-[40px] md:mx-[40px] xl:mx-0 py-[24px] px-[16px] md:py-[40px] md:px-[70px] xl:py-[56px] xl:px-[100px] rounded-t-[20px] md:rounded-[20px] border-[2px] border-[#F3F6FB] bg-white shadow-wrapper">
      <div className="flex flex-col items-center shrink-0 w-full md:w-[548px] md:h-[269px] lg:h-auto gap-[24px]">
        <Medkit />
        <div className="flex flex-col gap-[38px] items-center justify-center">
          <div className="flex md:w-[460px] flex-col items-center gap-[16px]">
            <h2 className="text-center text-black font-[Nunito] text-[24px] md:text-[40px]/[56px] text-wrap font-bold">
              {currentContent.title}
            </h2>
            <p className="text-center text-[16px] md:text-[24px] text-[#000000]">
              {currentContent.subtitle || currentContent.content}
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full justify-between gap-[16px]">
        {currentPage > 0 && (
          <button
            onClick={() => handlePageNavigation("back")}
            className="flex justify-center items-center rounded-full border-[1px] border-[#1C63DB] text-[#1C63DB] w-full md:w-[250px] h-[56px] p-[16px] shrink-0"
          >
            Back
          </button>
        )}

        {currentPage < contentPages.length - 1 ? (
          <button
            onClick={() => handlePageNavigation("next")}
            className={`ml-auto flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] shrink-0 cursor-pointer`}
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleNext}
            className={`flex justify-center items-center rounded-full bg-[#1C63DB] text-white w-full md:w-[250px] h-[56px] p-[16px] shrink-0 ${!isChecked ? "opacity-[50%]" : "cursor-pointer"}`}
            disabled={!isChecked}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};
