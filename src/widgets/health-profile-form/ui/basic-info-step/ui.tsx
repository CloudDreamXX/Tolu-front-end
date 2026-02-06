import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
} from "shared/ui";
import { z } from "zod";

export const basicInfoSchema = z.object({
  email: z.string().optional(),
  fullName: z.string().optional(),
});

export const BasicInfoStep = ({ form }: { form: any }) => (
  <div className="space-y-6">
    <FormField
      control={form.control}
      name="email"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input {...field} placeholder="you@example.com" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />

    <FormField
      control={form.control}
      name="fullName"
      render={({ field }) => (
        <FormItem>
          <FormLabel>What is your full name?</FormLabel>
          <FormControl>
            <Input {...field} placeholder="Full name" />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  </div>
);
