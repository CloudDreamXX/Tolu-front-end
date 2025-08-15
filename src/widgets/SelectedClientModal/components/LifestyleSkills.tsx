import React from "react";
import TrashIcon from "shared/assets/icons/trash-icon";
import EditIcon from "shared/assets/icons/edit";

export type LifestyleItem = { text: string; sign?: "plus" | "minus" };
export type LifestyleSkillsData = {
  sleepRelaxation: LifestyleItem[];
  exerciseMovement: LifestyleItem[];
};

type Props = {
  value: LifestyleSkillsData;
  isEditing: keyof LifestyleSkillsData | null;
  setIsEditing: React.Dispatch<
    React.SetStateAction<keyof LifestyleSkillsData | null>
  >;
  onChange?: (next: LifestyleSkillsData) => void;
  activeSection?: keyof LifestyleSkillsData;
  onSectionFocus?: (key: keyof LifestyleSkillsData) => void;
};

const SECTIONS: { key: keyof LifestyleSkillsData; title: string }[] = [
  { key: "sleepRelaxation", title: "Sleep & Relaxation" },
  { key: "exerciseMovement", title: "Exercise & Movement" },
];

const LifestyleSkills: React.FC<Props> = ({
  value,
  onChange,
  onSectionFocus,
  isEditing,
  setIsEditing,
}) => {
  const update = (key: keyof LifestyleSkillsData, nextArr: LifestyleItem[]) =>
    onChange?.({ ...value, [key]: nextArr });

  const changeItem = (
    key: keyof LifestyleSkillsData,
    i: number,
    text: string
  ) => {
    const arr = [...(value[key] || [])];
    arr[i] = { ...arr[i], text };
    update(key, arr);
  };

  const removeItem = (key: keyof LifestyleSkillsData, i: number) =>
    update(
      key,
      value[key].filter((_, idx) => idx !== i)
    );

  return (
    <div className="flex flex-col">
      <div className="bg-[#F3F7FD] text-[16px] text-[#1C63DB] font-bold rounded-t-[16px] px-[12px] py-[16px]">
        Lifestyle Skill
      </div>

      <div className="rounded-b-[8px] px-[20px] py-[16px] border border-[#DBDEE1] bg-white flex flex-col gap-[16px]">
        {SECTIONS.map(({ key, title }) => (
          <div key={String(key)} onClick={() => onSectionFocus?.(key)}>
            <div className="flex items-center justify-between">
              <p
                className={`text-[14px] ${isEditing === key ? "text-[#5F5F65]" : "text-[#1D1D1F]"} font-semibold mb-[12px]`}
              >
                {isEditing !== key && <span>•</span>} {title}
              </p>
              {isEditing !== key && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(key);
                  }}
                  className="p-1 rounded hover:bg-black/5"
                  aria-label={isEditing === key ? "Save" : "Edit"}
                >
                  <EditIcon />
                </button>
              )}
            </div>

            {isEditing !== key ? (
              <ul className="text-[14px] font-semibold text-[#1D1D1F]">
                <li className="list-disc ml-[15px]">
                  {(value[key] || []).map((it, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-3 font-bold text-center">
                        {it.sign === "minus" ? "–" : "+"}
                      </span>
                      <span className="text-[14px]">{it.text || "—"}</span>
                    </div>
                  ))}
                </li>
              </ul>
            ) : (
              <div className="flex flex-col gap-[10px]">
                {(value[key] || []).map((it, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-[8px] rounded-full border border-[#DBDEE1] bg-white px-[16px] py-[10px]"
                  >
                    <input
                      value={it.text}
                      onChange={(e) => changeItem(key, i, e.target.value)}
                      placeholder="Enter item"
                      className="w-full outline-none text-[16px] text-[#1D1D1F]"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(key, i)}
                      className="shrink-0 text-[#E86C4A] hover:opacity-80"
                      aria-label="Remove"
                      title="Remove"
                    >
                      <TrashIcon />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LifestyleSkills;
