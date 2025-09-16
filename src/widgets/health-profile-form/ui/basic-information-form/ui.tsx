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
  SelectItem,
  SelectGroup,
} from "shared/ui";
import { countries, languages } from "widgets/OnboardingClient/DemographicStep";
import { MultiSelect } from "../MultiSelect";
import { z } from "zod";
import { useState } from "react";

export const basicInformationSchema = z
  .object({
    age: z.string().optional(),
    genderIdentity: z.string().optional(),
    genderSelfDescribe: z.string().optional(),
    sexAssignedAtBirth: z.string().optional(),
    race: z.string().optional(),
    language: z.string().optional(),
    country: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (
      val.genderIdentity === "self_describe" &&
      (!val.genderSelfDescribe || !val.genderSelfDescribe.trim())
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please provide a self-description.",
        path: ["genderSelfDescribe"],
      });
    }
  });

export const BasicInformationForm = ({ form }: { form: any }) => {
  const identity = form.watch("genderIdentity");

  const [languagesSel, setLanguagesSel] = useState<string[]>([]);
  const onLanguagesChange = (vals: string[]) => {
    setLanguagesSel(vals);
    form.setValue("language", vals.join(" , "));
  };

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Tell us about any key health conditions or goals you'd like to track.
        This helps us personalize your insights and recommendations.
      </p>

      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age</FormLabel>
            <FormControl>
              <Input placeholder="34" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <FormLabel className="text-base">Gender</FormLabel>
        <FormField
          control={form.control}
          name="genderIdentity"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="woman">Woman</SelectItem>
                    <SelectItem value="man">Man</SelectItem>
                    <SelectItem value="nonbinary_genderqueer_expansive">
                      Non-binary / genderqueer / gender expansive
                    </SelectItem>
                    <SelectItem value="self_describe">
                      Prefer to self-describe
                    </SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {identity === "self_describe" && (
          <FormField
            control={form.control}
            name="genderSelfDescribe"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-normal">
                  Please self-describe
                </FormLabel>
                <FormControl>
                  <Input placeholder="Type here..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="space-y-2">
        <FormLabel className="text-base">Sex assigned at birth</FormLabel>
        <FormField
          control={form.control}
          name="sexAssignedAtBirth"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select one" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="intersex">Intersex</SelectItem>
                    <SelectItem value="prefer_not_to_say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="language"
        render={() => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <FormControl>
              <MultiSelect
                placeholder="Select languages..."
                options={languages}
                selected={languagesSel}
                onChange={onLanguagesChange}
                defaultValue={form.getValues("language")}
                className="text-sm"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country of Residence</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {countries.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
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
