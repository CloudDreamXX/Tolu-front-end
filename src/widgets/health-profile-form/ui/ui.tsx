import { zodResolver } from "@hookform/resolvers/zod";
import {
  HealthHistory,
  HealthHistoryPostData,
  HealthHistoryService,
} from "entities/health-history";
import { Steps } from "features/steps/ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Form,
} from "shared/ui";
import * as z from "zod";

import {
  BasicInformationForm,
  basicInformationSchema,
} from "./basic-information-form";
import { SocialFactorsForm, socialFactorsSchema } from "./social-factors";

import {
  ConsentSubmissionForm,
  consentSubmissionSchema,
} from "./consent-and-submission";
import {
  HealthStatusHistoryForm,
  healthStatusHistorySchema,
} from "./health-status-history-form";
import { mapHealthHistoryToFormDefaults, prune } from "./lib";
import {
  LifestyleHabitsForm,
  lifestyleHabitsSchema,
} from "./lifestyle-habits-form";
import {
  MetabolicDigestiveHealthForm,
  metabolicDigestiveHealthSchema,
} from "./metabolic-digestive-health-form";
import {
  NutritionHabitsForm,
  nutritionHabitsSchema,
} from "./nutrition-habits-form";
import { WomensHealthForm, womensHealthSchema } from "./womens-health";
import { DrivesAndGoalsForm, drivesAndGoalsSchema } from "./drives-and-goals";
import { usePageWidth } from "shared/lib";
import { ConfirmCancelModal } from "widgets/ConfirmCancelModal";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

const steps = [
  "Demographics",
  "Social Factors",
  "Health Status & History",
  "Lifestyle & Habits",
  "Nutrition Habits",
  "Women’s Health",
  "Metabolic & Digestive Health",
  "Drives and Goals",
  "Consent & Submission",
];

export const baseFormSchema = basicInformationSchema
  .and(socialFactorsSchema)
  .and(healthStatusHistorySchema)
  .and(lifestyleHabitsSchema)
  .and(nutritionHabitsSchema)
  .and(womensHealthSchema)
  .and(metabolicDigestiveHealthSchema)
  .and(drivesAndGoalsSchema)
  .and(consentSubmissionSchema);

type BaseValues = z.infer<typeof baseFormSchema>;

