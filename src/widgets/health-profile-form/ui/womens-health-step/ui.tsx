import { FormLabel, FormField, FormItem, FormControl, Input, FormMessage, Textarea } from "shared/ui";
import { z } from "zod";

export const womensHealthSchema = z.object({
    ageFirstPeriod: z.string(),
    mensesPmsPain: z.string(),
    cycleSecondHalfSymptoms: z.string(),
    yeastUtiInfections: z.string(),
    birthControlPills: z.string(),
    conceptionPregnancyProblems: z.string(),
    hormoneReplacementHerbs: z.string(),
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
                name="mensesPmsPain"
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
                name="cycleSecondHalfSymptoms"
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
                name="yeastUtiInfections"
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
                name="birthControlPills"
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
                name="conceptionPregnancyProblems"
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
                name="hormoneReplacementHerbs"
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
