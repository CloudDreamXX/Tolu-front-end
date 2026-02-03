import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  Input,
  Textarea,
  Checkbox,
} from "shared/ui";
import { z } from "zod";
import {
  CANCER,
  CARDIOVASCULAR,
  FREQUENCY_ITEMS,
  GASTROINTESTINAL,
  GENITAL_URINARY,
  HORMONES_METABOLIC,
  IMMUNE_INFLAMMATORY,
  MISCELLANEOUS,
  MUSCULOSKELETAL,
  NEUROLOGIC_MOOD,
  RESPIRATORY,
  SKIN,
} from "./lib";

export const frequencyEnum = z.enum(["yes", "no", "sometimes"]);
export const statusEnum = z.enum(["yes", "no"]);

export const medicalConditionSchema = z.object({
  status: statusEnum,
  date: z.string().optional(),
});

export const medicalHistorySchema = z.object({
  /* Gastrointestinal */
  conditionIbs: medicalConditionSchema.optional(),
  conditionCrohns: medicalConditionSchema.optional(),
  conditionUlcerativeColitis: medicalConditionSchema.optional(),
  conditionGastritisUlcer: medicalConditionSchema.optional(),
  conditionGerd: medicalConditionSchema.optional(),
  conditionCeliac: medicalConditionSchema.optional(),

  gastrointestinalDates: z.string().optional(),

  /* Environmental */
  chemicalToxicExposure: z.string().optional(),
  odorSensitivity: z.string().optional(),
  secondhandSmokeExposure: z.string().optional(),
  moldExposure: z.string().optional(),

  otherConditionsSymptoms: z.string().optional(),

  /* Frequency checks */
  freqMemoryImpairment: z.string().optional(),
  freqShortenedFocus: z.string().optional(),
  freqCoordinationBalance: z.string().optional(),
  freqLackInhibition: z.string().optional(),
  freqPoorOrganization: z.string().optional(),
  freqTimeManagement: z.string().optional(),
  freqMoodInstability: z.string().optional(),
  freqSpeechWordFinding: z.string().optional(),
  freqBrainFog: z.string().optional(),
  freqLowerEffectiveness: z.string().optional(),
  freqJudgmentProblems: z.string().optional(),
});

const StatusTable = ({
  title,
  items,
  datesField,
  form,
}: {
  title: string;
  items: { label: string; name: string }[];
  datesField: string;
  form: any;
}) => (
  <div className="space-y-4">
    <FormLabel className="text-base font-medium">
      {title} <span className="text-red-500">*</span>
    </FormLabel>

    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-[1fr_80px_80px] bg-gray-50 px-4 py-2 text-sm font-medium gap-4">
        <span />
        <span className="text-center">Yes</span>
        <span className="text-center">No</span>
      </div>

      {items.map(({ label, name }) => (
        <FormField
          key={name}
          control={form.control}
          name={`${name}.status`}
          render={({ field }) => (
            <FormItem className="grid grid-cols-[1fr_80px_80px] items-center gap-4 px-4 py-3 border-t">
              <span className="text-sm text-gray-900">{label}</span>

              {(["yes", "no"] as const).map((val) => (
                <FormControl key={val}>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={field.value === val}
                      onCheckedChange={() => field.onChange(val)}
                    />
                  </div>
                </FormControl>
              ))}
            </FormItem>
          )}
        />
      ))}
    </div>

    <FormField
      control={form.control}
      name={datesField}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm">
            If you answered “Yes” above, please provide the date.
          </FormLabel>
          <FormControl>
            <Input type="date" {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  </div>
);

const FrequencyTable = ({ form }: { form: any }) => (
  <div className="space-y-4">
    <FormLabel className="text-base font-medium">
      Please check the frequency of the following:{" "}
      <span className="text-red-500">*</span>
    </FormLabel>

    <div className="border rounded-lg overflow-hidden">
      <div className="grid grid-cols-[1fr_80px_80px_110px] bg-gray-50 px-4 py-2 text-sm font-medium gap-4">
        <span />
        <span className="text-center">Yes</span>
        <span className="text-center">No</span>
        <span className="text-center">Sometimes</span>
      </div>

      {FREQUENCY_ITEMS.map(({ label, name }) => (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem className="grid grid-cols-[1fr_80px_80px_110px] items-center gap-4 px-4 py-3 border-t">
              <span className="text-sm text-gray-900">{label}</span>

              {(["yes", "no", "sometimes"] as const).map((val) => (
                <FormControl key={val}>
                  <div className="flex justify-center">
                    <Checkbox
                      checked={field.value === val}
                      onCheckedChange={() => field.onChange(val)}
                    />
                  </div>
                </FormControl>
              ))}
            </FormItem>
          )}
        />
      ))}
    </div>
  </div>
);

export const MedicalHistoryStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-12">
      <StatusTable
        title="Gastrointestinal"
        items={GASTROINTESTINAL}
        datesField="gastrointestinalDates"
        form={form}
      />

      <StatusTable
        title="Hormones / Metabolic"
        items={HORMONES_METABOLIC}
        datesField="hormonesMetabolicDates"
        form={form}
      />

      <StatusTable
        title="Cardiovascular"
        items={CARDIOVASCULAR}
        datesField="cardiovascularDates"
        form={form}
      />

      <StatusTable
        title="Cancer"
        items={CANCER}
        datesField="cancerDates"
        form={form}
      />

      <StatusTable
        title="Genital & Urinary Systems"
        items={GENITAL_URINARY}
        datesField="genitalUrinaryDates"
        form={form}
      />

      <StatusTable
        title="Musculoskeletal / Pain"
        items={MUSCULOSKELETAL}
        datesField="musculoskeletalDates"
        form={form}
      />

      <StatusTable
        title="Immune / Inflammatory"
        items={IMMUNE_INFLAMMATORY}
        datesField="immuneInflammatoryDates"
        form={form}
      />

      <StatusTable
        title="Respiratory Conditions"
        items={RESPIRATORY}
        datesField="respiratoryDates"
        form={form}
      />

      <StatusTable
        title="Skin Conditions"
        items={SKIN}
        datesField="skinConditionsDates"
        form={form}
      />

      <StatusTable
        title="Neurologic / Mood"
        items={NEUROLOGIC_MOOD}
        datesField="neurologicMoodDates"
        form={form}
      />

      <StatusTable
        title="Miscellaneous"
        items={MISCELLANEOUS}
        datesField="miscellaneousDates"
        form={form}
      />

      <FormField
        control={form.control}
        name="otherConditionsSymptoms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Is there any other conditions or symptoms that you might be
              experiencing?
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FrequencyTable form={form} />

      {[
        {
          name: "chemicalToxicExposure",
          label:
            "Have you been exposed to chemical or toxic metals (lead, mercury, arsenic, aluminum)?",
        },
        { name: "odorSensitivity", label: "Do odors affect you?" },
        {
          name: "secondhandSmokeExposure",
          label: "Are you or have you been exposed to second-hand smoke?",
        },
        {
          name: "moldExposure",
          label:
            "Are you currently or have you been exposed to mold? If so, describe the source and duration.",
        },
      ].map(({ name, label }) => (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{label}</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      ))}
    </div>
  );
};
