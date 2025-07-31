import { zodResolver } from "@hookform/resolvers/zod";
import {
  HealthHistoryPostData,
  HealthHistoryService,
} from "entities/health-history";
import { Steps } from "features/steps/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, Form } from "shared/ui";
import z from "zod";
import { ConfirmCancelModal } from "widgets/ConfirmCancelModal";
import { OnboardingClientLayout } from "../Layout";
import {
  basicInformationSchema,
  BasicInformationForm,
} from "widgets/health-profile-form/ui/basic-information-form";
import {
  consentSubmissionSchema,
  ConsentSubmissionForm,
} from "widgets/health-profile-form/ui/consent-and-submission";
import {
  drivesAndGoalsSchema,
  DrivesAndGoalsForm,
} from "widgets/health-profile-form/ui/drives-and-goals";
import {
  healthStatusHistorySchema,
  HealthStatusHistoryForm,
} from "widgets/health-profile-form/ui/health-status-history-form";
import {
  lifestyleHabitsSchema,
  LifestyleHabitsForm,
} from "widgets/health-profile-form/ui/lifestyle-habits-form";
import {
  metabolicDigestiveHealthSchema,
  MetabolicDigestiveHealthForm,
} from "widgets/health-profile-form/ui/metabolic-digestive-health-form";
import {
  nutritionHabitsSchema,
  NutritionHabitsForm,
} from "widgets/health-profile-form/ui/nutrition-habits-form";
import {
  womensHealthSchema,
  WomensHealthForm,
} from "widgets/health-profile-form/ui/womens-health";

const steps = [
  "Basic Information",
  "Health Status & History",
  "Lifestyle & Habits",
  "Nutrition Habits",
  "Women’s Health",
  "Metabolic & Digestive Health",
  "Drives and Goals",
  "Consent & Submission",
];

const baseFormSchema = basicInformationSchema
  .merge(healthStatusHistorySchema)
  .merge(lifestyleHabitsSchema)
  .merge(nutritionHabitsSchema)
  .merge(womensHealthSchema)
  .merge(metabolicDigestiveHealthSchema)
  .merge(drivesAndGoalsSchema)
  .merge(consentSubmissionSchema);

const formSchema = baseFormSchema
  .refine(
    (data) => {
      if (data.medications === "other") {
        return data.otherMedications && data.otherMedications.length > 0;
      }
      return true;
    },
    {
      message: "Please specify your other medications.",
      path: ["otherMedications"],
    }
  )
  .refine(
    (data) => {
      if (data.exerciseHabits === "other") {
        return data.otherExerciseHabits && data.otherExerciseHabits.length > 0;
      }
      return true;
    },
    {
      message: "Please specify your other exercise habits.",
      path: ["otherExerciseHabits"],
    }
  )
  .superRefine((data, ctx) => {
    if (data.followUpMethod === "Text") {
      if (!data.phoneNumber || !/^\d{10}$/.test(data.phoneNumber)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Phone number must be exactly 10 digits",
          path: ["phoneNumber"],
        });
      }
    }
  });

