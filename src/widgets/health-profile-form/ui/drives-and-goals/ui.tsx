import { useEffect, useState } from "react";
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
import { MultiSelect } from "../MultiSelect";

export const drivesAndGoalsSchema = z.object({
  goals: z.string().optional(),
  goalReason: z.string().optional(),
  urgency: z.string().optional(),
  healthApproach: z.string().optional(),
});

const goalOptions = [
  {
    title: "Symptom Relief",
    options: [
      "Improve energy / reduce fatigue",
      "Sleep better / reduce insomnia",
      "Manage hot flashes/night sweats",
      "Reduce headaches or migraines",
      "Ease joint or muscle pain",
      "Improve digestion / reduce bloating",
    ],
  },
  {
    title: "Mental & Emotional Health",
    options: [
      "Manage anxiety",
      "Reduce depression or mood swings",
      "Improve focus and concentration",
      "Enhance emotional resilience",
      "Reduce brain fog",
    ],
  },
  {
    title: "Physical Health & Body Composition",
    options: [
      "Lose weight",
      "Build muscle",
      "Improve metabolism",
      "Balance blood sugar",
      "Reduce cholesterol / improve heart health",
      "Increase bone density",
    ],
  },
  {
    title: "Hormonal & Reproductive Health",
    options: [
      "Balance hormones",
      "Regulate menstrual cycles",
      "Reduce PMS symptoms",
      "Support fertility",
      "Manage menopause or perimenopause symptoms",
    ],
  },
  {
    title: "Longevity & Prevention",
    options: [
      "Reduce risk of chronic disease",
      "Support healthy aging",
      "Strengthen immunity",
      "Prevent osteoporosis",
      "Improve cardiovascular health",
    ],
  },
  {
    title: "Quality of Life & Performance",
    options: [
      "Improve libido / sexual health",
      "Increase physical performance",
      "Improve recovery after exercise",
      "Enhance overall well-being",
      "Feel more confident in body and mind",
    ],
  },
  { title: "Other", options: ["Other"] },
];

const reasonOptions = [
  {
    title: "Health & Longevity Reasons",
    options: [
      "I want to stay healthy and independent as I get older.",
      "To avoid ending up in the hospital like my parents did.",
      "I want to lower my risk of diabetes and heart disease.",
      "Because I don’t want to rely on medications if I can prevent it.",
    ],
  },
  {
    title: "Energy & Daily Function",
    options: [
      "So I can keep up with my kids and not feel exhausted all the time.",
      "To have the stamina to get through my workday without crashing.",
      "Because I’m tired of waking up with no energy.",
    ],
  },
  {
    title: "Work & Career Motivation",
    options: [
      "I want to perform better at work and focus more.",
      "To reduce stress and avoid burnout in my career.",
      "Because my symptoms are affecting my confidence at work.",
    ],
  },
  {
    title: "Emotional & Mental Well-being",
    options: [
      "To feel calmer and less anxious.",
      "I want to feel like myself again and not moody all the time.",
      "Because brain fog is affecting my memory and relationships.",
    ],
  },
  {
    title: "Family & Relationships",
    options: [
      "So I can be present and active with my kids/grandkids.",
      "Because I don’t want my partner to worry about me all the time.",
      "To be around for my family in the long run.",
    ],
  },
  {
    title: "Identity & Self-Confidence",
    options: [
      "I want to feel confident in my own body again.",
      "Because I don’t like how I look or feel right now.",
      "I want to get back to doing the things I used to love.",
    ],
  },
];

export const DrivesAndGoalsForm = ({ form }: { form: any }) => {
  const [goalsSelected, setGoalsSelected] = useState<string[]>([]);
  const [otherGoal, setOtherGoal] = useState<string>("");
  const [reasonsSelected, setReasonsSelected] = useState<string[]>([]);
  const [otherGoals, setOtherGoals] = useState<string[]>([]);

  useEffect(() => {
    if (goalsSelected.includes("Other") && otherGoals.length === 0) {
      setOtherGoals([""]);
    }
  }, [goalsSelected]);

  const handleGoalsChange = (val: string[]) => {
    setGoalsSelected(val);
    const merged = [
      ...val.filter(v => v !== "Other"),
      ...otherGoals.filter(v => v.trim()).map(v => `Other: ${v.trim()}`)
    ];
    form.setValue("goals", merged.join(" , "));
  };

  const handleReasonsChange = (val: string[]) => {
    setReasonsSelected(val);
    form.setValue("goalReason", val.join(" , "));
  };

  return (
    <div className="space-y-6 overflow-y-auto">
      <p className="text-sm text-gray-500">
        Tell us what you’re aiming for—whether it’s better energy, hormonal
        balance, or weight management.
      </p>

      <FormField
        control={form.control}
        name="goals"
        render={({ field }) => (
          <FormItem>
            <FormLabel>What are you hoping to achieve?</FormLabel>
            <MultiSelect
              defaultValue={field.value}
              placeholder="Choose goal(s)"
              options={goalOptions}
              selected={goalsSelected}
              onChange={handleGoalsChange}
            />
            {goalsSelected.includes("Other") && (
              <div className="pt-2 space-y-2">
                {otherGoals.map((val, idx) => (
                  <Input
                    key={idx}
                    placeholder="Describe your goal"
                    value={val}
                    onChange={(e) => {
                      const newVals = [...otherGoals];
                      newVals[idx] = e.target.value;
                      setOtherGoals(newVals);

                      const merged = [
                        ...goalsSelected.filter(v => v !== "Other"),
                        ...newVals.filter(v => v.trim()).map(v => `Other: ${v.trim()}`)
                      ];
                      form.setValue("goals", merged.join(" , "));
                    }}
                  />
                ))}
                <button
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                  onClick={() => setOtherGoals([...otherGoals, ""])}
                >
                  + Add another
                </button>
              </div>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="goalReason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              What would reaching this goal allow you to do that you can’t do
              now?
            </FormLabel>
            <MultiSelect
              defaultValue={field.value}
              placeholder="Select reason(s)"
              options={reasonOptions}
              selected={reasonsSelected}
              onChange={handleReasonsChange}
            />
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
              <p className="text-[#5F5F65] text-[14px] font-[500]">
                Select only one
              </p>
            </div>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              {["Immediate guidance", "Long-term sustainable change"].map(
                (val) => (
                  <FormItem
                    key={val}
                    className="flex items-center space-x-2 space-y-0"
                  >
                    <FormControl>
                      <RadioGroupItem value={val} id={`urgency-${val}`} />
                    </FormControl>
                    <FormLabel htmlFor={`urgency-${val}`}>{val}</FormLabel>
                  </FormItem>
                )
              )}
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
              <p className="text-[#5F5F65] text-[14px] font-[500]">
                Select only one
              </p>
            </div>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="space-y-1"
            >
              {[
                "Conventional medicine",
                "Holistic & natural",
                "A mix of both",
              ].map((val) => (
                <FormItem
                  key={val}
                  className="flex items-center space-x-2 space-y-0"
                >
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
