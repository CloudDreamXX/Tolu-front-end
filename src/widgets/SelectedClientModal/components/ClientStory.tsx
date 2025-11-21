import { ClientStoryInfo } from "entities/coach";
import React from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Button, Input } from "shared/ui";

type Props = {
  client: ClientStoryInfo;
  edit?: boolean;
  onChange?: (next: ClientStoryInfo) => void;
};

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <p className="text-[12px] text-[#5F5F65] font-semibold mb-[4px]">
    {children}
  </p>
);

const CURRENT_YEAR = new Date().getFullYear();
const YEARS: number[] = Array.from({ length: 120 }, (_, i) => CURRENT_YEAR - i);

export const ClientStory: React.FC<Props> = ({
  client,
  edit = false,
  onChange,
}) => {
  const update = (patch: Partial<ClientStoryInfo>) =>
    onChange?.({ ...client, ...patch });

  const notes = client.genetic_influences?.notes;
  const setNotes = (v: string) => update({ genetic_influences: { notes: v } });

  const pivots = client.pivotal_incidents ?? [];

  const setPivot = (
    idx: number,
    field: "year" | "description",
    value: string
  ) => {
    const copy = [...pivots];
    const curr = copy[idx] ?? {};
    copy[idx] = { ...curr, [field]: value };
    update({ pivotal_incidents: copy });
  };

  const addPivot = () =>
    update({
      pivotal_incidents: [...pivots, { year: "", description: "" }],
    });

  const removePivot = (idx: number) =>
    update({
      pivotal_incidents: pivots.filter((_, i) => i !== idx),
    });

  const symptomEntries: Array<[string, string]> = Object.entries(
    client.symptom_influencers ?? {}
  );

  const setSymptomEntry = (
    idx: number,
    field: "key" | "value",
    value: string
  ) => {
    const entries = [...symptomEntries];
    const curr = entries[idx] ?? ["", ""];
    entries[idx] = field === "key" ? [value, curr[1]] : [curr[0], value];
    const nextObj = entries.reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
    update({ symptom_influencers: nextObj });
  };

  const addSymptom = () => {
    const entries = [...symptomEntries, ["", ""]];
    const nextObj = entries.reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
    update({ symptom_influencers: nextObj });
  };

  const removeSymptom = (idx: number) => {
    const entries = symptomEntries.filter((_, i) => i !== idx);
    const nextObj = entries.reduce<Record<string, string>>((acc, [k, v]) => {
      acc[k] = v;
      return acc;
    }, {});
    update({ symptom_influencers: nextObj });
  };

  return (
    <div className="flex flex-col gap-[24px] border border-[#DBDEE1] bg-white rounded-[8px] p-[16px]">
      <section>
        <SectionTitle>Genetic &amp; Early Influences</SectionTitle>
        {!edit ? (
          notes ? (
            <p className="text-[16px] text-[#1D1D1F]">{notes}</p>
          ) : (
            <p className="text-[14px] text-[#5F5F65]">—</p>
          )
        ) : (
          <div className="flex gap-[8px] items-center w-full">
            <div className="w-full flex items-center gap-[8px] border border-[#DBDEE1] rounded-full bg-white px-[16px] py-[10px]">
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes (e.g., “Father had a stroke at 62”)"
                className="w-full outline-none text-[16px] text-[#1D1D1F]"
              />
            </div>
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              type="button"
              onClick={() => setNotes("")}
              className="shrink-0 text-[#FF1F0F] m-0 first-line:hover:opacity-80 flex items-center justify-center"
              title="Remove"
              aria-label="Remove"
            >
              <MaterialIcon iconName="delete" fill={1} />
            </Button>
          </div>
        )}
      </section>

      <section>
        <SectionTitle>Pivotal Incidents</SectionTitle>
        {!edit ? (
          pivots?.length ? (
            <ul className="list-disc pl-4 text-[16px] text-[#1D1D1F] space-y-1">
              {pivots.map((p, i) => (
                <li key={i}>
                  {p?.year ?? "—"} — {p?.description || "—"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-[#5F5F65]">—</p>
          )
        ) : (
          <div className="flex flex-col gap-[12px]">
            {pivots.map((p, i) => {
              const selectedYearStr =
                p?.year !== undefined && p?.year !== null && p?.year !== ""
                  ? String(p.year)
                  : "";
              const hasCustomYear =
                !!selectedYearStr &&
                !YEARS.some((y) => String(y) === selectedYearStr);

              return (
                <div key={i} className="flex flex-col md:flex-row gap-[8px]">
                  <div className="flex items-center gap-[8px] border border-[#DBDEE1] rounded-full bg-white px-[16px] py-[8px] md:w-[180px]">
                    <select
                      value={selectedYearStr}
                      onChange={(e) => setPivot(i, "year", e.target.value)}
                      className="w-full outline-none text-[16px] text-[#1D1D1F] bg-transparent"
                    >
                      <option value="">Year</option>
                      {hasCustomYear && (
                        <option value={selectedYearStr}>
                          {selectedYearStr}
                        </option>
                      )}
                      {YEARS.map((y) => (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-[8px] border border-[#DBDEE1] rounded-full bg-white px-[16px] py-[10px] flex-1">
                    <Input
                      value={p?.description ?? ""}
                      onChange={(e) =>
                        setPivot(i, "description", e.target.value)
                      }
                      placeholder="Description"
                      className="w-full outline-none text-[16px] text-[#1D1D1F]"
                    />
                  </div>
                  <Button
                    variant={"unstyled"}
                    size={"unstyled"}
                    type="button"
                    onClick={() => removePivot(i)}
                    className="shrink-0 text-[#FF1F0F] m-0 first-line:hover:opacity-80 flex items-center justify-center"
                    title="Remove"
                    aria-label="Remove"
                  >
                    <MaterialIcon iconName="delete" fill={1} />
                  </Button>
                </div>
              );
            })}
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              type="button"
              onClick={addPivot}
              className="text-[#008FF6] font-semibold flex items-center gap-1"
            >
              <span className="text-[20px]">+</span> Add
            </Button>
          </div>
        )}
      </section>

      <section>
        <SectionTitle>Symptom Influencers</SectionTitle>
        {!edit ? (
          symptomEntries.length ? (
            <ul className="list-disc pl-4 text-[16px] text-[#1D1D1F] space-y-1">
              {symptomEntries.map(([k, v], i) => (
                <li key={i}>
                  <span className="font-semibold">{k || "—"}</span>
                  {" : "}
                  {v || "—"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[14px] text-[#5F5F65]">—</p>
          )
        ) : (
          <div className="flex flex-col gap-[12px]">
            {symptomEntries.map(([k, v], i) => (
              <div key={i} className="flex flex-col md:flex-row gap-[8px]">
                <div className="flex items-center gap-[8px] border border-[#DBDEE1] rounded-full bg-white px-[16px] py-[10px] md:w-[240px]">
                  <Input
                    value={k}
                    onChange={(e) => setSymptomEntry(i, "key", e.target.value)}
                    placeholder="Symptom (e.g., Work stress)"
                    className="w-full outline-none text-[16px] text-[#1D1D1F]"
                  />
                </div>
                <div className="flex items-center gap-[8px] border border-[#DBDEE1] rounded-full bg-white px-[16px] py-[10px] flex-1">
                  <Input
                    value={v}
                    onChange={(e) =>
                      setSymptomEntry(i, "value", e.target.value)
                    }
                    placeholder="Description"
                    className="w-full outline-none text-[16px] text-[#1D1D1F]"
                  />
                </div>
                <Button
                  variant={"unstyled"}
                  size={"unstyled"}
                  type="button"
                  onClick={() => removeSymptom(i)}
                  className="shrink-0 text-[#FF1F0F] m-0 first-line:hover:opacity-80 flex items-center justify-center"
                  title="Remove"
                  aria-label="Remove"
                >
                  <MaterialIcon iconName="delete" fill={1} />
                </Button>
              </div>
            ))}
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              type="button"
              onClick={addSymptom}
              className="text-[#008FF6] font-semibold flex items-center gap-1"
            >
              <span className="text-[20px]">+</span> Add
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
