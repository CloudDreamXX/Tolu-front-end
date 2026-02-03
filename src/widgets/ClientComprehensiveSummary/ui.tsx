import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  HealthHistory,
  useGetCoachClientHealthHistoryQuery,
  useUpdateCoachClientHealthHistoryMutation,
} from "entities/health-history";

import { Steps } from "features/steps/ui";
import { Button, Dialog, DialogContent, DialogTitle, Form } from "shared/ui";

import {
  basicInfoSchema,
  BasicInfoStep,
} from "widgets/health-profile-form/ui/basic-info-step";
import {
  birthBodySchema,
  BirthBodyStep,
} from "widgets/health-profile-form/ui/birth-body-step";
import {
  bowelHealthSchema,
  BowelHealthStep,
} from "widgets/health-profile-form/ui/bowel-health-step";
import {
  healthConcernsSchema,
  HealthConcernsStep,
} from "widgets/health-profile-form/ui/health-concerns-step";
import {
  lifestyleHistorySchema,
  LifestyleHistoryStep,
} from "widgets/health-profile-form/ui/lifestyle-history-step";
import {
  medicalHistorySchema,
  MedicalHistoryStep,
} from "widgets/health-profile-form/ui/medical-history-step";
import {
  mentalHealthSchema,
  MentalHealthStatusStep,
} from "widgets/health-profile-form/ui/mental-health-step";
import {
  oralHealthSchema,
  OralHealthHistoryStep,
} from "widgets/health-profile-form/ui/oral-health-step";
import {
  otherInfoSchema,
  OtherStep,
} from "widgets/health-profile-form/ui/other-info-step";
import {
  sexualHistorySchema,
  SexualHistoryStep,
} from "widgets/health-profile-form/ui/sexual-history-step";
import {
  sleepHistorySchema,
  SleepHistoryStep,
} from "widgets/health-profile-form/ui/sleep-history-step";
import {
  stressfulEventsSchema,
  StressfulEventsStep,
} from "widgets/health-profile-form/ui/stressful-events-step";
import {
  womensHealthSchema,
  WomensHealthStep,
} from "widgets/health-profile-form/ui/womens-health-step";

import {
  mapHealthHistoryToFormDefaults,
  prune,
} from "widgets/health-profile-form/ui/lib";
import { HealthHistorySummary } from "widgets/HealthHistorySummary/ui";

const steps = [
  "Basic Info",
  "Birth & Body",
  "Health Concerns",
  "Bowel Health",
  "Stressful Events",
  "Medical History",
  "Oral Health",
  "Lifestyle History",
  "Sleep History",
  "Women’s Health",
  "Sexual History",
  "Mental Health",
  "Other",
];

export const formSchema = basicInfoSchema
  .and(birthBodySchema)
  .and(healthConcernsSchema)
  .and(bowelHealthSchema)
  .and(stressfulEventsSchema)
  .and(medicalHistorySchema)
  .and(oralHealthSchema)
  .and(lifestyleHistorySchema)
  .and(sleepHistorySchema)
  .and(womensHealthSchema)
  .and(sexualHistorySchema)
  .and(mentalHealthSchema)
  .and(otherInfoSchema);

type FormValues = z.infer<typeof formSchema>;

type Props = {
  clientId: string;
  asDialog?: boolean;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
};