const formSchema = baseFormSchema
  .refine(
    (data: BaseValues) => {
      if (data.medications === "other") {
        return !!data.otherMedications && data.otherMedications.length > 0;
      }
      return true;
    },
    {
      message: "Please specify your other medications.",
      path: ["otherMedications"],
    }
  )
  .refine(
    (data: BaseValues) => {
      if (data.exerciseHabits === "other") {
        return (
          !!data.otherExerciseHabits && data.otherExerciseHabits.length > 0
        );
      }
      return true;
    },
    {
      message: "Please specify your other exercise habits.",
      path: ["otherExerciseHabits"],
    }
  )
  .superRefine((data: BaseValues, ctx) => {
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

type Props = { healthHistory?: HealthHistory };

const DEFAULT_NEW_FIELDS = {
  genderIdentity: "",
  genderSelfDescribe: "",
  sexAssignedAtBirth: "",
  race: "",
  language: "",
  country: "",
  ethnicity: "",
  otherEthnicity: "",
  household: "",
  otherHousehold: "",
  occupation: "",
  otherOccupation: "",
  education: "",
} as const;

export const HealthProfileForm: React.FC<Props> = ({ healthHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const { isMobile } = usePageWidth();

  const form = useForm<BaseValues>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      ...DEFAULT_NEW_FIELDS,
      ...mapHealthHistoryToFormDefaults(healthHistory),
    } as Partial<BaseValues>,
  });

  useEffect(() => {
    if (healthHistory) {
      const defaults = {
        ...DEFAULT_NEW_FIELDS,
        ...mapHealthHistoryToFormDefaults(healthHistory),
      };
      form.reset(defaults as any);
    }
  }, [healthHistory]);

  const stepFields: Array<(keyof BaseValues)[]> = [
    [
      "age",
      "genderIdentity",
      "genderSelfDescribe",
      "sexAssignedAtBirth",
      "race",
      "language",
      "country",
    ],
    [
      "ethnicity",
      "otherEthnicity",
      "household",
      "otherHousehold",
      "occupation",
      "otherOccupation",
      "education",
      "religion",
    ],
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
      "dietDetails",
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

  const mapToApi = (values: BaseValues): HealthHistoryPostData => {
    const genderForApi =
      values.genderIdentity === "self_describe" &&
      values.genderSelfDescribe?.trim()
        ? values.genderSelfDescribe.trim()
        : values.genderIdentity;

    const resolvedEthnicity =
      values.ethnicity === "Other (please specify)"
        ? (values.otherEthnicity?.trim() ?? "")
        : values.ethnicity;

    const resolvedHousehold =
      values.household === "Other (please specify)"
        ? (values.otherHousehold?.trim() ?? "")
        : values.household;

    const resolvedOccupation =
      values.occupation === "Other (please specify)"
        ? (values.otherOccupation?.trim() ?? "")
        : values.occupation;

    return {
      age: Number(values.age),
      gender: values.sexAssignedAtBirth,
      gender_identity: genderForApi,
      location: values.country,
      language: values.language,
      ethnicity: resolvedEthnicity,
      household: resolvedHousehold,
      job: resolvedOccupation,
      education: values.education,
      religion: values.religion,

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
      follow_up_recommendation: values.followUpMethod,
      recommendation_destination: `${values.countryCode}${values.phoneNumber}`,

      height: "",
      weight: "",
      marital_status: "",
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
  };

  const submitHealthHistory = async (
    values: BaseValues,
    { partial = false }: { partial?: boolean } = {}
  ) => {
    const payload = prune(mapToApi(values)) as Partial<HealthHistoryPostData>;
    const labFile = values.labTestFile || undefined;

    await HealthHistoryService.createHealthHistory(payload as any, labFile);

    if (!partial) {
      setCurrentStep(0);
      setIsOpen(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await submitHealthHistory(values, { partial: false });
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const goToStep = async (nextStep: number) => {
    if (nextStep === currentStep) return;

    const ok = await form.trigger(stepFields[currentStep] as any);
    if (!ok) return;

    await submitHealthHistory(form.getValues() as BaseValues, {
      partial: true,
    });

    const isLastStep = currentStep === steps.length - 1;
    if (isLastStep && nextStep > currentStep) {
      const allValid = await form.trigger();
      if (!allValid) return;
      return onSubmit(form.getValues());
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
        <Button
          variant="brightblue"
          size={isMobile ? "sm" : "icon"}
          className="px-[10px] rounded-full md:h-14 md:w-14"
        >
          {isMobile ? (
            "Health profile"
          ) : (
            <MaterialIcon iconName="manage_accounts" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-32px)] md:max-w-3xl gap-6 left-[50%] bottom-auto top-[50%] rounded-[18px] z-50 flex flex-col translate-x-[-50%] translate-y-[-50%]">
        <DialogTitle>Your Health Status Now</DialogTitle>

        <Steps
          steps={steps}
          stepWidth={
            "text-[12px] w-[114px] md:text-[14px] md:w-[416px] lg:w-[389px]"
          }
          currentStep={currentStep}
          ordered
          onStepClick={goToStep}
        />

        <div className="max-h-[65vh] overflow-y-auto">
          <Form {...form}>
            {currentStep === 0 && <BasicInformationForm form={form} />}
            {currentStep === 1 && <SocialFactorsForm form={form} />}
            {currentStep === 2 && <HealthStatusHistoryForm form={form} />}
            {currentStep === 3 && <LifestyleHabitsForm form={form} />}
            {currentStep === 4 && <NutritionHabitsForm form={form} />}
            {currentStep === 5 && <WomensHealthForm form={form} />}
            {currentStep === 6 && <MetabolicDigestiveHealthForm form={form} />}
            {currentStep === 7 && <DrivesAndGoalsForm form={form} />}
            {currentStep === 8 && <ConsentSubmissionForm form={form} />}
          </Form>
        </div>

        <div className="flex flex-row gap-4 justify-between w-full">
          <Button
            variant="blue2"
            className="w-24 md:w-32"
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
                className="w-24 md:w-32 bg-white"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
            )}
            <Button
              variant="brightblue"
              className="w-24 md:w-32"
              onClick={handleNextStep}
            >
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>

      {confirmOpen && (
        <ConfirmCancelModal
          onCancel={() => {
            setConfirmOpen(false);
            setIsOpen(true);
          }}
          onDiscard={onDiscard}
          title={"Are you sure you want to leave personalization?"}
          description={
            "Sad to see you go! We’ve saved your progress so you can come back and finish anytime that works for you."
          }
          backTitle={"Back to personalization"}
          continueTitle={"Leave anyway"}
        />
      )}
    </Dialog>
  );
};
