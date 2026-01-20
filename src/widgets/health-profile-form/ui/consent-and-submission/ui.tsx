import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
} from "shared/ui";
import { Link } from "react-router-dom";
import z from "zod";

export const consentSubmissionSchema = z.object({
  agreeToPrivacy: z.boolean().optional(),
  followUpRecommendation: z.string().optional(),
  phoneNumber: z.string().optional(),
  countryCode: z.string().optional(),
});

export const ConsentSubmissionForm = ({ form }: { form: any }) => {
  // const watchFollowUp = form.watch("followUpRecommendation");
  // const [countryCode, setCountryCode] = useState("+1");

  return (
    <div className="space-y-6">
      <p className="text-[16px] text-[#5F5F65]">
        Agree to our privacy policy, and let us know if you'd like to receive
        personalized recommendations by email. Once you're ready, submit to get
        your tailored insights.
      </p>

      <FormField
        control={form.control}
        name="agreeToPrivacy"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-[#1D1D1F] text-[16px] font-[500]">
              Consent to{" "}
              <Link
                to="https://tolu.health/privacy-policy"
                className="text-[#1D1D1F] text-[16px] font-[500] underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Data Privacy Terms
              </Link>
            </FormLabel>
            <FormControl>
              <div className="flex gap-[16px] items-center">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
                <p className="text-[#1D1D1F] text-[16px] font-[500]">
                  I agree to the privacy policy and understand how my data will
                  be used.
                </p>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="followUpRecommendation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Would you like follow-up recommendations via email or text?
            </FormLabel>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              <FormItem
                key={"Email"}
                className="flex items-center space-x-2 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem value={"Email"} id={"Email"} />
                </FormControl>
                <FormLabel htmlFor={"Email"}>Email</FormLabel>
              </FormItem>

              <FormItem
                key={"None"}
                className="flex items-center space-x-2 space-y-0"
              >
                <FormControl>
                  <RadioGroupItem value={"None"} id={"None"} />
                </FormControl>
                <FormLabel htmlFor={"None"}>None</FormLabel>
              </FormItem>

              <FormItem
                key={"Text"}
                className="flex items-center space-x-2 space-y-0 opacity-60 cursor-not-allowed"
              >
                <FormControl>
                  <RadioGroupItem value={"Text"} id={"Text"} disabled />
                </FormControl>
                <FormLabel htmlFor={"Text"}>
                  Text{" "}
                  <span className="ml-1 text-sm text-[#5F5F65]">
                    (Coming Soon)
                  </span>
                </FormLabel>
              </FormItem>

              {/* {watchFollowUp === "Text" && (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <div className="flex items-center border border-[#CBD5E1] rounded-lg overflow-hidden w-fit">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="bg-[#E6F0FA] text-black px-[12px] h-[32px] rounded-[6px] outline-none text-[16px] font-medium my-[6px] ml-[16px]"
                      >
                        <option value="+1">+1</option>
                        <option value="+44">+44</option>
                        <option value="+33">+33</option>
                        <option value="+49">+49</option>
                      </select>
                      <Input
                        {...form.register("phoneNumber")}
                        className="border-none outline-none px-[12px] py-[6px] text-[16px] w-[160px]"
                        placeholder="(415) 555-2671"
                        type="tel"
                        maxLength={10}
                      />
                    </div>
                  </FormControl>

                  {form.formState.errors.phoneNumber && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.phoneNumber.message as string}
                    </p>
                  )}
                </FormItem>
              )} */}
            </RadioGroup>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
