import { UserCircleGearIcon } from "@phosphor-icons/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Steps } from "features/steps/ui";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Form,
} from "shared/ui";
import {
  BasicInformationForm,
  basicInformationSchema,
} from "./basic-information-form";
import {
  HealthStatusHistoryForm,
  healthStatusHistorySchema,
} from "./health-status-history-form";
import {
  LifestyleHabitsForm,
  lifestyleHabitsSchema,
} from "./lifestyle-habits-form";

const steps = [
  "Basic Information",
  "Health Status & History",
  "Lifestyle & Habits",
  "Nutrition Habits",
  "Women’s Health",
  "Metabolic & Digestive Health",
  "Drives and Goals",
  "Consent & Submission",
];

const baseFormSchema = basicInformationSchema
  .merge(healthStatusHistorySchema)
  .merge(lifestyleHabitsSchema);

const formSchema = baseFormSchema
  .refine(
    (data) => {
      if (data.medications === "other") {
        return data.otherMedications && data.otherMedications.length > 0;
      }
      return true;
    },
    {
      message: "Please specify your other medications.",
      path: ["otherMedications"],
    }
  )
  .refine(
    (data) => {
      if (data.exerciseHabits === "other") {
        return data.otherExerciseHabits && data.otherExerciseHabits.length > 0;
      }
      return true;
    },
    {
      message: "Please specify your other exercise habits.",
      path: ["otherExerciseHabits"],
    }
  );

export const HealthProfileForm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: "",
      gender: undefined,
      height: "",
      weight: "",
      healthConcerns: "Fatigue",
      medicalConditions: "None",
      medications: "None",
      otherMedications: "",
      supplements: "None",
      allergies: "None",
      familyHistory: "None",
      diet: "None",
      exerciseHabits: undefined,
      otherExerciseHabits: "",
      sleepQuality: 1,
      stressLevels: 1,
      energyLevels: 2,
    },
  });

  const handleNextStep = async () => {
    const stepFields = [
      ["age", "gender", "height", "weight"],
      [
        "healthConcerns",
        "medicalConditions",
        "medications",
        "otherMedications",
        "supplements",
        "allergies",
        "familyHistory",
      ],
      [
        "diet",
        "exerciseHabits",
        "otherExerciseHabits",
        "sleepQuality",
        "stressLevels",
        "energyLevels",
      ],
    ];

    let isValid = false;
    if (currentStep < stepFields.length) {
      isValid = await form.trigger(stepFields[currentStep] as any);
    } else {
      isValid = true; // For other steps without forms yet
    }

    if (!isValid) {
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 p-1 pr-4 text-sm font-medium text-blue-700 bg-blue-100 rounded-full hover:bg-blue-200">
          <div className="flex items-center justify-center border border-white rounded-full h-9 w-9">
            <UserCircleGearIcon size={24} />
          </div>
          My health profile 0/7
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl gap-6 max-h-[80vh] overflow-y-auto">
        <DialogTitle>Your Health Status Now</DialogTitle>
        <Steps steps={steps} currentStep={currentStep} ordered />
        <Form {...form}>
          {currentStep === 0 && <BasicInformationForm form={form} />}
          {currentStep === 1 && <HealthStatusHistoryForm form={form} />}
          {currentStep === 2 && <LifestyleHabitsForm form={form} />}
        </Form>
        <div className="flex flex-row justify-between w-full">
          <Button
            variant="blue2"
            className="w-32"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <div className="flex flex-row gap-4">
            {currentStep > 0 && (
              <Button
                variant="light-blue"
                className="w-32 bg-white"
                onClick={handlePreviousStep}
              >
                Back
              </Button>
            )}
            <Button
              variant="brightblue"
              className="w-32"
              onClick={handleNextStep}
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
