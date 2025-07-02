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
import { useRef } from "react";
import z from "zod";
import Upload from "shared/assets/icons/upload";

export const metabolicDigestiveHealthSchema = z.object({
  bloodSugarConcern: z.string().optional(),
  bloodSugarOther: z.string().optional(),

  digestiveIssues: z.string().optional(),
  digestiveOther: z.string().optional(),

  recentLabTests: z.string().min(1, "This field is required"),
  labTestFile: z.instanceof(File).optional(),
});

export const MetabolicDigestiveHealthForm = ({ form }: { form: any }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileName = form.watch("labTestFile")?.name || "No files chosen";

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Provide details about your digestion, blood sugar, metabolism, and gut
        health.
      </p>

      <FormField
        control={form.control}
        name="bloodSugarConcern"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <p>Blood sugar management concerns</p>
              <p className="text-[14px] text-[#5F5F65] font-[500]">
                Select if relevant
              </p>
            </FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              {["Yes", "No", "Other"].map((val) => (
                <FormItem
                  key={val}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={val} id={`blood-${val}`} />
                  </FormControl>
                  <FormLabel htmlFor={`blood-${val}`}>{val}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
            {form.watch("bloodSugarConcern") === "Other" && (
              <FormField
                control={form.control}
                name="bloodSugarOther"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g., Borderline insulin resistance"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="digestiveIssues"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              <p>Digestive issues (e.g., bloating, IBS, reflux)</p>
              <p className="text-[14px] text-[#5F5F65] font-[500]">
                Select if relevant
              </p>
            </FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              {["Yes", "No", "Other"].map((val) => (
                <FormItem
                  key={val}
                  className="flex items-center space-x-2 space-y-0"
                >
                  <FormControl>
                    <RadioGroupItem value={val} id={`digestive-${val}`} />
                  </FormControl>
                  <FormLabel htmlFor={`digestive-${val}`}>{val}</FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
            {form.watch("digestiveIssues") === "Other" && (
              <FormField
                control={form.control}
                name="digestiveOther"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="e.g., Occasional constipation and acid reflux"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="recentLabTests"
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between items-center">
              <FormLabel>Recent lab tests available?</FormLabel>
              <a
                href="https://tolu.health/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1C63DB] text-[14px] font-semibold hover:underline"
              >
                Data privacy
              </a>
            </div>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="Yes" id="lab-yes" />
                </FormControl>
                <FormLabel htmlFor="lab-yes">Yes</FormLabel>
              </FormItem>

              {form.watch("recentLabTests") === "Yes" && (
                <FormField
                  control={form.control}
                  name="labTestFile"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-4">
                        <span className="text-[14px] text-[#5F5F65] truncate max-w-[200px]">
                          {fileName}
                        </span>
                        <button
                          type="button"
                          className="flex items-center gap-[8px] px-[16.5px] py-[6px] text-[14px] font-medium text-[#1C63DB] bg-[#DDEBF6] rounded-full hover:bg-[#D6ECFD]/80 transition"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload />
                          Upload file
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          onChange={(e) => field.onChange(e.target.files?.[0])}
                          className="hidden"
                        />
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <RadioGroupItem value="No" id="lab-no" />
                </FormControl>
                <FormLabel htmlFor="lab-no">No</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormItem>
        )}
      />
    </div>
  );
};
