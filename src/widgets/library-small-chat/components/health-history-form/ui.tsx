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
        <span>I have a history of</span>
        <input
          {...register("diagnosedConditions")}
          placeholder="diseases and conditions"
          className={`${inputClass} w-[219px]`}
        />
        <span>. My genetic test indicates I have</span>
        <input
          {...register("geneticTraits")}
          placeholder="genetic disease"
          className={`${inputClass} w-[308px]`}
        />
        <span>.</span>
      </div>

      <div className={lineClass}>
        <span>In my family there's history of</span>
        <input
          {...register("maternalSide")}
          placeholder="disease"
          className={`${inputClass} w-[90px]`}
        />
        <span>. I take</span>
        <input
          {...register("medications")}
          placeholder="medication/supplement"
          className={`${inputClass} w-[221px]`}
        />
        <span>to support my condition.</span>
      </div>
    </div>
  );
};
