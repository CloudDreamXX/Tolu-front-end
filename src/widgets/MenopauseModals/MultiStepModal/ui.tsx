import React, { useEffect, useState } from "react";
import Close from "shared/assets/icons/close";
import { steps } from "./mock";
import { Stepper, Step, StepLabel, StepConnector } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Check } from "lucide-react";
import { MenopauseSubmissionRequest, Symptom } from "entities/user";
import ArrowBack from "shared/assets/icons/arrowBack";

interface MultiStepModalProps {
  isOpen: boolean;
  symptoms: Symptom[];
  onClose: () => void;
  onComplete: (results: MenopauseSubmissionRequest) => void;
}

export const MultiStepModal: React.FC<MultiStepModalProps> = ({
  isOpen,
  symptoms,
  onClose,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, string[]>
  >(
    steps.reduce(
      (acc, step) => {
        acc[step.folder_id] = [];
        return acc;
      },
      {} as Record<string, string[]>
    )
  );

  const [otherInputs, setOtherInputs] = useState<string[]>([]);

  steps[0] = {
    ...steps[0],
    options: symptoms.map((s) => ({ id: s.id, name: s.name })),
  };

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const folderId = step.folder_id;
  const hasSelectedOptions = selectedOptions[folderId]?.length > 0;
  const hasOtherInput = !!otherInputs[currentStep]?.trim();
  const isStepValid = hasSelectedOptions || hasOtherInput;
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState<boolean>(
    window.innerWidth > 768 && window.innerWidth < 1024
  );
  const [isTallScreen, setIsTallScreen] = useState<boolean>(
    window.innerHeight > 1000
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth > 768 && window.innerWidth < 1024);
      setIsTallScreen(window.innerHeight > 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const DefaultConnector = styled(StepConnector)(() => ({
    top: isMobile ? "16px" : 20,
    left: isMobile ? "calc(-50% + 16px)" : "calc(-50% + 20px)",
    right: isMobile ? "calc(50% + 16px)" : "calc(50% + 20px)",
    "& .MuiStepConnector-line": {
      borderColor: "#D5DAE2",
      borderTopWidth: 1,
      borderRadius: 1,
    },
  }));

  const WideConnector = styled(StepConnector)(({ theme }) => ({
    position: "absolute",
    top: isMobile ? "16px" : 20,
    left: isMobile ? "-70px" : isTablet ? "-42px" : "-30px",
    right: 0,
    margin: "0 auto",
    width: "100%",
    maxWidth: "580px",
    "& .MuiStepConnector-line": {
      borderColor: "#D5DAE2",
      borderTopWidth: 1,
      borderRadius: 1,
    },
  }));

  const StepIconRoot = styled("div")<{ ownerState: any }>(({ ownerState }) => ({
    backgroundColor: ownerState.completed
      ? "#BCE2C8"
      : ownerState.active
        ? "#ECEFF4"
        : "#FFF",
    zIndex: 1,
    width: isMobile ? 32 : 40,
    height: isMobile ? 32 : 40,
    color: ownerState.completed
      ? "#006622"
      : ownerState.active
        ? "#1D1D1F"
        : "#5F5F65",
    display: "flex",
    borderRadius: "50%",
    border: `1px solid ${ownerState.completed ? "#006622" : "#D5DAE2"}`,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  }));

  const CustomStep = styled(Step)(() => ({
    paddingLeft: 0,
    paddingRight: 0,
  }));

  const CustomStepIcon = (props: any) => {
    const { active, completed, className } = props;
    const { icon } = props;

    return (
      <StepIconRoot ownerState={{ completed, active }} className={className}>
        {completed ? <Check fontSize="small" /> : icon}
      </StepIconRoot>
    );
  };

  if (!isOpen) return null;

  const toggleOption = (option: string) => {
    const folderId = step.folder_id;

    setSelectedOptions((prev) => {
      const current = prev[folderId] || [];
      const exists = current.includes(option);
      const updated = exists
        ? current.filter((opt) => opt !== option)
        : [...current, option];

      return {
        ...prev,
        [folderId]: updated,
      };
    });
  };

  const handleOtherOptionChange = (value: string) => {
    const newOtherInputs = [...otherInputs];
    newOtherInputs[currentStep] = value;
    setOtherInputs(newOtherInputs);
  };

  const handleNextStepClick = () => {
    const folderId = step.folder_id;
    const trimmedOther = otherInputs[currentStep]?.trim();

    setSelectedOptions((prev) => {
      const updated = { ...prev };
      const current = prev[folderId] || [];

      if (trimmedOther && !current.includes(trimmedOther)) {
        updated[folderId] = [...current, trimmedOther];
      }

      return updated;
    });

    if (isLastStep) {
      const submission: MenopauseSubmissionRequest = {
        folder_ids: selectedOptions[steps[0].folder_id],
        desired_health_change: selectedOptions[steps[1].folder_id],
        genetic_conditions: selectedOptions[steps[2].folder_id],
        helpful_management: selectedOptions[steps[3].folder_id],
        allergies_sensitivities: selectedOptions[steps[4].folder_id],
        menstrual_changes: selectedOptions[steps[5].folder_id],
      };

      onComplete(submission);

      // Reset state
      setSelectedOptions(
        steps.reduce(
          (acc, step) => {
            acc[step.folder_id] = [];
            return acc;
          },
          {} as Record<string, string[]>
        )
      );
      setOtherInputs([]);
      setCurrentStep(0);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div
      className={`fixed top-[69px] md:top-0 inset-0 z-10 flex flex-col md:items-center ${currentStep === 0 ? "justify-end" : ""}
        ${currentStep === 0 || isTallScreen ? "md:justify-center" : ""} overflow-y-auto`}
      style={{
        background: isMobile ? "#F2F4F6" : "rgba(0, 0, 0, 0.30)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
      }}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {currentStep !== 0 && (
        <span
          onClick={() => setCurrentStep(currentStep - 1)}
          className="absolute z-10 top-[16px] left-[16px] md:hidden"
        >
          <ArrowBack />
        </span>
      )}
      <div
        className={`
                    flex flex-col 
                    bg-white 
                    rounded-t-[18px]
                    md:rounded-[18px] 
                    w-full 
                    md:w-[742px] 
                    px-[16px]
                    md:px-[24px] 
                    py-[24px] 
                    gap-[24px] 
                    relative
                    top-[64px] 
                    md:top-0
                  `}
      >
        <button
          onClick={onClose}
          className="absolute top-[16px] right-[16px] hidden md:block"
          aria-label="Close modal"
        >
          <Close />
        </button>

        <h3
          id="modal-title"
          className="text-[24px] font-semibold text-[#1D1D1F]"
        >
          Intro questions
        </h3>

        <div className="border border-[#D5DAE2] rounded-[32px] p-[6.5px] md:p-[8px]">
          <Stepper
            activeStep={currentStep}
            alternativeLabel
            connector={
              currentStep === 1 || currentStep === 2 ? (
                <WideConnector />
              ) : (
                <DefaultConnector />
              )
            }
          >
            {steps.map((step, index) => (
              <CustomStep key={index}>
                <StepLabel StepIconComponent={CustomStepIcon}>
                  {index === currentStep && (
                    <div className="w-max max-w-[107px] md:max-w-[266px] md:w-[266px] lg:max-w-[358px] lg:w-[358px] bg-[#ECEFF4] border border-[#D5DAE2] text-[#1D1D1F] text-[10px] md:text-[14px] leading-[16.411px] md:leading-[20px] text-wrap md:text-nowrap font-[600] rounded-[32px] flex items-center justify-center px-[12px] min-w-[82px] min-h-[32px] md:px-[16px] md:py-[10px] -mt-[48px] md:-mt-[57px] z-10 relative">
                      {step.stepTitle}
                    </div>
                  )}
                </StepLabel>
              </CustomStep>
            ))}
          </Stepper>
        </div>

        <div className="flex flex-col gap-[4px]">
          <p className="text-[18px] text-[#1D1D1F] font-[700] leading-[24px]">
            {step.question}
          </p>
          <p className="text-[14px] text-[#5F5F65] leading-[20px]">
            {step.subtitle}
          </p>
        </div>
        <div>
          {step.label && (
            <p className="text-[16px] text-[#1D1D1F] font-[500] mb-[8px] leading-[22px]">
              {step.label}
            </p>
          )}
          <div className="flex flex-wrap gap-[8px]">
            {step.options.map((option, index) => {
              const id = typeof option === "string" ? option : option.id;
              const label = typeof option === "string" ? option : option.name;

              const selected = Array.isArray(selectedOptions[folderId])
                ? (selectedOptions[folderId] as string[]).includes(id)
                : selectedOptions[folderId] === id;

              return (
                <button
                  key={id}
                  onClick={() => toggleOption(id)}
                  className={`flex text-left px-[16px] py-[8px] rounded-[8px] bg-[#F3F7FD] ${
                    selected
                      ? "border border-[#1C63DB] text-[#1C63DB]"
                      : "border border-[#F3F7FD] text-[#1D1D1F]"
                  } text-[16px] leading-[22px]`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
        {step.other !== false && (
          <div>
            <p className="text-[16px] text-[#1D1D1F] font-[500] mb-[10px] leading-[22px]">
              Other special conditions
            </p>
            <input
              placeholder="Type special conditions here..."
              value={otherInputs[currentStep] || ""}
              onChange={(e) => handleOtherOptionChange(e.target.value)}
              className="w-full border border-[#DFDFDF] rounded-[8px] px-[16px] py-[11px] resize-none text-[16px] font-[500] text-[#1D1D1F] outline-none"
            />
          </div>
        )}

        <div className="flex flex-col flex-col-reverse gap-[16px] md:flex-row justify-between w-full">
          <button
            onClick={onClose}
            className="px-[16px] py-[11px] rounded-[1000px] md:bg-[#DDEBF6] text-[#1C63DB] w-full md:w-[128px] text-[16px] font-[600] leading-[22px]"
          >
            Cancel
          </button>

          <div>
            {currentStep > 0 && !isMobile && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-[16px] py-[11px] rounded-[1000px] text-[#1C63DB] w-[128px] text-[16px] font-[600] leading-[22px]"
              >
                Back
              </button>
            )}

            <button
              onClick={handleNextStepClick}
              className={`px-[16px] py-[11px] rounded-[1000px] w-full md:w-[128px] text-[16px] font-[600] leading-[22px] bg-[#1C63DB] text-white ${!isStepValid ? "opacity-50" : ""}`}
              disabled={!isStepValid}
            >
              {isLastStep ? "Done" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
