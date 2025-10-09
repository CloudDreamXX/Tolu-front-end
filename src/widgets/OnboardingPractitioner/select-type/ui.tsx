import { updateCoachField } from "entities/store/coachOnboardingSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { usePageWidth } from "shared/lib";
import { AuthPageWrapper, TooltipWrapper } from "shared/ui";
import { HeaderOnboarding } from "../../HeaderOnboarding";
import { titlesAndIcons } from "./mock";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { UserService } from "entities/user";
import { RootState } from "entities/store";
import { SelectField } from "widgets/CRMSelectField";

export const SelectType = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { isMobile } = usePageWidth();

  const [otherText, setOtherText] = useState<string>("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    Array(titlesAndIcons.length).fill("")
  );

  const inputRef = useRef<HTMLInputElement | null>(null);
  const state = useSelector((state: RootState) => state.coachOnboarding);
  const practitionerTypes = state?.practitioner_types as string[] | undefined;

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

  useEffect(() => {
    if (
      selectedOptions.includes("Other (please specify)") &&
      inputRef.current
    ) {
      inputRef.current.focus();
    }
  }, [selectedOptions]);

  const handleSelection = (index: number, value: string) => {
    setSelectedOptions((prev) => {
      const next = [...prev];
      next[index] = value;

      const filledTypes = [...next];
      if (value === "Other (please specify)" && otherText.trim()) {
        filledTypes[index] = otherText.trim();
      }

      dispatch(
        updateCoachField({ key: "practitioner_types", value: filledTypes })
      );
      return next;
    });
  };

  const handleOtherChange = (text: string) => {
    setOtherText(text);

    const filledTypes = selectedOptions.map((opt) =>
      opt === "Other (please specify)" && text.trim() ? text.trim() : opt
    );

    dispatch(
      updateCoachField({ key: "practitioner_types", value: filledTypes })
    );
  };

  const isSelected = () => selectedOptions.some((option) => option !== "");

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
      <HeaderOnboarding currentStep={0} />

      <main className="flex flex-col items-center flex-1 justify-center gap-[32px] self-stretch md:px-[24px]">
        {!isMobile && (
          <h1 className="flex text-center text-[32px] font-medium text-black">
            What type of practitioner best describes your role?
          </h1>
        )}

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[25px] py-[24px] px-[16px] md:p-[40px] items-center w-full lg:w-fit rounded-t-[20px] md:rounded-[20px] bg-white border-[1px] border-[#1C63DB] shadow-md"
        >
          {isMobile && (
            <h1 className="flex text-center text-[24px] font-medium text-black">
              What type of practitioner best describes your role?
            </h1>
          )}

          <div className="mt-[24px] mb-[24px] md:m-0 flex flex-col gap-[16px] w-full">
            {titlesAndIcons.map((item, index) => {
              const isLast = index >= titlesAndIcons.length - 1;
              const isSecondLast = index === titlesAndIcons.length - 2;

              return (
                <div
                  key={index}
                  className="flex flex-col gap-[16px] md:gap-[20px] w-full lg:w-[460px] items-start"
                >
                  <div className="flex items-center self-stretch gap-[8px]">
                    <h2 className="text-[#1B2559] text-nowrap text-[16px] md:text-[20px] font-semibold">
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

                  <SelectField
                    label=""
                    selected={selectedOptions[index]}
                    onChange={(val) => handleSelection(index, val)}
                    options={[
                      ...item.options.map((opt) => ({
                        value: opt,
                        label: opt,
                      })),
                    ]}
                    containerClassName="py-[11px] px-[16px] rounded-[8px] text-[16px] font-medium"
                    labelClassName="text-[16px] font-medium"
                    className={
                      isLast
                        ? "h-[110px] md:h-[250px]"
                        : isSecondLast
                          ? "h-[200px] md:h-[250px]"
                          : "h-[250px]"
                    }
                  />

                  {selectedOptions[index] === "Other (please specify)" && (
                    <input
                      ref={inputRef}
                      type="text"
                      value={otherText}
                      onChange={(e) => handleOtherChange(e.target.value)}
                      placeholder="Other text"
                      className="mt-[4px] outline-none w-full h-[52px] px-[12px] border-[1px] border-[#DBDEE1] rounded-[8px] text-[16px] text-[#000]"
                    />
                  )}
                </div>
              );
            })}
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
