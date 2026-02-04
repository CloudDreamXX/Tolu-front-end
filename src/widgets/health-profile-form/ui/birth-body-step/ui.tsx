import { useState } from "react";
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
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";
import { z } from "zod";

export const birthBodySchema = z.object({
  age: z.string().optional(),
  birthDate: z.string().optional(),
  genderAtBirth: z.string().optional(),
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

export const BirthBodyStep = ({ form }: { form: any }) => {
  return (
    <div className="space-y-6">
      {/* Age */}
      <FormField
        control={form.control}
        name="age"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Age *</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Birth date */}
      <FormField
        control={form.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birth date *</FormLabel>
            <BirthDateField field={field} />
          </FormItem>
        )}
      />

      {/* Gender at birth */}
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
          </FormItem>
        )}
      />

      {/* Chosen gender */}
      <FormField
        control={form.control}
        name="chosenGenderAfterBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Chosen gender after birth (if applicable)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Breastfed / bottle */}
      <FormField
        control={form.control}
        name="breastfedOrBottle"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Were you breastfed or bottle-fed? *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Birth delivery method */}
      <FormField
        control={form.control}
        name="birthDeliveryMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Were you born vaginally or C sectioned? *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Height */}
      <FormField
        control={form.control}
        name="height"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Height *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Blood type */}
      <FormField
        control={form.control}
        name="bloodType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Blood type *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Current weight */}
      <FormField
        control={form.control}
        name="currentWeightLbs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current weight (lbs) *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Ideal weight */}
      <FormField
        control={form.control}
        name="idealWeightLbs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ideal weight (lbs)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Weight one year ago */}
      <FormField
        control={form.control}
        name="weightOneYearAgoLbs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Weight one year ago (lbs)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Birth weight */}
      <FormField
        control={form.control}
        name="birthWeightLbs"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Birth Weight (if known) (lbs)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Birth order / siblings */}
      <FormField
        control={form.control}
        name="birthOrderSiblings"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Birth Order (please list ages of biological siblings) *
            </FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Family / living situation */}
      <FormField
        control={form.control}
        name="familyLivingSituation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Family / Living Situation *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Partner gender at birth */}
      <FormField
        control={form.control}
        name="partnerGenderAtBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Partner’s gender at birth *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Partner chosen gender */}
      <FormField
        control={form.control}
        name="partnerChosenGender"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Partner’s chosen gender (if applicable)</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Children */}
      <FormField
        control={form.control}
        name="children"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Children *</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />

      {/* Exercise / recreation */}
      <FormField
        control={form.control}
        name="exerciseRecreation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Exercise / Recreation *</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g. yoga, walking, gym" />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

const BirthDateField = ({ field }: { field: any }) => {
  const [open, setOpen] = useState(false);

  const parsedDate = field.value ? new Date(field.value + "T00:00:00") : null;

  const [displayMonth, setDisplayMonth] = useState<Date>(
    parsedDate ?? new Date()
  );

  const selectedYear = parsedDate?.getFullYear() ?? displayMonth.getFullYear();

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <FormControl>
          <Input
            readOnly
            placeholder="Select Birth Date"
            className="text-start"
            value={
              parsedDate
                ? new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }).format(parsedDate)
                : ""
            }
          />
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
        <div className="flex items-center gap-2 m-4 mb-2 text-sm">
          Choose a year:
          <select
            value={selectedYear}
            onChange={(e) => {
              const year = Number(e.target.value);
              const month = displayMonth.getMonth();
              const day = parsedDate?.getDate() ?? 1;

              const d = new Date(year, month, day);
              setDisplayMonth(d);

              field.onChange(
                `${year}-${String(month + 1).padStart(2, "0")}-${String(
                  day
                ).padStart(2, "0")}`
              );
            }}
            className="px-2 py-1 border rounded-md outline-none"
          >
            {Array.from(
              { length: 100 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <Calendar
          mode="single"
          selected={parsedDate ?? undefined}
          month={displayMonth}
          onMonthChange={setDisplayMonth}
          onSelect={(date) => {
            if (!date) return;

            const clean = new Date(
              date.getFullYear(),
              date.getMonth(),
              date.getDate()
            );

            setDisplayMonth(clean);
            field.onChange(
              `${clean.getFullYear()}-${String(clean.getMonth() + 1).padStart(
                2,
                "0"
              )}-${String(clean.getDate()).padStart(2, "0")}`
            );

            setOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