export const ClientComprehensiveSummary = ({
  clientId,
  asDialog = false,
  open = true,
  onOpenChange,
}: Props) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [viewMode, setViewMode] = useState<"summary" | "edit">("summary");

  const {
    data: healthHistoryData,
    refetch,
    isLoading,
    isError,
  } = useGetCoachClientHealthHistoryQuery(clientId);

  const [updateHealthHistory] = useUpdateCoachClientHealthHistoryMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    shouldUnregister: false,
    defaultValues: mapHealthHistoryToFormDefaults(healthHistoryData),
  });

  useEffect(() => {
    if (healthHistoryData) {
      form.reset(mapHealthHistoryToFormDefaults(healthHistoryData));
    }
  }, [healthHistoryData]);

  const stepFields: Array<(keyof FormValues)[]> = [
    ["email", "fullName"],
    [
      "age",
      "birthDate",
      "genderAtBirth",
      "chosenGenderAfterBirth",
      "breastfedOrBottle",
      "birthDeliveryMethod",
      "height",
      "bloodType",
      "currentWeightLbs",
      "idealWeightLbs",
      "weightOneYearAgoLbs",
      "birthWeightLbs",
      "birthOrderSiblings",
      "familyLivingSituation",
      "partnerGenderAtBirth",
      "partnerChosenGender",
      "children",
      "exerciseRecreation",
    ],
    [
      "mainHealthConcerns",
      "whenFirstExperienced",
      "howDealtWithConcerns",
      "successWithApproaches",
      "otherHealthPractitioners",
      "surgicalProcedures",
      "antibioticsInfancyChildhood",
      "antibioticsTeen",
      "antibioticsAdult",
      "currentMedications",
      "currentSupplements",
      "familySimilarProblems",
      "foodsAvoidSymptoms",
      "immediateSymptomsAfterEating",
      "delayedSymptomsAfterEating",
      "foodCravings",
      "dietAtOnset",
      "knownFoodAllergies",
      "regularFoodConsumption",
      "specialDiet",
      "homeCookedPercentage",
      "dietRelationshipNotes",
    ],
    [
      "bowelMovementFrequency",
      "bowelMovementConsistency",
      "bowelMovementColor",
      "intestinalGas",
      "foodPoisoningHistory",
    ],
    [
      "traumaDeathFamily",
      "traumaDeathAccident",
      "traumaSexualPhysicalAbuse",
      "traumaEmotionalNeglect",
      "traumaDiscrimination",
      "traumaLifeThreateningAccident",
      "traumaLifeThreateningIllness",
      "traumaRobberyMugging",
      "traumaWitnessViolence",
      "livedTraveledOutsideUs",
      "recentMajorLifeChanges",
      "workSchoolTimeOff",
      "traumaAdditionalNotes",
    ],
    [
      "conditionIbs",
      "conditionCrohns",
      "conditionUlcerativeColitis",
      "conditionGastritisUlcer",
      "conditionGerd",
      "conditionCeliac",
      "gastrointestinalDates",
      "chemicalToxicExposure",
      "odorSensitivity",
      "secondhandSmokeExposure",
      "moldExposure",
      "otherConditionsSymptoms",
      "freqMemoryImpairment",
      "freqShortenedFocus",
      "freqCoordinationBalance",
      "freqLackInhibition",
      "freqPoorOrganization",
      "freqTimeManagement",
      "freqMoodInstability",
      "freqSpeechWordFinding",
      "freqBrainFog",
      "freqLowerEffectiveness",
      "freqJudgmentProblems",
    ],
    ["lastDentistVisit", "oralDentalRegimen"],
    ["junkFoodBingeDieting", "substanceUseHistory", "stressHandling"],
    [
      "satisfiedWithSleep",
      "stayAwakeAllDay",
      "asleep2am4am",
      "fallAsleepUnder30min",
      "sleep6to8Hours",
    ],
    ["ageFirstPeriod", "mensesPmsPain", "birthControlPills"],
    ["sexualFunctioningConcerns", "sexualPartnersPastYear"],
    ["generalMoods", "energyLevelScale"],
    ["healthGoalsAspirations", "whyAchieveGoals"],
  ];

  const savePartial = async () => {
    const payload = prune(form.getValues()) as Partial<HealthHistory>;
    await updateHealthHistory({
      clientId,
      data: { health_history: payload },
    }).unwrap();
    await refetch();
  };

  const goToStep = async (nextStep: number) => {
    const valid = await form.trigger(stepFields[currentStep] as any);
    if (!valid) return;

    await savePartial();
    setCurrentStep(nextStep);
  };

  const handleCancelEdit = () => {
    form.reset(mapHealthHistoryToFormDefaults(healthHistoryData));
    setCurrentStep(0);
    setViewMode("summary");
  };

  const handleSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    await savePartial();
    setCurrentStep(0);
    onOpenChange?.(false);
  };

  if (isLoading) {
    return <div>Loading…</div>;
  }

  if (isError) {
    return <div>Unable to load health history</div>;
  }

  const content =
    viewMode === "summary" ? (
      <div className="overflow-y-auto max-h-[calc(100vh-130px)]">
        <HealthHistorySummary
          data={healthHistoryData!}
          onEditSection={(step) => {
            setCurrentStep(step);
            setViewMode("edit");
          }}
          clientId={clientId}
        />
      </div>
    ) : (
      <>
        <Steps
          steps={steps}
          currentStep={currentStep}
          ordered
          onStepClick={goToStep}
        />

        <div className="flex-1 overflow-y-auto max-h-[65vh]">
          <Form {...form}>
            {currentStep === 0 && <BasicInfoStep form={form} />}
            {currentStep === 1 && <BirthBodyStep form={form} />}
            {currentStep === 2 && <HealthConcernsStep form={form} />}
            {currentStep === 3 && <BowelHealthStep form={form} />}
            {currentStep === 4 && <StressfulEventsStep form={form} />}
            {currentStep === 5 && <MedicalHistoryStep form={form} />}
            {currentStep === 6 && <OralHealthHistoryStep form={form} />}
            {currentStep === 7 && <LifestyleHistoryStep form={form} />}
            {currentStep === 8 && <SleepHistoryStep form={form} />}
            {currentStep === 9 && <WomensHealthStep form={form} />}
            {currentStep === 10 && <SexualHistoryStep form={form} />}
            {currentStep === 11 && <MentalHealthStatusStep form={form} />}
            {currentStep === 12 && <OtherStep form={form} />}
          </Form>
        </div>

        <div className="flex justify-between gap-4">
          <Button variant="light-blue" onClick={handleCancelEdit}>
            Cancel
          </Button>

          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button variant="blue2" onClick={() => goToStep(currentStep - 1)}>
                Back
              </Button>
            )}

            <Button
              variant="brightblue"
              onClick={
                currentStep === steps.length - 1
                  ? handleSubmit
                  : () => goToStep(currentStep + 1)
              }
            >
              {currentStep === steps.length - 1 ? "Save" : "Next"}
            </Button>
          </div>
        </div>
      </>
    );

  if (!asDialog) {
    return <div className="space-y-6">{content}</div>;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-3xl max-h-[90vh] flex flex-col gap-6">
        <DialogTitle>Client Health History</DialogTitle>
        {content}
      </DialogContent>
    </Dialog>
  );
};
