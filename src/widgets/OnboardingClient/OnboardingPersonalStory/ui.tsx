import { zodResolver } from "@hookform/resolvers/zod";
import { HealthHistoryService } from "entities/health-history";
import { Steps } from "features/steps/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Info from "shared/assets/icons/info";
import { Card, CardContent } from "shared/ui";
import { GoalsForm } from "widgets/library-small-chat/components/goals-form";
import { HealthHistoryForm } from "widgets/library-small-chat/components/health-history-form";
import { LifestyleForm } from "widgets/library-small-chat/components/lifestyle-form";
import { SymptomsForm } from "widgets/library-small-chat/components/symptoms-form";
import { mapFormToPostData } from "widgets/library-small-chat/lib";
import z from "zod";
import { OnboardingClientLayout } from "../Layout";
import { ConfirmCancelModal } from "widgets/ConfirmCancelModal";
import { MenopauseForm } from "widgets/library-small-chat/components/menopause-form/ui";

const steps = [
  "Demographic",
  "Menopause Status",
  "Health history",
  "Your Lifestyle",
  "Your Goals",
];

export const baseSchema = z.object({
  age: z.string().min(1),
  maritalStatus: z.string().min(1),
  job: z.string().min(1),
  children: z.string().min(1),
  location: z.string().min(1),
  religion: z.string().min(1),
  financialStatus: z.string().min(1),
  genderAssignedAtBirth: z.string().min(1),
  genderIdentity: z.string().min(1),

  menopauseStatus: z.string().min(1),
  mainSymptoms: z.string().min(1),
  symptomTracking: z.string().min(1),
  trackingDevice: z.string().min(1),
  biggestChallenge: z.string().min(1),
  successManaging: z.string().min(1),

  diagnosedConditions: z.string().min(1),
  geneticTraits: z.string().min(1),
  maternalSide: z.string().min(1),
  medications: z.string().min(1),

  lifestyleInfo: z.string().min(1),
  takeout: z.string().min(1),
  homeCooked: z.string().min(1),
  dietType: z.string().min(1),
  exercise: z.string().min(1),
  sexLife: z.string().min(1),
  supportSystem: z.string().min(1),

  goals: z.string().min(1),
});

