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
import { OnboardingClientLayout } from "../Layout";
import { mapFormToPostData } from "widgets/library-small-chat/lib";
import z from "zod";

const steps = [
  "Symptoms",
  "Your Health History",
  "Your Lifestyle",
  "Your Goals",
];

export const baseSchema = z.object({
  age: z.string(),
  maritalStatus: z.string(),
  job: z.string(),
  children: z.string(),
  menopauseStatus: z.string(),
  mainSymptoms: z.string(),
  otherChallenges: z.string(),
  strategiesTried: z.string(),
  diagnosedConditions: z.string(),
  geneticTraits: z.string(),
  maternalSide: z.string(),
  paternalSide: z.string(),
  notableConcern: z.string(),
  stressLevel: z.string(),
  takeout: z.string(),
  homeCooked: z.string(),
  dietType: z.string(),
  exercise: z.string(),
  limitations: z.string(),
  medications: z.string(),
  period: z.string(),
  sexLife: z.string(),
  supportSystem: z.string(),
  goals: z.string(),
});

export const OnboardingPersonalStory = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const nav = useNavigate();

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver: zodResolver(baseSchema),
    defaultValues: {
      age: "",
      maritalStatus: "",
      job: "",
      children: "",
      menopauseStatus: "",
      mainSymptoms: "",
      otherChallenges: "",
      strategiesTried: "",
      diagnosedConditions: "",
      geneticTraits: "",
      maternalSide: "",
      paternalSide: "",
      notableConcern: "",
      stressLevel: "",
      takeout: "",
      homeCooked: "",
      dietType: "",
      exercise: "",
      limitations: "",
      medications: "",
      period: "",
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
      "menopauseStatus",
      "mainSymptoms",
      "otherChallenges",
      "strategiesTried",
    ],
    [
      "diagnosedConditions",
      "geneticTraits",
      "maternalSide",
      "paternalSide",
      "notableConcern",
    ],
    [
      "stressLevel",
      "takeout",
      "homeCooked",
      "dietType",
      "exercise",
      "limitations",
      "medications",
      "period",
      "sexLife",
      "supportSystem",
    ],
    ["goals"],
  ];

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
          stepWidth={"lg:w-[462px]"}
          currentStep={currentStep}
          ordered
          onStepClick={handleStepClick}
        />
        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 0 && <SymptomsForm form={form} />}
          {currentStep === 1 && <HealthHistoryForm form={form} />}
          {currentStep === 2 && <LifestyleForm form={form} />}
          {currentStep === 3 && <GoalsForm form={form} />}
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
          onClick={() => nav("/library")}
        >
          Skip this for now
        </button>
        <button
          type="button"
          className={`md:hidden w-full py-[11px] px-[30px] rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#DDEBF6] text-[#1C63DB]`}
          onClick={handleNextStep}
        >
          Back
        </button>
        <button
          type="button"
          className={`py-[11px] px-[30px] w-full md:w-fit rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#1C63DB] text-white`}
          onClick={handleNextStep}
        >
          Continue
        </button>
      </div>
      <button
        className="md:hidden mt-[24px] flex p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]"
        onClick={() => nav("/library")}
      >
        Skip this for now
      </button>
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
