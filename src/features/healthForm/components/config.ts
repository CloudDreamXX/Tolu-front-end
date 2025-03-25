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
    points: ["test1", "test2", "test3", "test4", "test5"],
  },
  {
    icon: HormoneIcon,
    title: "Hormone Balance and Energy",
    points: ["test6", "test7", "test8", "test9", "test10"],
  },
  {
    icon: SexualIcon,
    title: "Sexual Health",
    points: ["test11", "test12", "test13", "test14", "test15"],
  },
  {
    icon: GutIcon,
    title: "Gut and Stomach Health",
    points: ["test16", "test17", "test18", "test19", "test20"],
  },
  {
    icon: InflammationIcon,
    title: "Inflammation and Immunity",
    points: ["test21", "test22", "test23", "test24", "test25"],
  },
  {
    icon: HeartIcon,
    title: "Heart and Blood Flow",
    points: ["test26", "test27", "test28", "test29", "test30"],
  },
  {
    icon: BladderIcon,
    title: "Bladder and Kidney Health",
    points: ["test31", "test32", "test33", "test34", "test35"],
  },
];

export const allergiesOptions = ["Pollen", "Nuts", "Dairy", "Gluten", "Seafood"];