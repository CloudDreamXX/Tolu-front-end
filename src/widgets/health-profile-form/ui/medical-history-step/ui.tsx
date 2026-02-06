import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  Input,
  Textarea,
  Checkbox,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
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
import { useState } from "react";

export const frequencyEnum = z.enum(["yes", "no", "sometimes"]);
export const statusEnum = z.enum(["yes", "no"]);

export const medicalConditionSchema = z.object({
  status: statusEnum.optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export const medicalHistorySchema = z.object({
  // Gastrointestinal
  conditionIbs: medicalConditionSchema.optional(),
  conditionCrohns: medicalConditionSchema.optional(),
  conditionUlcerativeColitis: medicalConditionSchema.optional(),
  conditionGastritisUlcer: medicalConditionSchema.optional(),
  conditionGerd: medicalConditionSchema.optional(),
  conditionCeliac: medicalConditionSchema.optional(),
  conditionSibo: medicalConditionSchema.optional(),
  conditionGutInfections: medicalConditionSchema.optional(),
  conditionDysbiosis: medicalConditionSchema.optional(),
  conditionLeakyGut: medicalConditionSchema.optional(),
  conditionFoodAllergies: medicalConditionSchema.optional(),
  conditionGallstones: medicalConditionSchema.optional(),
  conditionAbsorptionIssues: medicalConditionSchema.optional(),
  gastrointestinalDates: z.string().optional(),

  // Hormones / Metabolic
  conditionType1Diabetes: medicalConditionSchema.optional(),
  conditionType2Diabetes: medicalConditionSchema.optional(),
  conditionHypoglycemia: medicalConditionSchema.optional(),
  conditionMetabolicSyndrome: medicalConditionSchema.optional(),
  conditionInsulinResistance: medicalConditionSchema.optional(),
  conditionHypothyroidism: medicalConditionSchema.optional(),
  conditionHyperthyroidism: medicalConditionSchema.optional(),
  conditionHashimotos: medicalConditionSchema.optional(),
  conditionGravesDisease: medicalConditionSchema.optional(),
  conditionEndocrineProblems: medicalConditionSchema.optional(),
  conditionPcos: medicalConditionSchema.optional(),
  conditionInfertility: medicalConditionSchema.optional(),
  conditionWeightGain: medicalConditionSchema.optional(),
  conditionWeightLoss: medicalConditionSchema.optional(),
  conditionWeightFluctuations: medicalConditionSchema.optional(),
  conditionEatingDisorder: medicalConditionSchema.optional(),
  hormonesMetabolicDates: z.string().optional(),

  // Cardiovascular
  conditionHeartAttack: medicalConditionSchema.optional(),
  conditionHeartDisease: medicalConditionSchema.optional(),
  conditionStroke: medicalConditionSchema.optional(),
  conditionElevatedCholesterol: medicalConditionSchema.optional(),
  conditionArrhythmia: medicalConditionSchema.optional(),
  conditionHypertension: medicalConditionSchema.optional(),
  conditionRheumaticFever: medicalConditionSchema.optional(),
  conditionMitralValveProlapse: medicalConditionSchema.optional(),
  cardiovascularDates: z.string().optional(),

  // Cancer
  conditionLungCancer: medicalConditionSchema.optional(),
  conditionBreastCancer: medicalConditionSchema.optional(),
  conditionColonCancer: medicalConditionSchema.optional(),
  conditionOvarianCancer: medicalConditionSchema.optional(),
  conditionProstateCancer: medicalConditionSchema.optional(),
  conditionSkinCancerMelanoma: medicalConditionSchema.optional(),
  conditionSkinCancerSquamousBasal: medicalConditionSchema.optional(),
  cancerDates: z.string().optional(),

  // Genital / Urinary
  conditionKidneyStones: medicalConditionSchema.optional(),
  conditionGout: medicalConditionSchema.optional(),
  conditionInterstitialCystitis: medicalConditionSchema.optional(),
  conditionFrequentUti: medicalConditionSchema.optional(),
  conditionSexualDysfunction: medicalConditionSchema.optional(),
  conditionFrequentYeast: medicalConditionSchema.optional(),
  genitalUrinaryDates: z.string().optional(),

  // Musculoskeletal
  conditionOsteoarthritis: medicalConditionSchema.optional(),
  conditionFibromyalgia: medicalConditionSchema.optional(),
  conditionChronicPain: medicalConditionSchema.optional(),
  conditionSoreMusclesJoints: medicalConditionSchema.optional(),
  musculoskeletalDates: z.string().optional(),

  // Immune / Inflammatory
  conditionChronicFatigue: medicalConditionSchema.optional(),
  conditionRheumatoidArthritis: medicalConditionSchema.optional(),
  conditionLupus: medicalConditionSchema.optional(),
  conditionRaynauds: medicalConditionSchema.optional(),
  conditionPsoriasis: medicalConditionSchema.optional(),
  conditionMctd: medicalConditionSchema.optional(),
  conditionPoorImmune: medicalConditionSchema.optional(),
  conditionFoodAllergiesImmune: medicalConditionSchema.optional(),
  conditionEnvironmentalAllergies: medicalConditionSchema.optional(),
  conditionChemicalSensitivities: medicalConditionSchema.optional(),
  conditionLatexAllergy: medicalConditionSchema.optional(),
  conditionHepatitis: medicalConditionSchema.optional(),
  conditionLyme: medicalConditionSchema.optional(),
  conditionChronicInfections: medicalConditionSchema.optional(),
  immuneInflammatoryDates: z.string().optional(),

  // Respiratory
  conditionAsthma: medicalConditionSchema.optional(),
  conditionChronicSinusitis: medicalConditionSchema.optional(),
  conditionBronchitis: medicalConditionSchema.optional(),
  conditionEmphysema: medicalConditionSchema.optional(),
  conditionPneumonia: medicalConditionSchema.optional(),
  conditionSleepApnea: medicalConditionSchema.optional(),
  conditionFrequentColdsFlus: medicalConditionSchema.optional(),
  respiratoryDates: z.string().optional(),

  // Skin
  conditionEczema: medicalConditionSchema.optional(),
  conditionPsoriasisSkin: medicalConditionSchema.optional(),
  conditionDermatitis: medicalConditionSchema.optional(),
  conditionHives: medicalConditionSchema.optional(),
  conditionRashUndiagnosed: medicalConditionSchema.optional(),
  conditionAcne: medicalConditionSchema.optional(),
  conditionSkinCancerMelanomaDup: medicalConditionSchema.optional(),
  conditionSkinCancerSquamousBasalDup: medicalConditionSchema.optional(),
  skinConditionsDates: z.string().optional(),

  // Neurologic / Mood
  conditionDepression: medicalConditionSchema.optional(),
  conditionAnxiety: medicalConditionSchema.optional(),
  conditionBipolar: medicalConditionSchema.optional(),
  conditionSchizophrenia: medicalConditionSchema.optional(),
  conditionHeadaches: medicalConditionSchema.optional(),
  conditionMigraines: medicalConditionSchema.optional(),
  conditionAddAdhd: medicalConditionSchema.optional(),
  conditionAutism: medicalConditionSchema.optional(),
  conditionMildCognitiveImpairment: medicalConditionSchema.optional(),
  conditionMemoryProblems: medicalConditionSchema.optional(),
  conditionParkinsons: medicalConditionSchema.optional(),
  conditionMultipleSclerosis: medicalConditionSchema.optional(),
  conditionAls: medicalConditionSchema.optional(),
  conditionSeizures: medicalConditionSchema.optional(),
  conditionAlzheimers: medicalConditionSchema.optional(),
  conditionConcussionTbi: medicalConditionSchema.optional(),
  conditionBrainInjury: medicalConditionSchema.optional(),
  neurologicMoodDates: z.string().optional(),

  // Miscellaneous
  conditionAnemia: medicalConditionSchema.optional(),
  conditionChickenPox: medicalConditionSchema.optional(),
  conditionGermanMeasles: medicalConditionSchema.optional(),
  conditionMeasles: medicalConditionSchema.optional(),
  conditionMononucleosis: medicalConditionSchema.optional(),
  conditionMumps: medicalConditionSchema.optional(),
  conditionWhoopingCough: medicalConditionSchema.optional(),
  conditionTuberculosis: medicalConditionSchema.optional(),
  conditionGeneticVariants: medicalConditionSchema.optional(),
  miscellaneousDates: z.string().optional(),

  otherConditionsSymptoms: z.string().optional(),

  // Frequency
  freqMemoryImpairment: frequencyEnum.optional(),
  freqShortenedFocus: frequencyEnum.optional(),
  freqCoordinationBalance: frequencyEnum.optional(),
  freqLackInhibition: frequencyEnum.optional(),
  freqPoorOrganization: frequencyEnum.optional(),
  freqTimeManagement: frequencyEnum.optional(),
  freqMoodInstability: frequencyEnum.optional(),
  freqSpeechWordFinding: frequencyEnum.optional(),
  freqBrainFog: frequencyEnum.optional(),
  freqLowerEffectiveness: frequencyEnum.optional(),
  freqJudgmentProblems: frequencyEnum.optional(),

  // Environmental exposures
  chemicalToxicExposure: z.string().optional(),
  odorSensitivity: z.string().optional(),
  secondhandSmokeExposure: z.string().optional(),
  moldExposure: z.string().optional(),
});

const StatusTable = ({
  title,
  items,
  form,
}: {
  title: string;
  items: { label: string; name: string }[];
  form: any;
}) => (
  <div className="space-y-4">
    <FormLabel className="text-base font-medium">
      {title}
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
          render={({ field }) => {
            const status = field.value;

            return (
              <div className="border-t px-4 py-3 space-y-3">
                {/* Yes / No row */}
                <div className="grid grid-cols-[1fr_80px_80px] items-center gap-4">
                  <span className="text-sm text-gray-900">{label}</span>

                  {(["yes", "no"] as const).map((val) => (
                    <FormControl key={val}>
                      <div className="flex justify-center">
                        <Checkbox
                          checked={status === val}
                          onCheckedChange={
                            status === val
                              ? () => field.onChange("")
                              : () => field.onChange(val)
                          }
                        />
                      </div>
                    </FormControl>
                  ))}
                </div>

                {/* Date range (only if Yes) */}
                {status === "yes" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-2">
                    {/* Date From */}
                    <FormField
                      control={form.control}
                      name={`${name}.fromDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="xl:text-[14px] xl:font-normal">
                            Date from
                          </FormLabel>
                          <CustomDateField
                            field={field}
                            placeholder="Select start date"
                          />
                        </FormItem>
                      )}
                    />

                    {/* Date To */}
                    <FormField
                      control={form.control}
                      name={`${name}.toDate`}
                      render={({ field }) => {
                        const isCurrent = field.value === "current";

                        return (
                          <FormItem className="flex gap-4 items-end">
                            <div className="flex flex-col gap-2 w-full">
                              <FormLabel className="xl:text-[14px] xl:font-normal">
                                Date to
                              </FormLabel>

                              <CustomDateField
                                field={field}
                                placeholder="Select end date"
                                disabled={isCurrent}
                              />
                            </div>

                            <div className="flex items-center gap-2 pb-2">
                              <Checkbox
                                checked={isCurrent}
                                onCheckedChange={(checked) =>
                                  field.onChange(checked ? "current" : "")
                                }
                              />
                              <span className="text-sm">Current</span>
                            </div>
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            );
          }}
        />
      ))}
    </div>
  </div>
);

const FrequencyTable = ({ form }: { form: any }) => (
  <div className="space-y-4">
    <FormLabel className="text-base font-medium">
      Please check the frequency of the following:{" "}
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

export const CustomDateField = ({
  field,
  placeholder,
  disabled,
}: {
  field: any;
  placeholder: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  const parsedDate =
    field.value === "current"
      ? new Date()
      : field.value
        ? new Date(field.value + "T00:00:00")
        : null;

  const [displayMonth, setDisplayMonth] = useState<Date>(
    parsedDate ?? new Date()
  );

  const selectedYear = parsedDate?.getFullYear() ?? displayMonth.getFullYear();

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <FormControl>
          <Input
            readOnly
            disabled={disabled}
            placeholder={placeholder}
            className="text-start w-[200px]"
            value={
              parsedDate
                ? new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }).format(parsedDate)
                : ""
            }
          />
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
        {/* Year selector */}
        <div className="flex items-center gap-2 m-4 mb-2 text-sm">
          Choose a year:
          <select
            value={selectedYear}
            onChange={(e) => {
              const year = Number(e.target.value);
              const month = displayMonth.getMonth();
              const day = parsedDate?.getDate() ?? 1;

              const d = new Date(year, month, day);
              setDisplayMonth(d);

              field.onChange(
                `${year}-${String(month + 1).padStart(2, "0")}-${String(
                  day
                ).padStart(2, "0")}`
              );
            }}
            className="px-2 py-1 border rounded-md outline-none"
          >
            {Array.from(
              { length: 100 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Calendar */}
        <Calendar
          mode="single"
          selected={parsedDate ?? undefined}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          onSelect={(date) => {
            if (!date) return;

            const clean = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );

            setDisplayMonth(clean);
            field.onChange(
              `${clean.getFullYear()}-${String(clean.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(clean.getDate()).padStart(2, "0")}`
            );

            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export const MedicalHistoryStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-12">
      <StatusTable
        title="Gastrointestinal"
        items={GASTROINTESTINAL}
        form={form}
      />

      <StatusTable
        title="Hormones / Metabolic"
        items={HORMONES_METABOLIC}
        form={form}
      />

      <StatusTable title="Cardiovascular" items={CARDIOVASCULAR} form={form} />

      <StatusTable title="Cancer" items={CANCER} form={form} />

      <StatusTable
        title="Genital & Urinary Systems"
        items={GENITAL_URINARY}
        form={form}
      />

      <StatusTable
        title="Musculoskeletal / Pain"
        items={MUSCULOSKELETAL}
        form={form}
      />

      <StatusTable
        title="Immune / Inflammatory"
        items={IMMUNE_INFLAMMATORY}
        form={form}
      />

      <StatusTable
        title="Respiratory Conditions"
        items={RESPIRATORY}
        form={form}
      />

      <StatusTable title="Skin Conditions" items={SKIN} form={form} />

      <StatusTable
        title="Neurologic / Mood"
        items={NEUROLOGIC_MOOD}
        form={form}
      />

      <StatusTable title="Miscellaneous" items={MISCELLANEOUS} form={form} />

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
            "Are you currently or have you been exposed to mold? (If so, what is/was the source of the exposure, and for how long have you been/were you exposed to mold if known?)",
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
