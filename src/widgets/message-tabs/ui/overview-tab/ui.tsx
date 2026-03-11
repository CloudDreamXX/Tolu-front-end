import { useState } from "react";
import { MaterialIcon } from "shared/assets/icons/MaterialIcon";
import { Avatar, AvatarFallback, Button } from "shared/ui";

type OverviewTabProps = {
  clientName?: string;
  clientEmail?: string;
  coachName?: string;
  clientStatus?: string | null;
  onHealthProfileClick?: () => void;
  age?: string | number | null;
  cycles?: string | null;
  chiefConcern?: string | null;
  medicalDiagnoses?: string[];
  structuralConstraints?: string[];
  caseSummary?: string | null;
  coreMedicalLandscape?: string | null;
};

const toDisplayValue = (value?: string | number | null) => {
  if (typeof value === "number") {
    return String(value);
  }

  const trimmed = value?.trim();
  return trimmed ? trimmed : "-";
};

const toDisplayList = (values?: string[]) => {
  if (!values || values.length === 0) {
    return ["-"];
  }

  const filtered = values
    .map((value) => value.trim())
    .filter((value) => value.length > 0);

  return filtered.length > 0 ? filtered : ["-"];
};

const getInitials = (name?: string, email?: string) => {
  const safeName = (name || "").trim();
  if (safeName) {
    const parts = safeName.split(" ").filter(Boolean);
    if (parts.length > 1) {
      return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
    }
    return safeName.slice(0, 2).toUpperCase();
  }

  const safeEmail = (email || "").trim();
  if (safeEmail) {
    return safeEmail.slice(0, 2).toUpperCase();
  }

  return "UN";
};

