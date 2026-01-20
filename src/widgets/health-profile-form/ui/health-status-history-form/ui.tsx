import { useMemo } from "react";
import { FormField, FormItem, FormLabel, FormMessage, Input } from "shared/ui";
import { z } from "zod";
import { MultiSelect } from "../MultiSelect";

export const healthStatusHistorySchema = z.object({
  healthConcerns: z.string().optional(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  otherMedications: z.string().optional(),
  supplements: z.string().optional(),
  allergies: z.string().optional(),
  familyHistory: z.string().optional(),
});

const healthConcernsOptions = [
  "Weight gain",
  "Fatigue/low energy",
  "Trouble sleeping / insomnia",
  "Anxiety / stress",
  "Depression / low mood",
  "Hot flashes / night sweats",
  "Digestive issues (bloating, constipation, diarrhea)",
  "Brain fog / memory issues",
  "Joint or muscle pain",
  "Low libido",
  "Hair loss / thinning",
  "Skin issues (acne, dryness, rashes)",
  "Headaches / migraines",
  "Blood sugar fluctuations",
  "High blood pressure",
  "Other",
];

const medicalConditionsOptions = [
  "Hypothyroidism",
  "Hyperthyroidism",
  "Hashimoto’s thyroiditis",
  "Graves’ disease",
  "Diabetes (Type 1 / Type 2)",
  "Prediabetes",
  "PCOS (Polycystic Ovary Syndrome)",
  "Endometriosis",
  "Osteopenia / Osteoporosis",
  "Cardiovascular disease",
  "High cholesterol",
  "Hypertension",
  "Autoimmune disorder (e.g. lupus / rheumatoid arthritis)",
  "Asthma",
  "IBS / IBD (Crohn’s / Ulcerative Colitis)",
  "Depression / Anxiety disorder",
  "None",
  "Other",
];

const medicationOptions = [
  "Thyroid medication (Levothyroxine, Armour, etc.)",
  "Metformin",
  "Insulin",
  "Blood pressure medication",
  "Statins (cholesterol medication)",
  "Hormone replacement therapy (estrogen, progesterone, testosterone)",
  "Birth control pills / IUD / implant",
  "Antidepressants / anti-anxiety medications",
  "Pain relievers (NSAIDs, opioids)",
  "Steroids (prednisone, hydrocortisone)",
  "Sleep medication",
  "None",
  "Other",
];

const supplementsOptions = [
  "Alpha-Lipoic Acid",
  "Ashwagandha",
  "Calcium",
  "Collagen",
  "Coenzyme Q10 (CoQ10)",
  "Creatine",
  "DHEA",
  "Digestive Enzymes",
  "Fish Oil (Omega-3)",
  "Magnesium",
  "Probiotics",
  "Vitamin D",
  "Vitamin B12",
  "Vitamin C",
  "Zinc",
  "None",
  "Other",
];

const allergiesOptions = [
  "Shellfish",
  "Gluten",
  "Dairy",
  "Soy",
  "Nuts (tree nuts, peanuts)",
  "Eggs",
  "Corn",
  "Nightshades (tomatoes, peppers, eggplants, potatoes)",
  "Histamine sensitivity",
  "Sulfites",
  "Latex",
  "Seasonal allergies (pollen, dust, mold)",
  "None",
  "Other",
];

const familyHistoryOptions = [
  "Cancer",
  "Diabetes",
  "Heart disease",
  "Stroke",
  "Hypertension",
  "Thyroid disorders",
  "Autoimmune disease",
  "Osteoporosis",
  "Alzheimer’s / Dementia",
  "Depression / Mental health conditions",
  "None",
  "Other",
];

const split = (s?: string) =>
  (s ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const extractOtherValue = (joined: string) => {
  const parts = split(joined);
  const other = parts.find((v) => v.startsWith("Other:"));
  return other ? other.replace(/^Other:\s*/, "") : "";
};

const normalizeNone = (next: string[], prev: string[]) => {
  const prevSet = new Set(prev);
  const added = next.filter((v) => !prevSet.has(v));

  if (added.includes("None")) return ["None"];
  if (prevSet.has("None") && added.length > 0) {
    return next.filter((v) => v !== "None");
  }
  return next.includes("None") && next.length > 1
    ? next.filter((v) => v !== "None")
    : next;
};

const commitOther = (fieldName: string, otherValue: string) => (form: any) => {
  const vals = split(form.getValues(fieldName));
  const withoutOthers = vals.filter((v) => !v.startsWith("Other"));
  const trimmed = otherValue.trim();
  const merged = ["Other", ...(trimmed ? [`Other: ${trimmed}`] : [])];
  form.setValue(fieldName, [...withoutOthers, ...merged].join(", "));
};

export const HealthStatusHistoryForm = ({ form }: { form: any }) => {
  const healthConcernsStr = form.watch("healthConcerns") as string | undefined;
  const medicalConditionsStr = form.watch("medicalConditions") as
    | string
    | undefined;
  const medicationsStr = form.watch("medications") as string | undefined;
  const supplementsStr = form.watch("supplements") as string | undefined;
  const allergiesStr = form.watch("allergies") as string | undefined;
  const familyHistoryStr = form.watch("familyHistory") as string | undefined;

  const healthConcernsSel = useMemo(
    () => split(healthConcernsStr),
    [healthConcernsStr]
  );
  const medicalConditionsSel = useMemo(
    () => split(medicalConditionsStr),
    [medicalConditionsStr]
  );
  const medicationsSel = useMemo(() => split(medicationsStr), [medicationsStr]);
  const supplementsSel = useMemo(() => split(supplementsStr), [supplementsStr]);
  const allergiesSel = useMemo(() => split(allergiesStr), [allergiesStr]);
  const familyHistorySel = useMemo(
    () => split(familyHistoryStr),
    [familyHistoryStr]
  );

  const healthConcernsOther = useMemo(
    () => extractOtherValue(healthConcernsStr || ""),
    [healthConcernsStr]
  );
  const medicalConditionsOther = useMemo(
    () => extractOtherValue(medicalConditionsStr || ""),
    [medicalConditionsStr]
  );
  const medicationsOther = useMemo(
    () => extractOtherValue(medicationsStr || ""),
    [medicationsStr]
  );
  const supplementsOther = useMemo(
    () => extractOtherValue(supplementsStr || ""),
    [supplementsStr]
  );
  const allergiesOther = useMemo(
    () => extractOtherValue(allergiesStr || ""),
    [allergiesStr]
  );
  const familyHistoryOther = useMemo(
    () => extractOtherValue(familyHistoryStr || ""),
    [familyHistoryStr]
  );

  const onHealthConcernsChange = (val: string[]) => {
    form.setValue(
      "healthConcerns",
      normalizeNone(val, healthConcernsSel).join(", ")
    );
  };
  const onMedicalConditionsChange = (val: string[]) => {
    form.setValue(
      "medicalConditions",
      normalizeNone(val, medicalConditionsSel).join(", ")
    );
  };
  const onMedicationsChange = (val: string[]) => {
    const cleaned = normalizeNone(val, medicationsSel);
    form.setValue("medications", cleaned.join(", "));
    if (cleaned.includes("None")) {
      form.setValue("otherMedications", undefined);
    }
  };
  const onSupplementsChange = (val: string[]) => {
    form.setValue("supplements", normalizeNone(val, supplementsSel).join(", "));
  };
  const onAllergiesChange = (val: string[]) => {
    form.setValue("allergies", normalizeNone(val, allergiesSel).join(", "));
  };
  const onFamilyHistoryChange = (val: string[]) => {
    form.setValue(
      "familyHistory",
      normalizeNone(val, familyHistorySel).join(", ")
    );
  };

  return (
    <div className="space-y-6 overflow-y-auto">
      <p className="text-gray-500">
        Help us understand your current health picture by sharing symptoms,
        conditions, medications, supplements, and any family history.
      </p>

      <FormField
        control={form.control}
        name="healthConcerns"
        render={() => (
          <FormItem>
            <FormLabel>Current health concerns or symptoms</FormLabel>
            <MultiSelect
              placeholder="Select..."
              options={healthConcernsOptions}
              selected={healthConcernsSel}
              onChange={onHealthConcernsChange}
            />
            {healthConcernsSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other concerns"
                  value={healthConcernsOther}
                  onChange={(e) =>
                    commitOther("healthConcerns", e.target.value)(form)
                  }
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medicalConditions"
        render={() => (
          <FormItem>
            <FormLabel>Diagnosed medical conditions</FormLabel>
            <MultiSelect
              placeholder="Select..."
              options={medicalConditionsOptions}
              selected={medicalConditionsSel}
              onChange={onMedicalConditionsChange}
            />
            {medicalConditionsSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other conditions"
                  value={medicalConditionsOther}
                  onChange={(e) =>
                    commitOther("medicalConditions", e.target.value)(form)
                  }
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medications"
        render={() => (
          <FormItem>
            <FormLabel>Medications</FormLabel>
            <MultiSelect
              placeholder="Select..."
              options={medicationOptions}
              selected={medicationsSel}
              onChange={onMedicationsChange}
            />
            {medicationsSel.includes("Other") && (
              <div className="pt-2 space-y-2">
                <Input
                  placeholder="Other medications"
                  value={medicationsOther}
                  onChange={(e) => {
                    commitOther("medications", e.target.value)(form);
                    form.setValue(
                      "otherMedications",
                      e.target.value.trim() || undefined
                    );
                  }}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="supplements"
        render={() => (
          <FormItem>
            <FormLabel>Supplements</FormLabel>
            <MultiSelect
              placeholder="Select..."
              options={supplementsOptions}
              selected={supplementsSel}
              onChange={onSupplementsChange}
            />
            {supplementsSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other supplements"
                  value={supplementsOther}
                  onChange={(e) =>
                    commitOther("supplements", e.target.value)(form)
                  }
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allergies"
        render={() => (
          <FormItem>
            <FormLabel>Known allergies or intolerances</FormLabel>
            <MultiSelect
              placeholder="Select..."
              options={allergiesOptions}
              selected={allergiesSel}
              onChange={onAllergiesChange}
            />
            {allergiesSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other allergies or intolerances"
                  value={allergiesOther}
                  onChange={(e) =>
                    commitOther("allergies", e.target.value)(form)
                  }
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="familyHistory"
        render={() => (
          <FormItem>
            <FormLabel>Family health history</FormLabel>
            <MultiSelect
              placeholder="Select..."
              options={familyHistoryOptions}
              selected={familyHistorySel}
              onChange={onFamilyHistoryChange}
            />
            {familyHistorySel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other family history"
                  value={familyHistoryOther}
                  onChange={(e) =>
                    commitOther("familyHistory", e.target.value)(form)
                  }
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
