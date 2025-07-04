import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioGroup,
  RadioGroupItem,
} from "shared/ui";
import { z } from "zod";

export const basicInformationSchema = z.object({
  age: z.string().min(1, { message: "Age is required." }),
  gender: z.string().min(1, {
    message: "You need to select a gender.",
  }),
  height: z.string(),
  weight: z.string(),
});

export const BasicInformationForm = ({ form }: { form: any }) => {
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
      <FormField
        control={form.control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col mt-2 space-y-2"
              >
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="female" id="female" />
                  </FormControl>
                  <FormLabel htmlFor="female" className="font-normal">
                    Female
                  </FormLabel>
                </FormItem>
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="other" id="other" />
                  </FormControl>
                  <FormLabel htmlFor="other" className="font-normal">
                    Other
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (Optional)</FormLabel>
              <FormControl>
                <Input placeholder={`5'6" (167 cm)`} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="150 lbs (68 kg)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};
