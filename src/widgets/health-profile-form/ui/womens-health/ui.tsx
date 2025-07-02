import { Input, FormField, FormItem, FormLabel, FormControl, FormMessage, RadioGroup, RadioGroupItem } from "shared/ui";
import z from "zod";

export const womensHealthSchema = z.object({
    menstrualCycleStatus: z.string().min(1, "This field is required"),
    menstrualOther: z.string().optional(),

    hormoneTherapy: z.string().min(1, "This field is required"),
    hormoneDetails: z.string().optional(),
    hormoneDuration: z.string().optional(),
    hormoneProvider: z.string().optional(),

    fertilityConcerns: z.string().min(1, "This field is required"),
    birthControlUse: z.string().min(1, "This field is required"),
    birthControlDetails: z.string().optional(),
});

export const WomensHealthForm = ({ form }: { form: any }) => {
    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-500">
                Share key information related to your menstrual cycle, reproductive health, and hormonal patterns.
            </p>

            <FormField
                control={form.control}
                name="menstrualCycleStatus"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Menstrual cycle status</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                            {["Regular", "Irregular", "Post-menopause", "Other"].map((option) => (
                                <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={option} id={option} />
                                    </FormControl>
                                    <FormLabel htmlFor={option}>{option}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                        {form.watch("menstrualCycleStatus") === "Other" && (
                            <FormField
                                control={form.control}
                                name="menstrualOther"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input placeholder="Describe your status..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="hormoneTherapy"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Are you on Hormone Replacement Therapy?</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                            <FormItem key={"Yes"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"Yes"} id={"Yes"} />
                                </FormControl>
                                <FormLabel htmlFor={"Yes"}>Yes</FormLabel>
                            </FormItem>
                            {form.watch("hormoneTherapy") === "Yes" && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="hormoneDetails"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="e.g., Estradiol and Progesterone" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="hormoneDuration"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>For how long?</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., 2 months" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="hormoneProvider"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Who's your provider?</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Therapist name" {...field} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </>
                            )}
                            <FormItem key={"No"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"No"} id={"No"} />
                                </FormControl>
                                <FormLabel htmlFor={"No"}>No</FormLabel>
                            </FormItem>
                            <FormItem key={"Considering"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"Considering"} id={"Considering"} />
                                </FormControl>
                                <FormLabel htmlFor={"Considering"}>Considering</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="fertilityConcerns"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Fertility concerns</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                            <FormItem key={"Yes"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"Yes"} id={"Yes"} />
                                </FormControl>
                                <FormLabel htmlFor={"Yes"}>Yes</FormLabel>
                            </FormItem>
                            <FormItem key={"No"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"No"} id={"No"} />
                                </FormControl>
                                <FormLabel htmlFor={"No"}>No</FormLabel>
                            </FormItem>
                            <FormItem key={"Not applicable"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"Not applicable"} id={"Not applicable"} />
                                </FormControl>
                                <FormLabel htmlFor={"Not applicable"}>Not applicable</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="birthControlUse"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Birth control use</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                            <FormItem key={"Yes"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"Yes"} id={"Yes"} />
                                </FormControl>
                                <FormLabel htmlFor={"Yes"}>Yes</FormLabel>
                            </FormItem>
                            <FormItem key={"No"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"No"} id={"No"} />
                                </FormControl>
                                <FormLabel htmlFor={"No"}>No</FormLabel>
                            </FormItem>
                            {form.watch("birthControlUse") === "No" && (
                                <FormField
                                    control={form.control}
                                    name="birthControlDetails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input placeholder="e.g., Used pills for 10 years" {...field} />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormItem key={"Not applicable"} className="flex items-center space-x-2 space-y-0">
                                <FormControl>
                                    <RadioGroupItem value={"Not applicable"} id={"Not applicable"} />
                                </FormControl>
                                <FormLabel htmlFor={"Not applicable"}>Not applicable</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormItem>
                )}
            />
        </div>
    );
};


