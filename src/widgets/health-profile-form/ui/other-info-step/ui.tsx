import { FormLabel, FormField, FormItem, FormControl, Textarea, FormMessage } from "shared/ui";
import { z } from "zod";

export const otherInfoSchema = z.object({
    wellnessRole: z.string().min(1, "This field is required"),
    supportSystem: z.string().min(1, "This field is required"),
    dietarySupportPerson: z.string().min(1, "This field is required"),
    additionalHealthInfo: z.string().min(1, "This field is required"),
    healthGoals: z.string().min(1, "This field is required"),
    motivationReason: z.string().min(1, "This field is required"),
});

export const OtherStep = ({ form }: { form: any }) => {
    return (
        <div className="space-y-8">
            <div>
                <FormLabel className="text-base font-medium">
                    Other
                </FormLabel>
            </div>

            <FormField
                control={form.control}
                name="wellnessRole"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            What role do you play in your wellness plan? *
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
                name="supportSystem"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Do you think family and friends will be supportive of you making health and lifestyle changes to improve your quality of life? Explain, if no. *
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
                name="dietarySupportPerson"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Who in your family or on your health care team will be most supportive of you making dietary change? *
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
                name="additionalHealthInfo"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Please describe any other information you think would be useful in helping to address your health concern(s). *
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
                name="healthGoals"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            What are your health goals and aspirations? *
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
                name="motivationReason"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Though it may seem odd, please consider why you might want to achieve that for yourself. *
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
