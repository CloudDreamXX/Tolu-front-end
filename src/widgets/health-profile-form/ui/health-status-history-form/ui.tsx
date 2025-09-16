import { useMemo, useState } from "react";
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
  "Alpha-Lipoic Acid",
  "Ashwagandha",
  "Beta-Alanine",
  "Branched-Chain Amino Acids (BCAAs)",
  "Calcium",
  "Casein Protein",
  "Chasteberry (Vitex)",
  "Chondroitin",
  "Chromium",
  "Coenzyme Q10 (CoQ10)",
  "Collagen",
  "Copper",
  "Creatine",
  "DHEA",
  "Digestive Enzymes",
  "Echinacea",
  "Electrolytes",
  "Evening Primrose Oil",
  "Fenugreek",
  "Fish Oil (Omega-3)",
  "Flaxseed Oil",
  "Ginger",
  "Ginkgo Biloba",
  "Ginseng",
  "Glucosamine",
  "Glutamine",
  "Green Tea Extract",
  "HMB (β-Hydroxy β-Methylbutyrate)",
  "Hyaluronic Acid",
  "Iodine",
  "Iron",
  "Krill Oil",
  "L-Carnitine",
  "MCT Oil",
  "MSM (Methylsulfonylmethane)",
  "Maca",
  "Magnesium",
  "Manganese",
  "Melatonin",
  "Milk Thistle",
  "Molybdenum",
  "N-Acetyl Cysteine (NAC)",
  "Prebiotics (Inulin, FOS)",
  "Probiotics",
  "Quercetin",
  "Resveratrol",
  "Rhodiola",
  "Saw Palmetto",
  "Selenium",
  "Soy Protein",
  "Tribulus Terrestris",
  "Turmeric (Curcumin)",
  "Valerian Root",
  "Vitamin A",
  "Vitamin B1 (Thiamine)",
  "Vitamin B12",
  "Vitamin B2 (Riboflavin)",
  "Vitamin B3 (Niacin)",
  "Vitamin B5 (Pantothenic Acid)",
  "Vitamin B6",
  "Vitamin B7 (Biotin)",
  "Vitamin B9 (Folate)",
  "Vitamin C",
  "Vitamin D",
  "Vitamin E",
  "Vitamin K",
  "Whey Protein",
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

const joinVals = (vals: string[], extra?: string) => {
  const filtered = vals.filter((v) => v !== "Other" && v !== "None");
  const extraTrim = extra?.trim() ?? "";
  return [...filtered, ...(extraTrim ? [extraTrim] : [])].join(" , ");
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

const split = (s?: string) =>
  (s ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

export const HealthStatusHistoryForm = ({ form }: { form: any }) => {
  // const [healthConcernsSel, setHealthConcernsSel] = useState<string[]>([]);
  // const [medicalConditionsSel, setMedicalConditionsSel] = useState<string[]>(
  //   []
  // );
  // const [medicationsSel, setMedicationsSel] = useState<string[]>([]);
  // const [supplementsSel, setSupplementsSel] = useState<string[]>([]);
  // const [allergiesSel, setAllergiesSel] = useState<string[]>([]);
  // const [familyHistorySel, setFamilyHistorySel] = useState<string[]>([]);

  const [healthConcernsOther, setHealthConcernsOther] = useState("");
  const [medicalConditionsOther, setMedicalConditionsOther] = useState("");
  const [medicationsOther, setMedicationsOther] = useState("");
  const [supplementsOther, setSupplementsOther] = useState("");
  const [allergiesOther, setAllergiesOther] = useState("");
  const [familyHistoryOther, setFamilyHistoryOther] = useState("");

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

  const onHealthConcernsChange = (val: string[]) => {
    const cleaned = normalizeNone(val, healthConcernsSel);
    form.setValue("healthConcerns", joinVals(cleaned, healthConcernsOther));
  };

  const onMedicalConditionsChange = (val: string[]) => {
    const cleaned = normalizeNone(val, medicalConditionsSel);
    form.setValue(
      "medicalConditions",
      joinVals(cleaned, medicalConditionsOther)
    );
  };

  const onMedicationsChange = (val: string[]) => {
    const cleaned = normalizeNone(val, medicationsSel);
    form.setValue("medications", joinVals(cleaned, medicationsOther));
    form.setValue(
      "otherMedications",
      cleaned.length === 1 && cleaned[0] === "None"
        ? undefined
        : medicationsOther || undefined
    );
  };

  const onSupplementsChange = (val: string[]) => {
    const cleaned = normalizeNone(val, supplementsSel);
    form.setValue("supplements", joinVals(cleaned, supplementsOther));
  };

  const onAllergiesChange = (val: string[]) => {
    const cleaned = normalizeNone(val, allergiesSel);
    form.setValue("allergies", joinVals(cleaned, allergiesOther));
  };

  const onFamilyHistoryChange = (val: string[]) => {
    const cleaned = normalizeNone(val, familyHistorySel);
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
