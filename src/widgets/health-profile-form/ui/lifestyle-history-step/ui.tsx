import { FormLabel, FormField, FormItem, FormControl, Textarea, FormMessage } from "shared/ui";
import { z } from "zod";

export const lifestyleHistorySchema = z.object({
    dietHistory: z.string().min(1, "This field is required"),
    substanceUse: z.string().min(1, "This field is required"),
    stressManagement: z.string().min(1, "This field is required"),
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
                name="dietHistory"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you had periods of eating junk food, binge eating or dieting? List any known diet that you have been on for a significant amount of time. *
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
                name="substanceUse"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you used or abused alcohol, drugs, meds, tobacco or caffeine? Do you still? *
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
                name="stressManagement"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            How do you handle stress? *
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
