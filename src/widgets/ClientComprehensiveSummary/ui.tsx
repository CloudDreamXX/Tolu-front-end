import { Dialog, DialogContent, DialogTitle } from "shared/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { useGetCoachClientHealthHistoryQuery } from "entities/health-history";
import { stripOther } from "widgets/health-profile-form";
import { mapHealthHistoryToFormDefaults } from "widgets/health-profile-form/ui/lib";

export const ClientComprehensiveSummary = ({
  clientId,
  onOpenChange,
}: {
  clientId: string;
  onOpenChange: (v: boolean) => void;
}) => {
  const { data: healthHistoryData } =
    useGetCoachClientHealthHistoryQuery(clientId);

  const values = mapHealthHistoryToFormDefaults(healthHistoryData);

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

  const resolvedGender = values.genderIdentity
    ? (GI_LABELS[values.genderIdentity] ?? values.genderIdentity)
    : "";

  const resolvedBirthSex = values.sexAssignedAtBirth
    ? (SAB_LABELS[values.sexAssignedAtBirth] ?? values.sexAssignedAtBirth)
    : "";

  const languagesSel = (values.language || "")
    .split(",")
    .map((t: string) => t.trim())
    .filter(Boolean)
    .join(", ");

  const resolvedEthnicity =
    values.ethnicity === "Other (please specify)"
      ? values.otherEthnicity || ""
      : values.ethnicity;

  const resolvedHousehold =
    values.household === "Other (please specify)"
      ? values.otherHousehold || ""
      : values.household;

  const resolvedOccupation =
    values.occupation === "Other (please specify)"
      ? values.otherOccupation || ""
      : values.occupation;

  const resolvedMedications =
    values.medications === "other" && values.otherMedications
      ? `Other: ${values.otherMedications}`
      : (values.medications ?? "");

  const resolvedExercise =
    values.exerciseHabits === "other" && values.otherExerciseHabits
      ? `Other: ${values.otherExerciseHabits}`
      : (values.exerciseHabits ?? "");

  const fmtBool = (v: any) =>
    typeof v === "boolean" ? (v ? "Yes" : "No") : (v ?? "");

  const SummaryRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="space-y-1">
      <div className="font-medium text-base">{label}</div>
      <p className="text-sm text-gray-900">{value?.trim() ? value : "-"}</p>
    </div>
  );

  const Section = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <div className="space-y-4 border-b border-[#EAEAEA] pb-4">
      <h3 className="text-[18px] font-medium">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );

  return (
    <Dialog open={true} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-32px)] md:max-w-3xl gap-6 rounded-[18px] flex flex-col">
        <DialogTitle>Client Health Summary</DialogTitle>

        <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-2">
          <Section title="Demographics">
            <SummaryRow
              label="Age"
              value={values.age ? String(values.age) : ""}
            />
            <SummaryRow label="Gender" value={resolvedGender} />
            {values.genderIdentity === "self_describe" && (
              <SummaryRow
                label="Self-description"
                value={values.genderSelfDescribe}
              />
            )}
            <SummaryRow
              label="Sex assigned at birth"
              value={resolvedBirthSex}
            />
            <SummaryRow label="Language" value={languagesSel} />
            <SummaryRow label="Country of Residence" value={values.country} />
          </Section>

          <Section title="Social Factors">
            <SummaryRow
              label="Ethnicity"
              value={stripOther(resolvedEthnicity)}
            />
            <SummaryRow
              label="Household Type"
              value={stripOther(resolvedHousehold)}
            />
            <SummaryRow
              label="Occupation"
              value={stripOther(resolvedOccupation)}
            />
            <SummaryRow label="Education" value={values.education} />
            <SummaryRow label="Religion" value={values.religion} />
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
              value={stripOther(resolvedMedications)}
            />
            <SummaryRow
              label="Supplements"
              value={stripOther(values.supplements)}
            />
            <SummaryRow
              label="Allergies"
              value={stripOther(values.allergies)}
            />
            <SummaryRow
              label="Family health history"
              value={stripOther(values.familyHistory)}
            />
          </Section>

          <Section title="Lifestyle & Habits">
            <SummaryRow label="Exercise habits" value={resolvedExercise} />
            <SummaryRow
              label="Sleep quality"
              value={values.sleepQuality ? String(values.sleepQuality) : ""}
            />
            <SummaryRow
              label="Stress levels"
              value={values.stressLevels ? String(values.stressLevels) : ""}
            />
            <SummaryRow
              label="Energy levels"
              value={values.energyLevels ? String(values.energyLevels) : ""}
            />
          </Section>

          <Section title="Nutrition Habits">
            <SummaryRow label="Decision maker" value={values.decisionMaker} />
            <SummaryRow
              label="Cook at home frequency"
              value={values.cookFrequency}
            />
            <SummaryRow
              label="Takeout frequency"
              value={values.takeoutFrequency}
            />
            <SummaryRow
              label="Common foods"
              value={stripOther(values.commonFoods)}
            />
            <SummaryRow label="Specific diet" value={values.dietDetails} />
          </Section>

          <Section title="Women’s Health">
            <SummaryRow
              label="Menstrual cycle status"
              value={values.menstrualCycleStatus}
            />
            <SummaryRow
              label="Hormone therapy"
              value={fmtBool(values.hormoneTherapy)}
            />
            <SummaryRow
              label="Fertility concerns"
              value={values.fertilityConcerns}
            />
            <SummaryRow
              label="Birth control use"
              value={values.birthControlUse}
            />
          </Section>

          <Section title="Metabolic & Digestive Health">
            <SummaryRow
              label="Blood sugar concerns"
              value={stripOther(values.bloodSugarConcern)}
            />
            <SummaryRow
              label="Digestive issues"
              value={stripOther(values.digestiveIssues)}
            />
            <SummaryRow
              label="Recent lab tests"
              value={values.recentLabTests}
            />

            {values.labTestFiles?.map((file: any) => (
              <div
                key={file.filename}
                className="px-3 py-1 flex items-center justify-between border border-[#DBDEE1] rounded-[8px]"
              >
                <div className="flex items-center gap-3">
                  <MaterialIcon iconName="picture_as_pdf" />
                  <span className="text-[14px] text-[#1D1D1F]">
                    {file.original_filename}
                  </span>
                </div>
              </div>
            ))}
          </Section>

          <Section title="Drives & Goals">
            <SummaryRow label="Goals" value={values.goals} />
            <SummaryRow label="Why these goals" value={values.goalReason} />
            <SummaryRow label="Urgency" value={values.urgency} />
            <SummaryRow
              label="Approach preference"
              value={values.healthApproach}
            />
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
