import React from "react";

export type SymptomsData = {
  hormones: string;
  mind: string;
};

type Props = {
  value: SymptomsData;
  edit?: boolean;
  onChange?: (next: SymptomsData) => void;
  className?: string;
};

const sections = [
  {
    key: "hormones" as const,
    title: "Hormones & Neurotransmitters",
    label: "Reported Symptoms",
    placeholder:
      "Hot flashes (3–5/day), low libido, interrupted sleep, mood instability",
  },
  {
    key: "mind" as const,
    title: "Mind / Spirit / Emotions / Community",
    label: "Reported State",
    placeholder: "Irritability, fatigue, anxiety around peers …",
  },
];

const splitToBullets = (s: string) =>
  s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const Symptoms: React.FC<Props> = ({ value, edit = false, onChange }) => {
  const update = (key: keyof SymptomsData, v: string) =>
    onChange?.({ ...value, [key]: v });

  return (
    <div className="flex flex-col gap-[24px]">
      {sections.map(({ key, title, label, placeholder }) => {
        const raw = value[key] ?? "";
        const items = splitToBullets(raw);

        return (
          <div key={key} className="border border-[#DBDEE1] rounded-[8px]">
            <div className="bg-[#F3F6FB] py-[12px] px-[27px] border-b border-[#DBDEE1] rounded-t-[8px] text-[#1C63DB] font-bold text-[18px]">
              {title}
            </div>

            <div className="py-[12px] px-[27px]">
              <p className="text-[12px] text-[#5F5F65] font-semibold">
                {label}
              </p>

              {!edit ? (
                <ul className="mt-[6px] list-dis text-[#1D1D1F] text-[14px] font-normal space-y-[2px]">
                  {items.length ? (
                    items.map((li, i) => <li key={i}>• {li}</li>)
                  ) : (
                    <li>—</li>
                  )}
                </ul>
              ) : (
                <input
                  value={raw}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder={placeholder}
                  className="mt-[8px] w-full rounded-full border border-[#DBDEE1] bg-white px-[16px] py-[10px] text-[14px] text-[#1D1D1F] outline-none"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Symptoms;
