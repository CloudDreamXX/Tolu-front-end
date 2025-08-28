import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
  Slider,
} from "shared/ui";
import { z } from "zod";
import { useState } from "react";
import { MultiSelect } from "../MultiSelect";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export const lifestyleHabitsSchema = z.object({
  dietDetails: z.string().min(1, "This field is required"),
  exerciseHabits: z
    .string()
    .min(1, { message: "Please select your activity level." }),
  otherExerciseHabits: z.string().optional(),
  sleepQuality: z.number().min(0).max(3),
  stressLevels: z.number().min(0).max(3),
  energyLevels: z.number().min(0).max(3),
});

const dietDetailsOptions = [
  "Basic Elimination",
  "Full Elimination",
  "Nightshade Elimination",
  "Specific Carbohydrate Diet (SCD)",
  "Paleo",
  "Primal",
  "Traditional/WAPF",
  "Low Lectin",
  "Autoimmune Paleo",
  "Minus Glutamates",
  "Minus Oxalates",
  "Low FODMAP",
  "Minus Salicylates",
  "Minus Amines",
  "GAPS (Gut & Psychology Syndrome)",
  "Elemental (Food-Based)",
  "Ketogenic",
  "Low Carb",
  "Low Glycemic",
  "Body Ecology",
  "Anti-Candida",
  "Raw or Live Food Diet",
  "Other",
];

const sleepQualityLabels = [
  "Poor: Restless, interrupted sleep",
  "Fair: Inconsistent sleep, some nights good, some bad",
  "Good: Generally restful sleep",
  "Excellent: Consistently deep, restorative sleep",
];
const stressLevelsLabels = [
  "Low: Minimal stress",
  "Moderate: Manageable stress",
  "High: Frequent stress",
  "Extreme: Overwhelming stress",
];
const energyLevelsLabels = [
  "Low: Often fatigued",
  "Medium: Moderate energy",
  "High: Consistently energized",
  "Varies: Energy levels fluctuate significantly",
];

const joinVals = (vals: string[], extra?: string) => {
  const filtered = vals.filter((v) => v !== "Other");
  return [...filtered, ...(extra ? [extra] : [])].join(" , ");
};

