import { useState } from "react";
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
  decisionMaker: z.string().min(1, "This field is required"),
  cookFrequency: z.string().min(1, "This field is required"),
  takeoutFrequency: z.string().min(1, "This field is required"),
  commonFoods: z.string().min(1, "This field is required"),
  dietType: z.string().min(1, "This field is required"),
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
  "Other",
];

const dietTypeOptions = [
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
  "Other",
];

export const NutritionHabitsForm = ({ form }: { form: any }) => {
  const [commonFoodsSelected, setCommonFoodsSelected] = useState<string[]>([]);
  const [dietDetailsSelected, setDietDetailsSelected] = useState<string[]>([]);

  const handleCommonFoodsChange = (val: string[]) => {
    setCommonFoodsSelected(val);
    form.setValue("commonFoods", val.join(" , "));
  };

  const handleDietDetailsChange = (val: string[]) => {
    setDietDetailsSelected(val);
    form.setValue("dietDetails", val.join(" , "));
  };

  return (
    <div className="space-y-6">
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {decisionMakerOptions.map((option) => (
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
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              What kind of food do you find yourself eating the most each week?
            </FormLabel>
            <MultiSelect
              placeholder="Select common foods"
              options={commonFoodOptions}
              selected={commonFoodsSelected}
              onChange={handleCommonFoodsChange}
            />
            {form.watch("commonFoods") === "Other" && (
              <div className="pt-2">
                <Input
                  placeholder="Other"
                  value={field.value === "Other" ? "" : field.value}
                  onChange={(e) => form.setValue("dietDetails", e.target.value)}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dietType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you currently follow any specific type of diet or eating
              pattern?
            </FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
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
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="Other" id="Other" />
                  </FormControl>
                  <FormLabel htmlFor="Other" className="font-normal">
                    Other (please specify)
                  </FormLabel>
                </FormItem>
                {form.watch("dietType") === "Other" && (
                  <FormField
                    control={form.control}
                    name="dietDetails"
                    render={({ field }) => (
                      <FormItem>
                        <MultiSelect
                          placeholder="Select diet"
                          options={dietTypeOptions}
                          selected={dietDetailsSelected}
                          onChange={handleDietDetailsChange}
                        />
                        {form.watch("dietDetails") === "Other" && (
                          <div className="pt-2">
                            <Input
                              placeholder="Other"
                              value={field.value === "Other" ? "" : field.value}
                              onChange={(e) =>
                                form.setValue("dietDetails", e.target.value)
                              }
                            />
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="None" id="None" />
                  </FormControl>
                  <FormLabel htmlFor="None" className="font-normal">
                    Not sure / I don’t follow a specific diet
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
