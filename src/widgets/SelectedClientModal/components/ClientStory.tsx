import React from "react";
import TrashIcon from "shared/assets/icons/trash-icon";

export type StorySections = {
  genetics: string[];
  antecedents: string[];
  triggers: string[];
  mediators: string[];
};

type Props = {
  value: StorySections;
  edit?: boolean;
  onChange?: (next: StorySections) => void;
  className?: string;
};

const SECTIONS: [label: string, key: keyof StorySections][] = [
  ["Genetics", "genetics"],
  ["Antecedents", "antecedents"],
  ["Triggering events", "triggers"],
  ["Mediators", "mediators"],
];

export const ClientStory: React.FC<Props> = ({
  value,
  edit = false,
  onChange,
}) => {
  const update = (key: keyof StorySections, nextArr: string[]) =>
    onChange?.({ ...value, [key]: nextArr });

  const handleChange = (key: keyof StorySections, i: number, v: string) => {
    const arr = [...value[key]];
    arr[i] = v;
    update(key, arr);
  };

  const addItem = (key: keyof StorySections) =>
    update(key, [...value[key], ""]);

  const removeItem = (key: keyof StorySections, i: number) =>
    update(
      key,
      value[key].filter((_, idx) => idx !== i)
    );

  return (
    <div className={`flex flex-col gap-[24px] ${edit ? "" : "border border-[#DBDEE1] md:border-0 bg-white rounded-[8px] md:bg-transparent py-[16px] md:py-0"} md:px-[24px]`}>
      {!edit ? (
        SECTIONS.map(([label, key]) => (
          <section key={key}>
            <p className="text-[12px] text-[#5F5F65] font-semibold mb-[4px]">
              {label}
            </p>
            {value[key]?.length ? (
              <ul className="list-disc text-[16px] text-[#1D1D1F] space-y-1">
                {value[key].map((t, i) => (
                  <li key={i}>• {t}</li>
                ))}
              </ul>
            ) : (
              <p className="text-[14px] text-[#5F5F65]">—</p>
            )}
          </section>
        ))
      ) : (
        <div className="flex flex-col gap-[24px]">
          {SECTIONS.map(([label, key]) => (
            <div>
              <section key={key} className={`${edit ? "border border-[#DBDEE1] md:border-0 bg-white rounded-[8px] md:bg-transparent p-[10px] md:p-0" : ""}`}>
                <p className="text-[12px] text-[#5F5F65] font-semibold mb-[8px]">
                  {label}
                </p>
                <div className="flex flex-col gap-[12px]">
                  {value[key]?.map((val, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-[8px] rounded-full border border-[#DBDEE1] bg-white px-[20px] py-[12px] h-[68px] md:h-fit md:px-[16px] md:py-[10px]"
                    >
                      <input
                        value={val}
                        onChange={(e) => handleChange(key, i, e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()} item`}
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
                  <button
                    type="button"
                    onClick={() => addItem(key)}
                    className=" hidden md:inline-flex items-center gap-2 text-[#008FF6] font-semibold ml-auto"
                  >
                    <span className="text-[20px] leading-none">+</span> Add
                  </button>
                </div>
              </section>
              <button
                type="button"
                onClick={() => addItem(key)}
                className="inline-flex md:hidden items-center justify-end mt-[24px] w-full gap-2 text-[#008FF6] font-semibold ml-auto"
              >
                <span className="text-[20px] leading-none">+</span> Add
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
