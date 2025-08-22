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
import { z } from "zod";

export const basicInformationSchema = z
  .object({
    age: z.string().min(1, { message: "Age is required." }),
    genderIdentity: z.string(),
    genderSelfDescribe: z.string().optional(),
    sexAssignedAtBirth: z.string(),
    race: z.string(),
    language: z.string(),
    country: z.string(),
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
  const age = form.watch("age");

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
            <FormLabel>
              So we know how old you are ({age}), but how old do you really
              feel?
            </FormLabel>
            <FormControl>
              <Input placeholder="34" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-2">
        <FormLabel className="text-base">
          What is your gender identity?
        </FormLabel>
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
        <FormLabel className="text-base">
          What sex were you assigned at birth?
        </FormLabel>
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
        name="race"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Race</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <FormControl>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {languages.map((lang) => (
                      <SelectItem key={lang} value={lang}>
                        {lang}
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
