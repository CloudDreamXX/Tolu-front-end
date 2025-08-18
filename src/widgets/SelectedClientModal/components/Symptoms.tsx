import React from "react";
import TrashIcon from "shared/assets/icons/trash-icon";

type ClientSymptoms = {
  hormones_and_neurotransmitters_reported_symptoms: string[];
  mind_spirit_emotions_community_reported_state: string | null;
};

type Props = {
  client: ClientSymptoms;
  edit?: boolean;
  onChange?: (next: ClientSymptoms) => void;
  className?: string;
};

const Symptoms: React.FC<Props> = ({
  client,
  edit = false,
  onChange,
  className,
}) => {
  const update = (patch: Partial<ClientSymptoms>) =>
    onChange?.({ ...client, ...patch });

  const updateHormoneItem = (i: number, v: string) => {
    const arr = [
      ...(client.hormones_and_neurotransmitters_reported_symptoms || []),
    ];
    arr[i] = v;
    update({ hormones_and_neurotransmitters_reported_symptoms: arr });
  };

  const addHormoneItem = () => {
    const arr = [
      ...(client.hormones_and_neurotransmitters_reported_symptoms || []),
    ];
    arr.push("");
    update({ hormones_and_neurotransmitters_reported_symptoms: arr });
  };

  const removeHormoneItem = (i: number) => {
    const arr = (
      client.hormones_and_neurotransmitters_reported_symptoms || []
    ).filter((_, idx) => idx !== i);
    update({ hormones_and_neurotransmitters_reported_symptoms: arr });
  };

  const updateMind = (v: string) =>
    update({ mind_spirit_emotions_community_reported_state: v });

  const hormones =
    client.hormones_and_neurotransmitters_reported_symptoms ?? [];
  const mind = client.mind_spirit_emotions_community_reported_state ?? "";

  return (
    <div className={`flex flex-col gap-[24px] ${className ?? ""}`}>
      <div className="border border-[#DBDEE1] rounded-[8px]">
        <div className="bg-[#F3F6FB] py-[12px] px-[27px] border-b border-[#DBDEE1] rounded-t-[8px] text-[#1C63DB] font-bold text-[18px]">
          Hormones & Neurotransmitters
        </div>

        <div className="py-[12px] px-[27px] bg-white rounded-b-[8px]">
          <p className="text-[12px] text-[#5F5F65] font-semibold">
            Reported Symptoms
          </p>

          {!edit ? (
            <ul className="mt-[6px] text-[#1D1D1F] text-[14px] font-normal space-y-[2px]">
              {hormones.length ? (
                hormones.map((li, i) => <li key={i}>• {li}</li>)
              ) : (
                <li>—</li>
              )}
            </ul>
          ) : (
            <div className="flex flex-col gap-[12px] mt-[8px]">
              {hormones.map((val, i) => (
                <div
                  key={i}
                  className="flex items-center gap-[8px] rounded-full border border-[#DBDEE1] bg-white px-[16px] py-[10px]"
                >
                  <input
                    value={val}
                    onChange={(e) => updateHormoneItem(i, e.target.value)}
                    placeholder="Hot flashes (3–5/day)"
                    className="w-full outline-none text-[14px] text-[#1D1D1F]"
                  />
                  <button
                    type="button"
                    onClick={() => removeHormoneItem(i)}
                    className="shrink-0 text-[#E86C4A] hover:opacity-80"
                    aria-label="Remove"
                    title="Remove"
                  >
                    <TrashIcon />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addHormoneItem}
                className="inline-flex items-center gap-2 text-[#008FF6] font-semibold ml-auto"
              >
                <span className="text-[20px] leading-none">+</span> Add
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="border border-[#DBDEE1] rounded-[8px]">
        <div className="bg-[#F3F6FB] py-[12px] px-[27px] border-b border-[#DBDEE1] rounded-t-[8px] text-[#1C63DB] font-bold text-[18px]">
          Mind / Spirit / Emotions / Community
        </div>

        <div className="py-[12px] px-[27px] bg-white rounded-b-[8px]">
          <p className="text-[12px] text-[#5F5F65] font-semibold">
            Reported State
          </p>

          {!edit ? (
            <div className="mt-[6px] text-[#1D1D1F] text-[14px]">
              {mind?.trim() ? mind : "—"}
            </div>
          ) : (
            <input
              value={mind}
              onChange={(e) => updateMind(e.target.value)}
              placeholder="Irritability, fatigue, anxiety around peers …"
              className="mt-[8px] w-full rounded-full border border-[#DBDEE1] bg-white px-[16px] py-[10px] text-[14px] text-[#1D1D1F] outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Symptoms;
