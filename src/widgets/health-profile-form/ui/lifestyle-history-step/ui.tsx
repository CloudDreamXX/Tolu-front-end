import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  Textarea,
  FormMessage,
} from "shared/ui";
import { z } from "zod";

export const lifestyleHistorySchema = z.object({
  junkFoodBingeDieting: z.string(),
  substanceUseHistory: z.string(),
  stressHandling: z.string(),
});

export const LifestyleHistoryStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-8">
      <div>
        <FormLabel className="text-base font-medium">
          Lifestyle History
        </FormLabel>
      </div>

      <FormField
        control={form.control}
        name="junkFoodBingeDieting"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Have you had periods of eating junk food, binge eating or dieting?
              List any known diet that you have been on for a significant amount
              of time. *
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
        name="substanceUseHistory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Have you used or abused alcohol, drugs, meds, tobacco or caffeine?
              Do you still? *
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
        name="stressHandling"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How do you handle stress? *</FormLabel>
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
