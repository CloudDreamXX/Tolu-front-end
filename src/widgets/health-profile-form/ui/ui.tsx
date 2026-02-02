import { zodResolver } from "@hookform/resolvers/zod";
import {
  HealthHistoryPostData,
  useCreateHealthHistoryMutation,
  useGetUserHealthHistoryQuery,
} from "entities/health-history";
import { Steps } from "features/steps/ui";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Form,
} from "shared/ui";
import * as z from "zod";
import { prune, mapHealthHistoryToFormDefaults } from "./lib";
import { usePageWidth } from "shared/lib";
import { ConfirmCancelModal } from "widgets/ConfirmCancelModal";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { setHealthHistory } from "entities/health-history/lib";
import { useDispatch } from "react-redux";

import { stressfulEventsSchema, StressfulEventsStep } from "./stressful-events-step";
import { medicalHistorySchema, MedicalHistoryStep } from "./medical-history-step";
import { oralHealthSchema, OralHealthHistoryStep } from "./oral-health-step";
import { lifestyleHistorySchema, LifestyleHistoryStep } from "./lifestyle-history-step";
import { sleepHistorySchema, SleepHistoryStep } from "./sleep-history-step";
import { womensHealthSchema, WomensHealthStep } from "./womens-health-step";
import { sexualHistorySchema, SexualHistoryStep } from "./sexual-history-step";
import { mentalHealthSchema, MentalHealthStatusStep } from "./mental-health-step";
import { otherInfoSchema, OtherStep } from "./other-info-step";

const steps = [
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

export const formSchema = stressfulEventsSchema
  .and(medicalHistorySchema)
  .and(oralHealthSchema)
  .and(lifestyleHistorySchema)
  .and(sleepHistorySchema)
  .and(womensHealthSchema)
  .and(sexualHistorySchema)
  .and(mentalHealthSchema)
  .and(otherInfoSchema);

type FormValues = z.infer<typeof formSchema>;

export const HealthProfileForm = () => {
  const { isMobile } = usePageWidth();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
    ["stressfulEvents", "timeOffWork", "livedOutsideUS"],
    ["conditions", "conditionDates", "other_conditions_symptoms"],
    ["last_dentist_visit", "oral_dental_regimen"],
    ["junk_food_binge_dieting", "substance_use_history", "stress_handling"],
    [
      "satisfied_with_sleep",
      "stay_awake_all_day",
      "asleep_2am_4am",
      "fall_asleep_under_30min",
      "sleep_6_8_hours",
    ],
    [
      "age_first_period",
      "menses_pms_pain",
      "birth_control_pills",
    ],
    ["sexual_functioning_concerns", "sexual_partners_past_year"],
    ["general_moods", "energy_level_scale"],
    ["health_goals_aspirations", "why_achieve_goals"],
  ];

  const submitHealthHistory = async (
    values: FormValues,
    { partial = false }: { partial?: boolean } = {}
  ) => {
    const payload = prune(values) as Partial<HealthHistoryPostData>;

    await createHealthHistory({
      healthData: payload,
    }).unwrap();

    refetch();
    if (healthHistoryData) {
      dispatch(setHealthHistory(healthHistoryData));
    }

    if (!partial) {
      setCurrentStep(0);
    }
  };

  const goToStep = async (nextStep: number) => {
    if (nextStep === currentStep) return;

    const valid = await form.trigger(stepFields[currentStep] as any);
    if (!valid) return;

    await submitHealthHistory(form.getValues(), { partial: true });
    setCurrentStep(nextStep);
  };

  const handleSubmit = async () => {
    const valid = await form.trigger();
    if (!valid) return;
    await submitHealthHistory(form.getValues(), { partial: false });
  };

  const onDiscard = () => {
    setConfirmOpen(false);
    setIsOpen(false);
    setCurrentStep(0);
    form.reset(mapHealthHistoryToFormDefaults(healthHistoryData));
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setCurrentStep(0);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="brightblue"
          size={isMobile ? "sm" : "icon"}
          className="rounded-full"
        >
          {isMobile ? "Health profile" : <MaterialIcon iconName="manage_accounts" />}
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-3xl max-h-[90vh] flex flex-col gap-6">
        <DialogTitle>Your Health History</DialogTitle>

        <Steps
          steps={steps}
          currentStep={currentStep}
          ordered
          onStepClick={goToStep}
        />

        <div className="flex-1 overflow-y-auto">
          <Form {...form}>
            {currentStep === 0 && <StressfulEventsStep form={form} />}
            {currentStep === 1 && <MedicalHistoryStep form={form} />}
            {currentStep === 2 && <OralHealthHistoryStep form={form} />}
            {currentStep === 3 && <LifestyleHistoryStep form={form} />}
            {currentStep === 4 && <SleepHistoryStep form={form} />}
            {currentStep === 5 && <WomensHealthStep form={form} />}
            {currentStep === 6 && <SexualHistoryStep form={form} />}
            {currentStep === 7 && <MentalHealthStatusStep form={form} />}
            {currentStep === 8 && <OtherStep form={form} />}
          </Form>
        </div>

        <div className="flex justify-between gap-4">
          <Button
            variant="blue2"
            onClick={() => setConfirmOpen(true)}
          >
            Cancel
          </Button>

          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button
                variant="light-blue"
                onClick={() => goToStep(currentStep - 1)}
              >
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
              {currentStep === steps.length - 1 ? "Submit" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>

      {confirmOpen && (
        <ConfirmCancelModal
          title="Leave health history?"
          description="Your progress has been saved. You can return anytime."
          onCancel={() => setConfirmOpen(false)}
          onDiscard={onDiscard} backTitle={""} continueTitle={""}        />
      )}
    </Dialog>
  );
};
