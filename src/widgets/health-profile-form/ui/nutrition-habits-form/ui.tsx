import { useEffect, useMemo, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import z from "zod";
import { MultiSelect } from "../MultiSelect";

export const nutritionHabitsSchema = z.object({
  decisionMaker: z.string().optional(),
  cookFrequency: z.string().optional(),
  takeoutFrequency: z.string().optional(),
  commonFoods: z.string().optional(),
  otherCommonFoods: z.string().optional(), // ⬅️ Added field for typed "other"
  dietType: z.string().optional(),
  dietDetails: z.string().optional(),
});

const decisionMakerOptions = [
  "I decide",
  "My partner/spouse decides",
  "We decide together",
  "My children/family members decide",
  "It varies day to day",
  "I usually eat out or order in",
];

const frequencyOptions = [
  "Every day",
  "A few times a week",
  "Once a week",
  "Rarely",
  "Never",
];

const commonFoodOptions = [
  "Whole grains",
  "Vegetables",
  "Fruits",
  "Animal proteins",
  "Plant-based proteins",
  "Processed snacks",
  "Fast food",
  "Dairy",
  "Sugary foods",
  "Other (please specify)",
];

const dietDetailsOptions = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Paleo",
  "Keto / Low Carb",
  "Mediterranean",
  "Intermittent Fasting",
  "Gluten-Free",
  "Dairy-Free",
  "Low FODMAP",
  "Elimination / Rotation Diet",
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

const commitOther = (fieldName: string, otherValue: string) => (form: any) => {
  const vals = split(form.getValues(fieldName));
  const withoutOthers = vals.filter((v) => !v.startsWith("Other"));
  const trimmed = otherValue.trim();
  const merged = [
    "Other (please specify)",
    ...(trimmed ? [`Other: ${trimmed}`] : []),
  ];
  form.setValue(fieldName, [...withoutOthers, ...merged].join(", "));
};

export const NutritionHabitsForm = ({ form }: { form: any }) => {
  const [decisionMakersSelected, setDecisionMakersSelected] = useState<string[]>([]);
  const [dietDetailsSel, setDietDetailsSel] = useState<string[]>([]);
  const [dietDetailsOtherValues, setDietDetailsOtherValues] = useState<string[]>([]);
  const [commonFoodsOtherValues, setCommonFoodsOtherValues] = useState<string[]>([]);

  const handleDecisionMakersChange = (val: string[]) => {
    setDecisionMakersSelected(val);
    form.setValue("decisionMaker", val.join(" , "));
  };

  const commonFoodsStr = form.watch("commonFoods") as string | undefined;
  const commonFoodsSel = useMemo(() => split(commonFoodsStr), [commonFoodsStr]);

  useEffect(() => {
    // Initialize Other common foods input if "Other" selected
    if (commonFoodsSel.includes("Other (please specify)") && commonFoodsOtherValues.length === 0) {
      const existingOther = extractOtherValue(commonFoodsStr || "");
      setCommonFoodsOtherValues(existingOther ? [existingOther] : [""]);
    }
  }, [commonFoodsSel]);

  const onCommonFoodsChange = (vals: string[]) => {
    form.setValue("commonFoods", [
      ...vals.filter(v => v !== "Other (please specify)"),
      ...commonFoodsOtherValues.filter(Boolean).map(v => `Other: ${v}`),
      ...(vals.includes("Other (please specify)") ? ["Other (please specify)"] : []),
    ].join(" , "));
  };

  const renderCommonFoodsOtherInputs = () => {
    if (!commonFoodsSel.includes("Other (please specify)")) return null;

    return (
      <div className="pt-2 space-y-2">
        {commonFoodsOtherValues.map((val, idx) => (
          <Input
            key={idx}
            placeholder="Other food"
            value={val}
            onChange={(e) => {
              const newVals = [...commonFoodsOtherValues];
              newVals[idx] = e.target.value;
              setCommonFoodsOtherValues(newVals);
            }}
            onBlur={() => {
              const existingVals = commonFoodsSel.filter(v => v !== "Other (please specify)");
              const merged = [...existingVals, ...commonFoodsOtherValues.filter(v => v.trim()).map(v => `Other: ${v.trim()}`)];
              form.setValue("commonFoods", merged.join(" , "));
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => setCommonFoodsOtherValues([...commonFoodsOtherValues, ""])}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add another
        </button>
      </div>
    );
  };

  // Diet details "Other" logic remains the same as previous example
  const dietDetailsStr = form.watch("dietDetails") as string | undefined;
  const dietDetailsSelected = useMemo(() => split(dietDetailsStr), [dietDetailsStr]);

  useEffect(() => {
    if (dietDetailsSelected.includes("Other") && dietDetailsOtherValues.length === 0) {
      setDietDetailsOtherValues([""]);
    }
  }, [dietDetailsSelected]);

  const onDietDetailsChange = (vals: string[]) => {
    const normalized = vals.includes("Other") && dietDetailsOtherValues.length === 0
      ? [...vals, ""]
      : vals;
    setDietDetailsSel(normalized);
    form.setValue(
      "dietDetails",
      [
        ...normalized.filter((v) => v !== "Other"),
        ...dietDetailsOtherValues.filter(Boolean),
      ].join(" , ")
    );
  };

  const renderDietDetailsOtherInputs = () => {
    if (!dietDetailsSel.includes("Other")) return null;

    return (
      <div className="pt-2 space-y-2 pl-6">
        {dietDetailsOtherValues.map((val, idx) => (
          <Input
            key={idx}
            placeholder="Other diet detail"
            value={val}
            onChange={(e) => {
              const newVals = [...dietDetailsOtherValues];
              newVals[idx] = e.target.value;
              setDietDetailsOtherValues(newVals);
            }}
            onBlur={() => {
              const existingVals = dietDetailsSel.filter((v) => v !== "Other");
              const merged = [...existingVals, ...dietDetailsOtherValues.filter(v => v.trim())];
              form.setValue("dietDetails", merged.join(" , "));
            }}
          />
        ))}
        <button
          type="button"
          onClick={() => setDietDetailsOtherValues([...dietDetailsOtherValues, ""])}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add another
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 overflow-y-auto">
      <p className="text-sm text-gray-500">
        Share key information related to your menstrual cycle, reproductive
        health, and hormonal patterns.
      </p>

      <FormField
        control={form.control}
        name="decisionMaker"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Who typically decides what to eat in your household each day?
            </FormLabel>
            <MultiSelect
              defaultValue={field.value}
              placeholder="Choose option(s)"
              options={decisionMakerOptions}
              selected={decisionMakersSelected}
              onChange={handleDecisionMakersChange}
            />
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="cookFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How often do you cook at home?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="takeoutFrequency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How often do you eat take out?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {frequencyOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

     <FormField
        control={form.control}
        name="commonFoods"
        render={() => (
          <FormItem className="flex w-full flex-col items-start gap-[10px]">
            <FormLabel>
              What kind of food do you find yourself eating the most each week?
            </FormLabel>
            <FormControl>
              <MultiSelect
                placeholder="Select common foods..."
                options={commonFoodOptions}
                selected={commonFoodsSel}
                onChange={onCommonFoodsChange}
                defaultValue={form.getValues("commonFoods")}
                className="text-sm w-full"
              />
            </FormControl>
            <FormMessage />
            {renderCommonFoodsOtherInputs()}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dietType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you currently follow any specific type of diet or eating pattern?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={(val) => {
                  field.onChange(val);
                  form.setValue("dietDetails", "");
                  setDietDetailsSel([]);
                  setDietDetailsOtherValues([]);
                }}
                defaultValue={field.value}
                className="space-y-[10px]"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Yes" id="Yes" />
                  </FormControl>
                  <FormLabel htmlFor="Yes" className="font-normal">
                    Yes
                  </FormLabel>
                </FormItem>

                {form.watch("dietType") === "Yes" && (
                  <div className="pl-6">
                    <MultiSelect
                      placeholder="Select diet(s)"
                      options={dietDetailsOptions}
                      selected={dietDetailsSel}
                      onChange={onDietDetailsChange}
                      defaultValue={form.getValues("dietDetails")}
                      dropdownPosition="top"
                    />
                    {renderDietDetailsOtherInputs()}
                  </div>
                )}

                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Other" id="Other" />
                  </FormControl>
                  <FormLabel htmlFor="Other" className="font-normal">
                    Other (please specify)
                  </FormLabel>
                </FormItem>

                {form.watch("dietType") === "Other" && (
                  <div className="pl-6 pt-2">
                    <Input
                      placeholder="Type your diet"
                      value={dietDetailsOtherValues[0] || ""}
                      onChange={(e) => {
                        const v = e.target.value;
                        setDietDetailsOtherValues([v]);
                        form.setValue("dietDetails", v);
                      }}
                    />
                  </div>
                )}

                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="No" id="No" />
                  </FormControl>
                  <FormLabel htmlFor="No" className="font-normal">
                    No / I don’t follow a specific diet
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
