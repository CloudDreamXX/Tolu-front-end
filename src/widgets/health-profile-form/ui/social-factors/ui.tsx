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

/** NEW: religion options */
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
    if (
      val.ethnicity === "Other (please specify)" &&
      (!val.otherEthnicity || !val.otherEthnicity.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherEthnicity"],
        message: "Please specify your ethnicity.",
      });
    }
    if (
      val.household === "Other (please specify)" &&
      (!val.otherHousehold || !val.otherHousehold.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherHousehold"],
        message: "Please specify your household type.",
      });
    }
    if (
      val.occupation === "Other (please specify)" &&
      (!val.otherOccupation || !val.otherOccupation.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["otherOccupation"],
        message: "Please specify your occupation.",
      });
    }
  });

type SocialFactorsFormProps = {
  form: any;
};

export const SocialFactorsForm = ({ form }: SocialFactorsFormProps) => {
  const household = form.watch("household");
  const occupation = form.watch("occupation");
  const ethnicity = form.watch("ethnicity");

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="ethnicity"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col items-start gap-[10px]">
            <FormLabel className="text-[#1D1D1F]  text-base font-medium">
              Ethnicity
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {raceEthnicity.map((eth) => (
                      <SelectItem key={eth} value={eth}>
                        {eth}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />

            {ethnicity === "Other (please specify)" && (
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

      <FormField
        control={form.control}
        name="household"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col items-start gap-[10px]">
            <FormLabel className="text-[#1D1D1F]  text-base font-medium">
              Household Type
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {householdType.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />

            {household === "Other (please specify)" && (
              <FormField
                control={form.control}
                name="otherHousehold"
                render={({ field: otherField }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">
                      Other household type
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter household type"
                        className="mt-2"
                        {...otherField}
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

      <FormField
        control={form.control}
        name="occupation"
        render={({ field }) => (
          <FormItem className="flex w-full flex-col items-start gap-[10px]">
            <FormLabel className="text-[#1D1D1F]  text-base font-medium">
              Occupation
            </FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
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
            </FormControl>
            <FormMessage />

            {occupation === "Other (please specify)" && (
              <FormField
                control={form.control}
                name="otherOccupation"
                render={({ field: otherField }) => (
                  <FormItem className="w-full">
                    <FormLabel className="sr-only">Other occupation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter occupation"
                        className="mt-2"
                        {...otherField}
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
