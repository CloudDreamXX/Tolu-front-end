import {
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
    Input,
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "shared/ui";
import { z } from "zod";

export const birthBodySchema = z.object({
    age: z.number().min(0),
    birthDate: z.string().min(1),
    genderAtBirth: z.string().min(1),
    chosenGender: z.string().optional(),

    feedingType: z.enum(["Breastfed", "Bottle-fed"]),
    birthMethod: z.enum(["Vaginal", "C-section"]),

    height: z.string().min(1),
    bloodType: z.string().min(1),

    currentWeight: z.number().min(0),
    idealWeight: z.number().optional(),
    weightOneYearAgo: z.number().optional(),
    birthWeight: z.number().optional(),

    birthOrder: z.string().min(1),
    familySituation: z.string().min(1),

    partnerGenderAtBirth: z.string().optional(),
    partnerChosenGender: z.string().optional(),
    children: z.string().optional(),
    exercise: z.string().min(1),
});

export const BirthBodyStep = ({ form }: { form: any }) => (
    <div className="space-y-6">
        <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Age *</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="birthDate"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Birth date *</FormLabel>
                    <FormControl>
                        <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="genderAtBirth"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Gender at birth *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Female">Female</SelectItem>
                            <SelectItem value="Male">Male</SelectItem>
                            <SelectItem value="Intersex">Intersex</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="feedingType"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Were you breastfed or bottle-fed? *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Breastfed">Breastfed</SelectItem>
                            <SelectItem value="Bottle-fed">Bottle-fed</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />

        <FormField
            control={form.control}
            name="exercise"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Exercise / Recreation *</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="e.g. yoga, walking, gym" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    </div>
);
