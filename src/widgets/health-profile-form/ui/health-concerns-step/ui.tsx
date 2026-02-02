import {
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Checkbox,
    Textarea,
    RadioGroup,
    RadioGroupItem,
    Input,
} from "shared/ui";
import { z } from "zod";

export const healthConcernsSchema = z.object({
    mainHealthConcerns: z.string(),
    whenFirstExperienced: z.string(),

    howDealtWithConcerns: z.string(),
    successWithApproaches: z.string(),

    otherHealthPractitioners: z.string(),
    surgicalProcedures: z.string(),

    antibioticsInfancyChildhood: z.string(),
    antibioticsTeen: z.string(),
    antibioticsAdult: z.string(),

    currentMedications: z.string(),
    currentSupplements: z.string(),

    familySimilarProblems: z.string(),

    foodsAvoidSymptoms: z.string(),
    immediateSymptomsAfterEating: z.string(),
    delayedSymptomsAfterEating: z.string(),
    foodCravings: z.string(),

    dietAtOnset: z.string(),
    knownFoodAllergies: z.string().optional(),

    regularFoodConsumption: z.array(z.string()),
    specialDiet: z.array(z.string()),

    homeCookedPercentage: z.number(),
    dietRelationshipNotes: z.string(),
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
    return (
        <div className="space-y-8">
            <FormField
                control={form.control}
                name="mainHealthConcerns"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>What are your main health concerns? *</FormLabel>
                        <Textarea {...field} />
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="whenFirstExperienced"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>When did you first experience these concerns? *</FormLabel>
                        <Textarea {...field} />
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="howDealtWithConcerns"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>How have you dealt with these concerns in the past? *</FormLabel>
                        <Textarea {...field} />
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="successWithApproaches"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Have you experienced any success with these approaches? *</FormLabel>
                        <Textarea {...field} />
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="otherHealthPractitioners"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Other health practitioners you’re seeing *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="surgicalProcedures"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Surgical procedures (date & description) *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            {[
                ["antibioticsInfancyChildhood", "Infancy / childhood"],
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

            <FormField
                control={form.control}
                name="currentMedications"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Current medications *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="currentSupplements"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Supplements *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="familySimilarProblems"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Family members with similar problems *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="foodsAvoidSymptoms"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Foods you avoid due to symptoms *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="immediateSymptomsAfterEating"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Immediate symptoms after eating *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="delayedSymptomsAfterEating"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Delayed symptoms after eating *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="foodCravings"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Food cravings *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="dietAtOnset"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Diet at symptom onset *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="regularFoodConsumption"
                render={() => (
                    <FormItem>
                        <FormLabel>Foods consumed regularly *</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                            {REGULAR_FOODS.map((food) =>
                                checkboxGroup(form, "regularFoodConsumption", food)
                            )}
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="specialDiet"
                render={() => (
                    <FormItem>
                        <FormLabel>Special diet *</FormLabel>
                        <div className="grid grid-cols-2 gap-3">
                            {SPECIAL_DIETS.map((diet) =>
                                checkboxGroup(form, "specialDiet", diet)
                            )}
                        </div>
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="homeCookedPercentage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Home-cooked meals (%) *</FormLabel>
                        <RadioGroup
                            value={String(field.value)}
                            onValueChange={(v) => field.onChange(Number(v))}
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
                name="dietRelationshipNotes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Anything else about your diet or relationship with food? *</FormLabel>
                        <Textarea {...field} />
                    </FormItem>
                )}
            />
        </div>
    );
};



