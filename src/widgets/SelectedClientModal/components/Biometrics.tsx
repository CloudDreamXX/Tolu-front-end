import React from "react";

import { BiometricsInfo } from "entities/coach";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

type BiometricKey =
  | "hrv"
  | "sleep_quality"
  | "movement_and_intensity"
  | "cycle_tracking"
  | "blood_pressure"
  | "fertility_tracking"
  | "glucose_tracking";

type Props = {
  client: BiometricsInfo; // expects the snake_case nullable fields from API
  edit?: boolean;
  onChange?: (next: BiometricsInfo) => void;
  className?: string;
};

const FIELDS: { key: BiometricKey; label: string; placeholder: string }[] = [
  { key: "hrv", label: "HRV (Stress level)", placeholder: "e.g., 52 ms" },
  {
    key: "sleep_quality",
    label: "Sleep quality",
    placeholder: "e.g., 7h 30m (75% efficiency)",
  },
  {
    key: "movement_and_intensity",
    label: "Movement & Intensity",
    placeholder: "e.g., 5,000 steps/day",
  },
  {
    key: "cycle_tracking",
    label: "Cycle tracking",
    placeholder: "e.g., Ovulation Day 14",
  },
  {
    key: "blood_pressure",
    label: "Blood pressure",
    placeholder: "e.g., 120/80 mmHg",
  },
  {
    key: "fertility_tracking",
    label: "Fertility tracking",
    placeholder: "e.g., Ovulation predicted in 2 days",
  },
  {
    key: "glucose_tracking",
    label: "Glucose tracking",
    placeholder: "e.g., 95 mg/dL (fasting)",
  },
];

const Biometrics: React.FC<Props> = ({
  client,
  edit = false,
  onChange,
  className,
}) => {
  const setField = (key: BiometricKey, v: string) =>
    onChange?.({ ...client, [key]: v });

  const clearField = (key: BiometricKey) =>
    onChange?.({ ...client, [key]: null });

  return (
    <div
      className={[
        `grid ${edit ? "grid-cols-1" : "grid-cols-2"} md:grid-cols-3 gap-[8px] md:gap-[24px] text-[14px]`,
        className || "",
      ].join(" ")}
    >
      {FIELDS.map(({ key, label, placeholder }) => (
        <div
          key={key}
          className="flex flex-col justify-center gap-[4px] md:gap-[8px] px-[10px] py-[8px] md:p-0 rounded-[8px] md:rounded-0 border border-[#DBDEE1] md:border-none bg-white md:bg-transparent"
        >
          <div className="text-[12px] text-[#5F5F65] font-semibold flex justify-between items-center">
            {label}
            {edit && (
              <button
                type="button"
                onClick={() => clearField(key)}
                className="text-[#E86C4A] hover:opacity-80"
                aria-label={`Clear ${label}`}
                title="Clear"
              >
                <MaterialIcon iconName="delete" />
              </button>
            )}
          </div>

          {!edit ? (
            <p className="text-[16px] text-[#1D1D1F]">
              {client[key] && client[key]?.trim() ? client[key] : "—"}
            </p>
          ) : (
            <div className="relative flex items-center gap-2">
              <input
                value={client[key] ?? ""}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={placeholder || label}
                className="w-full rounded-full border border-[#DBDEE1] bg-white px-[16px] py-[10px] text-[14px] text-[#1D1D1F] outline-none"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Biometrics;
