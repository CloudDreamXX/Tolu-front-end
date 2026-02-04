import {
  FormLabel,
  FormField,
  FormItem,
  FormControl,
  Textarea,
} from "shared/ui";
import { z } from "zod";

export const oralHealthSchema = z.object({
  lastDentistVisit: z.string().optional(),
  dentistHealthDiscussion: z.string().optional(),
  oralDentalRegimen: z.string().optional(),
  mercuryAmalgams: z.string().optional(),
  rootCanals: z.string().optional(),
  oralHealthConcerns: z.string().optional(),
  oralHealthAdditionalNotes: z.string().optional(),
});

export const OralHealthHistoryStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-8">
      <FormField
        control={form.control}
        name="lastDentistVisit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              How long since you last visited the dentist? What was the reason
              for that visit? *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="dentistHealthDiscussion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              In the past 12 months has a dentist or hygienist talked to you
              about your oral health, blood sugar or other health concerns?
              (Explain.) *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="oralDentalRegimen"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              What is your current oral and dental regimen? (Please note whether
              this regimen is once or twice daily or occasionally and what kind
              of toothpaste you use.) *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="mercuryAmalgams"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you have any mercury amalgams? (If no, were they removed? If
              so, how?) *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="rootCanals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Have you had any root canals? (If yes, how many and when?) *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="oralHealthConcerns"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Do you have any concerns about your oral or dental health? (gums
              bleed after flossing, receding gums) *
            </FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="oralHealthAdditionalNotes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Is there anything else about your current oral or dental health or
              health history that you’d like us to know? *
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
