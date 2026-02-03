import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
  Textarea,
} from "shared/ui";
import { z } from "zod";

export const bowelHealthSchema = z.object({
  bowelMovementFrequency: z.string(),
  bowelMovementConsistency: z.array(z.string()),
  bowelMovementColor: z.array(z.string()),
  intestinalGas: z.string(),
  foodPoisoningHistory: z.string(),
});

export const BOWEL_FREQUENCY = [
  { value: "1-3_per_day", label: "1–3 times per day" },
  { value: "more_than_3_per_day", label: "More than 3 times per day" },
  { value: "not_regular", label: "Not regularly every day" },
];

export const BOWEL_CONSISTENCY = [
  { value: "soft_well_formed", label: "Soft & well formed" },
  { value: "often_float", label: "Often float" },
  { value: "difficult_to_pass", label: "Difficult to pass" },
  { value: "diarrhea", label: "Diarrhea" },
  { value: "thin_long_narrow", label: "Thin, long or narrow" },
  { value: "small_hard", label: "Small and hard" },
  { value: "loose_not_watery", label: "Loose but not watery" },
  { value: "alternating", label: "Alternating between hard and loose" },
];

export const BOWEL_COLOR = [
  { value: "medium_brown", label: "Medium brown" },
  { value: "very_dark_black", label: "Very dark or black" },
  { value: "greenish", label: "Greenish" },
  { value: "blood_visible", label: "Blood is visible" },
  { value: "variable", label: "Variable" },
  { value: "yellow_light_brown", label: "Yellow, light brown" },
  { value: "chalky", label: "Chalky colored" },
  { value: "greasy_shiny", label: "Greasy, shiny" },
];

const checkboxGroup = (form: any, name: string, value: string, label: string) => {
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
      <span className="text-sm">{label}</span>
    </div>
  );
};

export const BowelHealthStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="bowelMovementFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bowel Movement Frequency *</FormLabel>
            <RadioGroup
              value={field.value}
              onValueChange={field.onChange}
              className="space-y-2"
            >
              {BOWEL_FREQUENCY.map((opt) => (
                <div key={opt.value} className="flex items-center gap-3">
                  <RadioGroupItem value={opt.value} />
                  <span>{opt.label}</span>
                </div>
              ))}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bowelMovementConsistency"
        render={() => (
          <FormItem>
            <FormLabel>Bowel Movement Consistency *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {BOWEL_CONSISTENCY.map((opt) =>
                checkboxGroup(form, "bowelMovementConsistency", opt.value, opt.label)
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="bowelMovementColor"
        render={() => (
          <FormItem>
            <FormLabel>Bowel Movement Color *</FormLabel>
            <div className="grid grid-cols-2 gap-3">
              {BOWEL_COLOR.map((opt) =>
                checkboxGroup(form, "bowelMovementColor", opt.value, opt.label)
              )}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="intestinalGas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Do you experience intestinal gas? *</FormLabel>
            <Textarea {...field} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="foodPoisoningHistory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Have you ever had food poisoning? *</FormLabel>
            <Textarea
              {...field}
              placeholder="Where were you, how was it treated, and did you fully recover?"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
