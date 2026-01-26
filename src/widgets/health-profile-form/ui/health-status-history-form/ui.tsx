import { useEffect, useMemo, useState } from "react";
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

const extractOtherValues = (joined: string) => {
  const parts = split(joined);
  return parts
    .filter((v) => v.startsWith("Other:"))
    .map((v) => v.replace(/^Other:\s*/, ""));
};

const encode = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/,/g, "\\,");

const decode = (value: string) =>
  value.replace(/\\,/g, ",").replace(/\\\\/g, "\\");

const joinValues = (values: string[]) =>
  values.map(encode).join(", ");

const splitValues = (s?: string) => {
  if (!s) return [];

  const result: string[] = [];
  let current = "";
  let escaped = false;

  for (const char of s) {
    if (escaped) {
      current += char;
      escaped = false;
    } else if (char === "\\") {
      escaped = true;
    } else if (char === ",") {
      result.push(decode(current.trim()));
      current = "";
    } else {
      current += char;
    }
  }

  if (current) {
    result.push(decode(current.trim()));
  }

  return result.filter(Boolean);
};

const split = splitValues;

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

const commitOther = (fieldName: string, otherValues: string[]) => (form: any) => {
  const vals = split(form.getValues(fieldName));
  const withoutOthers = vals.filter((v) => !v.startsWith("Other"));
  const trimmed = otherValues.map((v) => v.trim()).filter(Boolean);
  const merged = [...withoutOthers, ...trimmed.map((v) => `Other: ${v}`)];
  form.setValue(fieldName, joinValues(merged));
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

  // Selected values
  const healthConcernsSel = useMemo(() => split(healthConcernsStr), [healthConcernsStr]);
  const medicalConditionsSel = useMemo(() => split(medicalConditionsStr), [medicalConditionsStr]);
  const medicationsSel = useMemo(() => split(medicationsStr), [medicationsStr]);
  const supplementsSel = useMemo(() => split(supplementsStr), [supplementsStr]);
  const allergiesSel = useMemo(() => split(allergiesStr), [allergiesStr]);
  const familyHistorySel = useMemo(() => split(familyHistoryStr), [familyHistoryStr]);

  // Multiple Other state
  const [healthConcernsOtherValues, setHealthConcernsOtherValues] = useState<string[]>(extractOtherValues(healthConcernsStr || ""));
  const [medicalConditionsOtherValues, setMedicalConditionsOtherValues] = useState<string[]>(extractOtherValues(medicalConditionsStr || ""));
  const [medicationsOtherValues, setMedicationsOtherValues] = useState<string[]>(extractOtherValues(medicationsStr || ""));
  const [supplementsOtherValues, setSupplementsOtherValues] = useState<string[]>(extractOtherValues(supplementsStr || ""));
  const [allergiesOtherValues, setAllergiesOtherValues] = useState<string[]>(extractOtherValues(allergiesStr || ""));
  const [familyHistoryOtherValues, setFamilyHistoryOtherValues] = useState<string[]>(extractOtherValues(familyHistoryStr || ""));

  useEffect(() => {
    if (healthConcernsSel.includes("Other") && healthConcernsOtherValues.length === 0) {
      setHealthConcernsOtherValues([""]);
    }
  }, [healthConcernsSel]);

  useEffect(() => {
    if (medicalConditionsSel.includes("Other") && medicalConditionsOtherValues.length === 0) {
      setMedicalConditionsOtherValues([""]);
    }
  }, [medicalConditionsSel]);

  useEffect(() => {
    if (medicationsSel.includes("Other") && medicationsOtherValues.length === 0) {
      setMedicationsOtherValues([""]);
    }
  }, [medicationsSel]);

  useEffect(() => {
    if (supplementsSel.includes("Other") && supplementsOtherValues.length === 0) {
      setSupplementsOtherValues([""]);
    }
  }, [supplementsSel]);

  useEffect(() => {
    if (allergiesSel.includes("Other") && allergiesOtherValues.length === 0) {
      setAllergiesOtherValues([""]);
    }
  }, [allergiesSel]);

  useEffect(() => {
    if (familyHistorySel.includes("Other") && familyHistoryOtherValues.length === 0) {
      setFamilyHistoryOtherValues([""]);
    }
  }, [familyHistorySel]);

  const onHealthConcernsChange = (val: string[]) => {
    form.setValue(
      "healthConcerns",
      joinValues(normalizeNone(val, healthConcernsSel))
    );
  };
  const onMedicalConditionsChange = (val: string[]) => {
    form.setValue(
      "medicalConditions",
      joinValues(normalizeNone(val, medicalConditionsSel))
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
    form.setValue("supplements", joinValues(normalizeNone(val, supplementsSel)));
  };
  const onAllergiesChange = (val: string[]) => {
    form.setValue("allergies", joinValues(normalizeNone(val, allergiesSel)));
  };
  const onFamilyHistoryChange = (val: string[]) => {
    form.setValue(
      "familyHistory",
      joinValues(normalizeNone(val, familyHistorySel))
    );
  };

  const renderOtherInputs = (
    selected: string[],
    otherValues: string[],
    setOtherValues: (vals: string[]) => void,
    fieldName: string
  ) => {
    if (!selected.includes("Other")) return null;

    return (
      <div className="pt-2 space-y-2">
        {otherValues.map((val, idx) => (
          <Input
            key={idx}
            placeholder="Other"
            value={val}
            onChange={(e) => {
              const newVals = [...otherValues];
              newVals[idx] = e.target.value;
              setOtherValues(newVals);
            }}
            onBlur={() => {
              const existingVals = split(form.getValues(fieldName)).filter(v => !v.startsWith("Other"));
              const merged = [
                ...existingVals,
                ...otherValues.filter(v => v.trim()).map(v => `Other: ${v.trim()}`)
              ];
              form.setValue(fieldName, joinValues(merged));

              if (fieldName === "medications") {
                form.setValue("otherMedications", otherValues.join(", ") || undefined);
              }
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => setOtherValues([...otherValues, ""])}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add another
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 overflow-y-auto">
      <p className="text-gray-500">
        Help us understand your current health picture by sharing symptoms,
        conditions, medications, supplements, and any family history.
      </p>

      <FormField control={form.control} name="healthConcerns" render={() => (
        <FormItem>
          <FormLabel>Current health concerns or symptoms</FormLabel>
          <MultiSelect placeholder="Select..." options={healthConcernsOptions} selected={healthConcernsSel} onChange={onHealthConcernsChange} />
          {renderOtherInputs(healthConcernsSel, healthConcernsOtherValues, setHealthConcernsOtherValues, "healthConcerns")}
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="medicalConditions" render={() => (
        <FormItem>
          <FormLabel>Diagnosed medical conditions</FormLabel>
          <MultiSelect placeholder="Select..." options={medicalConditionsOptions} selected={medicalConditionsSel} onChange={onMedicalConditionsChange} />
          {renderOtherInputs(medicalConditionsSel, medicalConditionsOtherValues, setMedicalConditionsOtherValues, "medicalConditions")}
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="medications" render={() => (
        <FormItem>
          <FormLabel>Medications</FormLabel>
          <MultiSelect placeholder="Select..." options={medicationOptions} selected={medicationsSel} onChange={onMedicationsChange} />
          {renderOtherInputs(medicationsSel, medicationsOtherValues, setMedicationsOtherValues, "medications")}
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="supplements" render={() => (
        <FormItem>
          <FormLabel>Supplements</FormLabel>
          <MultiSelect placeholder="Select..." options={supplementsOptions} selected={supplementsSel} onChange={onSupplementsChange} />
          {renderOtherInputs(supplementsSel, supplementsOtherValues, setSupplementsOtherValues, "supplements")}
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="allergies" render={() => (
        <FormItem>
          <FormLabel>Known allergies or intolerances</FormLabel>
          <MultiSelect placeholder="Select..." options={allergiesOptions} selected={allergiesSel} onChange={onAllergiesChange} />
          {renderOtherInputs(allergiesSel, allergiesOtherValues, setAllergiesOtherValues, "allergies")}
          <FormMessage />
        </FormItem>
      )} />

      <FormField control={form.control} name="familyHistory" render={() => (
        <FormItem>
          <FormLabel>Family health history</FormLabel>
          <MultiSelect placeholder="Select..." options={familyHistoryOptions} selected={familyHistorySel} onChange={onFamilyHistoryChange} />
          {renderOtherInputs(familyHistorySel, familyHistoryOtherValues, setFamilyHistoryOtherValues, "familyHistory")}
          <FormMessage />
        </FormItem>
      )} />
    </div>
  );
};
