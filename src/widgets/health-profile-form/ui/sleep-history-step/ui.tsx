import { Checkbox } from "@radix-ui/react-checkbox";
import { FormLabel, FormField, FormItem, FormControl } from "shared/ui";
import { z } from "zod";

export const sleepHistorySchema = z.object({
    satisfiedWithSleep: z.enum(["yes", "no"]),
    stayAwakeAllDay: z.enum(["yes", "no"]),
    asleepBetween2And4: z.enum(["yes", "no"]),
    fallAsleepUnder30: z.enum(["yes", "no"]),
    sleep6to8Hours: z.enum(["yes", "no"]),
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
            name: "asleepBetween2And4",
            label: "Are you asleep (or trying to sleep) between 2:00 a.m. and 4:00 a.m.?",
        },
        {
            name: "fallAsleepUnder30",
            label: "Do you fall asleep in less than 30 minutes?",
        },
        {
            name: "sleep6to8Hours",
            label: "Do you sleep between 6 and 8 hours per night?",
        },
    ];

    return (
        <div className="space-y-8">
            <FormLabel className="text-base font-medium">
                Sleep History
            </FormLabel>

            <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_80px] bg-gray-50 px-4 py-2 text-sm font-medium">
                    <span />
                    <span className="text-center">Yes</span>
                    <span className="text-center">No</span>
                </div>

                {QUESTIONS.map((q) => (
                    <FormField
                        key={q.name}
                        control={form.control}
                        name={q.name}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-[1fr_80px_80px] items-center gap-4 px-4 py-3 border-t">
                                <span className="text-sm">
                                    {q.label} *
                                </span>

                                <FormControl>
                                    <div className="flex justify-center">
                                        <Checkbox
                                            checked={field.value === "yes"}
                                            onCheckedChange={() =>
                                                field.onChange("yes")
                                            }
                                        />
                                    </div>
                                </FormControl>

                                <FormControl>
                                    <div className="flex justify-center">
                                        <Checkbox
                                            checked={field.value === "no"}
                                            onCheckedChange={() =>
                                                field.onChange("no")
                                            }
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                ))}
            </div>
        </div>
    );
};

