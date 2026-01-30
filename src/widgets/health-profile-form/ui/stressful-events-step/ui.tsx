import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Checkbox,
    Input,
    Textarea,
} from "shared/ui";
import { z } from "zod";

export const stressfulEventsSchema = z.object({
    stressfulEvents: z.record(z.enum(["yes", "no"])),
    timeOffWork: z.enum([
        "0-2 days",
        "3-14 days",
        "15+ days",
        "does_not_apply",
    ]),

    livedOutsideUS: z.string().min(1, "This field is required"),
    majorLifeChanges: z.string().optional(),
    additionalNotes: z.string().optional(),
});

export const STRESSFUL_EVENTS = [
    {
        key: "death_close_person",
        label:
            "Death of a family member, romantic partner, or very close friend (accident, homicide, or suicide)",
    },
    {
        key: "sexual_physical_abuse",
        label:
            "Sexual or physical abuse by a family member, romantic partner, stranger, or someone else",
    },
    {
        key: "emotional_abuse",
        label:
            "Emotional neglect or abuse (ridicule, bullying, being ignored, or put down)",
    },
    { key: "discrimination", label: "Discrimination" },
    {
        key: "life_threatening_event",
        label:
            "Life-threatening accident or situation (military combat or living in a war zone)",
    },
    { key: "life_threatening_illness", label: "Life-threatening illness" },
    {
        key: "weapon_threat",
        label: "Physical force or weapon threatened or used against you",
    },
    {
        key: "witnessed_violence",
        label:
            "Witnessed murder, serious injury, or assault of another person",
    },
] as const;

export const StressfulEventsStep = ({ form }: { form: any }) => {
    return (
        <div className="space-y-8">
            <FormField
                control={form.control}
                name="livedOutsideUS"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you lived or traveled outside of the United States? If so,
                            when and where? *
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
                name="majorLifeChanges"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Have you or your family recently experienced any major life
                            changes?
                        </FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />

            <div>
                <FormLabel className="text-base font-medium">
                    Have you experienced one or more of these stressful life events or
                    traumas in your life? *
                </FormLabel>

                <div className="mt-4 border rounded-lg overflow-hidden">
                    <div className="grid grid-cols-[1fr_80px_80px] bg-gray-50 px-4 py-2 text-sm font-medium">
                        <span />
                        <span className="text-center">Yes</span>
                        <span className="text-center">No</span>
                    </div>

                    {STRESSFUL_EVENTS.map((event) => (
                        <FormField
                            key={event.key}
                            control={form.control}
                            name={`stressfulEvents.${event.key}`}
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-[1fr_80px_80px] items-center gap-4 px-4 py-3 border-t">
                                    <span className="text-sm text-gray-900">
                                        {event.label}
                                    </span>

                                    <FormControl>
                                        <div className="flex justify-center">
                                            <Checkbox
                                                checked={field.value === "yes"}
                                                onCheckedChange={() =>
                                                    field.onChange("yes")
                                                }
                                            />
                                        </div>
                                    </FormControl>

                                    <FormControl>
                                        <div className="flex justify-center">
                                            <Checkbox
                                                checked={field.value === "no"}
                                                onCheckedChange={() =>
                                                    field.onChange("no")
                                                }
                                            />
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
            </div>

            <FormField
                control={form.control}
                name="timeOffWork"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            How much time have you had to take off from work or school in the
                            last year? *
                        </FormLabel>

                        <div className="space-y-3 mt-3">
                            {[
                                { label: "0 to 2 days", value: "0-2 days" },
                                { label: "3 to 14 days", value: "3-14 days" },
                                { label: "More than 15 days", value: "15+ days" },
                                { label: "Doesn't apply", value: "does_not_apply" },
                            ].map((opt) => (
                                <div
                                    key={opt.value}
                                    className="flex items-center gap-3"
                                >
                                    <Checkbox
                                        checked={field.value === opt.value}
                                        onCheckedChange={() =>
                                            field.onChange(opt.value)
                                        }
                                    />
                                    <span className="text-sm">{opt.label}</span>
                                </div>
                            ))}
                        </div>

                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="additionalNotes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Is there anything else you’d like to share?
                        </FormLabel>
                        <FormControl>
                            <Textarea {...field} />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
};
