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
    age: z.string(),
    birthDate: z.string(),
    genderAtBirth: z.string(),
    chosenGenderAfterBirth: z.string().optional(),

    breastfedOrBottle: z.string().optional(),
    birthDeliveryMethod: z.string().optional(),

    height: z.string().optional(),
    bloodType: z.string().optional(),

    currentWeightLbs: z.string().optional(),
    idealWeightLbs: z.string().optional(),
    weightOneYearAgoLbs: z.string().optional(),
    birthWeightLbs: z.string().optional(),

    birthOrderSiblings: z.string().optional(),
    familyLivingSituation: z.string().optional(),

    partnerGenderAtBirth: z.string().optional(),
    partnerChosenGender: z.string().optional(),
    children: z.string().optional(),

    exerciseRecreation: z.string().optional(),
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
