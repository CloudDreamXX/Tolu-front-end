export interface StepOption {
  id: string;
  name: string;
}

export interface Step {
  stepTitle: string;
  question: string;
  subtitle?: string;
  label?: string;
  options: (string | StepOption)[];
  other: boolean;
  folder_id: string;
  onlyOne?: boolean;
  specialCondition?: boolean;
}

export const steps: Step[] = [
  {
    stepTitle: "Symptoms",
    question: "You're the expert on how you feel.",
    subtitle: "What's been bothering you most lately?",
    label: "Exmaples:",
    options: [
      "Hot flashes & night sweats",
      "Sleep disturbances (insomnia, early waking)",
      "Irregular or missed periods",
      "Brain fog, memory lapses, trouble concentrating",
      "Mood swings, anxiety, depression",
      "Weight gain (especially belly fat)",
      "Palpitations, racing heart, blood pressure changes",
      "Bone loss / early osteoporosis",
      "Vaginal dryness, painful sex, UTIs",
      "New/worsening food sensitivities",
      "Hair thinning, dry skin, brittle nails",
      "Not feeling like myself anymore",
    ],
    other: true,
    folder_id: "symptoms",
  },
  {
    stepTitle: "Health Goals",
    question:
      "If you could make one big change for your health, what would it be?",
    subtitle: "Please select only one goal",
    options: [
      "I’d love to balance my hormones so I don’t feel like I’m on a rollercoaster every day.",
      "I want to get my hot flashes under control—they’re interfering with my sleep and confidence.",
      "I’d like to find a safe, effective way to support my hormones without harsh side effects.",
      "I just want to sleep through the night without waking up multiple times.",
      "I wish I could wake up feeling rested and energized again.",
      "I want to feel like myself again—clear-headed and emotionally stable.",
      "If I could lift this brain fog and anxiety, everything else would feel manageable.",
      "I’d love to lose this stubborn weight around my middle that wasn’t there before.",
      "I want to feel strong and maintain muscle as I age.",
      "I miss having a desire for sex!",
    ],
    other: false,
    onlyOne: true,
    specialCondition: true,
    folder_id: "desired_health_change",
  },
  {
    stepTitle: "Health history",
    question:
      "Is there a genetic condition or autoimmune diseases you're aware of in your health history?",
    subtitle: "Please select only one condition",
    options: [
      "Yes, early menopause runs in my family. My mother and grandmother both went through it in their early 40s.",
      "My sister and I both have a history of estrogen dominance, and our mom had fibroids.",
      "Osteoporosis runs in my family — my mom broke her hip in her 60s.",
      "There’s a history of PCOS on my maternal side, and I’ve had symptoms since my 20s.",
      "My mom and aunt both had hysterectomies before menopause, and I’ve been told I might be at risk too.",
      "Yes, there’s a strong history of heart disease in my family. My dad had a heart attack at 52 and my mom has high blood pressure.",
      "Type 2 diabetes runs on both sides — I’m trying to stay ahead of it as my fasting glucose has started creeping up during menopause.",
      "Hashimoto’s thyroiditis runs in my family — I was diagnosed in my 30s.",
      "There’s a lot of anxiety and depression on my maternal side. I’ve felt it get worse since starting menopause.",
    ],
    other: false,
    specialCondition: true,
    onlyOne: true,
    folder_id: "genetic_conditions",
  },
  {
    stepTitle: "Current solution",
    question: "What have you found helpful so far in managing how you feel?",
    options: [
      "I’m eating an anti-inflammatory diet and walking every day",
      "I’ve cut out sugar and caffeine to help with hot flashes",
      "I’m using herbal supplements like black cohosh and maca",
      "I meditate and practice yoga regularly for stress and sleep",
      "I’m on bioidentical hormone replacement therapy, which has helped a lot",
      "My doctor prescribed an antidepressant for mood swings and sleep issues",
      "I take thyroid medication and get regular labs",
      "I’ve joined a women’s health group where we talk openly about menopause",
      "Therapy has helped me cope with the emotional ups and downs",
      "Honestly, I’m not sure what’s working yet. I’m still experimenting",
      "I haven’t found anything that really helps. I’m overwhelmed and tired",
    ],
    other: false,
    specialCondition: true,
    folder_id: "helpful_management",
  },
  {
    stepTitle: "Allergies or food intolerances",
    question: "Is there anything you avoid due to an allergy or sensitivity?",
    options: [
      "I’ve developed a sensitivity to gluten — it causes bloating and brain fog",
      "Dairy makes me really congested and gives me joint pain, so I avoid it",
      "I can’t handle sugar the way I used to — it spikes my blood sugar and crashes my energy",
      "I’m allergic to shellfish — I carry an EpiPen",
      "I have a soy allergy, which makes finding menopause supplements tricky",
      "Eggs make me nauseous, and I’ve had hives from peanuts before",
      "Since hitting menopause, spicy foods give me hot flashes and stomach upset",
      "I never had issues with alcohol before, but now even a glass of wine gives me a headache and flush",
      "I’m not officially diagnosed, but I suspect histamine intolerance — I get headaches, hives, and insomnia from certain foods",
      "No confirmed allergies, but I feel off after eating certain things and haven’t figured out why yet",
    ],
    other: false,
    specialCondition: true,
    folder_id: "allergies_sensitivities",
  },
  {
    stepTitle: "Women’s Health",
    question:
      "Have your menstrual cycles changed in timing, flow, or frequency?",
    options: [
      "My periods have become less frequent (e.g., skipping months)",
      "My periods have become more frequent (e.g., coming every 2–3 weeks)",
      "My periods have become lighter than usual",
      "My periods have become heavier than usual",
      "My periods are more painful or intense",
      "My cycle is completely unpredictable now",
      "I’ve stopped menstruating for 12 months or more (menopause)",
      "I’ve stopped menstruating but not for 12 consecutive months (transitioning)",
      "I’m on birth control or hormonal therapy, so I don’t have a regular cycle",
      "I’ve had a hysterectomy, so I no longer menstruate",
      "No noticeable change in my cycle",
    ],
    other: false,
    specialCondition: true,
    folder_id: "menstrual_changes",
  },
];
