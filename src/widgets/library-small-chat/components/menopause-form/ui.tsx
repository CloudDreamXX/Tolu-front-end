import { UseFormReturn } from "react-hook-form";
import { baseSchema } from "widgets/library-small-chat/lib";
import z from "zod";

export type FormValues = z.infer<typeof baseSchema>;

export const MenopauseForm = ({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) => {
  const { register } = form;

  const inputClass =
    "input inline-input border border-[#DBDEE1] rounded-full outline-[#008FF6] py-[4px] px-[12px] min-w-[60px] placeholder:text-[#5F5F65]";
  const lineClass =
    "flex flex-wrap gap-x-[12px] gap-y-[12px] text-[14px] md:text-[18px] font-[500] text-[#1D1D1F] items-center";

  return (
    <div className="pt-[16px] border-t border-[#DBDEE1] mt-[16px] space-y-[12px]">
      <div className={lineClass}>
        <span>I am in</span>
        <input
          {...register("menopauseStatus")}
          placeholder="menopause status"
          className={`${inputClass} w-[174px]`}
        />
        <span>and my common symptoms are</span>
        <input
          {...register("mainSymptoms")}
          placeholder="symptoms"
          className={`${inputClass} w-[110px]`}
        />
        <span>.</span>
      </div>

      <div className={lineClass}>
        <span>I</span>
        <input
          {...register("symptomTracking")}
          placeholder="track/don't track"
          className={`${inputClass} w-[157px]`}
        />
        <span>my symptoms often using</span>
        <input
          {...register("trackingDevice")}
          placeholder="device"
          className={`${inputClass} w-[76px]`}
        />
        <span>.</span>
      </div>

      <div className={lineClass}>
        <span>My biggest challenge is</span>
        <input
          {...register("biggestChallenge")}
          placeholder="symptom/obstacle"
          className={`${inputClass} w-[174px]`}
        />
        <span>. Currently I</span>
        <input
          {...register("successManaging")}
          placeholder="am/am not"
          className={`${inputClass} w-[111px]`}
        />
        <span>successful managing my symptoms.</span>
      </div>
    </div>
  );
};
