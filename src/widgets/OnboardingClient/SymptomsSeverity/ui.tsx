import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { RootState } from "entities/store";
import { useOnboardClientMutation } from "entities/user";
import { OnboardingClientLayout } from "../Layout";
import { Slider } from "shared/ui/slider";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button } from "shared/ui";

const SYMPTOMS = [
  "Hot Flashes",
  "Lightheaded Feelings",
  "Headaches",
  "Irritability",
  "Depression",
  "Unloved Feelings",
  "Anxiety",
  "Mood Changes",
  "Sleeplessness",
  "Unusual Tiredness",
  "Backache",
  "Joint Pain",
  "Muscle Pain",
  "New Facial Hair",
  "Dry Skin",
  "Crawling Feelings Under the Skin",
  "Less Sexual Feelings",
  "Dry Vagina",
  "Uncomfortable Intercourse",
  "Urinary Frequency",
];

const severityLabels = ["Not at all", "Mild", "Moderate", "Extreme"];

export const SymptomsSeverity = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.user.token);
  const clientOnboarding = useSelector(
    (state: RootState) => state.clientOnboarding
  );

  const steps = Array.from({ length: 5 }, (_, i) =>
    SYMPTOMS.slice(i * 4, i * 4 + 4)
  );

  const [currentStep, setCurrentStep] = useState(0);

  const [ratings, setRatings] = useState<Record<string, number>>(
    SYMPTOMS.reduce(
      (acc, symptom) => {
        acc[symptom] = clientOnboarding.symptoms_severity?.[symptom] || 1;
        return acc;
      },
      {} as Record<string, number>
    )
  );

  const [onboardClient, { isLoading }] = useOnboardClientMutation();

  const handleSliderChange = (symptom: string, value: number[]) => {
    setRatings((prev) => ({
      ...prev,
      [symptom]: value[0],
    }));
  };

  const handleContinue = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      const normalizedRatings = Object.fromEntries(
        Object.entries(ratings).map(([symptom, value]) => [
          symptom,
          value === 0 ? 1 : value,
        ])
      );

      dispatch(
        setFormField({
          field: "symptoms_severity",
          value: normalizedRatings,
        })
      );

      await onboardClient({
        data: { ...clientOnboarding, symptoms_severity: normalizedRatings },
        token: token ?? undefined,
      });

      nav("/summary");
    }
  };

  const hintBlock = (
    <div className="flex gap-4 p-4 items-center rounded-2xl bg-[#DDEBF6] w-full lg:max-w-[718px]">
      <MaterialIcon
        iconName="info"
        size={32}
        className="text-[#1C63DB]"
        fill={1}
      />
      <p className="text-[#1B2559] text-base font-normal">
        Your information is kept private and secure. It helps me provide
        smarter, more relevant support. Visit our website for the complete{" "}
        <a
          className="text-[#1C63DB] underline"
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.tolu.health/privacy-policy"
        >
          Data Privacy Policy
        </a>
      </p>
    </div>
  );

  return (
    <OnboardingClientLayout
      currentStep={currentStep}
      numberOfSteps={steps.length}
      headerText="Let’s check on your symptoms."
      children={
        <div className="flex flex-col w-full gap-8">
          <h3 className="text-[18px] font-bold text-[#1D1D1F]">
            Rate the severity of your symptoms.
          </h3>

          {steps[currentStep].map((symptom) => (
            <div key={symptom} className="flex flex-col gap-2">
              <label className="font-semibold text-[14px] text-[#1D1D1F]">
                {symptom}
              </label>
              <Slider
                min={0}
                max={4}
                step={1}
                value={[ratings[symptom] || 1]}
                onValueChange={(val) => handleSliderChange(symptom, val)}
                colors={["#1C63DB", "#1C63DB", "#1C63DB", "#1C63DB"]}
              />
              <div className="flex justify-around text-xs text-[#1D1D1F]">
                {severityLabels.map((label) => (
                  <span key={label}>{label}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      }
      buttons={
        <>
          {hintBlock}
          <div className="w-full lg:max-w-[718px]">
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={handleContinue}
              className={
                "p-4 w-full md:w-[128px] h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#1C63DB] text-white ml-auto"
              }
            >
              Continue
            </Button>
          </div>
        </>
      }
    />
  );
};
