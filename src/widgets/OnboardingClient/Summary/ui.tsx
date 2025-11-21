import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { OnboardingClientLayout } from "../Layout";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { useOnboardClientMutation } from "entities/user";
import { Slider } from "shared/ui/slider";
import { toast } from "shared/lib";
import { Button, Input } from "shared/ui";

export const Summary = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const client = useSelector((state: RootState) => state.clientOnboarding);
  const token = useSelector((state: RootState) => state.user.token);

  // Edit mode tracking
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingSymptoms, setIsEditingSymptoms] = useState(false);

  // Local editable state
  const [personalState, setPersonalState] = useState({ ...client });
  const [symptomsState, setSymptomsState] = useState(
    client.symptoms_severity || {}
  );

  const [onboardClient] = useOnboardClientMutation();

  type FormState = RootState["clientOnboarding"];
  type FieldKey = keyof FormState;
  type AllowedValue = string | string[] | Record<string, number> | undefined;

  const severityLabels: Record<number, string> = {
    1: "Not at all",
    2: "Mild",
    3: "Moderate",
    4: "Extreme",
  };

  const normalizeValue = (
    value: unknown,
    original: unknown
  ): string | string[] | Record<string, number> | undefined => {
    if (Array.isArray(original)) {
      if (Array.isArray(value)) {
        return value.map((v) => String(v).trim()).filter(Boolean);
      }
      if (typeof value === "string") {
        return value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    }

    if (typeof original === "number") {
      if (typeof value === "number") return String(value);
      if (typeof value === "string") return value;
      return undefined;
    }

    if (typeof value === "string") return value;
    if (value == null) return undefined;

    return String(value);
  };

  const handleSave = (type: "personal" | "symptoms") => {
    if (type === "personal") {
      (Object.entries(personalState) as [FieldKey, unknown][]).forEach(
        ([key, value]) => {
          const prepared: AllowedValue = normalizeValue(
            value,
            (client as FormState)[key]
          );
          dispatch(setFormField({ field: key, value: prepared }));
        }
      );
      setIsEditingPersonal(false);
    }

    if (type === "symptoms") {
      dispatch(
        setFormField({
          field: "symptoms_severity",
          value: symptomsState,
        })
      );
      setIsEditingSymptoms(false);
    }
  };

  const personalFields: { label: string; key: keyof typeof client }[] = [
    { label: "Birth Date", key: "date_of_birth" },
    { label: "Cycle phase in Menopause Transition", key: "menopause_status" },
    { label: "Other conditions", key: "health_conditions" },
    { label: "Daily stress levels", key: "stress_levels" },
    { label: "Weekly to-go meal choice", key: "weekly_meal_choice" },
    { label: "Trusted person to rely on", key: "support_network" },
    { label: "Physical activity during the week", key: "physical_activity" },
    { label: "Sleep quality", key: "sleep_quality" },
    { label: "Daily hydration efforts", key: "hydration_levels" },
    { label: "Hoping to achieve with Tolu AI", key: "main_transition_goal" },
  ];

  const toInputString = (v: unknown): string => {
    if (v === null || v === undefined) return "";
    if (Array.isArray(v)) return v.join(", ");
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v);
  };

  const handleCreate = async () => {
    try {
      await onboardClient({ data: client, token: token ?? undefined }).unwrap();
      toast({
        title: "Onboarding successful",
      });
      nav("/library");
    } catch (err) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Error during onboarding",
        description: "Error during onboarding. Please try again",
      });
    }
  };

  const renderField = (
    label: string,
    key: keyof typeof client,
    editing: boolean
  ) => {
    const value = personalState[key];
    return (
      <div key={key} className="flex flex-col flex-1 gap-1">
        <p className="text-[#5F5F65] text-[12px] font-normal ">{label}</p>
        {editing ? (
          <Input
            name={key}
            value={toInputString(value)}
            onChange={(e) =>
              setPersonalState((prev) => ({ ...prev, [key]: e.target.value }))
            }
            className="text-[16px]  font-semibold border rounded px-2 py-1"
          />
        ) : (
          <h3 className="text-[#1D1D1F] text-[16px] font-semibold">
            {toInputString(value) || "-"}
          </h3>
        )}
      </div>
    );
  };

  const renderPairs = (
    fields: { label: string; key: keyof typeof client }[],
    editing: boolean
  ) => {
    const pairs = [];
    for (let i = 0; i < fields.length; i += 2) {
      const left = fields[i];
      const right = fields[i + 1];
      pairs.push(
        <div key={i} className="flex items-start self-stretch gap-4">
          {renderField(left.label, left.key, editing)}
          {right && renderField(right.label, right.key, editing)}
        </div>
      );
    }
    return pairs;
  };

  const symptomEntries = Object.entries(symptomsState);
  const symptomPairs = [];
  for (let i = 0; i < symptomEntries.length; i += 2) {
    const left = symptomEntries[i];
    const right = symptomEntries[i + 1];
    symptomPairs.push([left, right]);
  }

  const mainContent = (
    <>
      <div className="flex flex-col items-start gap-2">
        <h3 className=" text-[18px] font-bold text-[#1D1D1F]">
          Here’s a quick summary of what you shared.
        </h3>
        <p className="text-[#5F5F65] text-[16px] font-medium">
          We’ll use this to personalize your dashboard and recommendations.
        </p>
      </div>

      {/* Lifestyle skillset */}
      <div className="rounded-[16px] border border-[#DDEBF6] w-full flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#1D1D1F]  text-[18px] font-bold">
            Lifestyle skillset
          </h2>
          {!isEditingPersonal ? (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="cursor-pointer"
              onClick={() => setIsEditingPersonal(true)}
            >
              <MaterialIcon iconName="edit" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="text-[#1C63DB] text-sm"
                onClick={() => handleSave("personal")}
              >
                Save
              </Button>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="text-sm text-gray-500"
                onClick={() => {
                  setPersonalState({ ...client });
                  setIsEditingPersonal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
        {renderPairs(personalFields, isEditingPersonal)}
      </div>

      {/* Symptoms Section */}
      <div className="rounded-[16px] border border-[#DDEBF6] w-full flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between w-full">
          <h2 className="text-[#1D1D1F] text-[18px] font-bold">Symptoms</h2>
          {!isEditingSymptoms ? (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              className="cursor-pointer"
              onClick={() => setIsEditingSymptoms(true)}
            >
              <MaterialIcon iconName="edit" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="text-[#1C63DB] text-sm"
                onClick={() => handleSave("symptoms")}
              >
                Save
              </Button>
              <Button
                variant={"unstyled"}
                size={"unstyled"}
                className="text-sm text-gray-500"
                onClick={() => {
                  setSymptomsState(client.symptoms_severity || {});
                  setIsEditingSymptoms(false);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {symptomPairs.map(([left, right], idx) => (
          <div key={idx} className="flex items-start self-stretch gap-8">
            {left && (
              <div className="flex flex-col flex-1 gap-1">
                <p className="text-[#5F5F65] text-[12px] font-medium">
                  {left[0]}
                </p>
                {isEditingSymptoms ? (
                  <Slider
                    min={1}
                    max={4}
                    step={1}
                    value={[symptomsState[left[0]] || 1]}
                    onValueChange={(val) =>
                      setSymptomsState((prev) => ({
                        ...prev,
                        [left[0]]: val[0],
                      }))
                    }
                    colors={["#1C63DB", "#1C63DB", "#1C63DB", "#1C63DB"]}
                  />
                ) : (
                  <h3 className="text-[#1D1D1F] text-[16px] font-semibold">
                    {severityLabels[left[1] as number] || "-"}
                  </h3>
                )}
              </div>
            )}

            {right && (
              <div className="flex flex-col flex-1 gap-1">
                <p className="text-[#5F5F65] text-[12px] font-medium">
                  {right[0]}
                </p>
                {isEditingSymptoms ? (
                  <Slider
                    min={1}
                    max={4}
                    step={1}
                    value={[symptomsState[right[0]] || 1]}
                    onValueChange={(val) =>
                      setSymptomsState((prev) => ({
                        ...prev,
                        [right[0]]: val[0],
                      }))
                    }
                    colors={["#1C63DB", "#1C63DB", "#1C63DB", "#1C63DB"]}
                  />
                ) : (
                  <h3 className="text-[#1D1D1F] text-[16px] font-semibold">
                    {severityLabels[right[1] as number] || "-"}
                  </h3>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );

  const buttonsBlock = (
    <Button
      variant={"unstyled"}
      size={"unstyled"}
      onClick={handleCreate}
      className="p-4 w-full md:w-fit h-[44px] flex items-center justify-center rounded-full text-base font-semibold bg-[#1C63DB] text-white"
    >
      Go to My Dashboard
    </Button>
  );

  return (
    <OnboardingClientLayout
      currentStep={6}
      numberOfSteps={6}
      headerText="Summary Confirmation Page"
      children={mainContent}
      buttons={buttonsBlock}
    />
  );
};
