import { zodResolver } from "@hookform/resolvers/zod";
import {
  HealthHistory,
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
import {
  prune,
  mapHealthHistoryToFormDefaults,
  mapFormValuesToHealthHistoryPayload,
} from "./lib";
import { usePageWidth } from "shared/lib";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { setHealthHistory } from "entities/health-history/lib";
import { useDispatch } from "react-redux";

import {
  stressfulEventsSchema,
  StressfulEventsStep,
} from "./stressful-events-step";
import {
  medicalHistorySchema,
  MedicalHistoryStep,
} from "./medical-history-step";
import { oralHealthSchema, OralHealthHistoryStep } from "./oral-health-step";
import {
  lifestyleHistorySchema,
  LifestyleHistoryStep,
} from "./lifestyle-history-step";
import { sleepHistorySchema, SleepHistoryStep } from "./sleep-history-step";
import { womensHealthSchema, WomensHealthStep } from "./womens-health-step";
import { sexualHistorySchema, SexualHistoryStep } from "./sexual-history-step";
import {
  mentalHealthSchema,
  MentalHealthStatusStep,
} from "./mental-health-step";
import { otherInfoSchema, OtherStep } from "./other-info-step";
import { basicInfoSchema, BasicInfoStep } from "./basic-info-step";
import { birthBodySchema, BirthBodyStep } from "./birth-body-step";
import {
  healthConcernsSchema,
  HealthConcernsStep,
} from "./health-concerns-step";
import { bowelHealthSchema, BowelHealthStep } from "./bowel-health-step";
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

// export const formSchema = basicInfoSchema
//   .and(birthBodySchema)
//   .and(healthConcernsSchema)
//   .and(bowelHealthSchema)
//   .and(stressfulEventsSchema)
//   .and(medicalHistorySchema)
//   .and(oralHealthSchema)
//   .and(lifestyleHistorySchema)
//   .and(sleepHistorySchema)
//   .and(womensHealthSchema)
//   .and(sexualHistorySchema)
//   .and(mentalHealthSchema)
//   .and(otherInfoSchema);

// type FormValues = z.infer<typeof formSchema>;

export const HealthProfileForm = () => {
  const { isMobile } = usePageWidth();
  const dispatch = useDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const [isSummary, setIsSummary] = useState(true);

  const { data: healthHistoryData, refetch } = useGetUserHealthHistoryQuery();

  const [createHealthHistory] = useCreateHealthHistoryMutation();

  type FormValues = Record<string, any>;

  const form = useForm<FormValues>({
    shouldUnregister: false,
    defaultValues: mapHealthHistoryToFormDefaults(healthHistoryData),
  });

  useEffect(() => {
    if (healthHistoryData) {
      form.reset(mapHealthHistoryToFormDefaults(healthHistoryData));
    }
  }, [healthHistoryData]);

  const submitHealthHistory = async (
    values: FormValues,
    { partial = false }: { partial?: boolean } = {}
  ) => {
    const payload = prune(values) as Partial<HealthHistory>;

    await createHealthHistory({
      healthData: mapFormValuesToHealthHistoryPayload(payload),
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

    await submitHealthHistory(form.getValues(), { partial: true });
    setCurrentStep(nextStep);
  };

  const handleSubmit = async () => {
    await submitHealthHistory(form.getValues(), { partial: false });
    setIsSummary(true);
  };

  const onDiscard = () => {
    setCurrentStep(0);
    setIsSummary(true);
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
          className="rounded-full h-[56px] w-[56px] flex items-center justify-center"
        >
          {isMobile ? (
            "Health profile"
          ) : (
            <MaterialIcon iconName="manage_accounts" />
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="md:max-w-3xl max-h-[90vh] flex flex-col gap-6 overflow-y-auto">
        <DialogTitle>Your Health History</DialogTitle>

        {!isSummary && (
          <Steps
            steps={steps}
            currentStep={currentStep}
            ordered
            onStepClick={goToStep}
          />
        )}

        <div className="flex-1">
          {isSummary ? (
            <HealthHistorySummary
              data={healthHistoryData!}
              onEditSection={(step) => {
                setCurrentStep(step);
                setIsSummary(false);
              }}
            />
          ) : (
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
          )}
        </div>

        <div className="flex justify-between gap-4">
          <Button
            type="button"
            variant="blue2"
            onClick={isSummary ? () => setIsOpen(false) : onDiscard}
          >
            {isSummary ? "Close" : "Cancel"}
          </Button>

          <div className="flex gap-4">
            {!isSummary && currentStep > 0 && (
              <Button
                type="button"
                variant="light-blue"
                onClick={() => goToStep(currentStep - 1)}
              >
                Back
              </Button>
            )}

            <Button
              type="button"
              variant="brightblue"
              onClick={
                isSummary
                  ? () => {
                    setIsSummary(false);
                    setCurrentStep(0);
                  }
                  : currentStep === steps.length - 1
                    ? handleSubmit
                    : () => goToStep(currentStep + 1)
              }
            >
              {isSummary
                ? "Edit"
                : currentStep === steps.length - 1
                  ? "Submit"
                  : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
