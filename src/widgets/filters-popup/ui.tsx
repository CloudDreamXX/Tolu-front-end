import { useEffect, useState } from "react";
import { format } from "date-fns";
import {
  AppliedFilters,
  SortBy as FeedbackSortBy,
} from "pages/feedback-hub/ui";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { SelectField } from "widgets/CRMSelectField";
import {
  Button,
  Calendar,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "shared/ui";

export type RoleFilter =
  | "All"
  | "Super Admin"
  | "Admin"
  | "Practitioner"
  | "Client"
  | "Reviewer";
export type SortBy = "newest" | "oldest";
export type DateRange = { start?: string; end?: string };

export type UserFilters = {
  role: RoleFilter;
  signup: DateRange;
  sort: SortBy;
};

type Props =
  | {
      mode: "feedback";
      draftFilters: AppliedFilters;
      setDraftFilters: React.Dispatch<React.SetStateAction<AppliedFilters>>;
      onSave: () => void;
      onClose: () => void;
    }
  | {
      mode: "users";
      draftFilters: UserFilters;
      setDraftFilters: React.Dispatch<React.SetStateAction<UserFilters>>;
      onSave: () => void;
      onClose: () => void;
    };

// --- Reusable single-date picker ---
function DatePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v?: string) => void;
}) {
  const parse = (v?: string): Date | null => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const [localDate, setLocalDate] = useState<Date | null>(parse(value));
  const initialYear = (localDate ?? new Date()).getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(initialYear);
  const [displayMonth, setDisplayMonth] = useState<Date>(
    new Date(initialYear, (localDate ?? new Date()).getMonth())
  );

  useEffect(() => {
    const d = parse(value);
    setLocalDate(d);
    const y = (d ?? new Date()).getFullYear();
    setSelectedYear(y);
    setDisplayMonth(new Date(y, (d ?? new Date()).getMonth()));
  }, [value]);

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setDisplayMonth((prev) => new Date(year, prev.getMonth()));
    if (localDate) {
      const d = new Date(localDate);
      d.setFullYear(year);
      setLocalDate(d);
    }
  };

  return (
    <div className="flex flex-col gap-[8px]">
      <span className="text-[16px] text-[#1D1D1F] font-semibold">{label}</span>
      <div className="flex items-center gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start items-center text-left font-normal border-[#DBDEE1] hover:bg-white h-10"
            >
              <MaterialIcon iconName="calendar_today" fill={1} size={20} />
              <span className="ml-2">
                {localDate ? format(localDate, "PPP") : "Pick a date"}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 pointer-events-auto"
            align="start"
            avoidCollisions={false}
            sticky="always"
            side="bottom"
          >
            <div className="flex gap-[8px] items-center m-4 mb-1">
              Choose a year:
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(Number(e.target.value))}
                className="px-2 py-1 border rounded-md outline-0"
              >
                {Array.from(
                  { length: 100 },
                  (_, i) => new Date().getFullYear() - i
                ).map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="ml-auto">
                <Button
                  variant="ghost"
                  className="h-8 px-2 text-sm"
                  onClick={() => {
                    setLocalDate(null);
                    onChange(undefined);
                  }}
                >
                  Clear
                </Button>
              </div>
            </div>

            <Calendar
              mode="single"
              selected={localDate ?? undefined}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setLocalDate(selectedDate);
                  onChange(format(selectedDate, "yyyy-MM-dd"));
                  const y = selectedDate.getFullYear();
                  if (y !== selectedYear) setSelectedYear(y);
                  setDisplayMonth(
                    new Date(
                      selectedDate.getFullYear(),
                      selectedDate.getMonth()
                    )
                  );
                }
              }}
              initialFocus
              month={displayMonth}
              onMonthChange={(m) => {
                setDisplayMonth(m);
                const y = m.getFullYear();
                if (y !== selectedYear) setSelectedYear(y);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

// --- Main Filters Popup ---
export const FiltersPopup: React.FC<Props> = (props) => {
  const { onSave, onClose } = props;

  const isFeedback = props.mode === "feedback";
  const draftFilters = props.draftFilters as AppliedFilters | UserFilters;
  const setDraftFilters = props.setDraftFilters as
    | React.Dispatch<React.SetStateAction<AppliedFilters>>
    | React.Dispatch<React.SetStateAction<UserFilters>>;

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
          {isFeedback ? "Set Feedback Filters" : "Set User Filters"}
        </h3>

        <div className="grid grid-cols-1 gap-[24px]">
          {isFeedback ? (
            <>
              {/* --- Sentiment Buttons --- */}
              <div className="flex items-center gap-2 justify-center mb-[24px]">
                {(["all", "positive", "negative"] as const).map((s) => {
                  const active =
                    (draftFilters as AppliedFilters).sentiment === s;
                  return (
                    <Button
                      variant={"unstyled"}
                      size={"unstyled"}
                      key={s}
                      onClick={() =>
                        setDraftFilters((d: any) => ({ ...d, sentiment: s }))
                      }
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
                    </Button>
                  );
                })}
              </div>

              {/* --- Date Range Fields --- */}
              <div>
                <div className="text-[18px] text-[#1D1D1F] font-semibold mb-[16px]">
                  Date Range
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] items-end">
                  <DatePicker
                    label="Submission (from)"
                    value={(draftFilters as AppliedFilters).submit.start}
                    onChange={(v) =>
                      setDraftFilters((d: any) => ({
                        ...d,
                        submit: { ...d.submit, start: v },
                      }))
                    }
                  />
                  <DatePicker
                    label="Submission (to)"
                    value={(draftFilters as AppliedFilters).submit.end}
                    onChange={(v) =>
                      setDraftFilters((d: any) => ({
                        ...d,
                        submit: { ...d.submit, end: v },
                      }))
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px] items-end mt-[16px]">
                  <DatePicker
                    label="Rating date (from)"
                    value={(draftFilters as AppliedFilters).rating.start}
                    onChange={(v) =>
                      setDraftFilters((d: any) => ({
                        ...d,
                        rating: { ...d.rating, start: v },
                      }))
                    }
                  />
                  <DatePicker
                    label="Rating date (to)"
                    value={(draftFilters as AppliedFilters).rating.end}
                    onChange={(v) =>
                      setDraftFilters((d: any) => ({
                        ...d,
                        rating: { ...d.rating, end: v },
                      }))
                    }
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* --- Role Filter --- */}
              <SelectField
                label="User Role"
                className="rounded-[8px]"
                options={[
                  { label: "All", value: "All" },
                  { label: "Super Admin", value: "Super Admin" },
                  { label: "Admin", value: "Admin" },
                  { label: "Practitioner", value: "Practitioner" },
                  { label: "Client", value: "Client" },
                  { label: "Reviewer", value: "Reviewer" },
                ]}
                selected={(draftFilters as UserFilters).role}
                onChange={(v) =>
                  setDraftFilters((d: any) => ({
                    ...d,
                    role: (v as RoleFilter) || "All",
                  }))
                }
              />

              {/* --- Signup Date Range --- */}
              <div>
                <div className="text-[18px] text-[#1D1D1F] font-semibold mb-[16px]">
                  Signup Date
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[8px]">
                  <DatePicker
                    label="From"
                    value={(draftFilters as UserFilters).signup.start}
                    onChange={(v) =>
                      setDraftFilters((d: any) => ({
                        ...d,
                        signup: { ...d.signup, start: v },
                      }))
                    }
                  />
                  <DatePicker
                    label="To"
                    value={(draftFilters as UserFilters).signup.end}
                    onChange={(v) =>
                      setDraftFilters((d: any) => ({
                        ...d,
                        signup: { ...d.signup, end: v },
                      }))
                    }
                  />
                </div>
              </div>
            </>
          )}

          {/* --- Sort Dropdown (common) --- */}
          <SelectField
            className="rounded-[8px] capitalize"
            label={"Sort by"}
            options={[
              { label: "Newest", value: "newest" },
              { label: "Oldest", value: "oldest" },
            ]}
            selected={(draftFilters as any).sort}
            onChange={(e) =>
              setDraftFilters((d: any) => ({
                ...d,
                sort: (e as FeedbackSortBy | SortBy) || "newest",
              }))
            }
          />
        </div>

        <Button
          variant={"unstyled"}
          size={"unstyled"}
          className="mt-[32px] w-full p-[11px] rounded-full bg-[#1C63DB] text-[16px] text-white font-semibold"
          onClick={onSave}
        >
          Apply
        </Button>
      </div>
    </div>
  );
};
