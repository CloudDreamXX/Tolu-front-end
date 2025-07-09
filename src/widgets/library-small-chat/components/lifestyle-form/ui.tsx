import { Controller, UseFormReturn } from "react-hook-form";
import { baseSchema } from "widgets/library-small-chat/lib";
import { z } from "zod";
import { CustomSelect } from "../CustomSelect";

export type FormValues = z.infer<typeof baseSchema>;

interface LifestyleFormProps {
  form: UseFormReturn<FormValues>;
}

export const LifestyleForm = ({ form }: LifestyleFormProps) => {
  const { register, control } = form;

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
    "Traditional / WAPF",
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

  const sexLifeOptions = ["Irregular", "Regular"];

  return (
    <div className="pt-[16px] border-t border-[#DBDEE1] mt-[16px] space-y-[12px]">
      <div className={lineClass}>
        <span>Right now I have a</span>
        <input
          {...register("lifestyleInfo")}
          placeholder="stress level"
          className={`${inputClass} w-[117px]`}
        />
        <span>lifestyle.</span>
      </div>

      <div className={lineClass}>
        <span>I eat about</span>
        <input
          {...register("takeout")}
          placeholder="%"
          className={`${inputClass} w-[46px]`}
        />
        <span>takeout food and</span>
        <input
          {...register("homeCooked")}
          placeholder="%"
          className={`${inputClass} w-[41px]`}
        />
        <span>home-cooked food.</span>
      </div>

      <div className={lineClass}>
        <span>My diet is</span>
        <Controller
          name="dietType"
          control={control}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              options={dietOptions}
              placeholder="diet type"
              className="w-fit"
            />
          )}
        />
        <span>and I exercise</span>
        <input
          {...register("exercise")}
          placeholder="days"
          className={`${inputClass} w-[63px]`}
        />
        <span>days during a week.</span>
      </div>

      <div className={lineClass}>
        <span>My sex life is</span>
        <Controller
          name="sexLife"
          control={control}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              options={sexLifeOptions}
              placeholder="status"
              className="w-fit"
            />
          )}
        />
        <span>and my emotional support network is usually</span>
        <input
          {...register("supportSystem")}
          placeholder="option"
          className={`${inputClass} w-[300px]`}
        />
        <span>.</span>
      </div>
    </div>
  );
};
