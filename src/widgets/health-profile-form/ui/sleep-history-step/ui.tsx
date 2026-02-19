import { z } from "zod";
import { FormLabel, FormField, FormItem, FormControl, Input } from "shared/ui";

export const sleepHistorySchema = z.object({
  satisfiedWithSleep: z.string().optional(),
  stayAwakeAllDay: z.string().optional(),
  asleep2am4am: z.string().optional(),
  fallAsleepUnder30min: z.string().optional(),
  sleep6to8Hours: z.string().optional(),
});

export const SleepHistoryStep = ({ form }: { form: any }) => {
  const QUESTIONS = [
    {
      name: "satisfiedWithSleep",
      label: "Are you satisfied with your sleep?",
    },
    {
      name: "stayAwakeAllDay",
      label: "Do you stay awake all day without dozing?",
    },
    {
      name: "asleep2am4am",
      label:
        "Are you asleep (or trying to sleep) between 2:00 a.m. and 4:00 a.m.?",
    },
    {
      name: "fallAsleepUnder30min",
      label: "Do you fall asleep in less than 30 minutes?",
    },
    {
      name: "sleep6to8Hours",
      label: "Do you sleep between 6 and 8 hours per night?",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {QUESTIONS.map((q) => (
          <FormField
            key={q.name}
            control={form.control}
            name={q.name}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-medium">{q.label}</FormLabel>

                <FormControl>
                  <Input placeholder="Your answer" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
};
