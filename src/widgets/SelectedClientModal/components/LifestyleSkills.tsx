import React, { useEffect, useMemo } from "react";

import { LifestyleSkillsInfo } from "entities/coach";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

export type LifestyleItem = { text: string; sign?: "plus" | "minus" };

export type LifestyleSkillsValue = Record<string, LifestyleItem[]>;

type Props = {
  client: LifestyleSkillsInfo;
  value: LifestyleSkillsValue;
  isEditing: string | null;
  setIsEditing: React.Dispatch<React.SetStateAction<string | null>>;
  onChange?: (next: LifestyleSkillsValue) => void;
  activeSection?: string;
  onSectionFocus?: (key: string) => void;
};

const FALLBACK_SECTION_TITLES = ["Sleep & Relaxation", "Exercise & Movement"];

const toItems = (v: string | string[] | undefined): LifestyleItem[] => {
  if (Array.isArray(v)) return v.map((t) => ({ text: String(t) }));
  if (typeof v === "string" && v.trim().length > 0) return [{ text: v }];
  return [];
};

const LifestyleSkills: React.FC<Props> = ({
  client,
  value,
  onChange,
  onSectionFocus,
  isEditing,
  setIsEditing,
}) => {
  const sectionTitles = useMemo(() => {
    const entries = Object.entries(client || {}).filter(
      ([, v]) => v !== undefined
    );
    return entries.length > 0
      ? entries.map(([k]) => k)
      : FALLBACK_SECTION_TITLES;
  }, [client]);

  useEffect(() => {
    if (!onChange) return;

    let needsInit = false;
    const next: LifestyleSkillsValue = { ...value };

    if (sectionTitles === FALLBACK_SECTION_TITLES) {
      for (const title of sectionTitles) {
        if (!next[title]) {
          next[title] = [];
          needsInit = true;
        }
      }
    } else {
      for (const title of sectionTitles) {
        if (!next[title]) {
          next[title] = toItems(client[title]);
          needsInit = true;
        }
      }
    }

    const keys = Object.keys(next);
    for (const k of keys) {
      if (!sectionTitles.includes(k)) {
        delete next[k];
        needsInit = true;
      }
    }

    if (needsInit) onChange(next);
  }, [client, sectionTitles.join("|")]);

  const update = (title: string, nextArr: LifestyleItem[]) =>
    onChange?.({ ...value, [title]: nextArr });

  const changeItem = (title: string, i: number, text: string) => {
    const arr = [...(value[title] || [])];
    arr[i] = { ...arr[i], text };
    update(title, arr);
  };

  const removeItem = (title: string, i: number) =>
    update(
      title,
      (value[title] || []).filter((_, idx) => idx !== i)
    );

  return (
    <div className="flex flex-col">
      <div className="bg-[#F3F7FD] text-[16px] text-[#1C63DB] font-bold rounded-t-[16px] px-[12px] py-[16px]">
        Lifestyle Skill
      </div>

      <div className="rounded-b-[8px] px-[20px] py-[16px] border border-[#DBDEE1] bg-white flex flex-col gap-[16px]">
        {sectionTitles.map((title) => {
          const items = value[title] || [];
          const editing = isEditing === title;

          return (
            <div key={title} onClick={() => onSectionFocus?.(title)}>
              <div className="flex items-center justify-between">
                <p
                  className={`text-[14px] ${
                    editing ? "text-[#5F5F65]" : "text-[#1D1D1F]"
                  } font-semibold mb-[12px]`}
                >
                  {!editing && <span>•</span>} {title}
                </p>
                {!editing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(title)}
                    className="p-1 rounded hover:bg-black/5"
                    aria-label={editing ? "Save" : "Edit"}
                  >
                    <MaterialIcon iconName="edit" />
                  </button>
                )}
              </div>

              {!editing ? (
                <ul className="text-[14px] font-semibold text-[#1D1D1F]">
                  <li className="list-disc ml-[15px]">
                    {items.length === 0 ? (
                      <div className="text-[#5F5F65]">—</div>
                    ) : (
                      items.map((it, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <span className="w-3 font-bold text-center">
                            {it.sign === "minus" ? "–" : "+"}
                          </span>
                          <span className="text-[14px]">{it.text || "—"}</span>
                        </div>
                      ))
                    )}
                  </li>
                </ul>
              ) : (
                <div className="flex flex-col gap-[10px]">
                  {items.map((it, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-[8px] rounded-full border border-[#DBDEE1] bg-white px-[16px] py-[10px]"
                    >
                      <input
                        value={it.text}
                        onChange={(e) => changeItem(title, i, e.target.value)}
                        placeholder="Enter item"
                        className="w-full outline-none text-[16px] text-[#1D1D1F]"
                      />
                      <button
                        type="button"
                        onClick={() => removeItem(title, i)}
                        className="shrink-0 text-[#E86C4A] hover:opacity-80"
                        aria-label="Remove"
                        title="Remove"
                      >
                        <MaterialIcon iconName="delete" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LifestyleSkills;