export const LifestyleHabitsForm = ({ form }: { form: any }) => {
  const exerciseHabits = form.watch("exerciseHabits");

  const [dietDetailsSel, setDietDetailsSel] = useState<string[]>([]);
  const [dietDetailsOther, setDietDetailsOther] = useState("");

  const onDietDetailsChange = (val: string[]) => {
    setDietDetailsSel(val);
    form.setValue("dietDetails", joinVals(val, dietDetailsOther));
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-500 ">
        Tell us about your daily routines — diet, exercise, and sleep.
      </p>

      <FormField
        control={form.control}
        name="dietDetails"
        render={() => (
          <FormItem>
            <FormLabel>Are you on any specific diet?</FormLabel>
            <MultiSelect
              placeholder="None"
              options={dietDetailsOptions}
              selected={dietDetailsSel}
              onChange={onDietDetailsChange}
              defaultValue={form.getValues("dietDetails")}
            />
            {dietDetailsSel.includes("Other") && (
              <div className="pt-2">
                <Input
                  placeholder="Type your diet"
                  value={dietDetailsOther}
                  onChange={(e) => {
                    const v = e.target.value;
                    setDietDetailsOther(v);
                    form.setValue("dietDetails", joinVals(dietDetailsSel, v));
                  }}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Exercise habits (unchanged) */}
      <FormField
        control={form.control}
        name="exerciseHabits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exercise habits</FormLabel>
            <p className="!mt-0 text-sm text-gray-500">
              Select your typical activity level
            </p>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="space-y-[10px]"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="sedentary" id="sedentary" />
                  </FormControl>
                  <FormLabel htmlFor="sedentary" className="font-normal">
                    Sedentary (Little to no exercise)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="light" id="light" />
                  </FormControl>
                  <FormLabel htmlFor="light" className="font-normal">
                    Light activity (Walking, yoga, stretching)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="moderate" id="moderate" />
                  </FormControl>
                  <FormLabel htmlFor="moderate" className="font-normal">
                    Moderate (Strength training, cardio 3x per week)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="intense" id="intense" />
                  </FormControl>
                  <FormLabel htmlFor="intense" className="font-normal">
                    Intense (Athlete-level training)
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="other" id="other" />
                  </FormControl>
                  <FormLabel htmlFor="other" className="font-normal">
                    Other
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {exerciseHabits === "other" && (
        <FormField
          control={form.control}
          name="otherExerciseHabits"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Cycling and Pilates 4x per week"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Sleep quality */}
      <FormField
        control={form.control}
        name="sleepQuality"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Sleep quality</FormLabel>
            <p className="!mt-0 text-sm text-gray-500">
              How well do you sleep?
            </p>
            <div className="flex items-center gap-2 text-sm text-[#1B2559] font-medium">
              <MaterialIcon iconName="lightbulb" />
              <span>{sleepQualityLabels[field.value]}</span>
            </div>
            <FormControl>
              <div className="relative">
                <Slider
                  value={[field.value + 1]}
                  onValueChange={(value) =>
                    field.onChange(Math.max(0, value[0] - 1))
                  }
                  max={4}
                  step={1}
                  className="py-2"
                />
                <div
                  className="absolute top-0 bottom-0 left-0 right-0"
                  style={{ pointerEvents: "none" }}
                >
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-1/4"></div>
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-1/2"></div>
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-3/4"></div>
                </div>
              </div>
            </FormControl>
            <div className="flex justify-around text-xs text-gray-500">
              <span>Poor</span>
              <span>Fair</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </FormItem>
        )}
      />

      {/* Stress levels */}
      <FormField
        control={form.control}
        name="stressLevels"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Stress levels</FormLabel>
            <p className="!mt-0 text-sm text-gray-500">
              Rate your daily stress levels
            </p>
            <div className="flex items-center gap-2 text-sm text-[#1B2559] font-medium">
              <MaterialIcon iconName="lightbulb" />
              <span>{stressLevelsLabels[field.value]}</span>
            </div>
            <FormControl>
              <div className="relative">
                <Slider
                  value={[field.value + 1]}
                  onValueChange={(value) =>
                    field.onChange(Math.max(0, value[0] - 1))
                  }
                  max={4}
                  step={1}
                  className="py-2"
                />
                <div
                  className="absolute top-0 bottom-0 left-0 right-0"
                  style={{ pointerEvents: "none" }}
                >
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-1/4"></div>
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-1/2"></div>
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-3/4"></div>
                </div>
              </div>
            </FormControl>
            <div className="flex justify-around text-xs text-gray-500">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
              <span>Extreme</span>
            </div>
          </FormItem>
        )}
      />

      {/* Energy levels */}
      <FormField
        control={form.control}
        name="energyLevels"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Energy levels throughout the day</FormLabel>
            <p className="!mt-0 text-sm text-gray-500">
              How do you feel most days?
            </p>
            <div className="flex items-center gap-2 text-sm text-[#1B2559] font-medium">
              <MaterialIcon iconName="lightbulb" />
              <span>{energyLevelsLabels[field.value]}</span>
            </div>
            <FormControl>
              <div className="relative">
                <Slider
                  value={[field.value + 1]}
                  onValueChange={(value) =>
                    field.onChange(Math.max(0, value[0] - 1))
                  }
                  max={4}
                  step={1}
                  className="py-2"
                  withSeparator
                />
                <div
                  className="absolute top-0 bottom-0 left-0 right-0"
                  style={{ pointerEvents: "none" }}
                >
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-1/4"></div>
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-1/2"></div>
                  <div className="absolute top-0 bottom-0 w-px -translate-x-1/2 bg-white left-3/4"></div>
                </div>
              </div>
            </FormControl>
            <div className="flex justify-around text-xs text-gray-500">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
              <span>Varies</span>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
