import { UserCircleGearIcon } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Steps } from "features/steps/ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Form,
} from "shared/ui";
import {
  BasicInformationForm,
  basicInformationSchema,
} from "./basic-information-form";
import {
  HealthStatusHistoryForm,
  healthStatusHistorySchema,
} from "./health-status-history-form";
import {
  LifestyleHabitsForm,
  lifestyleHabitsSchema,
} from "./lifestyle-habits-form";
import {
  NutritionHabitsForm,
  nutritionHabitsSchema,
} from "./nutrition-habits-form";
import { WomensHealthForm, womensHealthSchema } from "./womens-health";
import {
  MetabolicDigestiveHealthForm,
  metabolicDigestiveHealthSchema,
} from "./metabolic-digestive-health-form";
import { DrivesAndGoalsForm, drivesAndGoalsSchema } from "./drives-and-goals";
import {
  ConsentSubmissionForm,
  consentSubmissionSchema,
} from "./consent-and-submission";
import {
  HealthHistory,
  HealthHistoryPostData,
  HealthHistoryService,
} from "entities/health-history";
import { ConfirmCancel } from "./confirm-cancel";
import { mapHealthHistoryToFormDefaults } from "./lib";

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

export const baseFormSchema = basicInformationSchema
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

type Props = {
  healthHistory?: HealthHistory;
};

export const HealthProfileForm: React.FC<Props> = ({ healthHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: mapHealthHistoryToFormDefaults(healthHistory),
  });

  useEffect(() => {
    if (healthHistory) {
      const defaults = mapHealthHistoryToFormDefaults(healthHistory);
      form.reset(defaults);
    }
  }, [healthHistory]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const transformed: HealthHistoryPostData = {
      age: Number(values.age),
      gender: values.gender,
      height: values.height,
      weight: values.weight,
      current_health_concerns: values.healthConcerns,
      diagnosed_conditions: values.medicalConditions,
      medications:
        values.medications === "other"
          ? values.otherMedications
          : values.medications,
      supplements: values.supplements,
      allergies_intolerances: values.allergies,
      family_health_history: values.familyHistory,
      specific_diet: values.dietDetails,
      exercise_habits:
        values.exerciseHabits === "other"
          ? values.otherExerciseHabits
          : values.exerciseHabits,
      eat_decision: values.decisionMaker,
      cook_at_home: values.cookFrequency,
      takeout_food: values.takeoutFrequency,
      kind_of_food: values.commonFoods,
      diet_pattern: values.dietType,
      sleep_quality: String(values.sleepQuality),
      stress_levels: String(values.stressLevels),
      energy_levels: String(values.energyLevels),
      menstrual_cycle_status: values.menstrualCycleStatus,
      hormone_replacement_therapy: values.hormoneTherapy,
      fertility_concerns: values.fertilityConcerns,
      birth_control_use: values.birthControlUse,
      blood_sugar_concerns: values.bloodSugarConcern,
      digestive_issues: values.digestiveIssues,
      recent_lab_tests: values.recentLabTests === "Yes",
      health_goals: values.goals,
      why_these_goals: values.goalReason,
      desired_results_timeline: values.urgency,
      health_approach_preference: values.healthApproach,
      privacy_consent: values.agreeToPrivacy,
      follow_up_recommendations: values.followUpMethod,
      recommendation_destination: `${values.countryCode}${values.phoneNumber}`,
    };

    const labFile = values.labTestFile || undefined;

    try {
      await HealthHistoryService.createHealthHistory(transformed, labFile);

      form.reset();
      setCurrentStep(0);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const goToStep = async (nextStep: number) => {
    if (nextStep === currentStep) return;

    const stepFields = [
      ["age", "gender", "height", "weight"],
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
      const allValid = await form.trigger();
      if (!allValid) return;

      onSubmit(form.getValues());
      return;
    }

    setCurrentStep(nextStep);
  };

  const handleNextStep = () => goToStep(currentStep + 1);
  const handlePreviousStep = () => goToStep(currentStep - 1);

  const onDiscard = () => {
    setConfirmOpen(false);
    form.reset();
    setCurrentStep(0);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 p-1 pr-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200">
          <div className="flex items-center justify-center border border-white rounded-full h-9 w-9">
            <UserCircleGearIcon size={24} />
          </div>
          My health profile 0/7
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl gap-6 max-h-[98vh] overflow-y-auto">
        <DialogTitle>Your Health Status Now</DialogTitle>
        <Steps
          steps={steps}
          currentStep={currentStep}
          ordered
          onStepClick={goToStep}
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
        <div className="flex flex-row justify-between w-full">
          <Button
            variant="blue2"
            className="w-32"
            onClick={() => {
              setIsOpen(false);
              setConfirmOpen(true);
            }}
          >
            Cancel
          </Button>
          <div className="flex flex-row gap-4">
            {currentStep > 0 && (
              <Button
                variant="light-blue"
                className="w-32 bg-white"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
            )}
            <Button
              variant="brightblue"
              className="w-32"
              onClick={handleNextStep}
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
      {confirmOpen && (
        <ConfirmCancel
          onCancel={() => {
            setConfirmOpen(false);
            setIsOpen(true);
          }}
          onDiscard={onDiscard}
        />
      )}
    </Dialog>
  );
};
