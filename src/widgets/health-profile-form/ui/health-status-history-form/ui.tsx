import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import { z } from "zod";

export const healthStatusHistorySchema = z.object({
  healthConcerns: z.string().min(1, { message: "This field is required." }),
  medicalConditions: z.string().min(1, { message: "This field is required." }),
  medications: z.string().min(1, { message: "This field is required." }),
  otherMedications: z.string().optional(),
  supplements: z.string().min(1, { message: "This field is required." }),
  allergies: z.string().min(1, { message: "This field is required." }),
  familyHistory: z.string().min(1, { message: "This field is required." }),
});

export const HealthStatusHistoryForm = ({ form }: { form: any }) => {
  const medications = form.watch("medications");

  return (
    <div className="space-y-6">
      <p className="text-gray-500 ">
        Help us understand your current health picture by sharing symptoms,
        conditions, medications, supplements, and any family history.
      </p>
      <FormField
        control={form.control}
        name="healthConcerns"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current health concerns or symptoms</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Fatigue">Fatigue</SelectItem>
                <SelectItem value="Irregular periods">
                  Irregular periods
                </SelectItem>
                <SelectItem value="Weight gain">Weight gain</SelectItem>
                <SelectItem value="Bloating">Bloating</SelectItem>
                <SelectItem value="Brain fog">Brain fog</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="medicalConditions"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diagnosed medical conditions</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="hypothyroidism">Hypothyroidism</SelectItem>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Crohn's">Crohn's</SelectItem>
                <SelectItem value="PCOS">PCOS</SelectItem>
                <SelectItem value="T2D">T2D</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="medications"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Medications{" "}
              <span className="text-gray-500">(Current or recent)</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Synthroid (Levothyroxine) 50 mcg">
                  Synthroid (Levothyroxine) 50 mcg
                </SelectItem>
                <SelectItem value="Statin">Statin</SelectItem>
                <SelectItem value="Metformin">Metformin</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      {medications === "other" && (
        <FormField
          control={form.control}
          name="otherMedications"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Other medications" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
      <FormField
        control={form.control}
        name="supplements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Supplements</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="vitamins">Vitamins</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="allergies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Known allergies or intolerances</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Pollen">Pollen</SelectItem>
                <SelectItem value="Shellfish">Shellfish</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Gluten">Gluten</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="familyHistory"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Family health history</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                <SelectItem value="Cancer">Cancer</SelectItem>
                <SelectItem value="Alzheimer's">Alzheimer's</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
