import { batch, useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { RootState } from "entities/store";
import { setFormField } from "entities/store/clientOnboardingSlice";
import { Input, Button } from "shared/ui";
import { UserService } from "entities/user";

type FormState = RootState["clientOnboarding"];
type FieldKey = keyof FormState;
type AllowedValue = string | number | string[] | undefined;

export const OnboardingInfo = ({
  embedded = false,
}: {
  embedded?: boolean;
}) => {
  const dispatch = useDispatch();
  const client = useSelector((s: RootState) => s.clientOnboarding);
  const token = useSelector((s: RootState) => s.user.token);

  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState<FormState>({ ...client });

  useEffect(() => {
    if (!isEditing) setFormState({ ...client });
  }, [client, isEditing]);

  const LIST_FIELDS: ReadonlyArray<FieldKey> = [
    "important_values",
    "support_network",
    "language",
  ] as const;
  const LIST_FIELD_SET = new Set<FieldKey>(LIST_FIELDS as FieldKey[]);

  const personalFields: { label: string; key: FieldKey }[] = [
    { label: "Age", key: "age" },
    { label: "Menopause Status", key: "menopause_status" },
    { label: "Language", key: "language" },
  ];

  const insightsFields: { label: string; key: FieldKey }[] = [
    { label: "My main goal", key: "main_transition_goal" },
    { label: "Most important values", key: "important_values" },
    { label: "What’s been getting in your way so far?", key: "obstacles" },
    { label: "My support", key: "support_network" },
    { label: "Readiness to life changes", key: "readiness_for_change" },
  ];

  const allKeys = useMemo(
    () =>
      [...personalFields, ...insightsFields].map((f) => f.key) as FieldKey[],
    []
  );

  const percentage = useMemo(() => {
    const src = isEditing ? formState : client;

    const isFilled = (v: unknown): boolean => {
      if (Array.isArray(v)) return v.filter((x) => String(x).trim()).length > 0;
      if (v instanceof Date) return !Number.isNaN(v.getTime());
      if (typeof v === "number") return Number.isFinite(v);
      if (typeof v === "string") return v.trim().length > 0;
      return v != null && String(v).trim().length > 0;
    };

    const filled = allKeys.reduce(
      (acc, key) => acc + (isFilled(src[key]) ? 1 : 0),
      0
    );
    return allKeys.length ? Math.round((filled / allKeys.length) * 100) : 0;
  }, [isEditing, formState, client, allKeys]);

  const toInputString = (v: unknown): string => {
    if (v == null) return "";
    if (Array.isArray(v)) return v.join(", ");
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v);
  };

  const normalizeValue = (
    key: FieldKey,
    value: unknown,
    original: unknown
  ): AllowedValue => {
    if (Array.isArray(original) || LIST_FIELD_SET.has(key)) {
      if (Array.isArray(value))
        return value
          .map(String)
          .map((s) => s.trim())
          .filter(Boolean);
      if (typeof value === "string")
        return value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      return [];
    }
    if (typeof original === "number") {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const n = Number(value);
        return Number.isFinite(n) ? n : undefined;
      }
      return undefined;
    }
    if (typeof value === "string") return value;
    if (value == null) return undefined;
    return String(value);
  };

  const handleSave = async () => {
    const entries = Object.entries(formState) as [FieldKey, unknown][];
    const nextClient: FormState = { ...client };

    batch(() => {
      for (const [key, value] of entries) {
        const prepared: AllowedValue = normalizeValue(key, value, client[key]);
        nextClient[key] = prepared as any;
        dispatch(setFormField({ field: key, value: prepared }));
      }
    });

    await UserService.onboardClient(nextClient, token);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as FieldKey;
    setFormState((prev) => ({ ...prev, [key]: value as any }));
  };

  const FieldView = ({
    label,
    fieldKey,
  }: {
    label: string;
    fieldKey: FieldKey;
  }) => {
    const source = isEditing ? formState : client;
    const value = source[fieldKey];
    return (
      <div className="flex flex-col gap-1">
        <p className="text-[#5F5F65] text-[12px] md:text-[18px] font-[500]">
          {label}
        </p>
        {isEditing ? (
          <Input
            name={String(fieldKey)}
            value={
              Array.isArray(value) ? value.join(", ") : toInputString(value)
            }
            onChange={handleChange}
            className="text-[16px] font-semibold"
          />
        ) : (
          <h3 className="text-[#1D1D1F] text-[14px] md:text-[20px] font-[500]">
            {Array.isArray(value)
              ? value.join(", ")
              : toInputString(value) || "-"}
          </h3>
        )}
      </div>
    );
  };

  const Body = (
    <>
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
          className={`text-[14px] font-semibold ${percentage > 40 ? "text-white" : ""}`}
        >
          Intake completed
        </span>
        <span
          className={`text-[14px] font-semibold ${percentage > 97 ? "text-white" : ""}`}
        >
          {percentage}%
        </span>
      </div>

      <div className="flex items-center justify-between mb-3 mt-2">
        <h5 className="text-[16px] md:text-[18px] font-bold text-[#1D1D1F]">
          Personal info
        </h5>
        {embedded &&
          (!isEditing ? (
            <Button
              variant="blue2"
              className="px-6 text-blue-700"
              onClick={() => setIsEditing(true)}
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
                  setFormState({ ...client });
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 md:gap-x-6 md:gap-y-6 mb-6">
        {personalFields.map(({ label, key }) => (
          <FieldView key={String(key)} label={label} fieldKey={key} />
        ))}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h5 className="text-[16px] md:text-[18px] font-bold text-[#1D1D1F]">
          Your Health Drivers
        </h5>
      </div>
      <div className="grid grid-cols-1 gap-y-4 md:gap-y-6">
        {insightsFields.map(({ label, key }) => (
          <FieldView key={String(key)} label={label} fieldKey={key} />
        ))}
      </div>
    </>
  );

  if (embedded) return Body;

  return <div className="bg-white rounded-[16px] p-4">{Body}</div>;
};
