import { zodResolver } from "@hookform/resolvers/zod";
import {
  HealthHistory,
  useCreateHealthHistoryMutation,
  useGetUserHealthHistoryQuery,
} from "entities/health-history";
import { Steps } from "features/steps/ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "shared/ui";
import * as z from "zod";
import { useNavigate } from "react-router";
import { OnboardingClientLayout } from "../Layout";
import { basicInfoSchema, BasicInfoStep } from "widgets/health-profile-form/ui/basic-info-step";
import { birthBodySchema, BirthBodyStep } from "widgets/health-profile-form/ui/birth-body-step";
import { bowelHealthSchema, BowelHealthStep } from "widgets/health-profile-form/ui/bowel-health-step";
import { healthConcernsSchema, HealthConcernsStep } from "widgets/health-profile-form/ui/health-concerns-step";
import { mapHealthHistoryToFormDefaults, prune } from "widgets/health-profile-form/ui/lib";
import { lifestyleHistorySchema, LifestyleHistoryStep } from "widgets/health-profile-form/ui/lifestyle-history-step";
import { medicalHistorySchema, MedicalHistoryStep } from "widgets/health-profile-form/ui/medical-history-step";
import { mentalHealthSchema, MentalHealthStatusStep } from "widgets/health-profile-form/ui/mental-health-step";
import { oralHealthSchema, OralHealthHistoryStep } from "widgets/health-profile-form/ui/oral-health-step";
import { otherInfoSchema, OtherStep } from "widgets/health-profile-form/ui/other-info-step";
import { sexualHistorySchema, SexualHistoryStep } from "widgets/health-profile-form/ui/sexual-history-step";
import { sleepHistorySchema, SleepHistoryStep } from "widgets/health-profile-form/ui/sleep-history-step";
import { stressfulEventsSchema, StressfulEventsStep } from "widgets/health-profile-form/ui/stressful-events-step";
import { womensHealthSchema, WomensHealthStep } from "widgets/health-profile-form/ui/womens-health-step";

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

export const formSchema =
  basicInfoSchema
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

export const DemographicStep = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const { data: healthHistoryData, refetch } =
    useGetUserHealthHistoryQuery();

  const [createHealthHistory] = useCreateHealthHistoryMutation();

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

  const saveStep = async (partial = true) => {
    const payload = prune(form.getValues()) as Partial<HealthHistory>;
    await createHealthHistory({ healthData: payload }).unwrap();
    await refetch();
  };

  const goNext = async () => {
    const valid = await form.trigger(stepFields[currentStep] as any);
    if (!valid) return;

    await saveStep(true);
    setCurrentStep((s) => s + 1);
  };

  const submitFinal = async () => {
    const valid = await form.trigger();
    if (!valid) return;

    await saveStep(false);
    navigate("/symptoms-severity");
  };

  return (
    <OnboardingClientLayout
      currentStep={0}
      numberOfSteps={0}
      headerText=" "
      title={
        <div className="flex flex-col gap-4">
          <h1 className="text-[#1D1D1F] text-[24px] text-center">
            A few questions to rate your lifestyle skillset & tailor your <br />
            support.
          </h1>
        </div>
      }
      children={
        <div className="flex flex-col gap-6 w-full">
          <Steps
            steps={steps}
            currentStep={currentStep}
            ordered
            onStepClick={setCurrentStep}
          />

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

          <div className="flex justify-between mt-6">
            <Button
              variant="light-blue"
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((s) => s - 1)}
            >
              Back
            </Button>

            <Button
              variant="brightblue"
              onClick={
                currentStep === steps.length - 1 ? submitFinal : goNext
              }
            >
              {currentStep === steps.length - 1 ? "Continue" : "Next"}
            </Button>
          </div>
        </div>
      }
    />
  );
};
