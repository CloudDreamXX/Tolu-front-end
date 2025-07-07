import { Controller, UseFormReturn } from "react-hook-form";
import { baseSchema } from "widgets/library-small-chat";
import { z } from "zod";
import { CustomSelect } from "../CustomSelect/ui";
import { MultiSelect } from "../MultiSelect";

export type FormValues = z.infer<typeof baseSchema>;

interface LifestyleFormProps {
  form: UseFormReturn<FormValues>;
}

export const LifestyleForm = ({ form }: LifestyleFormProps) => {
  const { register } = form;
  const inputClass =
    "input inline-input border border-[#DBDEE1] rounded-full outline-[#008FF6] py-[4px] px-[12px] min-w-[60px] placeholder:text-[#5F5F65]";
  const lineClass =
    "flex flex-wrap gap-x-[12px] gap-y-[12px] text-[18px] font-[500] text-[#1D1D1F] items-center";

  const dietOptions = [
    "Standard / No specific diet",
    "Vegetarian",
    "Vegan",
    "Pescatarian",
    "Paleo",
    "Primal",
    "Autoimmune Paleo (AIP)",
    "Low Lectin",
    "Low Carb",
    "Low Glycemic",
    "Specific Carbohydrate Diet (SCD)",
    "Keto / Ketogenic",
    "Intermittent Fasting",
    "Traditional / WAPF (Weston A. Price Foundation)",
    "Nightshade Elimination",
    "Basic Elimination",
    "Full Elimination",
    "Elimination / Rotation Diet",
    "Anti-Candida",
    "Body Ecology Diet",
    "Raw or Live Food Diet",
    "Gluten-Free",
    "Dairy-Free",
    "Low FODMAP",
    "Anti-inflammatory",
    "Mediterranean",
    "Other (please specify)",
    "Not sure / I don’t follow a specific diet",
  ];

  return (
    <div className="pt-[16px] border-t border-[#DBDEE1] mt-[16px] space-y-[12px]">
      <div className={lineClass}>
        <span>Right now, my lifestyle includes</span>
        <input
          {...register("lifestyleInfo")}
          placeholder="stress level – e.g., high-stress job"
          className={`${inputClass} w-[296px]`}
        />
      </div>

      <div className={lineClass}>
        <span>, eating about</span>
        <input
          {...register("takeout")}
          placeholder="takeout %"
          className={`${inputClass} w-[108px]`}
        />
        <span>takeout and</span>
        <input
          {...register("homeCooked")}
          placeholder="home-cooked %"
          className={`${inputClass} w-[158px]`}
        />
        <span>home-cooked meals.</span>
      </div>

      <div className={lineClass}>
        <span>I usually follow a</span>
        <Controller
          name="dietType"
          control={form.control}
          render={({ field }) => (
            <MultiSelect
              placeholder="die type"
              options={dietOptions}
              className="w-fit"
              selected={field.value
                .split(",")
                .map((str) => str.trim())
                .filter(Boolean)}
              onChange={(val) => {
                const cleaned = val
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .join(", ");
                field.onChange(cleaned);
              }}
            />
          )}
        />
        <span>diet.</span>
      </div>

      <div className={lineClass}>
        <span>I</span>
        <Controller
          name="exercise"
          control={form.control}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              options={["Sometimes", "Rarely", "Never"]}
              placeholder="rarely"
              className="w-fit"
            />
          )}
        />
        <span>get time to exercise or relax, and</span>
        <input
          {...register("limitations")}
          placeholder="add any major lifestyle limitation – e.g., we haven’t traveled in years"
          className={`${inputClass} w-[579px]`}
        />
      </div>

      <div className={lineClass}>
        <span>I’m currently taking</span>
        <Controller
          name="medications"
          control={form.control}
          render={({ field }) => (
            <MultiSelect
              placeholder={"medications or supplements"}
              options={dietOptions}
              className="w-fit"
              selected={field.value
                .split(",")
                .map((str) => str.trim())
                .filter(Boolean)}
              onChange={(val) => {
                const cleaned = val
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .join(", ");
                field.onChange(cleaned);
              }}
            />
          )}
        />
      </div>

      <div className={lineClass}>
        <span>my periods are</span>
        <Controller
          name="period"
          control={form.control}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              options={["Irregular", "Regular"]}
              placeholder="regular"
              className="w-fit"
            />
          )}
        />

        <span>, and my sex life is</span>

        <Controller
          name="sexLife"
          control={form.control}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              options={["Nonexistent", "Active", "Low"]}
              placeholder="active"
              className="w-fit"
            />
          )}
        />
      </div>

      <div className={lineClass}>
        <span>I usually rely on</span>
        <input
          {...register("supportSystem")}
          placeholder="support system – e.g., mom and best friend"
          className={`${inputClass} w-[407px]`}
        />
        <span>for emotional support.</span>
      </div>
    </div>
  );
};
