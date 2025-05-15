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

export const titlesAndIcons = [
  {
    title: "Clinical & Licensed Healthcare Providers",
    icon: <Microscope size={20} />,
  },
  {
    title: "Functional & Holistic Health Practitioners",
    icon: <Leaf />,
  },
  {
    title: "Lifestyle, Mind-Body, and Wellness Coaches",
    icon: <Brain />,
  },
  {
    title: "Women's Health & Specialty Coaches",
    icon: <WomansLine />,
  },
  {
    title: "Other",
    icon: <Chemistry />,
  },
];