import { batch, useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { Button, Input, Slider } from "shared/ui";
import { useOnboardClientMutation } from "entities/user/api";

type FormState = Record<string, string>;
type FieldKey = keyof RootState["clientOnboarding"];

export const OnboardingInfo = ({
  embedded = false,
}: {
  embedded?: boolean;
}) => {
  const dispatch = useDispatch();
  const client = useSelector((s: RootState) => s.clientOnboarding);
  const token = useSelector((s: RootState) => s.user.token);

  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingSymptoms, setIsEditingSymptoms] = useState(false);

  const [formState, setFormState] = useState<FormState>({});
  const [symptomsState, setSymptomsState] = useState<Record<string, number>>(
    client.symptoms_severity || {}
  );

  const [onboardClient] = useOnboardClientMutation();

  useEffect(() => {
    if (!isEditingPersonal) {
      const next: FormState = {};
      for (const [key, val] of Object.entries(client)) {
        if (key === "symptoms_severity") continue;
        next[key] = toInputString(val);
      }
      setFormState(next);
    }
  }, [client, isEditingPersonal]);

  useEffect(() => {
    if (!isEditingSymptoms) setSymptomsState(client.symptoms_severity || {});
  }, [client, isEditingSymptoms]);

  const personalFields: { label: string; key: FieldKey }[] = [
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

  const symptoms = client.symptoms_severity || {};
  const severityLabels: Record<number, string> = {
    1: "Not at all",
    2: "Mild",
    3: "Moderate",
    4: "Extreme",
  };

  const allKeys = useMemo(() => {
    const symptomKeys = Object.keys(symptoms) as FieldKey[];
    return [...personalFields.map((f) => f.key), ...symptomKeys];
  }, [personalFields, symptoms]);

  const percentage = useMemo(() => {
    const src = isEditingPersonal ? formState : client;

    const isFilled = (v: unknown): boolean => {
      if (Array.isArray(v)) return v.filter((x) => String(x).trim()).length > 0;
      if (v instanceof Date) return !Number.isNaN(v.getTime());
      if (typeof v === "number") return Number.isFinite(v);
      if (typeof v === "string") return v.trim().length > 0;
      return v != null && String(v).trim().length > 0;
    };

    const filled = allKeys.reduce((acc, key) => {
      const value =
        key in (client.symptoms_severity || {})
          ? isEditingSymptoms
            ? symptomsState[key as string]
            : client.symptoms_severity?.[key as string]
          : src[key];
      return acc + (isFilled(value) ? 1 : 0);
    }, 0);

    return allKeys.length ? Math.round((filled / allKeys.length) * 100) : 0;
  }, [
    isEditingPersonal,
    isEditingSymptoms,
    formState,
    client,
    symptomsState,
    allKeys,
  ]);

  const toInputString = (v: unknown): string => {
    if (v == null) return "";
    if (Array.isArray(v)) return v.join(", ");
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v);
  };

  const normalizeValue = (
    value: string,
    original: unknown
  ): string | string[] | number | undefined => {
    if (Array.isArray(original)) {
      return value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    if (typeof original === "number") {
      const num = Number(value);
      return Number.isFinite(num) ? num : undefined;
    }

    if (typeof original === "string") {
      return value.trim() || undefined;
    }

    return value.trim() || undefined;
  };

  const handleSave = async () => {
    const nextClient = { ...client };

    batch(() => {
      for (const { key } of personalFields) {
        const value = formState[key as string];
        nextClient[key] = normalizeValue(value, client[key]) as any;
        dispatch(
          setFormField({
            field: key,
            value: nextClient[key],
          })
        );
      }

      nextClient.symptoms_severity = { ...symptomsState };
      dispatch(
        setFormField({ field: "symptoms_severity", value: symptomsState })
      );
    });

    await onboardClient({
      data: nextClient,
      token: token ? token : undefined,
    }).unwrap();

    setIsEditingPersonal(false);
    setIsEditingSymptoms(false);
  };

  const Body = (
    <>
      {/* Progress bar */}
      <div
        aria-label="Intake completion"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percentage}
        style={{
          backgroundImage: `linear-gradient(to right, #1C63DB 0%, #1C63DB ${percentage}%, rgba(0,0,0,0) ${percentage}%, rgba(0,0,0,0) 100%)`,
        }}
        className="hidden md:flex h-[32px] mt-[8px] md:w-[328px] text-nowrap items-center justify-between self-stretch bg-white rounded-[8px] border-[1px] border-[#1C63DB] py-[6px] gap-8 px-[16px]"
      >
        <span
          className={`text-[14px] font-semibold ${
            percentage > 40 ? "text-white" : ""
          }`}
        >
          Intake completed
        </span>
        <span
          className={`text-[14px] font-semibold ${
            percentage > 97 ? "text-white" : ""
          }`}
        >
          {percentage}%
        </span>
      </div>

      {/* Lifestyle skillset */}
      <div className="flex items-center justify-between mb-3 mt-2">
        <h5 className="text-[16px] md:text-[18px] font-bold text-[#1D1D1F]">
          Lifestyle skillset
        </h5>
        {embedded &&
          (!isEditingPersonal ? (
            <Button
              variant="blue2"
              className="px-6 text-blue-700"
              onClick={() => setIsEditingPersonal(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="brightblue" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="blue2"
                className="px-6 text-blue-700"
                onClick={() => {
                  const next: FormState = {};
                  for (const { key } of personalFields) {
                    next[key] = toInputString(client[key]);
                  }
                  setFormState(next);
                  setIsEditingPersonal(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 md:gap-x-6 md:gap-y-6 mb-6">
        {personalFields.map(({ label, key }) => {
          const value = isEditingPersonal
            ? (formState[key] ?? "")
            : toInputString(client[key]);

          return (
            <label key={String(key)} className="flex flex-col gap-1">
              <span className="text-[#5F5F65] text-[14px] font-[500]">
                {label}
              </span>

              {isEditingPersonal ? (
                <Input
                  id={`field-${String(key)}`}
                  value={value}
                  onChange={(e) =>
                    setFormState((prev) => ({
                      ...prev,
                      [key]: e.target.value,
                    }))
                  }
                  className="text-[16px] font-semibold border rounded px-2 py-1"
                />
              ) : (
                <span className="text-[#1D1D1F] text-[16px] font-[500]">
                  {value || "-"}
                </span>
              )}
            </label>
          );
        })}
      </div>

      {/* Symptoms */}
      <div className="flex items-center justify-between mb-3">
        <h5 className="text-[16px] md:text-[18px] font-bold text-[#1D1D1F]">
          Symptoms
        </h5>
        {embedded &&
          (!isEditingSymptoms ? (
            <Button
              variant="blue2"
              className="px-6 text-blue-700"
              onClick={() => setIsEditingSymptoms(true)}
            >
              Edit
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="brightblue" onClick={handleSave}>
                Save
              </Button>
              <Button
                variant="blue2"
                className="px-6 text-blue-700"
                onClick={() => {
                  setSymptomsState(client.symptoms_severity || {});
                  setIsEditingSymptoms(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-4 md:gap-x-6 md:gap-y-6">
        {Object.entries(symptomsState).map(([name, value]) => (
          <div key={name} className="flex flex-col gap-1">
            <p className="text-[#5F5F65] text-[14px] font-[500]">{name}</p>
            {isEditingSymptoms ? (
              <Slider
                min={1}
                max={4}
                step={1}
                value={[value || 1]}
                onValueChange={(val) =>
                  setSymptomsState((prev) => ({ ...prev, [name]: val[0] }))
                }
                colors={["#1C63DB", "#1C63DB", "#1C63DB", "#1C63DB"]}
              />
            ) : (
              <h3 className="text-[#1D1D1F] text-[16px] font-[500]">
                {severityLabels[value as number] || "-"}
              </h3>
            )}
          </div>
        ))}
      </div>
    </>
  );

  if (embedded) return Body;
  return <div className="bg-white rounded-[16px] p-4">{Body}</div>;
};
