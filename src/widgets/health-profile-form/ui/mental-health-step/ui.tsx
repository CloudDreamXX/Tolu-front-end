import { FormLabel, FormField, FormItem, FormControl, Textarea, FormMessage, Input } from "shared/ui";
import { z } from "zod";

export const mentalHealthSchema = z.object({
    moodOverview: z.string().min(1, "This field is required"),
    energyLevel: z
        .number()
        .min(1, "Must be between 1 and 10")
        .max(10, "Must be between 1 and 10"),
    feltBestPeriod: z.string().min(1, "This field is required"),
});

export const MentalHealthStatusStep = ({ form }: { form: any }) => {
    return (
        <div className="space-y-8">
            <div>
                <FormLabel className="text-base font-medium">
                    Mental Health Status
                </FormLabel>
            </div>

            <FormField
                control={form.control}
                name="moodOverview"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            How are your moods in general? Do you experience more anxiety, depression or anger than you would like? *
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
                name="energyLevel"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            On a scale of 1–10, one being the worst and 10 being the best, describe your usual level of energy. *
                        </FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={1}
                                max={10}
                                {...field}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="feltBestPeriod"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            At what point in your life did you feel best? Why? *
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
