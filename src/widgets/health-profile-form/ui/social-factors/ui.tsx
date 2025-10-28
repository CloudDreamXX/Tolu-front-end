import { useMemo, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "shared/ui";
import {
  education,
  householdType,
  occupation as occupationItems,
  raceEthnicity,
} from "widgets/OnboardingClient/DemographicStep";
import { z } from "zod";
import { MultiSelect } from "../MultiSelect";

// Constants for religion and other options
const religionOptions = [
  "Christianity",
  "Islam",
  "Hinduism",
  "Buddhism",
  "Judaism",
  "Sikhism",
  "Baháʼí Faith",
  "Jainism",
  "Shinto",
  "Taoism",
  "Confucianism",
  "African traditional religions",
  "Native American spirituality",
  "Australian Aboriginal traditions",
  "Shamanism",
  "Scientology",
  "Neo-Paganism",
  "Wicca",
  "New Age Spirituality",
  "Atheism",
  "Agnosticism",
] as const;

export const socialFactorsSchema = z
  .object({
    ethnicity: z.string().optional(),
    otherEthnicity: z.string().optional(),
    household: z.string().optional(),
    otherHousehold: z.string().optional(),
    occupation: z.string().optional(),
    otherOccupation: z.string().optional(),
    education: z.string().optional(),
    religion: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.ethnicity === "Other (please specify)" && !val.otherEthnicity) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherEthnicity"],
        message: "Please specify your ethnicity.",
      });
    }
    if (val.household === "Other (please specify)" && !val.otherHousehold) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherHousehold"],
        message: "Please specify your household type.",
      });
    }
    if (val.occupation === "Other (please specify)" && !val.otherOccupation) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherOccupation"],
        message: "Please specify your occupation.",
      });
    }
  });

const split = (s?: string) =>
  (s ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const extractOtherValue = (joined: string) => {
  const parts = split(joined);
  const other = parts.find((v) => v.startsWith("Other:"));
  return other ? other.replace(/^Other:\s*/, "") : "";
};

const commitOther = (fieldName: string, otherValue: string) => (form: any) => {
  const vals = split(form.getValues(fieldName));
  const withoutOthers = vals.filter((v) => !v.startsWith("Other"));
  const trimmed = otherValue.trim();
  const merged = ["Other (please specify)", ...(trimmed ? [`Other: ${trimmed}`] : [])];
  form.setValue(fieldName, [...withoutOthers, ...merged].join(", "));
};

type SocialFactorsFormProps = {
  form: any;
};

const stripOther = (s?: string) => {
  if (!s) return "";

  const otherIndex = s.indexOf("Other:");

  if (otherIndex !== -1) {
    return s.slice(0, otherIndex).trim();
  }

  return s.trim();
};

export const SocialFactorsForm = ({ form }: SocialFactorsFormProps) => {
  const occupationStr = form.watch("occupation") as string | undefined;
  const householdStr = form.watch("household") as string | undefined;
  const ethnicityStr = form.watch("ethnicity") as string | undefined;

  const ethSel = useMemo(() => split(ethnicityStr), [ethnicityStr]);
  const occupationSel = useMemo(() => split(occupationStr), [occupationStr]);
  const householdSel = useMemo(() => split(householdStr), [householdStr]);

  console.log(ethSel)

  const onEthnicityChange = (vals: string[]) => {
    form.setValue("ethnicity", vals.join(" , "));
  };

  const ethList = useMemo(
    () => (ethnicityStr ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    [ethnicityStr]
  );
  const showOtherEthnicity = ethList.includes("Other (please specify)");
  const ethnicityOther = useMemo(() => extractOtherValue(ethnicityStr ?? ""), [ethnicityStr]);
  const occupationOther = useMemo(() => extractOtherValue(occupationStr || ""), [occupationStr]);
  const householdOther = useMemo(() => extractOtherValue(householdStr || ""), [householdStr]);

  const onOccupationChange = (value: string) => {
    form.setValue("occupation", value);
  };

  const onHouseholdChange = (value: string) => {
    form.setValue("household", value);
  };

  return (
    <div className="space-y-6">
      {/* Ethnicity Field */}
      <FormField
        control={form.control}
        name="ethnicity"
        render={() => (
          <FormItem className="flex w-full flex-col items-start gap-[10px]">
            <FormLabel className="text-[#1D1D1F] text-base font-medium">
              Ethnicity
            </FormLabel>
            <FormControl>
              <MultiSelect
                placeholder="Select ethnicities..."
                options={raceEthnicity}
                selected={ethSel}
                onChange={onEthnicityChange}
                defaultValue={form.getValues("ethnicity")}
                className="text-sm w-full"
              />
            </FormControl>
            <FormMessage />
            {showOtherEthnicity && (
              <FormField
                control={form.control}
                name="otherEthnicity"
                render={({ field: otherField }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">Other ethnicity</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter ethnicity"
                        className="mt-2"
                        {...otherField}
                        value={ethnicityOther}
                        onChange={(e) =>
                          commitOther("ethnicity", e.target.value)(form)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </FormItem>
        )}
      />


      {/* Household Field */}
      <FormField
        control={form.control}
        name="household"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Household Type</FormLabel>
            <Select value={householdSel.includes("Other (please specify)") ? "Other (please specify)" : field.value} onValueChange={onHouseholdChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {householdType.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {householdSel.includes("Other (please specify)") && (
              <div className="pt-2">
                <Input
                  placeholder="Other household type"
                  value={householdOther}
                  onChange={(e) => commitOther("household", e.target.value)(form)}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Occupation</FormLabel>
            <Select value={occupationSel.includes("Other (please specify)") ? "Other (please specify)" : field.value} onValueChange={onOccupationChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {occupationItems.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {occupationSel.includes("Other (please specify)") && (
              <div className="pt-2">
                <Input
                  placeholder="Other occupation"
                  value={occupationOther}
                  onChange={(e) => commitOther("occupation", e.target.value)(form)}
                />
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Education Level Field */}
      <FormField
        control={form.control}
        name="education"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col items-start gap-[10px]">
            <FormLabel className="text-[#1D1D1F]  text-base font-medium">
              Education Level
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {education.map((lvl) => (
                      <SelectItem key={lvl} value={lvl}>
                        {lvl}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Religion Field */}
      <FormField
        control={form.control}
        name="religion"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col items-start gap-[10px]">
            <FormLabel className="text-[#1D1D1F]  text-base font-medium">
              Religion
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {religionOptions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
