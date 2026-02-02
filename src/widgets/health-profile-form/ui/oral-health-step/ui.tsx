import { FormLabel, FormField, FormItem, FormControl, Textarea, FormMessage } from "shared/ui";
import { z } from "zod";

export const oralHealthSchema = z.object({
    lastDentalVisit: z.string().min(1, "This field is required"),
    dentalHealthDiscussion: z.string().min(1, "This field is required"),
    oralRegimen: z.string().min(1, "This field is required"),
    mercuryAmalgams: z.string().min(1, "This field is required"),
    rootCanals: z.string().min(1, "This field is required"),
    oralHealthConcerns: z.string().min(1, "This field is required"),
    additionalOralNotes: z.string().min(1, "This field is required"),
});

export const OralHealthHistoryStep = ({ form }: { form: any }) => {
    return (
        <div className="space-y-8">
            <div>
                <FormLabel className="text-base font-medium">
                    Oral Health History
                </FormLabel>
            </div>

            <FormField
                control={form.control}
                name="lastDentalVisit"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            How long since you last visited the dentist? What was the reason for that visit? *
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
                name="dentalHealthDiscussion"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            In the past 12 months has a dentist or hygienist talked to you about your oral health, blood sugar or other health concerns? (Explain.) *
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
                name="oralRegimen"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            What is your current oral and dental regimen? (Please note whether this regimen is once or twice daily or occasionally and what kind of toothpaste you use.) *
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
                name="mercuryAmalgams"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Do you have any mercury amalgams? (If no, were they removed? If so, how?) *
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
                name="rootCanals"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you had any root canals? (If yes, how many and when?) *
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
                name="oralHealthConcerns"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Do you have any concerns about your oral or dental health? (gums bleed after flossing, receding gums) *
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
                name="additionalOralNotes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Is there anything else about your current oral or dental health or health history that you’d like us to know? *
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
