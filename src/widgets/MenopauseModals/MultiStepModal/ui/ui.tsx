import { MenopauseSubmissionRequest, Symptom } from "entities/user";
import React, { useEffect, useState } from "react";
import { steps as initialSteps } from "../mock";
import { ModalLayout } from "./modal-layout";
import { ModalStepper } from "./modal-steper";
import { StepContent } from "./step-content";
import { ModalNavigation } from "./modal-navigation";

interface MultiStepModalProps {
  isOpen: boolean;
  symptoms: Symptom[];
  onClose: () => void;
  onComplete: (results: MenopauseSubmissionRequest) => Promise<void>;
}

export const MultiStepModal: React.FC<MultiStepModalProps> = ({
  isOpen,
  symptoms,
  onClose,
  onComplete,
}) => {
  const [steps, setSteps] = useState(initialSteps);
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

  // useEffect(() => {
  //   const newSteps = [...initialSteps];
  //   newSteps[0] = {
  //     ...newSteps[0],
  //     options: symptoms.map((s) => ({ id: s.id, name: s.name })),
  //   };
  //   setSteps(newSteps);
  // }, [symptoms]);

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
    console.log("handleNextStepClick", currentStep, step, isLastStep);

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
      isTallScreen={isTallScreen}
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
