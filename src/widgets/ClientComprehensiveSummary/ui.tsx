import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import {
  useGetCoachClientHealthHistoryQuery,
  useUpdateCoachClientHealthHistoryMutation,
  HealthHistoryPostData,
  LabResultFile,
} from "entities/health-history";

import { baseFormSchema, stripOther } from "widgets/health-profile-form";

import { Steps } from "features/steps/ui";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Button,
  Form,
  FormField,
  FormControl,
  FormItem,
  Textarea,
} from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { BasicInformationForm } from "widgets/health-profile-form/ui/basic-information-form";
import { DrivesAndGoalsForm } from "widgets/health-profile-form/ui/drives-and-goals";
import { HealthStatusHistoryForm } from "widgets/health-profile-form/ui/health-status-history-form";
import { prune } from "widgets/health-profile-form/ui/lib";
import { LifestyleHabitsForm } from "widgets/health-profile-form/ui/lifestyle-habits-form";
import { MetabolicDigestiveHealthForm } from "widgets/health-profile-form/ui/metabolic-digestive-health-form";
import { NutritionHabitsForm } from "widgets/health-profile-form/ui/nutrition-habits-form";
import { SocialFactorsForm } from "widgets/health-profile-form/ui/social-factors";
import { WomensHealthForm } from "widgets/health-profile-form/ui/womens-health";
import { mapHealthHistoryToFormDefaults } from "widgets/library-small-chat/lib";
import { FormValues } from "widgets/library-small-chat/components/health-history-form";
import { LabFilePreview } from "widgets/health-profile-form/ui/metabolic-digestive-health-form/LabFilePreview";

type BaseValues = z.infer<typeof baseFormSchema>;

const steps = [
  "Demographics",
  "Social Factors",
  "Health Status & History",
  "Lifestyle & Habits",
  "Nutrition Habits",
  "Women’s Health",
  "Metabolic & Digestive Health",
  "Drives & Goals",
];

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

