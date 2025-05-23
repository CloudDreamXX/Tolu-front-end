import Leaf from "shared/assets/icons/leaf";
import Brain from "shared/assets/icons/brain";
import WomansLine from "shared/assets/icons/womans-line";
import Chemistry from "shared/assets/icons/chemistry";
import { Microscope } from "lucide-react";

export const dropdownOptions = [
  "Clinical Psychologist",
  "Psychiatrist",
  "Psychoanalyst",
  "Psychotherapist",
  "Clinical Social Worker",
  "Licensed Professional Counselor",
  "Marriage and Family Therapist",
];

const ClinicalOptions = [
  "Nurse Practitioner (NP)",
  "Physician Assistant (PA)",
  "Registered Nurse (RN)",
  "Medical Doctor (MD)",
  "Doctor of Osteopathy (DO)",
  "Physical Therapist (PT) – Pelvic Floor & Women’s Health",
  "Licensed Clinical Social Worker (LCSW)",
  "Licensed Midwife or Nurse Midwife (CNM)",
  "Chiropractor (DC)"
];

const FunctionalOptions = [
  "Certified Functional Nutrition Counselor / Coach",
  "Functional Medicine Health Coach (FMCHC)",
  "Integrative Nutritionist",
  "Traditional Naturopath",
  "Herbalist",
  "Ayurvedic Practitioner",
  "Homeopath",
  "Board Certified Nutrition Specialist (CNS)",
  "Health Practitioner with Detox or Gut Health Specialty"
];

const LifestyleOptions = [
  "Mind-Body Coach / Therapist (e.g., somatic, breathwork)",
  "Certified Health & Wellness Coach (NBC-HWC)",
  "Trauma-Informed Coach",
  "Meditation & Mindfulness Instructor",
  "Yoga Therapist or Instructor",
  "Fitness Coach with Hormone Focus",
  "Lifestyle Coach (Sleep, Energy, Productivity)",
  "Recovery & Resilience Coach"
];

const WomensOptions = [
  "Menopause or Perimenopause Specialist",
  "Hormone Health Coach",
  "Fertility Awareness or Conception Coach",
  "Cycle Syncing Coach",
  "Prenatal/Postpartum Coach",
  "PCOS/Endometriosis Coach",
  "Sexual Health Coach for Women",
  "Emotional Eating or Body Image Coach"
];

const OtherOptions = [
  "Healthcare Professional (General/Other)",
  "Patient Advocate / Health Navigator",
  "Genetic Counselor",
  "Lab Interpretation Specialist",
  "Supplement or Nutraceutical Consultant",
  "Educator or Course Creator in Wellness",
  "Chronic Condition Coach (e.g., autoimmune, metabolic)",
  "Other (please specify)"
];

export const titlesAndIcons = [
  {
    title: "Clinical & Licensed Healthcare Providers",
    icon: <Microscope size={20} />,
    options: ClinicalOptions,
  },
  {
    title: "Functional & Holistic Health Practitioners",
    icon: <Leaf />,
    options: FunctionalOptions,
  },
  {
    title: "Lifestyle, Mind-Body, and Wellness Coaches",
    icon: <Brain />,
    options: LifestyleOptions,
  },
  {
    title: "Women's Health & Specialty Coaches",
    icon: <WomansLine />,
    options: WomensOptions,
  },
  {
    title: "Other",
    icon: <Chemistry />,
    options: OtherOptions,
  },
];
