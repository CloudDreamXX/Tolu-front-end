import { MenopauseSubmissionRequest } from "entities/user";
import React, { useState } from "react";
import { usePageWidth } from "shared/lib";
import { steps as initialSteps } from "../mock";
import { ModalLayout } from "./modal-layout";
import { ModalNavigation } from "./modal-navigation";
import { ModalStepper } from "./modal-steper";
import { StepContent } from "./step-content";

interface MultiStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: MenopauseSubmissionRequest) => Promise<void>;
}

export const MultiStepModal: React.FC<MultiStepModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [steps] = useState(initialSteps);
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
  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;
  const folderId = step.folder_id;
  const hasSelectedOptions = selectedOptions[folderId]?.length > 0;
  const hasOtherInput = !!otherInputs[currentStep]?.trim();
  const isStepValid = hasSelectedOptions || hasOtherInput;
  const { isMobile, isTablet } = usePageWidth();

  if (!isOpen) return null;

  const addCustomSymptom = () => {
    setSelectedOptions((prev) => {
      const updated = { ...prev };
      const current = prev[folderId] || [];
      const trimmedOther = otherInputs[currentStep]?.trim();
      if (trimmedOther && !current.includes(trimmedOther)) {
        updated[folderId] = [...current, trimmedOther];
      }
      return updated;
    });
    setOtherInputs((prev) => {
      const newOtherInputs = [...prev];
      newOtherInputs[currentStep] = "";
      return newOtherInputs;
    });
  };

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

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleNextStepClick = async () => {
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
        symptoms: selectedOptions[steps[0].folder_id],
        desired_health_change: selectedOptions[steps[1].folder_id],
        genetic_conditions: selectedOptions[steps[2].folder_id],
        helpful_management: selectedOptions[steps[3].folder_id],
        allergies_sensitivities: selectedOptions[steps[4].folder_id],
        menstrual_changes: selectedOptions[steps[5].folder_id],
      };

      try {
        await onComplete(submission);
      } catch (error) {
        console.error("Error submitting menopause data:", error);
        return;
      }

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
    <ModalLayout
      onClose={onClose}
      onBack={handleBack}
      currentStep={currentStep}
      isMobile={isMobile}
    >
      <ModalStepper
        steps={steps}
        currentStep={currentStep}
        isMobile={isMobile}
        isTablet={isTablet}
      />
      <StepContent
        step={step}
        selectedOptions={selectedOptions[folderId] || []}
        otherInput={otherInputs[currentStep] || ""}
        onOptionToggle={toggleOption}
        onOtherInputChange={handleOtherOptionChange}
        addCustomSymptom={addCustomSymptom}
      />
      <ModalNavigation
        onClose={onClose}
        onBack={handleBack}
        onNext={handleNextStepClick}
        currentStep={currentStep}
        isLastStep={isLastStep}
        isStepValid={isStepValid}
        isMobile={isMobile}
      />
    </ModalLayout>
  );
};
