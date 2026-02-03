import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  Textarea,
  FormMessage,
} from "shared/ui";
import { z } from "zod";

export const sexualHistorySchema = z.object({
  sexualFunctioningConcerns: z.string(),
  sexualPartnersPastYear: z.string(),
});

export const SexualHistoryStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-8">
      <div>
        <FormLabel className="text-base font-medium">Sexual History</FormLabel>
      </div>

      <FormField
        control={form.control}
        name="sexualFunctioningConcerns"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you have any concerns or issues with your sexual functioning
              that you’d like to share with us (pain with intercourse, dryness,
              libido issues, erectile dysfunction)? *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="sexualPartnersPastYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              In the past year, have your sexual partners been men, women, or
              both? And how many partners have you had in the past year? *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