const ExpandableSection = ({
  title,
  value,
  isOpen,
  onToggle,
  titleClassName,
  valueClassName,
}: {
  title: string;
  value?: string | number | null;
  isOpen: boolean;
  onToggle: () => void;
  titleClassName: string;
  valueClassName: string;
}) => (
  <div className="space-y-1">
    <button
      type="button"
      onClick={onToggle}
      className="flex items-center gap-1 text-left"
    >
      <h4 className={titleClassName}>{title}</h4>
      <MaterialIcon
        iconName={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
        className="text-[#1C63DB]"
      />
    </button>
    <p
      className={`whitespace-pre-wrap ${valueClassName} ${isOpen ? "block" : "hidden"}`}
    >
      {toDisplayValue(value)}
    </p>
  </div>
);

const STATIC_RIGHT_SECTIONS = [
  {
    id: "health_timeline",
    title: "Health Timeline",
    value: "-",
  },
  {
    id: "atm_map",
    title: "ATM map",
    value: "-",
  },
  {
    id: "body_map",
    title: "Body Map",
    value: "-",
  },
  {
    id: "priority_signals",
    title: "Priority signals",
    value: "-",
  },
  {
    id: "phase_alignment",
    title: "Phase alignment",
    value: "-",
  },
];

type ViewingOption = {
  id: string;
  label: string;
  updatedAt: string;
  editorName: string;
};

const ViewingDropdown = ({
  label,
  className,
  options,
  selectedOption,
  onSelect,
}: {
  label: string;
  className?: string;
  options: ViewingOption[];
  selectedOption: ViewingOption | null;
  onSelect: (option: ViewingOption) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`relative space-y-1 ${className ?? ""}`}>
      <div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1 text-left text-[12px] leading-[18px] text-[#1D1D1F]"
        >
          <span>{label}</span>
          <MaterialIcon
            iconName={isOpen ? "keyboard_arrow_up" : "keyboard_arrow_down"}
            size={16}
            className="text-[#1D1D1F]"
          />
        </button>

        {isOpen && (
          <div className="absolute left-0 top-[calc(100%+6px)] min-w-[180px] rounded-[10px] border border-[#ECEFF4] bg-white py-[8px] px-[12px] shadow-[0_6px_18px_rgba(29,29,31,0.12)] z-10">
            {options.map((option) => {
              const isSelected = selectedOption?.id === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onSelect(option);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between gap-3 text-left text-[12px] leading-[20px] text-[#1D1D1F] px-1 py-[4px] hover:bg-[#F4F8FF]"
                >
                  <span>{option.label}</span>
                  {isSelected ? (
                    <MaterialIcon
                      iconName="check"
                      size={16}
                      className="text-[#1C63DB]"
                    />
                  ) : null}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selectedOption && (
        <div className="flex flex-col gap-[5px]">
          <div className="flex items-center gap-2 text-[12px] leading-[18px] text-[#1D1D1F]">
            <MaterialIcon iconName="calendar_today" size={16} />
            <span>updated: {selectedOption.updatedAt}</span>
          </div>
          <div className="flex items-center gap-2 text-[12px] leading-[18px] text-[#1D1D1F]">
            <MaterialIcon iconName="person" size={16} />
            <span>by: {selectedOption.editorName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const OverviewTab: React.FC<OverviewTabProps> = ({
  clientName,
  clientEmail,
  coachName,
  clientStatus,
  onHealthProfileClick,
  age,
  cycles,
  chiefConcern,
  medicalDiagnoses,
  structuralConstraints,
}) => {
  const diagnoses = toDisplayList(medicalDiagnoses);
  const constraints = toDisplayList(structuralConstraints);
  const initials = getInitials(clientName, clientEmail);
  const isClientActive = (clientStatus || "").toLowerCase() === "active";
  const shouldDisableOverviewActions = !isClientActive;
  const [leftSelectedViewingId, setLeftSelectedViewingId] = useState<
    string | null
  >(null);
  const [rightSelectedViewingId, setRightSelectedViewingId] = useState<
    string | null
  >(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    age: true,
    cycles: true,
    chief_concern: true,
    medical_diagnoses: true,
    structural_constraints: true,
    case_summary: true,
    health_timeline: true,
    atm_map: true,
    body_map: true,
    priority_signals: true,
    phase_alignment: true,
  });

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const viewingOptions: ViewingOption[] = [
    {
      id: "latest",
      label: "Latest",
      updatedAt: "Mar 3, 2026, 14:32",
      editorName: toDisplayValue(coachName),
    },
    {
      id: "mar-3-2026-1432",
      label: "Mar 3, 2026, 14:32",
      updatedAt: "Mar 3, 2026, 14:32",
      editorName: toDisplayValue(coachName),
    },
    {
      id: "mar-1-2026-0911",
      label: "Mar 1, 2026, 09:11",
      updatedAt: "Mar 1, 2026, 09:11",
      editorName: toDisplayValue(coachName),
    },
    {
      id: "feb-25-2026-1704",
      label: "Feb 25, 2026, 17:04",
      updatedAt: "Feb 25, 2026, 17:04",
      editorName: toDisplayValue(coachName),
    },
  ];

  const leftSelectedViewingOption = viewingOptions.find(
    (option) => option.id === leftSelectedViewingId
  );

  const rightSelectedViewingOption = viewingOptions.find(
    (option) => option.id === rightSelectedViewingId
  );

  const leftViewingLabel = leftSelectedViewingOption
    ? `Viewing: ${leftSelectedViewingOption.label}`
    : "Viewing: Choose";

  const rightViewingLabel = rightSelectedViewingOption
    ? `Viewing: ${rightSelectedViewingOption.label}`
    : "Viewing: Choose";

  return (
    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-350px)] pr-1">
      <div className="grid grid-cols-1 xl:grid-cols-[350px_minmax(0,1fr)] gap-4">
        <section className="space-y-3">
          <div className="bg-[rgba(255,255,255,0.4)] border border-[#ECEFF4] rounded-[16px] p-4 flex items-start gap-4">
            <Avatar className="w-[36px] h-[36px] shrink-0">
              <AvatarFallback className="bg-[rgba(28,99,219,0.7)] text-white text-[14px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-[7px]">
              <h3 className="text-[14px] leading-[24px] font-bold text-[#1C63DB]">
                {toDisplayValue(clientName)}
              </h3>
              <p className="text-[12px] leading-[16px] text-[#1D1D1F]">
                {toDisplayValue(clientEmail)}
              </p>
            </div>
          </div>

          <div className="bg-[rgba(255,255,255,0.4)] border border-[#ECEFF4] rounded-[16px] p-4 space-y-4">
            <div className="flex items-center gap-2 text-[12px] leading-[18px] text-[#1D1D1F]">
              <ViewingDropdown
                label={leftViewingLabel}
                className="min-w-[86px]"
                options={viewingOptions}
                selectedOption={leftSelectedViewingOption ?? null}
                onSelect={(option) => setLeftSelectedViewingId(option.id)}
              />
            </div>
            <Button
              variant="brightblue"
              onClick={shouldDisableOverviewActions ? undefined : onHealthProfileClick}
              disabled={shouldDisableOverviewActions}
              className="flex items-center justify-center h-[33px] bg-[#1C63DB] text-white py-[8px] px-[12px] rounded-[8px] text-[14px] font-medium"
            >
              Health profile
            </Button>
            <ExpandableSection
              title="Age"
              value={age}
              isOpen={expanded.age}
              onToggle={() => toggle("age")}
              titleClassName="text-[16px] leading-[24px] font-semibold text-[#1C63DB]"
              valueClassName="text-[12px] leading-[18px] text-[#1D1D1F]"
            />
            <ExpandableSection
              title="Cycles"
              value={cycles}
              isOpen={expanded.cycles}
              onToggle={() => toggle("cycles")}
              titleClassName="text-[16px] leading-[24px] font-semibold text-[#1C63DB]"
              valueClassName="text-[12px] leading-[18px] text-[#1D1D1F]"
            />
            <ExpandableSection
              title="Chief concern"
              value={chiefConcern}
              isOpen={expanded.chief_concern}
              onToggle={() => toggle("chief_concern")}
              titleClassName="text-[16px] leading-[24px] font-semibold text-[#1C63DB]"
              valueClassName="text-[12px] leading-[18px] text-[#1D1D1F]"
            />
            <ExpandableSection
              title="Medical Diagnoses"
              value={diagnoses.join("\n")}
              isOpen={expanded.medical_diagnoses}
              onToggle={() => toggle("medical_diagnoses")}
              titleClassName="text-[16px] leading-[24px] font-semibold text-[#1C63DB]"
              valueClassName="text-[12px] leading-[18px] text-[#1D1D1F]"
            />
            <ExpandableSection
              title="Structural Constraints"
              value={constraints.join("\n")}
              isOpen={expanded.structural_constraints}
              onToggle={() => toggle("structural_constraints")}
              titleClassName="text-[16px] leading-[24px] font-semibold text-[#1C63DB]"
              valueClassName="text-[12px] leading-[18px] text-[#1D1D1F]"
            />
            <Button
              variant="unstyled"
              className="w-[24px] h-[24px] flex items-center justify-center bg-[#1C63DB] text-white p-[3px] rounded-full"
            >
              <MaterialIcon iconName="add" size={18} />
            </Button>
          </div>
        </section>

        <section className="bg-[rgba(255,255,255,0.4)] border border-[#ECEFF4] rounded-[16px] p-6 space-y-4 min-h-[320px]">
          <div>
            <div className="flex items-center gap-2 text-[12px] leading-[18px] text-[#1D1D1F] mb-[5px]">
              <ViewingDropdown
                label={rightViewingLabel}
                className="min-w-[86px]"
                options={viewingOptions}
                selectedOption={rightSelectedViewingOption ?? null}
                onSelect={(option) => setRightSelectedViewingId(option.id)}
              />
            </div>
          </div>

          <div className="py-1">
            <Button
              variant="brightblue"
              disabled={shouldDisableOverviewActions}
              className="h-[33px] px-4 rounded-[8px] text-[14px] leading-[20px]"
            >
              Intake analysis
            </Button>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => toggle("case_summary")}
              className="flex items-center gap-1 text-left"
            >
              <h4 className="text-[16px] leading-[22px] font-bold text-[#1C63DB]">
                Case Summary
              </h4>
              <MaterialIcon
                iconName={
                  expanded.case_summary
                    ? "keyboard_arrow_up"
                    : "keyboard_arrow_down"
                }
                className="text-[#1C63DB]"
              />
            </button>

            {expanded.case_summary && (
              <p className="text-[12px] leading-[18px] text-[#1D1D1F] whitespace-pre-wrap">
                -
              </p>
            )}
          </div>

          {STATIC_RIGHT_SECTIONS.map((section) => (
            <ExpandableSection
              key={section.id}
              title={section.title}
              value={section.value}
              isOpen={expanded[section.id]}
              onToggle={() => toggle(section.id)}
              titleClassName="text-[16px] leading-[22px] font-bold text-[#1C63DB]"
              valueClassName="text-[12px] leading-[18px] text-[#1D1D1F]"
            />
          ))}
        </section>
      </div>
    </div>
  );
};