export const OnboardingPersonalStory = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nav = useNavigate();
  const [IsCancelOpen, setIsCancelOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      age: "",
      maritalStatus: "",
      job: "",
      children: "",
      location: "",
      religion: "",
      financialStatus: "",
      genderAssignedAtBirth: "",
      genderIdentity: "",

      menopauseStatus: "",
      mainSymptoms: "",
      symptomTracking: "",
      trackingDevice: "",
      biggestChallenge: "",
      successManaging: "",

      diagnosedConditions: "",
      geneticTraits: "",
      maternalSide: "",
      medications: "",

      lifestyleInfo: "",
      takeout: "",
      homeCooked: "",
      dietType: "",
      exercise: "",
      sexLife: "",
      supportSystem: "",

      goals: "",
    },
  });

  const stepFields: (keyof z.infer<typeof baseSchema>)[][] = [
    [
      "age",
      "maritalStatus",
      "job",
      "children",
      "location",
      "religion",
      "financialStatus",
      "genderAssignedAtBirth",
      "genderIdentity",
    ],
    [
      "menopauseStatus",
      "mainSymptoms",
      "symptomTracking",
      "trackingDevice",
      "biggestChallenge",
      "successManaging",
    ],
    ["diagnosedConditions", "geneticTraits", "maternalSide", "medications"],
    [
      "lifestyleInfo",
      "takeout",
      "homeCooked",
      "dietType",
      "exercise",
      "sexLife",
      "supportSystem",
    ],
    ["goals"],
  ];

  const watchedValues = form.watch();
  const areCurrentStepFieldsFilled = stepFields[currentStep].every(
    (field) => watchedValues[field]?.trim() !== ""
  );

  const goToStep = async (nextStep: number) => {
    if (nextStep > currentStep) {
      const isValid = await form.trigger(stepFields[currentStep]);
      if (!isValid) return;
    }

    if (nextStep >= steps.length) {
      const formValues = form.getValues();
      const postData = mapFormToPostData(formValues);
      await HealthHistoryService.createHealthHistory(postData);
      nav("/finish");
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handlePreviousStep = () => setCurrentStep(currentStep - 1);
  const handleNextStep = () => goToStep(currentStep + 1);
  const handleStepClick = (stepIndex: number) => goToStep(stepIndex);

  const mainContent = (
    <Card className="flex flex-col w-full border-none shadow-none h-fit">
      <CardContent className="p-0">
        <p className="text-[24px] text-[#1D1D1F] font-[500] mb-[16px]">
          Personal story
        </p>
        <Steps
          steps={steps}
          stepWidth={
            "text-[12px] w-[114px] md:text-[14px] md:w-[416px] lg:w-[389px]"
          }
          currentStep={currentStep}
          ordered
          onStepClick={handleStepClick}
        />
        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 0 && <SymptomsForm form={form} />}
          {currentStep === 1 && <MenopauseForm form={form} />}
          {currentStep === 2 && <HealthHistoryForm form={form} />}
          {currentStep === 3 && <LifestyleForm form={form} />}
          {currentStep === 4 && <GoalsForm form={form} />}
        </form>
      </CardContent>

      {currentStep === 0 && (
        <div className="lg:hidden flex gap-4 p-4 items-center w-full lg:max-w-[718px] rounded-2xl bg-[#DDEBF6] mt-[8px]">
          <Info />
          <p className="text-[#1B2559] font-[Nunito] text-base font-normal">
            Your information is kept private and secure. It helps us provide
            smarter, more relevant support.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between w-full lg:max-w-[718px] gap-2 mt-6">
        <button
          className="hidden md:block flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
          onClick={() => setIsCancelOpen(true)}
        >
          Skip this for now
        </button>
        <button
          type="button"
          className={`w-full md:hidden py-[11px] px-[30px] rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#DDEBF6] text-[#1C63DB]`}
          onClick={handlePreviousStep}
        >
          Back
        </button>
        <div className="w-full md:w-fit flex gap-[16px]">
          <button
            type="button"
            className={`hidden md:block md:w-[128px] py-[11px] px-[30px] rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#DDEBF6] text-[#1C63DB]`}
            onClick={handlePreviousStep}
          >
            Back
          </button>
          <button
            type="button"
            className={`py-[11px] px-[30px] w-full md:w-fit rounded-full text-[16px] font-semibold transition-colors duration-200 ${
              areCurrentStepFieldsFilled
                ? "bg-[#1C63DB] text-white"
                : "bg-[#D5DAE2] text-[#5F5F65] events-none"
            }`}
            onClick={handleNextStep}
            disabled={!areCurrentStepFieldsFilled}
          >
            Continue
          </button>
        </div>
      </div>
      <button
        className="md:hidden mt-[24px] flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
        onClick={() => setIsCancelOpen(true)}
      >
        Skip this for now
      </button>

      {IsCancelOpen && (
        <ConfirmCancelModal
          title={"Are you sure you want to skip this form?"}
          description={
            "This helps us tailor your journey and ensure the right support — nothing is ever shared without your permission."
          }
          backTitle={"Skip this for now"}
          continueTitle={"Continue filling out"}
          onCancel={() => nav("/library")}
          onDiscard={() => setIsCancelOpen(false)}
          onClose={() => setIsCancelOpen(false)}
        />
      )}
    </Card>
  );

  const buttons = (
    <>
      {currentStep === 0 && (
        <div className="hidden lg:flex gap-4 p-4 items-center w-full lg:max-w-[718px] rounded-2xl bg-[#DDEBF6] mt-[8px]">
          <Info />
          <p className="text-[#1B2559] font-[Nunito] text-base font-normal">
            Your information is kept private and secure. It helps us provide
            smarter, more relevant support.
          </p>
        </div>
      )}
    </>
  );

  return (
    <OnboardingClientLayout
      currentStep={1}
      numberOfSteps={8}
      children={mainContent}
      buttons={buttons}
    />
  );
};
