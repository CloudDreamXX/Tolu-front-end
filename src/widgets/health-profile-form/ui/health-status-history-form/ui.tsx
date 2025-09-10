import { useState } from "react";
import { FormField, FormItem, FormLabel, FormMessage, Input } from "shared/ui";
import { z } from "zod";
import { MultiSelect } from "../MultiSelect";

export const healthStatusHistorySchema = z.object({
  healthConcerns: z.string().min(1, { message: "This field is required." }),
  medicalConditions: z.string().min(1, { message: "This field is required." }),
  medications: z.string().min(1, { message: "This field is required." }),
  otherMedications: z.string().optional(),
  supplements: z.string().min(1, { message: "This field is required." }),
  allergies: z.string().min(1, { message: "This field is required." }),
  familyHistory: z.string().min(1, { message: "This field is required." }),
});

const healthConcernsOptions = [
  "Weight gain",
  "Fatigue/low energy",
  "Trouble sleeping / insomnia",
  "Anxiety / stress",
  "Depression / low mood",
  "Hot flashes / night sweats",
  "Irregular periods",
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
  "Autoimmune disorder (e.g., lupus, rheumatoid arthritis)",
  "Asthma",
  "IBS / IBD (Crohn’s, Ulcerative Colitis)",
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
  "Multivitamin",
  "Vitamin D",
  "Vitamin B complex",
  "Magnesium",
  "Omega-3 (fish oil, algae oil)",
  "Probiotics",
  "Zinc",
  "Iron",
  "Calcium",
  "Collagen",
  "Adaptogens (ashwagandha, rhodiola, maca, etc.)",
  "Herbal supplements (turmeric, ginger, milk thistle, etc.)",
  "Protein powder",
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

const joinVals = (vals: string[], extra?: string) => {
  const filtered = vals.filter((v) => v !== "Other" && v !== "None");
  const extraTrim = extra?.trim() ?? "";
  return [...filtered, ...(extraTrim ? [extraTrim] : [])].join(" , ");
};

const sanitizeNone = (vals: string[]) =>
  vals.length > 1 ? vals.filter((v) => v !== "None") : vals;

export const HealthStatusHistoryForm = ({ form }: { form: any }) => {
  const [healthConcernsSel, setHealthConcernsSel] = useState<string[]>([]);
  const [medicalConditionsSel, setMedicalConditionsSel] = useState<string[]>(
    []
  );
  const [medicationsSel, setMedicationsSel] = useState<string[]>([]);
  const [supplementsSel, setSupplementsSel] = useState<string[]>([]);
  const [allergiesSel, setAllergiesSel] = useState<string[]>([]);
  const [familyHistorySel, setFamilyHistorySel] = useState<string[]>([]);

  const [healthConcernsOther, setHealthConcernsOther] = useState("");
  const [medicalConditionsOther, setMedicalConditionsOther] = useState("");
  const [medicationsOther, setMedicationsOther] = useState("");
  const [supplementsOther, setSupplementsOther] = useState("");
  const [allergiesOther, setAllergiesOther] = useState("");
  const [familyHistoryOther, setFamilyHistoryOther] = useState("");

  const onHealthConcernsChange = (val: string[]) => {
    const cleaned = sanitizeNone(val);
    setHealthConcernsSel(cleaned);
    form.setValue("healthConcerns", joinVals(cleaned, healthConcernsOther));
  };

  const onMedicalConditionsChange = (val: string[]) => {
    const cleaned = sanitizeNone(val);
    setMedicalConditionsSel(cleaned);
    form.setValue(
      "medicalConditions",
      joinVals(cleaned, medicalConditionsOther)
    );
  };

  const onMedicationsChange = (val: string[]) => {
    const cleaned = sanitizeNone(val);
    setMedicationsSel(cleaned);
    form.setValue("medications", joinVals(cleaned, medicationsOther));
    if (cleaned.length === 1 && cleaned[0] === "None") {
      form.setValue("otherMedications", undefined);
    } else {
      form.setValue("otherMedications", medicationsOther || undefined);
    }
  };

  const onSupplementsChange = (val: string[]) => {
    const cleaned = sanitizeNone(val);
    setSupplementsSel(cleaned);
    form.setValue("supplements", joinVals(cleaned, supplementsOther));
  };

  const onAllergiesChange = (val: string[]) => {
    const cleaned = sanitizeNone(val);
    setAllergiesSel(cleaned);
    form.setValue("allergies", joinVals(cleaned, allergiesOther));
  };

  const onFamilyHistoryChange = (val: string[]) => {
    const cleaned = sanitizeNone(val);
    setFamilyHistorySel(cleaned);
    form.setValue("familyHistory", joinVals(cleaned, familyHistoryOther));
  };

  const onOtherChange =
    (setter: (s: string) => void, write: (v: string) => void) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      setter(v);
      write(v);
    };

  return (
    <div className="space-y-6">
      <p className="text-gray-500">
        Help us understand your current health picture by sharing symptoms,
        conditions, medications, supplements, and any family history.
      </p>

      {/* Health Concerns */}
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
              defaultValue={form.getValues("healthConcerns")}
            />
            {healthConcernsSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other concerns"
                  value={healthConcernsOther}
                  onChange={onOtherChange(setHealthConcernsOther, (v) =>
                    form.setValue(
                      "healthConcerns",
                      joinVals(healthConcernsSel, v)
                    )
                  )}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Medical Conditions */}
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
              defaultValue={form.getValues("medicalConditions")}
            />
            {medicalConditionsSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other conditions"
                  value={medicalConditionsOther}
                  onChange={onOtherChange(setMedicalConditionsOther, (v) =>
                    form.setValue(
                      "medicalConditions",
                      joinVals(medicalConditionsSel, v)
                    )
                  )}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Medications */}
      <FormField
        control={form.control}
        name="medications"
        render={() => (
          <FormItem>
            <FormLabel>
              Medications{" "}
              <span className="text-gray-500">(Current or recent)</span>
            </FormLabel>
            <MultiSelect
              placeholder="Select..."
              options={medicationOptions}
              selected={medicationsSel}
              onChange={onMedicationsChange}
              defaultValue={form.getValues("medications")}
            />
            {medicationsSel.includes("Other") && (
              <div className="pt-2 space-y-2">
                <Input
                  placeholder="Other medications"
                  value={medicationsOther}
                  onChange={onOtherChange(setMedicationsOther, (v) => {
                    form.setValue("otherMedications", v || undefined);
                    form.setValue("medications", joinVals(medicationsSel, v));
                  })}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Supplements */}
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
              defaultValue={form.getValues("supplements")}
            />
            {supplementsSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other supplements"
                  value={supplementsOther}
                  onChange={onOtherChange(setSupplementsOther, (v) =>
                    form.setValue("supplements", joinVals(supplementsSel, v))
                  )}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Allergies */}
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
              defaultValue={form.getValues("allergies")}
            />
            {allergiesSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other allergies or intolerances"
                  value={allergiesOther}
                  onChange={onOtherChange(setAllergiesOther, (v) =>
                    form.setValue("allergies", joinVals(allergiesSel, v))
                  )}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Family History */}
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
              defaultValue={form.getValues("familyHistory")}
            />
            {familyHistorySel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Other family history"
                  value={familyHistoryOther}
                  onChange={onOtherChange(setFamilyHistoryOther, (v) =>
                    form.setValue(
                      "familyHistory",
                      joinVals(familyHistorySel, v)
                    )
                  )}
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
