import {
  FormField,
  FormItem,
  FormLabel,
  Checkbox,
  Textarea,
  RadioGroup,
  RadioGroupItem,
} from "shared/ui";
import { z } from "zod";
import { useState, useEffect } from "react";

export const healthConcernsSchema = z.object({
  mainHealthConcerns: z.string().optional(),
  whenFirstExperienced: z.string().optional(),

  howDealtWithConcerns: z.string().optional(),
  successWithApproaches: z.string().optional(),

  otherHealthPractitioners: z.string().optional(),
  surgicalProcedures: z.string().optional(),

  antibioticsInfancyChildhood: z.string().optional(),
  antibioticsTeen: z.string().optional(),
  antibioticsAdult: z.string().optional(),
  currentMedications: z.string().optional(),
  currentSupplements: z.string().optional(),

  familySimilarProblems: z.string().optional(),

  foodsAvoidSymptoms: z.string().optional(),
  immediateSymptomsAfterEating: z.string().optional(),
  delayedSymptomsAfterEating: z.string().optional(),
  foodCravings: z.string().optional(),

  dietAtOnset: z.string().optional(),
  knownFoodAllergies: z.string().optional(),

  regularFoodConsumption: z.array(z.string()).optional(),
  specialDiet: z.array(z.string()).optional(),

  homeCookedPercentage: z.number().optional(),
  dietRelationshipNotes: z.string().optional(),
});

export const REGULAR_FOODS = [
  "Soda",
  "Diet soda",
  "Refined sugar",
  "Alcohol",
  "Fast food",
  "Gluten",
  "Dairy",
  "Coffee",
];

export const SPECIAL_DIETS = [
  "Autoimmune paleo (AIP)",
  "SCD/GAPS",
  "Dairy restricted or dairy-free",
  "Vegetarian",
  "Vegan",
  "Paleo",
  "Blood type",
  "Raw",
  "Refined sugar-free",
  "Gluten-free",
  "Ketogenic diet",
  "Other",
];

export const ANTIBIOTIC_FREQUENCY_OPTIONS = [
  "Never",
  "Rarely (1-2 times)",
  "Occasionally (3-5 times)",
  "Frequently (6+ times)",
];

const checkboxGroup = (form: any, name: string, value: string) => {
  const vals = form.watch(name) ?? [];
  const checked = vals.includes(value);

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={checked}
        onCheckedChange={() =>
          form.setValue(
            name,
            checked ? vals.filter((v: string) => v !== value) : [...vals, value]
          )
        }
      />
      <span className="text-sm">{value}</span>
    </div>
  );
};

