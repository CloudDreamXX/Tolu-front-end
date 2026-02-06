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
  mapFormValuesToHealthHistoryPayload,
  mapHealthHistoryToFormDefaults,
  prune,
} from "widgets/health-profile-form/ui/lib";
import { HealthHistorySummary } from "widgets/HealthHistorySummary/ui";

const steps = [
  // "Basic Info",
  "Birth & Body",
  "History",
  "Health Concerns",
  "Intestinal Status",
  "Medical Status",
  "Oral Health History",
  "Lifestyle History",
  "Sleep History",
  "For Woman only",
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

  const savePartial = async () => {
    const payload = prune(form.getValues()) as Partial<HealthHistory>;
    await updateHealthHistory({
      clientId,
      data: mapFormValuesToHealthHistoryPayload(payload),
    }).unwrap();
    await refetch();
  };

  const goToStep = async (nextStep: number) => {
    await savePartial();
    setCurrentStep(nextStep);
  };

  const handleCancelEdit = () => {
    form.reset(mapHealthHistoryToFormDefaults(healthHistoryData));
    setCurrentStep(0);
    setViewMode("summary");
  };

  const handleSubmit = async () => {
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
            {/* {currentStep === 0 && <BasicInfoStep form={form} />} */}
            {currentStep === 0 && <BirthBodyStep form={form} />}
            {currentStep === 1 && <StressfulEventsStep form={form} />}
            {currentStep === 2 && <HealthConcernsStep form={form} />}
            {currentStep === 3 && <BowelHealthStep form={form} />}
            {currentStep === 4 && <MedicalHistoryStep form={form} />}
            {currentStep === 5 && <OralHealthHistoryStep form={form} />}
            {currentStep === 6 && <LifestyleHistoryStep form={form} />}
            {currentStep === 7 && <SleepHistoryStep form={form} />}
            {currentStep === 8 && <WomensHealthStep form={form} />}
            {currentStep === 9 && <SexualHistoryStep form={form} />}
            {currentStep === 10 && <MentalHealthStatusStep form={form} />}
            {currentStep === 11 && <OtherStep form={form} />}
          </Form>
        </div>

        <div className="flex justify-between gap-4">
          <Button type="button" variant="light-blue" onClick={handleCancelEdit}>
            Cancel
          </Button>

          <div className="flex gap-4">
            {currentStep > 0 && (
              <Button
                type="button"
                variant="blue2"
                onClick={() => goToStep(currentStep - 1)}
              >
                Back
              </Button>
            )}

            <Button
              variant="brightblue"
              type="button"
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
