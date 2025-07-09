import { Controller, UseFormReturn } from "react-hook-form";
import { baseSchema } from "widgets/library-small-chat/lib";
import { z } from "zod";
import { CustomSelect } from "../CustomSelect/ui";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "shared/ui";
import LightIcon from "shared/assets/icons/light";

export type FormValues = z.infer<typeof baseSchema>;

interface SymptomsFormProps {
  form: UseFormReturn<FormValues>;
}

export const SymptomsForm = ({ form }: SymptomsFormProps) => {
  const { register } = form;

  const inputClass =
    "input inline-input border border-[#DBDEE1] rounded-full outline-[#008FF6] py-[4px] px-[12px] min-w-[60px] placeholder:text-[#5F5F65]";
  const lineClass =
    "flex flex-wrap gap-x-[12px] gap-y-[12px] text-[18px] font-[500] text-[#1D1D1F] items-center";

  return (
    <div className="pt-[16px] border-t border-[#DBDEE1] mt-[16px] space-y-[12px]">
      <div className={lineClass}>
        <span>Hi Tolu, I'm a</span>
        <input
          {...register("age")}
          placeholder="age"
          className={`${inputClass} w-[46px]`}
        />
        <span>and I'm</span>
        <input
          {...register("maritalStatus")}
          placeholder="marital status"
          className={`${inputClass} w-[138px]`}
        />
        <span>. I work as a</span>
        <input
          {...register("job")}
          placeholder="job"
          className={`${inputClass} w-[96px]`}
        />
        <span>and I have</span>
        <input
          {...register("children")}
          placeholder="number of"
          className={`${inputClass} w-[109px]`}
        />
        <span>children.</span>
        <span>I live in</span>
        <input
          {...register("location")}
          placeholder="city"
          className={`${inputClass} w-[90px]`}
        />
        <span>and I'm a</span>
        <TooltipProvider delayDuration={500}>
          <Tooltip>
            <TooltipTrigger asChild>
              <input
                {...register("religion")}
                placeholder="religion"
                className={`${inputClass} w-[120px]`}
              />
            </TooltipTrigger>

            <TooltipContent side="top">
              <div className="flex flex-col items-center gap-2">
                <h3 className="flex gap-2 text-[#1B2559] text-[16px] leading-[1.4]">
                  <span className="w-6 h-6 shrink-0">
                    <LightIcon className="text-[#1B2559]" />
                  </span>
                  We collect this information because some of the religious
                  rituals and dietary habits can affect the way your experience
                  perimenopause.
                </h3>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <span>.</span>
      </div>

      <div className={lineClass}>
        <span>I consider my financial ability</span>
        <Controller
          name="financialStatus"
          control={form.control}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              onChange={field.onChange}
              placeholder="stress level"
              options={["secure", "stable", "stressful"]}
              className="w-fit min-w-[140px]"
            />
          )}
        />
        <span>.</span>
        <span>I was born a</span>
        <input
          {...register("genderAssignedAtBirth")}
          placeholder="gender"
          className={`${inputClass} w-[82px]`}
        />
        <span>and I identify as a</span>
        <input
          {...register("genderIdentity")}
          placeholder="gender"
          className={`${inputClass} w-[82px]`}
        />
        <span>.</span>
      </div>

      {/* <div className={lineClass}>
        <span>I'm</span>
        <Controller
          name="menopauseStatus"
          control={form.control}
          render={({ field }) => (
            <CustomSelect
              value={field.value}
              placeholder="in perimenopause"
              onChange={field.onChange}
              options={[
                "Not sure",
                "Premenopausal (Regular cycles)",
                "Perimenopausal (Irregular cycles)",
                "Post menopausal (No cycles)",
              ]}
              className="w-fit min-w-[160px]"
            />
          )}
        />
        <span>but lately I’ve been dealing with</span>
        <input
          {...register("mainSymptoms")}
          placeholder="e.g., trouble sleeping, mood swings"
          className={`${inputClass} w-[320px]`}
        />
        <span>.</span>
      </div>

      <div className={lineClass}>
        <span>I’ve also noticed</span>
        <input
          {...register("otherChallenges")}
          placeholder="e.g., cravings, low energy"
          className={`${inputClass} w-[300px]`}
        />
        <span>, and it feels like no matter</span>
        <input
          {...register("strategiesTried")}
          placeholder="e.g., dieting, exercising"
          className={`${inputClass} w-[280px]`}
        />
        <span>, things aren’t getting better.</span>
      </div> */}
    </div>
  );
};
