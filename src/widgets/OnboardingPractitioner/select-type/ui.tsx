import {
  setCoachOnboardingData,
  updateCoachField,
} from "entities/store/coachOnboardingSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper, TooltipWrapper } from "shared/ui";
import { Footer } from "../../Footer";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { titlesAndIcons } from "./mock";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { UserService } from "entities/user";
import { RootState } from "entities/store";
import { findFirstIncompleteStep } from "../onboarding-finish/helpers";
import { mapUserToCoachOnboarding } from "./helpers";

export const SelectType = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { isMobile } = usePageWidth();
  const [otherText, setOtherText] = useState<string>("");
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array(titlesAndIcons.length).fill("")
  );
  const state = useSelector((state: RootState) => state.coachOnboarding);

  const practitionerTypes = state?.practitioner_types as string[] | undefined;

  const token = useSelector((state: RootState) => state.user.token);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    const getOnboardingStatusWithRetry = async (attempt = 1) => {
      try {
        return await UserService.getOnboardingStatus();
      } catch (err: any) {
        const status = err?.response?.status ?? err?.status;
        if (!cancelled && status === 403 && attempt < 2) {
          await sleep(300);
          return getOnboardingStatusWithRetry(attempt + 1);
        }
        throw err;
      }
    };

    const loadUser = async () => {
      try {
        const onboardingComplete = await getOnboardingStatusWithRetry();
        if (onboardingComplete.onboarding_filled) {
          if (!cancelled) nav("/content-manager/create");
          return;
        }

        const coach = await UserService.getOnboardingUser();
        const coachData = mapUserToCoachOnboarding(coach);

        if (cancelled) return;

        dispatch(setCoachOnboardingData(coachData));

        const issue = findFirstIncompleteStep(coachData);
        if (issue) {
          nav(issue.route);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, [token, dispatch, nav]);

  useEffect(() => {
    const initial = Array(titlesAndIcons.length).fill("");

    let firstOtherValue: string | null = null;

    titlesAndIcons.forEach((item, i) => {
      const saved = practitionerTypes?.[i];
      if (!saved) return;

      if (item.options.includes(saved)) {
        initial[i] = saved;
      } else {
        initial[i] = "Other (please specify)";
        if (firstOtherValue === null) firstOtherValue = saved;
      }
    });

    setSelectedOptions(initial);
    if (firstOtherValue !== null) setOtherText(firstOtherValue);
  }, [practitionerTypes]);

  const handleSelection = (index: number, value: string) => {
    setSelectedOptions((prev) => {
      const next = [...prev];
      next[index] = value;

      const filledTypes = next.map((opt) =>
        opt === "Other (please specify)" ? otherText.trim() : opt
      );

      dispatch(
        updateCoachField({ key: "practitioner_types", value: filledTypes })
      );
      return next;
    });

    setActiveDropdown(null);
  };

  const toggleDropdown = (index: number) => {
    setActiveDropdown((prev) => (prev === index ? null : index));
  };

  const isSelected = () => {
    return selectedOptions.find((option) => option !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSelected()) return;

    try {
      await UserService.onboardUser(state);
      nav("/onboarding-welcome");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthPageWrapper>
      <Footer position={isMobile ? "top-right" : undefined} />
      <HeaderOnboarding currentStep={0} />
      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch md:px-[24px]">
        {!isMobile && (
          <h1 className="flex text-center  text-[32px] font-medium text-black">
            What type of practitioner best describes your role?
          </h1>
        )}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[25px] py-[24px] px-[16px] md:p-[40px] items-center w-full lg:w-fit rounded-t-[20px] md:rounded-[20px] bg-white border-[1px] border-[#1C63DB] shadow-md"
        >
          {isMobile && (
            <h1 className="flex text-center  text-[24px] font-medium text-black">
              What type of practitioner best describes your role?
            </h1>
          )}
          <div className="mt-[24px] mb-[24px] md:m-0 flex flex-col gap-[16px] w-full">
            {titlesAndIcons.map((item, index) => (
              <div
                key={index}
                className="flex flex-col gap-[16px] md:gap-[20px] w-full lg:w-[460px] items-start"
              >
                <div className="flex items-center self-stretch gap-[8px]">
                  <h2 className="text-[#1B2559]  text-nowrap text-[16px] md:text-[20px] font-semibold">
                    {item.title}
                  </h2>
                  <TooltipWrapper content={item.tooltipContent}>
                    <MaterialIcon
                      iconName="help"
                      size={16}
                      fill={1}
                      className="text-[#1C63DB]"
                    />
                  </TooltipWrapper>
                </div>
                {/* Custom Dropdown */}
                <div className="relative w-full">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between bg-[#FAFAFA] border-[#9D9D9D] border-[1px] rounded-[8px] h-[52px] px-[12px] cursor-pointer"
                    onClick={() => toggleDropdown(index)}
                  >
                    <span className="text-[#000]  text-[16px]">
                      {selectedOptions[index] || "Select your type"}
                    </span>
                    <MaterialIcon iconName="keyboard_arrow_down" />
                  </button>
                  {activeDropdown === index && (
                    <div className="absolute z-10 flex flex-col w-full mt-[4px] bg-[#FAFAFA] border-none rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto scrollbar-hide">
                      {item.options.map((option) => (
                        <button
                          type="button"
                          key={option}
                          className="py-[15px] px-[12px] text-left text-[#1D1D1F] text-[16px] font-medium cursor-pointer hover:bg-[#F2F2F2] hover:text-[#1C63DB]"
                          onClick={() => handleSelection(index, option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                  {selectedOptions[index] === "Other (please specify)" && (
                    <input
                      type="text"
                      value={otherText}
                      onChange={(e) => setOtherText(e.target.value)}
                      placeholder="Other text"
                      className="mt-[4px] outline-none w-full h-[52px] px-[12px] border-[1px] border-[#9D9D9D] rounded-[8px] bg-[#FAFAFA] text-[16px] text-[#000] "
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
          {isMobile && (
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={!isSelected()}
              className={`flex items-center justify-center w-full md:h-[44px] p-[16px] rounded-full ${
                isSelected()
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#D5DAE2] text-[#5F5F65]"
              }`}
            >
              Next
            </button>
          )}
        </form>
        {!isMobile && (
          <div className="pb-10 md:pb-[140px]">
            <button
              onClick={handleSubmit}
              type="submit"
              disabled={!isSelected()}
              className={`mt-[20px] flex items-center justify-center w-[250px] h-[44px] p-[16px] rounded-full ${
                isSelected()
                  ? "bg-[#1C63DB] text-white"
                  : "bg-[#D5DAE2] text-[#5F5F65]"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </main>
    </AuthPageWrapper>
  );
};