export const ClientComprehensiveSummary = ({
  clientId,
  onOpenChange,
  asDialog = false,
}: {
  clientId: string;
  onOpenChange?: (v: boolean) => void;
  asDialog?: boolean;
}) => {
  const { data: healthHistoryData, refetch } =
    useGetCoachClientHealthHistoryQuery(clientId);

  const [updateHealthHistory] = useUpdateCoachClientHealthHistoryMutation();

  const form = useForm<BaseValues>({
    resolver: zodResolver(baseFormSchema),
    shouldUnregister: false,
    defaultValues: mapHealthHistoryToFormDefaults(
      healthHistoryData
    ) as Partial<FormValues>,
  });

  useEffect(() => {
    if (healthHistoryData) {
      form.reset(
        mapHealthHistoryToFormDefaults(healthHistoryData) as Partial<FormValues>
      );
    }
  }, [healthHistoryData]);

  const values = useWatch({
    control: form.control,
  });

  const followUpRecommendation = useWatch({
    control: form.control,
    name: "followUpRecommendation",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingCoachInput, setIsEditingCoachInput] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const [preview, setPreview] = useState<{
    open: boolean;
    file?: LabResultFile;
  }>({
    open: false,
    file: undefined,
  });

  const openPreview = (file: LabResultFile) => setPreview({ open: true, file });
  const closePreview = () => setPreview({ open: false, file: undefined });

  const mapToApi = (v: BaseValues): HealthHistoryPostData => {
    const genderForApi =
      v.genderIdentity === "self_describe" && v.genderSelfDescribe?.trim()
        ? v.genderSelfDescribe.trim()
        : v.genderIdentity;

    return {
      age: Number(v.age),
      gender: v.sexAssignedAtBirth,
      gender_identity: genderForApi,
      location: v.country,
      language: v.language,
      ethnicity: v.ethnicity,
      household: v.household,
      job: v.occupation,
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

      health_goals: v.goals,
      why_these_goals: v.goalReason,
      desired_results_timeline: v.urgency,
      health_approach_preference: v.healthApproach,

      privacy_consent: v.agreeToPrivacy,
      follow_up_recommendation: v.followUpRecommendation,
    };
  };

  const handleSaveCoachInput = async () => {
    const followUpMethod = form.getValues("followUpRecommendation");

    await updateHealthHistory({
      clientId,
      data: prune({
        follow_up_recommendation: followUpMethod,
      }),
    }).unwrap();

    await refetch();
  };

  const handleSave = async () => {
    const payload = prune(mapToApi(form.getValues()));

    await updateHealthHistory({
      clientId,
      data: payload,
    }).unwrap();

    await refetch();
    setIsEditing(false);
  };

  const resolvedGenderIdentity = values.genderIdentity
    ? (GI_LABELS[values.genderIdentity] ?? values.genderIdentity)
    : "";

  const resolvedSexAtBirth = values.gender
    ? (SAB_LABELS[values.gender] ?? values.gender)
    : "";

  const languagesSel = split(values.language).join(", ");

  const fmtBool = (v: any) => (typeof v === "boolean" ? (v ? "Yes" : "No") : v);

  const SummaryRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1">
      <div className="font-medium text-base">{label}</div>
      <p className="text-sm text-gray-900">
        {value && String(value).trim() ? String(value) : "-"}
      </p>
    </div>
  );

  const Section = ({
    title,
    children,
    button,
  }: {
    title: string;
    children: React.ReactNode;
    button?: React.ReactNode;
  }) => (
    <div className="space-y-4 border-b border-[#EAEAEA] pb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-medium">{title}</h3>
        {button
          ? button
          : !isEditing && (
            <Button
              variant="unstyled"
              size="unstyled"
              onClick={() => {
                setIsEditing(true);
                setCurrentStep(steps.indexOf(title));
              }}
            >
              <MaterialIcon iconName="edit" />
            </Button>
          )}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const content = (
    <>
      {!isEditing ? (
        <div className="space-y-6">
          <Section title="Demographics">
            <SummaryRow label="Age" value={values.age} />
            <SummaryRow label="Gender" value={resolvedGenderIdentity} />
            <SummaryRow
              label="Sex assigned at birth"
              value={resolvedSexAtBirth}
            />
            <SummaryRow label="Language" value={languagesSel} />
            <SummaryRow label="Country of Residence" value={values.country} />
          </Section>

          <Section title="Health Status & History">
            <SummaryRow
              label="Current health concerns"
              value={stripOther(values.healthConcerns)}
            />
            <SummaryRow
              label="Medical conditions"
              value={stripOther(values.medicalConditions)}
            />
            <SummaryRow
              label="Medications"
              value={stripOther(values.medications)}
            />
            <SummaryRow
              label="Supplements"
              value={stripOther(values.supplements)}
            />
            <SummaryRow
              label="Family health history"
              value={stripOther(values.familyHistory)}
            />
          </Section>

          <Section title="Lifestyle & Habits">
            <SummaryRow label="Exercise habits" value={values.exerciseHabits} />
            <SummaryRow
              label="Sleep quality"
              value={String(values.sleepQuality) || ""}
            />
            <SummaryRow
              label="Stress levels"
              value={String(values.stressLevels) || ""}
            />
            <SummaryRow
              label="Energy levels"
              value={String(values.energyLevels) || ""}
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
              value={stripOther(values.commonFoods) ?? ""}
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
              value={stripOther(values.bloodSugarConcern) ?? ""}
            />
            <SummaryRow
              label="Digestive issues"
              value={stripOther(values.digestiveIssues) ?? ""}
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

                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  onClick={() => openPreview(file)}
                  className="flex items-center justify-center p-2 rounded hover:bg-black/5"
                  title="View"
                  aria-label="View"
                >
                  <MaterialIcon iconName="visibility" fill={1} />
                </Button>
              </div>
            ))}
          </Section>

          <Section title="Drives & Goals">
            <SummaryRow label="Goals" value={values.goals} />
            <SummaryRow label="Why these goals" value={values.goalReason} />
            <SummaryRow label="Urgency" value={values.urgency} />
            <SummaryRow label="Health approach" value={values.healthApproach} />
          </Section>
          {/* <Section title="Coach Input" button={<Button
            variant="unstyled"
            size="unstyled"
            onClick={() => setIsEditingCoachInput(true)}
          >
            <MaterialIcon iconName="edit" />
          </Button>}> */}
          <div className="space-y-4 border-b border-[#EAEAEA] pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[18px] font-medium">Coach Input</h3>
              <Button
                variant="unstyled"
                size="unstyled"
                onClick={() => setIsEditingCoachInput(true)}
              >
                <MaterialIcon iconName="edit" />
              </Button>
            </div>
            <div className="space-y-2"></div>
            {!isEditingCoachInput ? (
              <>
                <SummaryRow label="" value={followUpRecommendation} />
              </>
            ) : (
              <>
                <FormField
                  control={form.control}
                  name="followUpRecommendation"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Add your notes..."
                          containerClassName="rounded-[6px] py-[8px] px-[12px]"
                          className="xl:text-[14px]"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2 mt-3">
                  <Button
                    variant="light-blue"
                    size="sm"
                    onClick={() => {
                      form.setValue(
                        "followUpRecommendation",
                        healthHistoryData?.follow_up_recommendation ?? ""
                      );
                      setIsEditingCoachInput(false);
                    }}
                  >
                    Cancel
                  </Button>

                  <Button
                    variant="brightblue"
                    size="sm"
                    onClick={async () => {
                      await handleSaveCoachInput();
                      setIsEditingCoachInput(false);
                    }}
                  >
                    Save
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-[24px] overflow-y-auto">
          <Steps
            steps={steps}
            ordered
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />

          {currentStep === 0 && (
            <BasicInformationForm form={form} age={Number(values?.age) || 0} />
          )}
          {currentStep === 1 && <SocialFactorsForm form={form} />}
          {currentStep === 2 && <HealthStatusHistoryForm form={form} />}
          {currentStep === 3 && <LifestyleHabitsForm form={form} />}
          {currentStep === 4 && <NutritionHabitsForm form={form} />}
          {currentStep === 5 && <WomensHealthForm form={form} />}
          {currentStep === 6 && <MetabolicDigestiveHealthForm form={form} />}
          {currentStep === 7 && <DrivesAndGoalsForm form={form} />}

          <div className="flex justify-between mt-4">
            <Button variant="light-blue" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button variant="brightblue" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      )}
    </>
  );

  if (asDialog) {
    return (
      <Dialog open onOpenChange={onOpenChange}>
        <DialogContent className="min-h-[80vh] h-[90vh] md:max-w-3xl rounded-[18px] overflow-y-auto">
          <DialogTitle>Client Health Summary</DialogTitle>
          <Form {...form}>{content}</Form>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="w-full rounded-[18px] border border-[#EAEAEA] p-6 overflow-y-auto max-h-[calc(100vh-130px)]">
      <Form {...form}>{content}</Form>

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
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="p-1 rounded hover:bg-black/5"
                onClick={closePreview}
              >
                <MaterialIcon iconName="close" fill={1} />
              </Button>
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
    </div>
  );
};