export const OnboardingHealthProfile = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [IsCancelOpen, setIsCancelOpen] = useState(false);
  const nav = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      gender: "female",
      height: "",
      weight: "",

      healthConcerns: "",
      medicalConditions: "None",
      medications: "None",
      otherMedications: "",
      supplements: "None",
      allergies: "None",
      familyHistory: "None",

      diet: "None",
      dietType: "",
      dietDetails: "",
      cookFrequency: "",
      takeoutFrequency: "",
      decisionMaker: "",

      exerciseHabits: "light",
      otherExerciseHabits: "",

      sleepQuality: 1,
      stressLevels: 1,
      energyLevels: 2,

      menstrualCycleStatus: "",
      menstrualOther: "",
      hormoneTherapy: "",
      hormoneDetails: "",
      hormoneDuration: "",
      hormoneProvider: "",
      fertilityConcerns: "not_applicable",
      birthControlUse: "not_applicable",
      birthControlDetails: "",

      bloodSugarConcern: "",
      bloodSugarOther: "",
      digestiveIssues: "",
      digestiveOther: "",

      recentLabTests: "No",
      labTestFile: undefined,

      goals: "",
      goalReason: "",
      urgency: "",
      healthApproach: "",

      agreeToPrivacy: false,
      followUpMethod: "",
      countryCode: "",
      phoneNumber: "",
    },
  });

  const goToStep = async (nextStep: number) => {
    if (nextStep === currentStep) return;

    const stepFields = [
      ["age", "gender"],
      [
        "healthConcerns",
        "medicalConditions",
        "medications",
        "otherMedications",
        "supplements",
        "allergies",
        "familyHistory",
      ],
      [
        "diet",
        "exerciseHabits",
        "otherExerciseHabits",
        "sleepQuality",
        "stressLevels",
        "energyLevels",
      ],
      [
        "decisionMaker",
        "cookFrequency",
        "takeoutFrequency",
        "commonFoods",
        "dietType",
        "dietDetails",
      ],
      [
        "menstrualCycleStatus",
        "menstrualOther",
        "hormoneTherapy",
        "hormoneDetails",
        "hormoneDuration",
        "hormoneProvider",
        "fertilityConcerns",
        "birthControlUse",
        "birthControlDetails",
      ],
      [
        "bloodSugarConcern",
        "bloodSugarOther",
        "digestiveIssues",
        "digestiveOther",
        "recentLabTests",
        "labTestFile",
      ],
      ["goals", "goalReason", "urgency", "healthApproach"],
      ["agreeToPrivacy", "followUpMethod", "countryCode", "phoneNumber"],
    ];

    const isLastStep = currentStep === steps.length - 1;
    const currentFields = stepFields[currentStep] as (keyof z.infer<
      typeof formSchema
    >)[];

    const isValid = await form.trigger(currentFields);
    if (!isValid) return;

    if (isLastStep) {
      const formValues = form.getValues();
      const transformed: HealthHistoryPostData = {
        age: Number(formValues.age),
        gender: formValues.gender,
        height: formValues.height,
        weight: formValues.weight,
        current_health_concerns: formValues.healthConcerns,
        diagnosed_conditions: formValues.medicalConditions,
        medications:
          formValues.medications === "other"
            ? formValues.otherMedications
            : formValues.medications,
        supplements: formValues.supplements,
        allergies_intolerances: formValues.allergies,
        family_health_history: formValues.familyHistory,
        specific_diet: formValues.dietDetails,
        exercise_habits:
          formValues.exerciseHabits === "other"
            ? formValues.otherExerciseHabits
            : formValues.exerciseHabits,
        eat_decision: formValues.decisionMaker,
        cook_at_home: formValues.cookFrequency,
        takeout_food: formValues.takeoutFrequency,
        kind_of_food: formValues.commonFoods,
        diet_pattern: formValues.dietType,
        sleep_quality: String(formValues.sleepQuality),
        stress_levels: String(formValues.stressLevels),
        energy_levels: String(formValues.energyLevels),
        menstrual_cycle_status: formValues.menstrualCycleStatus,
        hormone_replacement_therapy: formValues.hormoneTherapy,
        fertility_concerns: formValues.fertilityConcerns,
        birth_control_use: formValues.birthControlUse,
        blood_sugar_concerns: formValues.bloodSugarConcern,
        digestive_issues: formValues.digestiveIssues,
        recent_lab_tests: formValues.recentLabTests === "Yes",
        health_goals: formValues.goals,
        why_these_goals: formValues.goalReason,
        desired_results_timeline: formValues.urgency,
        health_approach_preference: formValues.healthApproach,
        privacy_consent: formValues.agreeToPrivacy,
        follow_up_recommendations: formValues.followUpMethod,
        recommendation_destination: `${formValues.countryCode}${formValues.phoneNumber}`,
        marital_status: "",
        job: "",
        no_children: "",
        menopause_status: "",
        other_challenges: "",
        tried_strategies: "",
        maternal_health_history: "",
        paternal_health_history: "",
        lifestyle_information: "",
        lifestyle_limitations: "",
        sex_life: "",
        support_system: "",
      };
      const labFile = formValues.labTestFile || undefined;

      await HealthHistoryService.createHealthHistory(transformed, labFile);
      nav("/finish");
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handlePreviousStep = () => setCurrentStep(currentStep - 1);
  const handleNextStep = () => goToStep(currentStep + 1);
  const handleStepClick = (stepIndex: number) => goToStep(stepIndex);

  const mainContent = (
    <Card className="flex flex-col w-full border-none shadow-none h-full overflow-y-auto">
      <CardContent className="px-1">
        <p className="text-[24px] text-[#1D1D1F] font-[500] mb-[16px]">
          Your Health Status Now
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
        <Form {...form}>
          {currentStep === 0 && <BasicInformationForm form={form} />}
          {currentStep === 1 && <HealthStatusHistoryForm form={form} />}
          {currentStep === 2 && <LifestyleHabitsForm form={form} />}
          {currentStep === 3 && <NutritionHabitsForm form={form} />}
          {currentStep === 4 && <WomensHealthForm form={form} />}
          {currentStep === 5 && <MetabolicDigestiveHealthForm form={form} />}
          {currentStep === 6 && <DrivesAndGoalsForm form={form} />}
          {currentStep === 7 && <ConsentSubmissionForm form={form} />}
        </Form>
      </CardContent>

      <div className="flex items-center justify-between w-full lg:max-w-[718px] gap-2 mt-6">
        <button
          className={`${currentStep === 0 ? "flex w-full md:w-fit" : "hidden md:flex"} p-4 h-[44px] items-center justify-center text-base font-semibold text-[#1C63DB]`}
          onClick={() => setIsCancelOpen(true)}
        >
          Skip this for now
        </button>
        {currentStep !== 0 && (
          <button
            type="button"
            className={`w-full md:hidden py-[11px] px-[30px] rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#DDEBF6] text-[#1C63DB]`}
            onClick={handlePreviousStep}
          >
            Back
          </button>
        )}
        <div className="w-full md:w-fit flex gap-[16px]">
          {currentStep !== 0 && (
            <button
              type="button"
              className={`hidden md:block md:w-[128px] py-[11px] px-[30px] rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#DDEBF6] text-[#1C63DB]`}
              onClick={handlePreviousStep}
            >
              Back
            </button>
          )}
          <button
            type="button"
            className={`py-[11px] px-[30px] w-full md:w-fit rounded-full text-[16px] font-semibold transition-colors duration-200 bg-[#1C63DB] text-white`}
            onClick={handleNextStep}
          >
            Continue
          </button>
        </div>
      </div>

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

  return (
    <OnboardingClientLayout
      currentStep={currentStep}
      numberOfSteps={steps.length}
      children={mainContent}
    />
  );
};
