import StepSymptoms from "./StepSymptoms";
import StepConditions from "./StepConditions";
import StepAllergies from "./StepAllergies";

export const stepConfig = [
  {
    id: "symptoms",
    title: "Tell Us About Your Current Health",
    description: "Help us provide personalized tips and insights based on your current health condition.",
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
