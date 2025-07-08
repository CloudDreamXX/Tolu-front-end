import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { baseSchema } from "widgets/library-small-chat/lib";

export type FormValues = z.infer<typeof baseSchema>;

interface HealthHistoryFormProps {
  form: UseFormReturn<FormValues>;
}

export const HealthHistoryForm = ({ form }: HealthHistoryFormProps) => {
  const { register } = form;

  const inputClass =
    "input inline-input border border-[#DBDEE1] rounded-full outline-[#008FF6] py-[4px] px-[12px] min-w-[60px] placeholder:text-[#5F5F65]";
  const lineClass =
    "flex flex-wrap gap-x-[12px] gap-y-[12px] text-[18px] font-[500] text-[#1D1D1F] items-center";

  return (
    <div className="pt-[16px] border-t border-[#DBDEE1] mt-[16px] space-y-[12px]">
      <div className={lineClass}>
        <span>My health history includes</span>
        <input
          {...register("diagnosedConditions")}
          placeholder="diagnosed conditions – e.g., Grave’s, arthritis"
          className={`${inputClass} w-[388px]`}
        />
        <span>, and I have</span>
        <input
          {...register("geneticTraits")}
          placeholder="genetic traits – e.g., alpha thalassemia"
          className={`${inputClass} w-[337px]`}
        />
        <span>.</span>
      </div>
      <div className={lineClass}>
        <span>In my family, there’s a history of</span>
        <input
          {...register("maternalSide")}
          placeholder="maternal side issues – e.g., joint pain, cancer"
          className={`${inputClass} w-[385px]`}
        />
        <span>on my mom’s side and</span>
        <input
          {...register("paternalSide")}
          placeholder="paternal side issues – e.g., asthma"
          className={`${inputClass} w-[303px]`}
        />
        <span>on my dad’s side.</span>
      </div>
      <div className={lineClass}>
        <span>Someone in my family was recently diagnosed with</span>
        <input
          {...register("notableConcern")}
          placeholder="notable concern – e.g., breast cancer"
          className={`${inputClass} w-[321px]`}
        />
        <span>, which has me thinking more about prevention.</span>
      </div>
    </div>
  );
};
