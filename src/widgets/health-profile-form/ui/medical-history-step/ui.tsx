import { Checkbox } from "@radix-ui/react-checkbox";
import { FormLabel, FormField, FormItem, FormControl, Input, Textarea, FormMessage } from "shared/ui";
import { z } from "zod";
import { CANCER, CARDIOVASCULAR, FREQUENCY_ITEMS, GASTROINTESTINAL, GENITAL_URINARY, HORMONES_METABOLIC, IMMUNE_INFLAMMATORY, MISCELLANEOUS, MUSCULOSKELETAL, NEUROLOGIC_MOOD, RESPIRATORY, SKIN } from "./lib";

export const statusEnum = z.enum(["past", "now", "never"]);
export const frequencyEnum = z.enum(["yes", "no", "sometimes"]);

export const medicalHistorySchema = z.object({
    conditions: z.record(statusEnum),
    conditionDates: z.record(z.string().optional()),

    otherConditions: z.string().min(1, "This field is required"),

    symptomFrequency: z.record(frequencyEnum),

    chemicalExposure: z.string().min(1, "This field is required"),
    odorSensitivity: z.string().min(1, "This field is required"),
    secondHandSmoke: z.string().min(1, "This field is required"),
    moldExposure: z.string().min(1, "This field is required"),
});

const StatusTable = ({
    title,
    items,
    form,
}: {
    title: string;
    items: string[];
    form: any;
}) => {
    return (
        <div className="space-y-4">
            <FormLabel className="text-base font-medium">{title} *</FormLabel>

            <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_80px_80px] bg-gray-50 px-4 py-2 text-sm font-medium">
                    <span />
                    <span className="text-center">Past</span>
                    <span className="text-center">Now</span>
                    <span className="text-center">Never</span>
                </div>

                {items.map((label) => {
                    const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "_");

                    return (
                        <FormField
                            key={key}
                            control={form.control}
                            name={`conditions.${key}`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-[1fr_80px_80px_80px] items-center gap-4 px-4 py-3 border-t">
                                    <span className="text-sm">{label}</span>

                                    {["past", "now", "never"].map((val) => (
                                        <FormControl key={val}>
                                            <div className="flex justify-center">
                                                <Checkbox
                                                    checked={field.value === val}
                                                    onCheckedChange={() =>
                                                        field.onChange(val)
                                                    }
                                                />
                                            </div>
                                        </FormControl>
                                    ))}
                                </FormItem>
                            )}
                        />
                    );
                })}
            </div>

            <FormField
                control={form.control}
                name={`conditionDates.${title}`}
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">
                            If you had any of the conditions above, please provide the date. *
                        </FormLabel>
                        <FormControl>
                            <Input type="date" {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
};

const FrequencyTable = ({ form }: { form: any }) => (
    <div className="space-y-4">
        <FormLabel className="text-base font-medium">
            Please check the frequency of the following: *
        </FormLabel>

        <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-[1fr_80px_80px_110px] bg-gray-50 px-4 py-2 text-sm font-medium">
                <span />
                <span className="text-center">Yes</span>
                <span className="text-center">No</span>
                <span className="text-center">Sometimes</span>
            </div>

            {FREQUENCY_ITEMS.map((label) => {
                const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "_");

                return (
                    <FormField
                        key={key}
                        control={form.control}
                        name={`symptomFrequency.${key}`}
                        render={({ field }) => (
                            <FormItem className="grid grid-cols-[1fr_80px_80px_110px] items-center gap-4 px-4 py-3 border-t">
                                <span className="text-sm">{label}</span>

                                {["yes", "no", "sometimes"].map((val) => (
                                    <FormControl key={val}>
                                        <div className="flex justify-center">
                                            <Checkbox
                                                checked={field.value === val}
                                                onCheckedChange={() =>
                                                    field.onChange(val)
                                                }
                                            />
                                        </div>
                                    </FormControl>
                                ))}
                            </FormItem>
                        )}
                    />
                );
            })}
        </div>
    </div>
);

export const MedicalHistoryStep = ({ form }: { form: any }) => {
    return (
        <div className="space-y-10">
            <StatusTable
                title="Gastrointestinal"
                items={GASTROINTESTINAL}
                form={form}
            />

            <StatusTable title="Hormones / Metabolic" items={HORMONES_METABOLIC} form={form} />
            <StatusTable title="Cardiovascular" items={CARDIOVASCULAR} form={form} />
            <StatusTable title="Cancer" items={CANCER} form={form} />
            <StatusTable title="Genital & Urinary Systems" items={GENITAL_URINARY} form={form} />
            <StatusTable title="Musculoskeletal / Pain" items={MUSCULOSKELETAL} form={form} />
            <StatusTable title="Immune / Inflammatory" items={IMMUNE_INFLAMMATORY} form={form} />
            <StatusTable title="Respiratory Conditions" items={RESPIRATORY} form={form} />
            <StatusTable title="Skin Conditions" items={SKIN} form={form} />
            <StatusTable title="Neurologic / Mood" items={NEUROLOGIC_MOOD} form={form} />
            <StatusTable title="Miscellaneous" items={MISCELLANEOUS} form={form} />


            <FormField
                control={form.control}
                name="otherConditions"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Is there any other conditions or symptoms that you might be experiencing? *
                        </FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FrequencyTable form={form} />

            {[
                {
                    name: "chemicalExposure",
                    label:
                        "Have you been exposed to chemical or toxic metals (lead, mercury, arsenic, aluminum)? *",
                },
                { name: "odorSensitivity", label: "Do odors affect you? *" },
                {
                    name: "secondHandSmoke",
                    label:
                        "Are you or have you been exposed to second-hand smoke? *",
                },
                {
                    name: "moldExposure",
                    label:
                        "Are you currently or have you been exposed to mold? (If so, describe source and duration) *",
                },
            ].map((q) => (
                <FormField
                    key={q.name}
                    control={form.control}
                    name={q.name}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{q.label}</FormLabel>
                            <FormControl>
                                <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            ))}
        </div>
    );
};
