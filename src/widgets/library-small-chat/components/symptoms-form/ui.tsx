import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { baseSchema } from "widgets/library-small-chat";
import { useState } from "react";
import { CustomSelect } from "../CustomSelect/ui";

export type FormValues = z.infer<typeof baseSchema>;

interface SymptomsFormProps {
    form: UseFormReturn<FormValues>;
}

export const SymptomsForm = ({ form }: SymptomsFormProps) => {
    const [menopauseStatus, setMenopauseStatus] = useState("");
    const { register } = form;

    const inputClass =
        "input inline-input border border-[#DBDEE1] rounded-full outline-[#008FF6] py-[4px] px-[12px] min-w-[60px] placeholder:text-[#5F5F65]";
    const lineClass = "flex flex-wrap gap-x-[12px] gap-y-[12px] text-[18px] font-[500] text-[#1D1D1F] items-center";

    return (
        <div className="pt-[16px] border-t border-[#DBDEE1] mt-[16px] space-y-[12px]">
            <div className={lineClass}>
                <span>Hi Tolu. I’m a</span>
                <input {...register("age")} placeholder="age" className={`${inputClass} w-[40px]`} />
                <span>-year-old</span>
                <input {...register("maritalStatus")} placeholder="marital status" className={`${inputClass} w-[138px]`} />
                <span>woman working</span>
                <input {...register("job")} placeholder="job type/hours" className={`${inputClass} w-[142px]`} />
                <span>, and I have</span>
                <input {...register("children")} placeholder="number" className={`${inputClass} w-[88px]`} />
                <span>children. I’m</span>
                <CustomSelect
                    value={menopauseStatus}
                    placeholder="in perimenopause"
                    onChange={(val) => {
                        setMenopauseStatus(val);
                        form.setValue("menopauseStatus", val);
                    }}
                    options={[
                        "Not sure",
                        "Premenopausal (Regular cycles)",
                        "Perimenopausal (Irregular cycles)",
                        "Post menopausal (No cycles)",
                    ]}
                    className="w-fit min-w-[160px]"
                />
                <span>but lately I’ve been dealing with</span>
                <input {...register("mainSymptoms")} placeholder="main symptoms – e.g., trouble sleeping, mood swings, weight gain" className={`${inputClass} w-[568px]`} />
            </div>

            <div className={lineClass}>
                <span>I’ve also noticed</span>
                <input {...register("otherChallenges")} placeholder="other challenges – e.g., cravings, low energy, memory problems" className={`${inputClass} w-[544px]`} />
                <span>, and it feels like no matter</span>
                <input {...register("strategiesTried")} placeholder="strategies – e.g., dieting, exercising, meditating" className={`${inputClass} w-[407px]`} />
                <span>, things aren’t getting better.</span>
            </div>
        </div>
    );
};
