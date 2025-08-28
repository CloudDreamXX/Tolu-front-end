import { AppliedFilters, SortBy } from "pages/feedback-hub/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { SelectField } from "widgets/CRMSelectField";

type Props = {
  draftFilters: AppliedFilters;
  setDraftFilters: React.Dispatch<React.SetStateAction<AppliedFilters>>;
  onSave: () => void;
  onClose: () => void;
};

export const FiltersPopup: React.FC<Props> = ({
  draftFilters,
  setDraftFilters,
  onSave,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                  w-[calc(100%-32px)] md:w-[650px] rounded-2xl bg-white shadow-2xl p-6"
      >
        <h3 className="text-center text-[28px] font-semibold mb-[32px]">
          Set Filters
        </h3>

        <div className="flex items-center gap-2 justify-center mb-[24px]">
          {(["all", "positive", "negative"] as const).map((s) => {
            const active = draftFilters.sentiment === s;
            return (
              <button
                key={s}
                onClick={() => setDraftFilters((d) => ({ ...d, sentiment: s }))}
                className={[
                  "flex items-center gap-[12px] px-3 py-2 rounded-lg text-[16px] border bg-[#F3F7FD]",
                  active
                    ? "text-[#1C63DB] border-[#1C63DB]"
                    : "text-[#1D1D1F] border-[#F3F7FD]",
                ].join(" ")}
              >
                {s === "positive" && (
                  <MaterialIcon iconName="thumb_up" fill={1} />
                )}
                {s === "negative" && (
                  <MaterialIcon iconName="thumb_down" fill={1} />
                )}
                {s === "all"
                  ? "All"
                  : s === "positive"
                    ? "Only Positive"
                    : "Only Negative"}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 gap-[24px]">
          <div>
            <div className="text-[18px] text-[#1D1D1F] font-semibold mb-[16px]">
              Date Range
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] items-end">
              <label className="flex flex-col gap-[8px]">
                <span className="text-[16px] text-[#1D1D1F] font-semibold">
                  By submission (from)
                </span>
                <input
                  type="date"
                  value={draftFilters.submit.start ?? ""}
                  onChange={(e) =>
                    setDraftFilters((d) => ({
                      ...d,
                      submit: {
                        ...d.submit,
                        start: e.target.value || undefined,
                      },
                    }))
                  }
                  className="h-10 rounded-md border border-[#DBDEE1] px-3"
                />
              </label>
              <label className="flex flex-col gap-[8px]">
                <span className="text-[16px] text-[#1D1D1F] font-semibold">
                  By submission (to)
                </span>
                <input
                  type="date"
                  value={draftFilters.submit.end ?? ""}
                  onChange={(e) =>
                    setDraftFilters((d) => ({
                      ...d,
                      submit: { ...d.submit, end: e.target.value || undefined },
                    }))
                  }
                  className="h-10 rounded-md border border-[#DBDEE1] px-3"
                />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] items-end mt-[16px]">
              <label className="flex flex-col gap-[8px]">
                <span className="text-[16px] text-[#1D1D1F] font-semibold">
                  By rating date (from)
                </span>
                <input
                  type="date"
                  value={draftFilters.rating.start ?? ""}
                  onChange={(e) =>
                    setDraftFilters((d) => ({
                      ...d,
                      rating: {
                        ...d.rating,
                        start: e.target.value || undefined,
                      },
                    }))
                  }
                  className="h-10 rounded-md border border-[#DBDEE1] px-3"
                />
              </label>
              <label className="flex flex-col gap-1">
                <span className="text-[16px] text-[#1D1D1F] font-semibold">
                  By rating date (to)
                </span>
                <input
                  type="date"
                  value={draftFilters.rating.end ?? ""}
                  onChange={(e) =>
                    setDraftFilters((d) => ({
                      ...d,
                      rating: { ...d.rating, end: e.target.value || undefined },
                    }))
                  }
                  className="h-10 rounded-md border border-[#DBDEE1] px-3"
                />
              </label>
            </div>
          </div>

          <SelectField
            className="rounded-[8px] capitalize"
            label={"Sort by"}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" },
            ]}
            selected={draftFilters.sort}
            onChange={(e) =>
              setDraftFilters((d) => ({
                ...d,
                sort: (e as SortBy) || "newest",
              }))
            }
          />
        </div>
        <button
          className="mt-[32px] w-full p-[11px] rounded-full bg-[#1C63DB] text-[16px] text-white font-semibold"
          onClick={onSave}
        >
          Apply
        </button>
      </div>
    </div>
  );
};
