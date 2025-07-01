import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    RadioGroup,
    RadioGroupItem,
    Input,
} from "shared/ui";
import z from "zod";

export const drivesAndGoalsSchema = z.object({
    goals: z.string().min(1, "This field is required"),
    goalReason: z.string().min(1, "This field is required"),
    urgency: z.string().min(1, "This field is required"),
    healthApproach: z.string().min(1, "This field is required"),
});

export const DrivesAndGoalsForm = ({ form }: { form: any }) => {
    return (
        <div className="space-y-6">
            <p className="text-sm text-gray-500">
                Tell us what you’re aiming for—whether it’s better energy, hormonal balance, or weight management.
            </p>

            <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>What are you hoping to achieve?</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Improve fatigue, Lose weight, Manage anxiety"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="goalReason"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Why this specific goal?</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="To stay away from the hospital or to boost performance at work"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="urgency"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex flex-col">
                            <FormLabel>How quickly do you want results?</FormLabel>
                            <p className="text-[#5F5F65] text-[14px] font-[500]">Select only one</p>
                        </div>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                            {["Immediate guidance", "Long-term sustainable change"].map((val) => (
                                <FormItem key={val} className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={val} id={`urgency-${val}`} />
                                    </FormControl>
                                    <FormLabel htmlFor={`urgency-${val}`}>{val}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="healthApproach"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex flex-col">
                            <FormLabel>Preferred approach to health solutions</FormLabel>
                            <p className="text-[#5F5F65] text-[14px] font-[500]">Select only one</p>
                        </div>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-1">
                            {["Conventional medicine", "Holistic & natural", "A mix of both"].map((val) => (
                                <FormItem key={val} className="flex items-center space-x-2 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value={val} id={`approach-${val}`} />
                                    </FormControl>
                                    <FormLabel htmlFor={`approach-${val}`}>{val}</FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};
