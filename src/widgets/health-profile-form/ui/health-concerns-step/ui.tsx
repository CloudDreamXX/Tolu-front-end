import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Checkbox,
    Textarea,
    RadioGroup,
    RadioGroupItem,
    Input,
} from "shared/ui";
import { z } from "zod";

export const healthConcernsSchema = z.object({
    mainConcerns: z.string().min(1),
    concernOnset: z.string().min(1),

    pastApproaches: z.array(z.enum(["Doctors", "Self-care"])).min(1),
    pastSuccess: z.string().min(1),

    currentPractitioners: z.string().min(1),
    surgeries: z.string().min(1),

    antibioticsInfancy: z.string().min(1),
    antibioticsTeen: z.string().min(1),
    antibioticsAdult: z.string().min(1),

    currentMedications: z.string().min(1),
    supplements: z.string().min(1),

    familyHistory: z.string().min(1),

    avoidedFoods: z.string().min(1),
    immediateFoodSymptoms: z.string().min(1),
    delayedFoodSymptoms: z.string().min(1),
    foodCravings: z.string().min(1),

    dietAtOnset: z.string().min(1),

    regularFoods: z.array(z.string()).min(1),
    specialDiets: z.array(z.string()).min(1),
    specialDietOther: z.string().optional(),

    homeCookedPercent: z.enum([
        "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"
    ]),

    additionalDietNotes: z.string().min(1),
});

export const REGULAR_FOODS = [
    "Soda",
    "Diet soda",
    "Refined sugar",
    "Alcohol",
    "Fast food",
    "Gluten",
    "Dairy",
    "Coffee",
];

export const SPECIAL_DIETS = [
    "Autoimmune paleo (AIP)",
    "SCD/GAPS",
    "Dairy restricted or dairy-free",
    "Vegetarian",
    "Vegan",
    "Paleo",
    "Blood type",
    "Raw",
    "Refined sugar-free",
    "Gluten-free",
    "Ketogenic diet",
    "Other",
];

const checkboxGroup =
    (form: any, name: string, value: string) => {
        const vals = form.watch(name) ?? [];
        const checked = vals.includes(value);

        return (
            <div className="flex items-center gap-3">
                <Checkbox
                    checked={checked}
                    onCheckedChange={() =>
                        form.setValue(
                            name,
                            checked
                                ? vals.filter((v: string) => v !== value)
                                : [...vals, value]
                        )
                    }
                />
                <span className="text-sm">{value}</span>
            </div>
        );
    };

export const HealthConcernsStep = ({ form }: { form: any }) => {
    const specialDiets = form.watch("specialDiets") ?? [];

    return (
        <div className="space-y-8">
            {/* MAIN CONCERNS */}
            <FormField
                control={form.control}
                name="mainConcerns"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            What are your main health concerns? *
                        </FormLabel>
                        <Textarea {...field} />
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="concernOnset"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            When did you first experience these concerns? *
                        </FormLabel>
                        <Textarea {...field} />
                        <FormMessage />
                    </FormItem>
                )}
            />

            {/* PAST APPROACHES */}
            <FormField
                control={form.control}
                name="pastApproaches"
                render={() => (
                    <FormItem>
                        <FormLabel>
                            How have you dealt with these concerns in the past? *
                        </FormLabel>
                        <div className="space-y-2">
                            {checkboxGroup(form, "pastApproaches", "Doctors")}
                            {checkboxGroup(form, "pastApproaches", "Self-care")}
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="pastSuccess"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you experienced any success with these approaches? *
                        </FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            {/* PRACTITIONERS & SURGERIES */}
            <FormField
                control={form.control}
                name="currentPractitioners"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            What other health practitioners are you currently seeing? *
                        </FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="surgeries"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Surgical procedures (date & description) *
                        </FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            {/* ANTIBIOTICS */}
            {[
                ["antibioticsInfancy", "Infancy / childhood"],
                ["antibioticsTeen", "Teen years"],
                ["antibioticsAdult", "Adulthood"],
            ].map(([name, label]) => (
                <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                How often did you take antibiotics during {label}? *
                            </FormLabel>
                            <Textarea {...field} />
                        </FormItem>
                    )}
                />
            ))}

            {/* MEDS & SUPPLEMENTS */}
            <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Current medications *
                        </FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="supplements"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Vitamins, minerals, herbs & supplements *
                        </FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            {/* FOOD & DIET */}
            <FormField
                control={form.control}
                name="regularFoods"
                render={() => (
                    <FormItem>
                        <FormLabel>
                            Which of the following foods do you consume regularly? *
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                            {REGULAR_FOODS.map((f) =>
                                checkboxGroup(form, "regularFoods", f)
                            )}
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="specialDiets"
                render={() => (
                    <FormItem>
                        <FormLabel>
                            Are you currently on a special diet? *
                        </FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                            {SPECIAL_DIETS.map((d) =>
                                checkboxGroup(form, "specialDiets", d)
                            )}
                        </div>

                        {specialDiets.includes("Other") && (
                            <Input
                                className="mt-3"
                                placeholder="Please specify"
                                {...form.register("specialDietOther")}
                            />
                        )}
                    </FormItem>
                )}
            />

            {/* HOME COOKED */}
            <FormField
                control={form.control}
                name="homeCookedPercent"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            What percentage of your meals are home-cooked? *
                        </FormLabel>
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="grid grid-cols-5 gap-2"
                        >
                            {["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"].map((p) => (
                                <div key={p} className="flex items-center gap-2">
                                    <RadioGroupItem value={p} />
                                    <span>{p}%</span>
                                </div>
                            ))}
                        </RadioGroup>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="additionalDietNotes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Anything else we should know about your diet or relationship with food? *
                        </FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />
        </div>
    );
};


