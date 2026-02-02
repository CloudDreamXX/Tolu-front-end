import { FormLabel, FormField, FormItem, FormControl, Input, FormMessage, Textarea } from "shared/ui";
import { z } from "zod";

export const womensHealthSchema = z.object({
    ageFirstPeriod: z.string().min(1, "This field is required"),
    menstrualHistory: z.string().min(1, "This field is required"),
    lutealSymptoms: z.string().min(1, "This field is required"),
    infectionsHistory: z.string().min(1, "This field is required"),
    birthControlHistory: z.string().min(1, "This field is required"),
    conceptionPregnancyIssues: z.string().min(1, "This field is required"),
    hormoneTherapy: z.string().min(1, "This field is required"),
});

export const WomensHealthStep = ({ form }: { form: any }) => {
    return (
        <div className="space-y-8">
            <div>
                <FormLabel className="text-base font-medium">
                    For Women Only
                </FormLabel>
            </div>

            <FormField
                control={form.control}
                name="ageFirstPeriod"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            How old were you when you first got your period? *
                        </FormLabel>
                        <FormControl>
                            <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="menstrualHistory"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            How are/were your menses? Do/did you have PMS? Painful periods? If so, explain. *
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
                name="lutealSymptoms"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            In the second half of your cycle do you experience any symptoms of breast tenderness, water retention or irritability? *
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
                name="infectionsHistory"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you experienced any yeast infections or urinary tract infections? Are they regular? *
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
                name="birthControlHistory"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you/do you still take birth control pills? If so, please list length of time and type. *
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
                name="conceptionPregnancyIssues"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you had any problems with conception or pregnancy? *
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
                name="hormoneTherapy"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Are you taking any hormone replacement therapy or hormonal supportive herbs? If so, please list again here. *
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
