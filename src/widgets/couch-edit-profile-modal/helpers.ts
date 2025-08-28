export const steps = [
  { id: "general", label: "General info" },
  // { id: "safety", label: "Safety" },
  { id: "practice", label: "Practice" },
  { id: "type", label: "Type" },
  { id: "focus", label: "Focus" },
] as const;

export const RECOVERY_QUESTIONS = [
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What was the name of your first pet?",
  "What was the name of your elementary school?",
  "What is your favorite teacher's name?",
];

export const SCHOOL_OPTIONS = [
  "Functional Medicine Coaching Academy (FMCA)",
  "Institute for Integrative Nutrition (IIN)",
  "National Institute for Integrative Nutrition (NIIN)",
  "School of Applied Functional Medicine (SAFM)",
  "Functional Nutrition Alliance / FBS (FXNA)",
  "Nutritional Therapy Association (NTA)",
  "Chris Kresser Institute (ADAPT Health Coach Training)",
  "Duke Integrative Medicine",
  "Maryland University of Integrative Health (MUIH)",
  "Saybrook University",
  "Wellcoaches School of Coaching",
  "The Integrative Women’s Health Institute (IWHI)",
  "Primal Health Coach Institute",
  "Mind Body Food Institute",
  "Transformation Academy",
  "National Board for Health & Wellness Coaching (NBHWC)",
  "Other (please specify)",
];

export const PRACTICE_ANSWERS = ["Yes", "No", "Planning to"];
export const USE_AI_ANSWERS = ["Yes", "No", "Planning to soon"];

export const FOCUS_OPTIONS = [
  "Perimenopause & Menopause",
  "Gut Health",
  "Thyroid & Autoimmune",
  "Weight & Metabolic Health",
  "Blood Sugar & Insulin Resistance",
  "Fertility & Hormones",
  "Chronic Fatigue / Long COVID",
  "Anxiety & Sleep",
  "Mold / Lyme / MCAS",
  "Inflammation & Pain",
  "Postpartum / Pelvic Floor",
  "Cancer Support",
  "Other",
] as const;

export const SOFTWARE_OPTIONS = [
  "Practice Management Software",
  "Telehealth Platforms",
  "EHR/EMR Systems",
  "Billing & Coding Software",
  "Patient Engagement Tools",
] as const;
