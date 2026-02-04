import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  Textarea,
} from "shared/ui";
import { z } from "zod";

export const otherInfoSchema = z.object({
  roleInWellnessPlan: z.string().optional(),
  familyFriendsSupport: z.string().optional(),
  supportivePersonDietaryChange: z.string().optional(),
  otherUsefulInformation: z.string().optional(),
  healthGoalsAspirations: z.string().optional(),
  whyAchieveGoals: z.string().optional(),
});

export const OtherStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="roleInWellnessPlan"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              What role do you play in your wellness plan? *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="familyFriendsSupport"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you think family and friends will be supportive of you making
              health and lifestyle changes to improve your quality of life?
              Explain, if no. *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="supportivePersonDietaryChange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Who in your family or on your health care team will be most
              supportive of you making dietary change? *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="otherUsefulInformation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Please describe any other information you think would be useful in
              helping to address your health concern(s). *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="healthGoalsAspirations"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What are your health goals and aspirations? *</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="whyAchieveGoals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Though it may seem odd, please consider why you might want to
              achieve that for yourself. *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};
