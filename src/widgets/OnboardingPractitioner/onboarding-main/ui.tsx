import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { usePageWidth } from "shared/lib";
import {
  AuthPageWrapper,
  Button,
  Input,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";
import { updateCoachField } from "../../../entities/store/coachOnboardingSlice";
import { HeaderOnboarding } from "./components";
import { buttons } from "./mock";
import { RootState } from "entities/store";
import { useOnboardUserMutation } from "entities/user";
import { MultiSelectField } from "widgets/MultiSelectField";

export const OnboardingMain = () => {
  const nav = useNavigate();
  const { isMobile } = usePageWidth();
  const [customButtons] = useState(buttons);
  const [otherText, setOtherText] = useState("");
  const [selectedButtons, setSelectedButtons] = useState<string[]>([]);
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const state = useSelector((state: RootState) => state.coachOnboarding);

  const dispatch = useDispatch();

  const allOptions = useMemo(() => customButtons.flat(), [customButtons]);

  const [onboardUser, { isLoading }] = useOnboardUserMutation();

  useEffect(() => {
    const saved = (state?.primary_niches ?? []) as string[];

    if (!saved.length) {
      setSelectedButtons([]);
      setOtherText("");
      return;
    }

    const nextSelected: string[] = [];
    let firstCustom: string | null = null;

    for (const val of saved) {
      if (nextSelected.length >= 5) break;
      if (allOptions.includes(val)) {
        if (!nextSelected.includes(val)) nextSelected.push(val);
      } else if (!firstCustom) {
        nextSelected.push("Other");
        firstCustom = val;
      }
    }

    setSelectedButtons(nextSelected);
    setOtherText(firstCustom ?? "");
  }, [state?.primary_niches, allOptions]);

  const isOtherSelected = () => {
    return selectedButtons.includes("Other");
  };

  const handleHintButtonClick = () => {
    setIsTooltipOpen(false);
  };

  const isNextDisabled =
    selectedButtons.length === 0 ||
    (selectedButtons.includes("Other") && otherText.trim() === "");

  const handleNext = async () => {
    let updatedButtons = [...selectedButtons];

    if (isOtherSelected() && otherText.trim()) {
      updatedButtons = updatedButtons
        .filter((btn) => btn !== "Other")
        .concat(otherText);
    }

    dispatch(
      updateCoachField({ key: "primary_niches", value: updatedButtons })
    );

    try {
      await onboardUser({ data: state }).unwrap();
      if (location.pathname.startsWith("/content-manager/create")) {
        nav("/content-manager/create", {
          state: { incompleteRoute: "/about-your-practice" },
        });
      } else {
        nav("/about-your-practice");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectionChange = (updated: string[]) => {
    setSelectedButtons(updated);

    let valueToSave = [...updated];

    if (updated.includes("Other") && otherText.trim()) {
      valueToSave = updated
        .filter((b) => b !== "Other")
        .concat(otherText.trim());
    }

    dispatch(updateCoachField({ key: "primary_niches", value: valueToSave }));
  };

  const handleOtherChange = (text: string) => {
    setOtherText(text);
    const updatedButtons = selectedButtons.includes("Other")
      ? [...selectedButtons.filter((b) => b !== "Other"), text.trim()]
      : selectedButtons;
    dispatch(
      updateCoachField({ key: "primary_niches", value: updatedButtons })
    );
  };

  return (
    <AuthPageWrapper>
      {!location.pathname.startsWith("/content-manager/create") && (
        <HeaderOnboarding currentStep={1} />
      )}
      <main
        className={`flex flex-col items-center flex-1 justify-center gap-[32px] md:gap-[60px] self-stretch bg-white py-[24px] px-[16px] md:p-0 rounded-t-[20px] md:rounded-0
    ${isMobile && !location.pathname.startsWith("/content-manager/create") ? "absolute bottom-0 left-0 w-full z-10" : "relative"} 
    ${isMobile && !location.pathname.startsWith("/content-manager/create") ? "shadow-md" : ""} md:bg-transparent`}
      >
        <h3 className=" text-[24px] md:text-[32px] font-medium text-black text-center self-stretch">
          What are your primary focus areas?
        </h3>

        <section className="w-full lg:w-[900px] items-center justify-center flex flex-col">
          <div className="md:px-[24px] xl:px-0 w-full">
            <MultiSelectField
              label=""
              options={[...customButtons.flat().map((b) => ({ label: b }))]}
              selected={selectedButtons}
              onChange={handleSelectionChange}
              className="py-[11px] px-[16px] md:rounded-[8px] text-[16px] font-medium"
              labelClassName="text-[16px] font-medium"
              height="h-[100px] md:h-[200px] xl:h-[400px]"
            />
          </div>

          {isOtherSelected() && (
            <div className="flex justify-center w-full mt-2">
              <Input
                type="text"
                value={otherText}
                onChange={(e) => handleOtherChange(e.target.value)}
                placeholder="Please specify your niche"
                className="peer w-full md:w-[620px] py-[11px] px-[16px] pr-[40px] rounded-[8px] border border-[#DBDEE1] bg-white outline-none placeholder-[#5F5F65] focus:border-[#1C63DB]"
              />
            </div>
          )}
        </section>

        {/* Next Button */}
        <div className="flex items-center gap-[8px] md:gap-[16px] w-full md:w-fit">
          <Button
            variant={"unstyled"}
            size={"unstyled"}
            onClick={() => nav(-1)}
            className="flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px]  font-semibold text-[#1C63DB]"
            style={{ background: "rgba(0, 143, 246, 0.10)" }}
          >
            Back
          </Button>

          <TooltipProvider delayDuration={500}>
            <Tooltip open={isTooltipOpen} onOpenChange={setIsTooltipOpen}>
              <TooltipTrigger asChild>
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  disabled={isNextDisabled || isLoading}
                  className={
                    !isNextDisabled && !isLoading
                      ? "bg-[#1C63DB] flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full text-[16px]  font-semibold text-white"
                      : "flex w-full md:w-[250px] md:h-[44px] py-[16px] md:py-[4px] md:px-[32px] justify-center items-center gap-[8px] rounded-full bg-[#D5DAE2] text-[16px]  font-semibold text-[#5F5F65] cursor-not-allowed"
                  }
                  tabIndex={isNextDisabled || isLoading ? -1 : 0}
                  aria-disabled={isNextDisabled || isLoading}
                  onClick={handleNext}
                >
                  {isLoading ? "Saving..." : "Next"}
                </Button>
              </TooltipTrigger>

              <TooltipContent side="bottom">
                <div className="flex flex-col items-center gap-2">
                  <h3 className="flex gap-2 text-[#1B2559] leading-[1.4]">
                    <span className="w-6 h-6 shrink-0">
                      <MaterialIcon
                        iconName="lightbulb"
                        className="text-[#1B2559]"
                      />
                    </span>
                    You can update your focus areas anytime from your dashboard.
                  </h3>
                  <Button
                    variant={"unstyled"}
                    size={"unstyled"}
                    className="bg-[#1C63DB] inline-flex py-1 px-4 justify-center items-center gap-2 rounded-full  font-semibold text-white self-center"
                    onClick={handleHintButtonClick}
                  >
                    Got It
                  </Button>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </main>
    </AuthPageWrapper>
  );
};
