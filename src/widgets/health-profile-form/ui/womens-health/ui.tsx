import { useState } from "react";
import {
  Input,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  RadioGroup,
  RadioGroupItem,
} from "shared/ui";
import z from "zod";
import { MultiSelect } from "../MultiSelect";

export const womensHealthSchema = z.object({
  menstrualCycleStatus: z.string().optional(),
  menstrualOther: z.string().optional(),

  hormoneTherapy: z.string().optional(),
  hormoneDetails: z.string().optional(),
  hormoneDuration: z.string().optional(),
  hormoneProvider: z.string().optional(),

  fertilityConcerns: z.string().optional(),
  birthControlUse: z.string().optional(),
  birthControlDetails: z.string().optional(),
});

const hormoneOptions = [
  {
    title: "Estrogens",
    options: [
      "Estradiol (oral, transdermal patch, gel, cream, spray, injection)",
      "Estrone",
      "Conjugated equine estrogens (e.g., Premarin)",
      "Esterified estrogens",
      "Estriol (often in compounded bioidentical HRT)",
    ],
  },
  {
    title: "Progestogens",
    options: [
      "Micronized Progesterone (Prometrium, compounded versions)",
      "Medroxyprogesterone acetate (Provera)",
      "Norethindrone acetate",
      "Levonorgestrel",
      "Dydrogesterone (in some countries)",
      "Drospirenone (often combined with estradiol)",
    ],
  },
  {
    title: "Combination Estrogen + Progestogen",
    options: [
      "Estradiol + Progesterone (e.g., Bijuva)",
      "Estradiol + Norethindrone acetate (e.g., Activella, CombiPatch)",
      "Estradiol + Medroxyprogesterone acetate (e.g., Prempro)",
      "Estradiol + Drospirenone (e.g., Angeliq)",
      "Estradiol + Levonorgestrel (some patch formulations)",
    ],
  },
  {
    title: "Androgens (less common, sometimes compounded)",
    options: [
      "Testosterone (gel, cream, patch, pellet, injection – usually off-label for women)",
      "DHEA (prasterone, vaginal insert – e.g., Intrarosa)",
    ],
  },
  {
    title: "Other / Tissue-Specific Estrogenic Compounds",
    options: [
      "Tibolone (synthetic steroid with estrogenic, progestogenic, and androgenic activity – not available in the U.S., but used in Europe/Asia)",
      "SERMs (e.g., raloxifene, bazedoxifene; combos like Duavee: conjugated estrogens + bazedoxifene)",
    ],
  },
];

export const WomensHealthForm = ({ form }: { form: any }) => {
  const [hormonesSelected, setHormonesSelected] = useState<string[]>([]);

  const handleHormonesChange = (val: string[]) => {
    setHormonesSelected(val);
    form.setValue("hormoneDetails", val.join(" , "));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Share key information related to your menstrual cycle, reproductive
        health, and hormonal patterns.
      </p>

      <FormField
        control={form.control}
        name="menstrualCycleStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Menstrual cycle status</FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              {[
                "Regular",
                "Irregular",
                "Post-menopause",
                "Other",
                "Not applicable",
              ].map((option) => (
                <FormItem
                  key={option}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={option} id={option} />
                  </FormControl>
                  <FormLabel htmlFor={option}>{option}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
            {form.watch("menstrualCycleStatus") === "Other" && (
              <FormField
                control={form.control}
                name="menstrualOther"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Describe your status..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hormoneTherapy"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Are you on Hormone Replacement Therapy?</FormLabel>
            <RadioGroup
              onValueChange={(v) => {
                field.onChange(v);
                if (v !== "Yes") {
                  setHormonesSelected([]);
                  form.setValue("hormoneDetails", "");
                  form.setValue("hormoneDuration", "");
                  form.setValue("hormoneProvider", "");
                }
              }}
              defaultValue={field.value}
              className="space-y-1"
            >
              {["Yes", "No", "Considering", "Not applicable"].map((opt) => (
                <FormItem
                  key={opt}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={opt} id={`hrt-${opt}`} />
                  </FormControl>
                  <FormLabel htmlFor={`hrt-${opt}`}>{opt}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>

            {form.watch("hormoneTherapy") === "Yes" && (
              <>
                <FormField
                  control={form.control}
                  name="hormoneDetails"
                  render={() => (
                    <FormItem>
                      <FormLabel>Which hormones / formulations?</FormLabel>
                      <MultiSelect
                        placeholder="Select hormone(s)"
                        options={hormoneOptions}
                        selected={hormonesSelected}
                        onChange={handleHormonesChange}
                      />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="hormoneDuration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>For how long?</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 2 months" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hormoneProvider"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who's your provider?</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Clinic or clinician name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fertilityConcerns"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fertility concerns</FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              <FormItem
                key={"Yes"}
                className="flex items-center space-x-2 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem value={"Yes"} id={"Yes"} />
                </FormControl>
                <FormLabel htmlFor={"Yes"}>Yes</FormLabel>
              </FormItem>
              <FormItem
                key={"No"}
                className="flex items-center space-x-2 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem value={"No"} id={"No"} />
                </FormControl>
                <FormLabel htmlFor={"No"}>No</FormLabel>
              </FormItem>
              <FormItem
                key={"Not applicable"}
                className="flex items-center space-x-2 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem
                    value={"Not applicable"}
                    id={"Not applicable"}
                  />
                </FormControl>
                <FormLabel htmlFor={"Not applicable"}>Not applicable</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="birthControlUse"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birth control use</FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              <FormItem
                key={"Yes"}
                className="flex items-center space-x-2 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem value={"Yes"} id={"Yes"} />
                </FormControl>
                <FormLabel htmlFor={"Yes"}>Yes</FormLabel>
              </FormItem>
              <FormItem
                key={"No"}
                className="flex items-center space-x-2 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem value={"No"} id={"No"} />
                </FormControl>
                <FormLabel htmlFor={"No"}>No</FormLabel>
              </FormItem>
              {form.watch("birthControlUse") === "No" && (
                <FormField
                  control={form.control}
                  name="birthControlDetails"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="e.g., Used pills for 10 years"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              )}
              <FormItem
                key={"Not applicable"}
                className="flex items-center space-x-2 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem
                    value={"Not applicable"}
                    id={"Not applicable"}
                  />
                </FormControl>
                <FormLabel htmlFor={"Not applicable"}>Not applicable</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormItem>
        )}
      />
    </div>
  );
};
