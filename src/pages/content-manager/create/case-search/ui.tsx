import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { baseSchema } from "../ui";
import { useState } from "react";
import { CustomSelect } from "widgets/library-small-chat/components/CustomSelect/ui";

export type FormValues = z.infer<typeof baseSchema>;

interface CaseSearchFormProps {
  form: UseFormReturn<FormValues>;
}

export const CaseSearchForm = ({ form }: CaseSearchFormProps) => {
  const { register } = form;
  const [menopausePhase, setMenopausePhase] = useState<string>("");
  const [protocol, setProtocol] = useState<string>("");

  const inputClass =
    "input inline-input border border-[#DBDEE1] rounded-full outline-[#008FF6] py-[4px] px-[12px] min-w-[60px] placeholder:text-[#5F5F65]";
  const lineClass =
    "flex flex-wrap gap-x-[12px] gap-y-[12px] text-[18px] font-[500] text-[#1D1D1F] items-center";

  return (
    <div className="pb-[16px] space-y-[12px]">
      <div className={lineClass}>
        <span>This case involves a</span>
        <input
          {...register("age")}
          placeholder="52"
          className={`${inputClass} w-[46px]`}
        />
        <span>-year-old</span>
        <input
          {...register("employmentStatus")}
          placeholder="full-time teacher"
          className={`${inputClass} w-[162px]`}
        />
        <span>woman in the</span>
        <CustomSelect
          value={menopausePhase}
          placeholder="perimenopause"
          onChange={(val) => {
            setMenopausePhase(val);
            form.setValue("menopausePhase", val);
          }}
          options={["Premenopause", "Perimenopause", "Postmenopause"]}
          className="w-[179px]"
        />
        <span>phase, presenting with</span>
        <input
          {...register("symptoms")}
          placeholder="hot flashes"
          className={`${inputClass} w-[115px]`}
        />
        <span>.</span>
      </div>
      <div className={lineClass}>
        <span>Her health history includes</span>
        <input
          {...register("diagnosedConditions")}
          placeholder="Mild hypertension"
          className={`${inputClass} w-[172px]`}
        />
        <span>, and she is currently taking</span>
        <input
          {...register("medication")}
          placeholder="levothyroxine"
          className={`${inputClass} w-[136px]`}
        />
        <span>.</span>
      </div>
      <div className={lineClass}>
        <span>Lifestyle factors such as</span>
        <input
          {...register("lifestyleFactors")}
          placeholder="poor sleep and high emotional stress"
          className={`${inputClass} w-[328px]`}
        />
        <span>may be contributing.</span>
      </div>
      <div className={lineClass}>
        <span>Previous interventions have included</span>
        <input
          {...register("previousInterventions")}
          placeholder="DIM, B-complex"
          className={`${inputClass} w-[157px]`}
        />
        <span>, with</span>
        <input
          {...register("interventionOutcome")}
          placeholder="limited improvement in symptoms"
          className={`${inputClass} w-[303px]`}
        />
        <span>.</span>
      </div>
      <div className={lineClass}>
        <span>The suspected root causes include</span>
        <input
          {...register("suspectedRootCauses")}
          placeholder="hormonal imbalance, inflammation, stress, poor detox, gut dysfunction"
          className={`${inputClass} w-[602px]`}
        />
        <span>.</span>
      </div>
      <div className={lineClass}>
        <span>This case is being used to create a</span>
        <CustomSelect
          value={protocol}
          placeholder="protocol"
          onChange={(val) => {
            setProtocol(val);
            form.setValue("protocol", val);
          }}
          options={["Research", "Handout", "Protocol", "Article"]}
          className={`w-[120px]`}
        />
        <span>aimed at</span>
        <input
          {...register("goal")}
          placeholder="guiding other practitioners managing similar cases"
          className={`${inputClass} w-[438px]`}
        />
      </div>
    </div>
  );
};
