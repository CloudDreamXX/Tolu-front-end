import { zodResolver } from "@hookform/resolvers/zod";
import {
  HealthHistory,
  HealthHistoryPostData,
  LabResultFile,
  useCreateHealthHistoryMutation,
  useGetUserHealthHistoryQuery,
} from "entities/health-history";
import { Steps } from "features/steps/ui";
import { useEffect, useMemo, useState } from "react";
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
import { LabFilePreview } from "./metabolic-digestive-health-form/LabFilePreview";
import { setHealthHistory } from "entities/health-history/lib";
import { useDispatch } from "react-redux";
import { useGetClientProfileQuery } from "entities/client";

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

const GI_LABELS: Record<string, string> = {
  woman: "Woman",
  man: "Man",
  nonbinary_genderqueer_expansive:
    "Non-binary / genderqueer / gender expansive",
  self_describe: "Prefer to self-describe",
  prefer_not_to_say: "Prefer not to say",
};
const SAB_LABELS: Record<string, string> = {
  female: "Female",
  male: "Male",
  intersex: "Intersex",
  prefer_not_to_say: "Prefer not to say",
};

const split = (s?: string) =>
  (s ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const fmtBool = (v: any) => (typeof v === "boolean" ? (v ? "Yes" : "No") : v);
const isFilled = (v: any) => {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim().length > 0;
  if (Array.isArray(v)) return v.length > 0;
  return typeof v === "number" || typeof v === "boolean";
};

export const HealthProfileForm: React.FC<Props> = ({ healthHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState(false);
  const { isMobile } = usePageWidth();
  const [preview, setPreview] = useState<{
    open: boolean;
    file?: LabResultFile;
  }>({
    open: false,
    file: undefined,
  });
  const dispatch = useDispatch();

  const form = useForm<BaseValues>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: {
      ...DEFAULT_NEW_FIELDS,
      ...mapHealthHistoryToFormDefaults(healthHistory),
    } as Partial<BaseValues>,
  });

  const { data: healthHistoryData, refetch } = useGetUserHealthHistoryQuery();

  const [createHealthHistory] = useCreateHealthHistoryMutation();

  const { data: client } = useGetClientProfileQuery();

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
      "labTestFiles",
    ],
    ["goals", "goalReason", "urgency", "healthApproach"],
    ["agreeToPrivacy", "followUpMethod", "countryCode", "phoneNumber"],
  ];

  const values = form.watch() as BaseValues;

  const allKeys = useMemo(() => stepFields.flat() as (keyof BaseValues)[], []);
  const hasAnyValue = useMemo(
    () => allKeys.some((k) => isFilled((values as any)[k])),
    [values, allKeys]
  );

  const percentage = useMemo(() => {
    const filled = allKeys.reduce(
      (acc, k) => acc + (isFilled((values as any)[k]) ? 1 : 0),
      0
    );
    return allKeys.length ? Math.round((filled / allKeys.length) * 100) : 0;
  }, [values, allKeys]);

  const showSummary = !isEditing && hasAnyValue;

  const SummaryLabel = ({ children }: { children: React.ReactNode }) => (
    <div className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-base">
      {children}
    </div>
  );

  const SummaryRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1">
      <SummaryLabel>{label}</SummaryLabel>
      <p className="text-sm text-gray-900">
        {value && String(value).trim() ? String(value) : "-"}
      </p>
    </div>
  );

  const normalize = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[’']/g, "'")
      .replace(/\s+/g, " ")
      .trim();

  const titleToStepIndex = (title: string, all: string[]) =>
    all.findIndex((t) => normalize(t) === normalize(title));

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => {
    const onEdit = () => {
      const idx = titleToStepIndex(title, steps);
      const next = idx < 0 ? 0 : idx;

      setIsEditing(true);
      setCurrentStep(next);
    };

    return (
      <div className="space-y-4 border-b border-[#EAEAEA] pb-4">
        <div className="text-[20px] font-medium flex items-center justify-between mr-[24px]">
          {title}
          <button className="cursor-pointer" onClick={onEdit}>
            <MaterialIcon iconName="edit" />
          </button>
        </div>
        <div className="space-y-2">{children}</div>
      </div>
    );
  };

  const resolvedGenderIdentity = values.genderIdentity
    ? (GI_LABELS[values.genderIdentity] ?? values.genderIdentity)
    : "";
  const resolvedSexAtBirth = values.sexAssignedAtBirth
    ? (SAB_LABELS[values.sexAssignedAtBirth] ?? values.sexAssignedAtBirth)
    : "";

  const languagesSel = split(values.language).join(", ");
  const resolvedMedications =
    values.medications === "other" && values.otherMedications?.trim()
      ? `Other: ${values.otherMedications}`
      : (values.medications ?? "");
  const resolvedExercise =
    values.exerciseHabits === "other" && values.otherExerciseHabits?.trim()
      ? `Other: ${values.otherExerciseHabits}`
      : (values.exerciseHabits ?? "");

  const resolvedEthnicity =
    values.ethnicity === "Other (please specify)"
      ? (values.otherEthnicity ?? "")
      : (values.ethnicity ?? "");
  const resolvedHousehold =
    values.household === "Other (please specify)"
      ? (values.otherHousehold ?? "")
      : (values.household ?? "");
  const resolvedOccupation =
    values.occupation === "Other (please specify)"
      ? (values.otherOccupation ?? "")
      : (values.occupation ?? "");

  const mapToApi = (v: BaseValues): HealthHistoryPostData => {
    const genderForApi =
      v.genderIdentity === "self_describe" && v.genderSelfDescribe?.trim()
        ? v.genderSelfDescribe.trim()
        : v.genderIdentity;

    const resEthnicity =
      v.ethnicity === "Other (please specify)"
        ? (v.otherEthnicity?.trim() ?? "")
        : v.ethnicity;

    const resHousehold =
      v.household === "Other (please specify)"
        ? (v.otherHousehold?.trim() ?? "")
        : v.household;

    const resOccupation =
      v.occupation === "Other (please specify)"
        ? (v.otherOccupation?.trim() ?? "")
        : v.occupation;

    return {
      age: Number(v.age),
      gender: v.sexAssignedAtBirth,
      gender_identity: genderForApi,
      location: v.country,
      language: v.language,
      ethnicity: resEthnicity,
      household: resHousehold,
      job: resOccupation,
      education: v.education,
      religion: v.religion,

      current_health_concerns: v.healthConcerns,
      diagnosed_conditions: v.medicalConditions,
      medications:
        v.medications === "other" ? v.otherMedications : v.medications,
      supplements: v.supplements,
      allergies_intolerances: v.allergies,
      family_health_history: v.familyHistory,

      specific_diet: v.dietDetails,
      exercise_habits:
        v.exerciseHabits === "other" ? v.otherExerciseHabits : v.exerciseHabits,
      eat_decision: v.decisionMaker,
      cook_at_home: v.cookFrequency,
      takeout_food: v.takeoutFrequency,
      kind_of_food: v.commonFoods,
      diet_pattern: v.dietType,

      sleep_quality: String(v.sleepQuality),
      stress_levels: String(v.stressLevels),
      energy_levels: String(v.energyLevels),

      menstrual_cycle_status: v.menstrualCycleStatus,
      hormone_replacement_therapy: v.hormoneTherapy,
      fertility_concerns: v.fertilityConcerns,
      birth_control_use: v.birthControlUse,

      blood_sugar_concerns: v.bloodSugarConcern,
      digestive_issues: v.digestiveIssues,
      recent_lab_tests: v.recentLabTests === "Yes",

      health_goals: v.goals,
      why_these_goals: v.goalReason,
      desired_results_timeline: v.urgency,
      health_approach_preference: v.healthApproach,

      privacy_consent: v.agreeToPrivacy,
      follow_up_recommendation: v.followUpMethod,
      recommendation_destination: `${v.countryCode ?? ""}${v.phoneNumber ?? ""}`,
    };
  };

  const base64ToFile = (
    base64: string,
    filename: string,
    contentType: string
  ): File => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: contentType });
    return new File([blob], filename, { type: contentType });
  };

  const submitHealthHistory = async (
    vals: BaseValues,
    { partial = false }: { partial?: boolean } = {}
  ) => {
    const payload = prune(mapToApi(vals)) as Partial<HealthHistoryPostData>;

    let labFiles: File[] | undefined;

    if (Array.isArray(vals.labTestFiles)) {
      if (
        vals.labTestFiles.length > 0 &&
        vals.labTestFiles[0].content &&
        vals.labTestFiles[0].filename
      ) {
        labFiles = vals.labTestFiles.map((labFile) =>
          base64ToFile(labFile.content, labFile.filename, labFile.content_type)
        );
      } else if (vals.labTestFiles[0] instanceof File) {
        labFiles = vals.labTestFiles as File[];
      }
    }

    await createHealthHistory({
      healthData: payload,
      labFiles,
    }).unwrap();

    refetch();
    if (healthHistoryData) {
      dispatch(setHealthHistory(healthHistoryData));
    }

    if (!partial) {
      setCurrentStep(0);
      // setIsOpen(false);
    }
  };

  const onSubmit = async (vals: z.infer<typeof formSchema>) => {
    try {
      await submitHealthHistory(vals, { partial: false });
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

  // const handleNextStep = () => goToStep(currentStep + 1);
  const handlePreviousStep = () => goToStep(currentStep - 1);

  const onDiscard = () => {
    setConfirmOpen(false);
    form.reset();
    setCurrentStep(0);
    setIsOpen(false);
  };

  const openPreview = (file: LabResultFile) => setPreview({ open: true, file });
  const closePreview = () => setPreview({ open: false, file: undefined });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        setIsOpen(o);
        if (!o) setIsEditing(false);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="brightblue"
          size={isMobile ? "sm" : "icon"}
          className="text-[12px] px-[10px] rounded-full md:h-14 md:w-14"
        >
          {isMobile ? (
            "Health profile"
          ) : (
            <MaterialIcon iconName="manage_accounts" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100%-32px)] md:max-w-3xl gap-6 left-[50%] bottom-auto top-[50%] rounded-[18px] z-50 flex flex-col translate-x-[-50%] translate-y-[-50%]">
        <div>
          <DialogTitle>Your Health Status Now</DialogTitle>
          {!isEditing && (
            <div
              aria-label="Health profile completion"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percentage}
              style={{
                backgroundImage: `linear-gradient(to right, #1C63DB 0%, #1C63DB ${percentage}%, rgba(0,0,0,0) ${percentage}%, rgba(0,0,0,0) 100%)`,
              }}
              className="hidden md:flex h-[32px] mt-[8px] md:w-[328px] text-nowrap items-center justify-between self-stretch bg-white rounded-[8px] border-[1px] border-[#1C63DB] py-[6px] gap-8 px-[16px]"
            >
              <span
                className={`text-[14px] font-semibold ${percentage > 40 ? "text-white" : ""}`}
              >
                Health profile completed
              </span>
              <span className="text-[14px] font-semibold">{percentage}%</span>
            </div>
          )}
        </div>

        {showSummary ? (
          <>
            <div className="space-y-6 max-h-[80vh] overflow-y-auto">
              <Section title="Demographics">
                <SummaryRow
                  label="Age"
                  value={String(client?.calculated_age) || ""}
                />
                <SummaryRow label="Gender" value={resolvedGenderIdentity} />
                {values.genderIdentity === "self_describe" && (
                  <SummaryRow
                    label="Self-description"
                    value={values.genderSelfDescribe ?? ""}
                  />
                )}
                <SummaryRow
                  label="Sex assigned at birth"
                  value={resolvedSexAtBirth}
                />
                <SummaryRow label="Language" value={languagesSel} />
                <SummaryRow
                  label="Country of Residence"
                  value={values.country ?? ""}
                />
              </Section>

              <Section title="Social Factors">
                <SummaryRow label="Ethnicity" value={resolvedEthnicity} />
                <SummaryRow label="Household Type" value={resolvedHousehold} />
                <SummaryRow label="Occupation" value={resolvedOccupation} />
                <SummaryRow
                  label="Education level"
                  value={values.education ?? ""}
                />
                <SummaryRow label="Religion" value={values.religion ?? ""} />
              </Section>

              <Section title="Health Status & History">
                <SummaryRow
                  label="Current health concerns"
                  value={values.healthConcerns ?? ""}
                />
                <SummaryRow
                  label="Diagnosed medical conditions"
                  value={values.medicalConditions ?? ""}
                />
                <SummaryRow label="Medications" value={resolvedMedications} />
                <SummaryRow
                  label="Supplements"
                  value={values.supplements ?? ""}
                />
                <SummaryRow
                  label="Known allergies or intolerances"
                  value={values.allergies ?? ""}
                />
                <SummaryRow
                  label="Family health history"
                  value={values.familyHistory ?? ""}
                />
              </Section>

              <Section title="Lifestyle & Habits">
                <SummaryRow label="Exercise habits" value={resolvedExercise} />
                <SummaryRow
                  label="Sleep quality"
                  value={String(values.sleepQuality ?? "")}
                />
                <SummaryRow
                  label="Stress levels"
                  value={String(values.stressLevels ?? "")}
                />
                <SummaryRow
                  label="Energy levels"
                  value={String(values.energyLevels ?? "")}
                />
              </Section>

              <Section title="Nutrition Habits">
                <SummaryRow
                  label="Decision maker"
                  value={values.decisionMaker ?? ""}
                />
                <SummaryRow
                  label="Cook at home frequency"
                  value={values.cookFrequency ?? ""}
                />
                <SummaryRow
                  label="Takeout frequency"
                  value={values.takeoutFrequency ?? ""}
                />
                <SummaryRow
                  label="Common foods"
                  value={values.commonFoods ?? ""}
                />
                <SummaryRow
                  label="Specific diet"
                  value={values.dietDetails ?? ""}
                />
              </Section>

              <Section title="Women’s Health">
                <SummaryRow
                  label="Menstrual cycle status"
                  value={values.menstrualCycleStatus ?? ""}
                />
                <SummaryRow
                  label="Hormone Replacement Therapy"
                  value={fmtBool(values.hormoneTherapy) as string}
                />
                <SummaryRow
                  label="Fertility concerns"
                  value={values.fertilityConcerns ?? ""}
                />
                <SummaryRow
                  label="Birth control use"
                  value={values.birthControlUse ?? ""}
                />
              </Section>

              <Section title="Metabolic & Digestive Health">
                <SummaryRow
                  label="Blood sugar concerns"
                  value={values.bloodSugarConcern ?? ""}
                />
                <SummaryRow
                  label="Digestive issues"
                  value={values.digestiveIssues ?? ""}
                />
                <SummaryRow
                  label="Recent lab tests"
                  value={values.recentLabTests ?? ""}
                />
                {values.labTestFiles?.map((file) => (
                  <div
                    key={file.filename}
                    className={
                      "px-3 py-1 flex items-center justify-between border border-[#DBDEE1] rounded-[8px]"
                    }
                  >
                    <div className="flex items-center w-full gap-3 md:w-1/3">
                      <MaterialIcon iconName="picture_as_pdf" />
                      <span className="text-[14px] text-[#1D1D1F]">
                        {file.original_filename}
                      </span>
                    </div>

                    <button
                      onClick={() => openPreview(file)}
                      className="flex items-center justify-center p-2 rounded hover:bg-black/5"
                      title="View"
                      aria-label="View"
                    >
                      <MaterialIcon iconName="visibility" fill={1} />
                    </button>
                  </div>
                ))}
              </Section>

              <Section title="Drives & Goals">
                <SummaryRow label="Goals" value={values.goals ?? ""} />
                <SummaryRow
                  label="Why these goals"
                  value={values.goalReason ?? ""}
                />
                <SummaryRow label="Urgency" value={values.urgency ?? ""} />
                <SummaryRow
                  label="Health approach"
                  value={values.healthApproach ?? ""}
                />
              </Section>

              <Section title="Consent & Submission">
                <SummaryRow
                  label="Agree to privacy"
                  value={fmtBool(values.agreeToPrivacy) as string}
                />
                <SummaryRow
                  label="Follow-up method"
                  value={values.followUpMethod ?? ""}
                />
              </Section>
            </div>
          </>
        ) : (
          <>
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
                {currentStep === 0 && (
                  <BasicInformationForm
                    form={form}
                    age={client?.calculated_age || 0}
                  />
                )}
                {currentStep === 1 && <SocialFactorsForm form={form} />}
                {currentStep === 2 && <HealthStatusHistoryForm form={form} />}
                {currentStep === 3 && <LifestyleHabitsForm form={form} />}
                {currentStep === 4 && <NutritionHabitsForm form={form} />}
                {currentStep === 5 && <WomensHealthForm form={form} />}
                {currentStep === 6 && (
                  <MetabolicDigestiveHealthForm form={form} />
                )}
                {currentStep === 7 && <DrivesAndGoalsForm form={form} />}
                {currentStep === 8 && <ConsentSubmissionForm form={form} />}
              </Form>
            </div>

            <div className="flex flex-row justify-between w-full gap-4">
              <Button
                variant="blue2"
                className="w-24 md:w-32"
                onClick={
                  isEditing
                    ? () => setIsEditing(false)
                    : () => {
                        setIsOpen(false);
                        setConfirmOpen(true);
                      }
                }
              >
                Cancel
              </Button>
              <div className="flex flex-row gap-4">
                {currentStep > 0 && (
                  <Button
                    variant="light-blue"
                    className="w-24 bg-white md:w-32"
                    onClick={handlePreviousStep}
                  >
                    Back
                  </Button>
                )}
                <Button
                  variant="brightblue"
                  className="w-24 md:w-32"
                  onClick={() => {
                    onSubmit(form.getValues());
                    setIsEditing(false);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Preview modal */}
        {preview.open && preview.file && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center">
            <div className="bg-white w-full h-full rounded-[16px] shadow-xl overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-5 py-4">
                <h2 className="text-[18px] font-bold">
                  Preview{" "}
                  <span className="text-[#1D1D1F]">
                    “{preview.file.filename}”
                  </span>
                </h2>
                <button
                  className="p-1 rounded hover:bg-black/5"
                  onClick={closePreview}
                >
                  <MaterialIcon iconName="close" fill={1} />
                </button>
              </div>

              <div className="relative flex-1 bg-[#F7F7F8] rounded-[8px] mx-[5px] md:mx-[40px] mb-[24px] px-[5px] md:px-6 py-6 overflow-auto">
                <div className="mx-auto w-full bg-white rounded-[12px] shadow p-6 space-y-5">
                  <LabFilePreview
                    filename={preview.file.filename}
                    className="min-h-[600px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
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
