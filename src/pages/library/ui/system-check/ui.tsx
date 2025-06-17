import QuestionImage from "shared/assets/images/Question.png";
import ListImage from "shared/assets/images/List.png";
import ListCheck from "shared/assets/icons/list-checks";
import ArrowClock from "shared/assets/icons/arrow-clock";
import { usePageWidth } from "shared/lib";
import { Recommendation } from "entities/user";

interface SystemCheckProps {
  showResults?: boolean;
  setModalOpen: (open: boolean) => void;
  recommendations?: Recommendation[];
}

export const SystemCheck: React.FC<SystemCheckProps> = ({
  showResults,
  setModalOpen,
  recommendations,
}) => {
  const width = usePageWidth();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1280;

  return !showResults ? (
    <div className="bg-white w-full rounded-[16px] shadow-[0px_0px_16px_8px_rgba(209,219,220,0.2)] border-l-[8px] border-r-[8px] border-[#1C63DB] p-[16px_24px]">
      <div className="flex flex-col items-center gap-6 md:flex-row">
        {!isMobile && (
          <img
            src={QuestionImage}
            alt="question mark"
            className="md:w-[48px] md:h-[48px] lg:w-[56px] lg:h-[56px]"
          />
        )}
        <div className="flex flex-col items-start flex-grow gap-2">
          <div className="flex items-center gap-[16px]">
            {isMobile && (
              <img
                src={QuestionImage}
                alt="question mark"
                className="w-[40px] h-[40px]"
              />
            )}
            <p className="text-[24px] leading-[32px] font-semibold text-[#1D1D1F]">
              Noticing changes? It could be menopause.
            </p>
          </div>
          <p className="text-[16px] leading-[22px] font-normal text-[#5F5F65]">
            Check your symptoms and get personalized insights in minutes with
            our Menopause Symptom Checker.
          </p>
        </div>
        <button
          className="hidden  ml-auto w-full md:w-fit px-4 py-2 rounded-full bg-[#1C63DB] text-white text-[16px] font-semibold whitespace-nowrap lg:flex items-center justify-center gap-[12px]"
          onClick={() => setModalOpen(true)}
        >
          <ListCheck />
          Start Symptom Check
        </button>
      </div>
      <div className="lg:hidden w-full flex items-center justify-end mt-[16px]">
        <button
          className="w-full h-fit md:w-fit px-4 py-2 rounded-full bg-[#1C63DB] text-white text-[16px] font-semibold whitespace-nowrap gap-[12px] flex items-center justify-center"
          onClick={() => setModalOpen(true)}
        >
          <ListCheck />
          Start Symptom Check
        </button>
      </div>
    </div>
  ) : (
    <div className="bg-white w-full rounded-[16px] shadow-[0px_0px_16px_8px_rgba(209,219,220,0.2)] border-l-[8px] border-r-[8px] border-[#1C63DB] p-[16px] md:p-[20px] xl:p-[24px]">
      <div className="flex  gap-[16px] md:gap-[20px] lg:gap-[24px]">
        <div className="flex flex-col xl:flex-row items-start md:items-start xl:items-center justify-between gap-[16px] xl:gap-6 w-full">
          <div className="flex flex-col items-start flex-grow gap-2">
            <div className="flex flex-col gap-[10px] md:flex-row md:gap-[24px]">
              {!isMobile && (
                <>
                  <img
                    src={ListImage}
                    alt="question mark"
                    className="md:w-[48px] md:h-[48px] xl:w-[56px] xl:h-[56px]"
                  />
                  <div>
                    <div className="flex items-center gap-[24px] md:gap-[16px]">
                      <p className="text-[24px] leading-[32px] font-semibold text-[#1D1D1F]">
                        Symptom check results
                      </p>
                    </div>
                    <p className="text-[16px] leading-[22px] font-normal text-[#5F5F65]">
                      Based on your symptoms, we’ve selected content that’s most
                      relevant to you.
                    </p>
                  </div>
                </>
              )}
              {isMobile && (
                <>
                  <div className="flex items-center gap-[24px] md:gap-[16px]">
                    <img
                      src={ListImage}
                      alt="question mark"
                      className="w-[40px] h-[40px]"
                    />
                    <p className="text-[24px] leading-[32px] font-semibold text-[#1D1D1F]">
                      Symptom check results
                    </p>
                  </div>
                  <p className="text-[16px] leading-[22px] font-normal text-[#5F5F65]">
                    Based on your symptoms, we’ve selected content that’s most
                    relevant to you.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-col xl:flex-row justify-between items-start xl:items-center w-full xl:w-auto gap-[24px] md:gap-[16px]">
            {(isMobile || isTablet) && (
              <div className="flex flex-wrap gap-[8px]">
                {recommendations?.map((item) => (
                  <div
                    key={item.id}
                    className="text-[13px] md:text-[14px] font-medium px-[12px] py-[6px] bg-[#F3F7FD] text-[#1C63DB] rounded-[6px] border border-[#1C63DB]"
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between xl:justify-center gap-[12px] xl:gap-[24px] text-[14px] text-[#1C63DB] font-medium w-full xl:w-auto">
              <p className="text-[#5F5F65] text-[13px] md:text-[14px] leading-[18px] md:leading-[20px] font-normal">
                Date of last check:{" "}
                <span className="font-semibold text-[#1D1D1F]">
                  May 14, 2025 4:00 pm
                </span>
              </p>

              <div className="flex items-center gap-[8px] flex-col-reverse w-full md:flex-row md:w-fit">
                <button className="w-full md:w-[176px] flex items-center justify-center gap-[12px] rounded-[1000px] px-[16px] py-[11px] text-[14px] md:text-[16px] font-semibold text-[#1C63DB]">
                  Hide my results
                </button>

                <button className="w-full md:w-[176px] flex items-center justify-center gap-[12px] bg-[#DDEBF6] rounded-[1000px] px-[16px] py-[11px] text-[14px] md:text-[16px] font-semibold text-[#1C63DB]">
                  <ArrowClock />
                  Update results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {!isMobile && !isTablet && (
        <div className="flex flex-wrap gap-[8px] mt-[24px]">
          {recommendations?.map((item) => (
            <div
              key={item.id}
              className="text-[13px] md:text-[14px] font-medium px-[12px] py-[6px] bg-[#F3F7FD] text-[#1C63DB] rounded-[6px] border border-[#1C63DB]"
            >
              {item.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
