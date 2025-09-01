import LeavesIcon from "shared/assets/icons/leaves";
import Brain from "shared/assets/icons/brain";
import Chemistry from "shared/assets/icons/chemistry";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

const ClinicalOptions = [
  "Nurse Practitioner (NP)",
  "Physician Assistant (PA)",
  "Registered Nurse (RN)",
  "Medical Doctor (MD)",
  "Doctor of Osteopathy (DO)",
  "Physical Therapist (PT) – Pelvic Floor & Women’s Health",
  "Licensed Clinical Social Worker (LCSW)",
  "Licensed Midwife or Nurse Midwife (CNM)",
  "Chiropractor (DC)",
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
  "Health Practitioner with Detox or Gut Health Specialty",
];

const LifestyleOptions = [
  "Mind-Body Coach / Therapist (e.g., somatic, breathwork)",
  "Certified Health & Wellness Coach (NBC-HWC)",
  "Trauma-Informed Coach",
  "Meditation & Mindfulness Instructor",
  "Yoga Therapist or Instructor",
  "Fitness Coach with Hormone Focus",
  "Lifestyle Coach (Sleep, Energy, Productivity)",
  "Recovery & Resilience Coach",
];

const WomensOptions = [
  "Menopause or Perimenopause Specialist",
  "Hormone Health Coach",
  "Fertility Awareness or Conception Coach",
  "Cycle Syncing Coach",
  "Prenatal/Postpartum Coach",
  "PCOS/Endometriosis Coach",
  "Sexual Health Coach for Women",
  "Emotional Eating or Body Image Coach",
];

const OtherOptions = [
  "Healthcare Professional (General/Other)",
  "Patient Advocate / Health Navigator",
  "Genetic Counselor",
  "Lab Interpretation Specialist",
  "Supplement or Nutraceutical Consultant",
  "Educator or Course Creator in Wellness",
  "Chronic Condition Coach (e.g., autoimmune, metabolic)",
  "Other (please specify)",
];

export const titlesAndIcons = [
  {
    title: "Clinical & Licensed Healthcare Providers",
    icon: (
      <MaterialIcon
        iconName="lightbulb"
        fill={1}
        size={20}
        className="text-[#1B2559]"
      />
    ),
    options: ClinicalOptions,
    tooltipContent:
      "For licensed professionals supporting\nhealth transformation through\ndiagnostics and medical oversight.",
  },
  {
    title: "Functional & Holistic Health Practitioners",
    icon: <LeavesIcon />,
    options: FunctionalOptions,
    tooltipContent:
      "For those trained in integrative\nframeworks and root-cause resolution.",
  },
  {
    title: "Lifestyle, Mind-Body, and Wellness Coaches",
    icon: <Brain />,
    options: LifestyleOptions,
    tooltipContent:
      "Supporting behavioral change, stress\nreduction, and nervous system balance.",
  },
  {
    title: "Women's Health & Specialty Coaches",
    icon: <MaterialIcon iconName="female" className="text-[#1B2559]" />,
    options: WomensOptions,
    tooltipContent:
      "Serving women through transitions like\nperimenopause, menopause, and\nfertility journeys.",
  },
  {
    title: "Other",
    icon: <Chemistry />,
    options: OtherOptions,
    tooltipContent:
      "For professionals who support\nwellness but don’t fall into traditional\ncategories.",
  },
];
