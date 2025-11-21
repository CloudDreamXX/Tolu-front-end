import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "shared/lib";
import {
  Button,
  Input,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "shared/ui";
import { FOCUS_OPTIONS, SOFTWARE_OPTIONS, USE_AI_ANSWERS } from "../helpers";
import { CoachOnboardingState } from "entities/store/coachOnboardingSlice";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";

type FocusOption = string;

type StepFocusProps = {
  data: CoachOnboardingState;
  setDataState: React.Dispatch<React.SetStateAction<CoachOnboardingState>>;
};

export const StepFocus = ({ data, setDataState }: StepFocusProps) => {
  const [softwere, setSoftwere] = useState(
    data.practice_management_software || ""
  );
  const [query, setQuery] = useState("");
  const [otherText, setOtherText] = useState("");

  const [options, setOptions] = useState<string[]>(FOCUS_OPTIONS);

  const [selected, setSelected] = useState<Set<FocusOption>>(
    new Set(data.expertise_areas || [])
  );

  const [usesAI, setUsesAI] = useState(data.uses_ai || "");

  useEffect(() => {
    setDataState((prevState) => ({
      ...prevState,
      expertise_areas: Array.from(selected),
      practice_management_software: softwere,
      uses_ai: usesAI,
    }));
  }, [selected, softwere, usesAI, setDataState]);

  const toggle = useCallback((item: FocusOption) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  }, []);

  const isOtherSelected = selected.has("Other");

  const filtered = useMemo(
    () =>
      options.filter((o) =>
        o.toLowerCase().includes(query.trim().toLowerCase())
      ),
    [options, query]
  );

  const renderItem = (label: FocusOption) => {
    const isActive = selected.has(label);
    return (
      <Button
        variant={"unstyled"}
        size={"unstyled"}
        key={label}
        onClick={() => toggle(label)}
        className={cn(
          "h-[44px] rounded-full px-[16px]  text-[16px] font-semibold",
          isActive
            ? "bg-[#008FF61A] text-[#1C63DB]"
            : "border border-[#B9B9B9] text-[#B9B9B9]"
        )}
      >
        {label}
        {isActive && <span className="ml-2">x</span>}
      </Button>
    );
  };

  const handleAddNiche = () => {
    const value = otherText.trim();
    if (!value) return;

    const exists = options.some((o) => o.toLowerCase() === value.toLowerCase());
    if (!exists) {
      setOptions((prev) => [...prev, value]);
    }

    setSelected((prev) => {
      const next = new Set(prev);
      next.add(value);
      return next;
    });

    setOtherText("");
  };

  return (
    <div className="flex flex-col gap-4 mt-2 md:gap-8">
      <label className="text-lg font-medium text-center">
        Select primary focus areas & setup
      </label>

      <div className="justify-center max-w-[500px] w-full mx-auto">
        <Input
          icon={<MaterialIcon iconName="search" size={16} />}
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-full "
        />
      </div>

      <div className="flex flex-wrap content-center items-center justify-center gap-[13px] self-stretch ">
        {filtered.map((label) => renderItem(label))}
      </div>

      {isOtherSelected && (
        <div className="flex items-start justify-center gap-[8px]">
          <Input
            value={otherText}
            onChange={(e) => setOtherText(e.target.value)}
            type="text"
            placeholder="Please specify your niche"
            className="flex h-[44px] w-[220px] md:w-[300px] items-center justify-center self-stretch rounded-[8px] border-[1px] border-[#DFDFDF] bg-white px-[16px] py-[11px]  text-[16px] font-medium text-[#5F5F65] outline-none"
          />
          {otherText.trim().length > 0 && (
            <Button
              variant={"unstyled"}
              size={"unstyled"}
              onClick={handleAddNiche}
              className="flex h-[44px] items-center rounded-full bg-[#1C63DB] p-[16px]  text-[14px] md:text-[16px] font-semibold text-white"
            >
              Add niche
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <label>Do you use AI in your day-to-day work? *</label>
        <RadioGroup
          className="flex flex-col gap-4 md:flex-row md:gap-10"
          value={usesAI}
          onValueChange={(v) => setUsesAI(v)}
        >
          {USE_AI_ANSWERS.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <RadioGroupItem value={option} />
              <span>{option}</span>
            </div>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-4">
        <label>
          Which practice management software do you currently use? *
        </label>
        <Select value={softwere} onValueChange={(v) => setSoftwere(v)}>
          <SelectTrigger className="md:w-1/2">
            <SelectValue placeholder="Choose a software" />
          </SelectTrigger>
          <SelectContent className="max-h-[200px] overflow-y-auto">
            {SOFTWARE_OPTIONS.map((q) => (
              <SelectItem key={q} value={q}>
                {q}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
