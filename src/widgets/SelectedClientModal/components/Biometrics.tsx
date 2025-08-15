import React from "react";
import TrashIcon from "shared/assets/icons/trash-icon";

export type BiometricsData = {
  hrv: string;
  sleepQuality: string;
  movementIntensity: string;
  bloodPressure: string;
  fertilityTracking: string;
  glucoseTracking: string;
};

type Props = {
  value: BiometricsData;
  edit?: boolean;
  onChange: (next: BiometricsData) => void;
};

const FIELDS: { key: keyof BiometricsData; label: string }[] = [
  { key: "hrv", label: "HRV (Stress level)" },
  { key: "sleepQuality", label: "Sleep quality" },
  { key: "movementIntensity", label: "Movement & Intensity" },
  { key: "bloodPressure", label: "Blood pressure" },
  { key: "fertilityTracking", label: "Fertility tracking" },
  { key: "glucoseTracking", label: "Glucose tracking" },
];

const Biometrics: React.FC<Props> = ({ value, edit = false, onChange }) => {
  const setField = (key: keyof BiometricsData, v: string) =>
    onChange({ ...value, [key]: v });

  const clearField = (key: keyof BiometricsData) =>
    onChange({ ...value, [key]: "" });

  return (
    <div
      className={`grid ${edit ? "grid-cols-1" : "grid-cols-2"} md:grid-cols-3 gap-[8px] md:gap-[24px] text-[14px]`}
    >
      {FIELDS.map(({ key, label }) => (
        <div
          key={key}
          className="flex flex-col justify-center gap-[4px] md:gap-[8px] px-[10px] py-[8px] md:p-0 rounded-[8px] md:rounded-0 border border-[#DBDEE1] md:border-none bg-white md:bg-transparent"
        >
          <div className="text-[12px] text-[#5F5F65] font-semibold flex justify-between items-center">
            {label}{" "}
            {edit && (
              <button
                type="button"
                onClick={() => clearField(key)}
                className="text-[#E86C4A] hover:opacity-80"
                aria-label="Clear"
                title="Clear"
              >
                <TrashIcon />
              </button>
            )}
          </div>

          {!edit ? (
            <p className="text-[16px] text-[#1D1D1F]">{value[key] || "—"}</p>
          ) : (
            <div className="relative flex items-center gap-2">
              <input
                value={value[key] ?? ""}
                onChange={(e) => setField(key, e.target.value)}
                placeholder={label}
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
