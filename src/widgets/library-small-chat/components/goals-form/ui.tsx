import { UseFormReturn } from "react-hook-form";
import { baseSchema } from "widgets/library-small-chat/lib";
import { z } from "zod";

export type FormValues = z.infer<typeof baseSchema>;

interface GoalsFormProps {
  form: UseFormReturn<FormValues>;
}

export const GoalsForm = ({ form }: GoalsFormProps) => {
  const inputClass =
    "input inline-input border border-[#DBDEE1] rounded-full outline-[#008FF6] py-[4px] px-[12px] min-w-[60px] placeholder:text-[#5F5F65]";
  const lineClass =
    "flex flex-wrap gap-x-[12px] gap-y-[12px] text-[18px] font-[500] text-[#1D1D1F] items-center";

  return (
    <div className="pt-[16px] border-t border-[#DBDEE1] mt-[16px] space-y-[12px]">
      <div className={lineClass}>
        <span>My goal is to</span>
        <input
          {...form.register("goals")}
          placeholder="sleep better, lose weight"
          className={`${inputClass} w-[227px]`}
        />
        <span>.</span>
      </div>
    </div>
  );
};