export const HealthConcernsStep = ({ form }: { form: any }) => {
  const [otherDiet, setOtherDiet] = useState("");
  const specialDiet = form.watch("specialDiet") ?? [];
  const isOtherSelected = specialDiet.includes("Other");

  useEffect(() => {
    if (!isOtherSelected) {
      setOtherDiet("");
    }
  }, [isOtherSelected]);

  return (
    <div className="space-y-8">
      {/* Main health concerns */}
      <FormField
        control={form.control}
        name="mainHealthConcerns"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              What are your main health concerns? (Describe in detail, including
              the severity of the symptoms) *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* When first experienced */}
      <FormField
        control={form.control}
        name="whenFirstExperienced"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              When did you first experience these concerns? *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* How dealt with concerns */}
      <FormField
        control={form.control}
        name="howDealtWithConcerns"
        render={() => (
          <FormItem>
            <FormLabel>
              How have you dealt with these concerns in the past? *
            </FormLabel>
            <div className="flex flex-col gap-2">
              {["Doctors", "Self-care"].map((option) => (
                <div key={option} className="flex items-center gap-2">
                  <Checkbox
                    checked={(
                      form.watch("howDealtWithConcerns") ?? ""
                    ).includes(option)}
                    onCheckedChange={() => {
                      const vals = form.watch("howDealtWithConcerns") || [];
                      form.setValue(
                        "howDealtWithConcerns",
                        vals.includes(option)
                          ? vals.filter((v: string) => v !== option)
                          : [...vals, option]
                      );
                    }}
                  />
                  <span>{option}</span>
                </div>
              ))}
            </div>
          </FormItem>
        )}
      />

      {/* Success with approaches */}
      <FormField
        control={form.control}
        name="successWithApproaches"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Have you experienced any success with these approaches? *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Other health practitioners */}
      <FormField
        control={form.control}
        name="otherHealthPractitioners"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              What other health practitioners are you currently seeing? List
              name, specialty and phone # below. *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Surgical procedures */}
      <FormField
        control={form.control}
        name="surgicalProcedures"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Please list the date and description of any surgical procedures
              you have had (including breast reduction or augmentation). *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Antibiotics */}
      {[
        ["antibioticsInfancyChildhood", "in infancy/childhood"],
        ["antibioticsTeen", "as a teen"],
        ["antibioticsAdult", "as an adult"],
      ].map(([name, label]) => (
        <FormField
          key={name}
          control={form.control}
          name={name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How often did you take antibiotics {label}? *
              </FormLabel>
              <Textarea {...field} />
            </FormItem>
          )}
        />
      ))}

      {/* Current medications */}
      <FormField
        control={form.control}
        name="currentMedications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>List any medicine you are currently taking. *</FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Current supplements */}
      <FormField
        control={form.control}
        name="currentSupplements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              List all vitamins, minerals, herbs and nutritional supplements you
              are now taking. *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Family similar problems */}
      <FormField
        control={form.control}
        name="familySimilarProblems"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Have any other family members had similar problems (describe)? *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Foods avoided */}
      <FormField
        control={form.control}
        name="foodsAvoidSymptoms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Are there any foods that you avoid because of the way they make
              you feel? If yes, please name the food and the symptom. *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Immediate symptoms */}
      <FormField
        control={form.control}
        name="immediateSymptomsAfterEating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you have symptoms immediately after eating like bloating, gas,
              sneezing or hives? If so, please explain. *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Delayed symptoms */}
      <FormField
        control={form.control}
        name="delayedSymptomsAfterEating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Are you aware of any delayed symptoms after eating certain foods
              such as fatigue, muscle aches, sinus congestion, etc? If so,
              please explain. *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Food cravings */}
      <FormField
        control={form.control}
        name="foodCravings"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Are there foods that you crave? If so, please explain. *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Diet at onset */}
      <FormField
        control={form.control}
        name="dietAtOnset"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Describe your diet at the onset of your health concerns. *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Known allergies */}
      <FormField
        control={form.control}
        name="knownFoodAllergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you have any known food allergies or sensitivities? *
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />

      {/* Regular foods */}
      <FormField
        control={form.control}
        name="regularFoodConsumption"
        render={() => (
          <FormItem>
            <FormLabel>
              Which of the following foods do you consume regularly? *
            </FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {REGULAR_FOODS.map((food) =>
                checkboxGroup(form, "regularFoodConsumption", food)
              )}
            </div>
          </FormItem>
        )}
      />

      {/* Special diet */}
      <FormItem>
        <FormLabel>Are you currently on a special diet? *</FormLabel>
        <div className="grid grid-cols-2 gap-3">
          {SPECIAL_DIETS.map((diet) =>
            checkboxGroup(form, "specialDiet", diet)
          )}
        </div>
        {isOtherSelected && (
          <div className="flex flex-col mt-4 gap-2">
            <FormLabel className="mt-4">
              Please specify your other diet
            </FormLabel>
            <Textarea
              value={otherDiet}
              onChange={(e) => setOtherDiet(e.target.value)}
              onBlur={() => {
                if (otherDiet.trim()) {
                  // Replace 'Other' with the typed value only on blur
                  const filtered = specialDiet.filter(
                    (d: string) => d !== "Other"
                  );
                  if (!filtered.includes(otherDiet.trim())) {
                    form.setValue("specialDiet", [
                      ...filtered,
                      otherDiet.trim(),
                    ]);
                  }
                }
              }}
              placeholder="Type your diet..."
            />
          </div>
        )}
      </FormItem>

      {/* Home-cooked meals */}
      <FormField
        control={form.control}
        name="homeCookedPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              What percentage of your meals are home-cooked?
            </FormLabel>
            <RadioGroup
              value={String(field.value)}
              onValueChange={(v) => field.onChange(Number(v))}
              className="grid grid-cols-5 gap-2"
            >
              {[
                "10",
                "20",
                "30",
                "40",
                "50",
                "60",
                "70",
                "80",
                "90",
                "100",
              ].map((p) => (
                <div key={p} className="flex items-center gap-2">
                  <RadioGroupItem value={p} />
                  <span>{p}%</span>
                </div>
              ))}
            </RadioGroup>
          </FormItem>
        )}
      />

      {/* Diet notes */}
      <FormField
        control={form.control}
        name="dietRelationshipNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Is there anything else I should know about your current diet,
              history or relationship to food?
            </FormLabel>
            <Textarea {...field} />
          </FormItem>
        )}
      />
    </div>
  );
};
