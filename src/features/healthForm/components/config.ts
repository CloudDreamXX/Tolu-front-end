import StepSymptoms from "./StepSymptoms";
import StepConditions from "./StepConditions";
import StepAllergies from "./StepAllergies";

//icons
import BrainIcon from "../../../assets/svgs/diagnoses/Brain.svg";
import HormoneIcon from "../../../assets/svgs/diagnoses/hormones.svg";
import SexualIcon from "../../../assets/svgs/diagnoses/Gender.svg";
import GutIcon from "../../../assets/svgs/diagnoses/Gut.svg";
import InflammationIcon from "../../../assets/svgs/diagnoses/Virus.svg";
import HeartIcon from "../../../assets/svgs/diagnoses/Heart.svg";
import BladderIcon from "../../../assets/svgs/diagnoses/Kidney.svg";


export const stepConfig = [
  {
    id: "symptoms",
    title: "Tell Us About Your Current Health",
    description: "Help us provide you with personalized tips and insights based on your current health condition. You can skip this step if you prefer.",
    component: StepSymptoms,
  },
  {
    id: "conditions",
    title: "Select Your Diagnosed Conditions",
    description: "Choose diagnosed conditions to tailor recommendations.",
    component: StepConditions,
  },
  {
    id: "allergies",
    title: "Select Your Allergies",
    description: "Specify allergies to avoid incorrect suggestions.",
    component: StepAllergies,
  },
];

export const symptoms = ['Nausea', 'Headache', 'Confusion', 'Loss of consciousness', 'Fatigue', 'Other special condition'];

export const diagnosedConditions = [
  {
    icon: BrainIcon,
    title: "Brain, Mind and Mood",
    points: ["test", "test", "test", "test", "test"],
  },
  {
    icon: HormoneIcon,
    title: "Hormone Balance and Energy",
    points: ["test", "test", "test", "test", "test"],
  },
  {
    icon: SexualIcon,
    title: "Sexual Health",
    points: ["test", "test", "test", "test", "test"],
  },
  {
    icon: GutIcon,
    title: "Gut and Stomach Health",
    points: ["test", "test", "test", "test", "test"],
  },
  {
    icon: InflammationIcon,
    title: "Inflammation and Immunity",
    points: ["test", "test", "test", "test", "test"],
  },
  {
    icon: HeartIcon,
    title: "Heart and Blood Flow",
    points: ["test", "test", "test", "test", "test"],
  },
  {
    icon: BladderIcon,
    title: "Bladder and Kidney Health",
    points: ["test", "test", "test", "test", "test"],
  },
];